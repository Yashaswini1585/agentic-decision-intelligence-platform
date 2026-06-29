import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Check, 
  Square, 
  CheckSquare, 
  Play, 
  RotateCcw, 
  Terminal, 
  ArrowRight,
  Loader2,
  ChevronRight,
  Database,
  Brain,
  Search,
  BookOpen,
  TrendingUp,
  Award,
  Sparkles,
  BrainCircuit
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const getAgentIcon = (name) => {
  const lowercase = name.toLowerCase();
  if (lowercase.includes('input') || lowercase.includes('reading')) return BookOpen;
  if (lowercase.includes('crm') || lowercase.includes('database') || lowercase.includes('opportunity')) return Database;
  if (lowercase.includes('history') || lowercase.includes('lead') || lowercase.includes('qualification') || lowercase.includes('memory')) return Brain;
  if (lowercase.includes('pricing') || lowercase.includes('policy') || lowercase.includes('cost') || lowercase.includes('analysis') || lowercase.includes('strategy')) return TrendingUp;
  if (lowercase.includes('product') || lowercase.includes('documentation') || lowercase.includes('technical') || lowercase.includes('search')) return Search;
  if (lowercase.includes('recommendation') || lowercase.includes('award')) return Award;
  if (lowercase.includes('explanation') || lowercase.includes('sparkles') || lowercase.includes('justification') || lowercase.includes('proposal')) return Sparkles;
  return Check;
};

const getLogsForAgent = (agentName, allLogs) => {
  if (!allLogs) return [];
  const prefix = `[${agentName}]`;
  return allLogs.filter(log => log.startsWith(prefix) || log.includes(prefix));
};

const getInitialStepsFromFlow = (flow, alreadyWatched = false) => {
  if (flow && flow.execution) {
    return flow.execution.map((step, idx) => ({
      id: idx + 1,
      name: step.agent,
      status: step.status === 'skipped' ? 'skipped' : (alreadyWatched ? 'completed' : 'waiting'),
      reason: step.reason,
      duration: step.duration,
      icon: getAgentIcon(step.agent)
    }));
  }
  return [];
};

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const consoleEndRef = useRef(null);
  
  const { selectedFlow, markSimulationWatched } = usePlatform();

  // Core state: Step checklist (waiting, running, completed, skipped)
  const [steps, setSteps] = useState([]);
  const [terminalLogs, setTerminalLogs] = useState(['[System] Pipeline initialized. Agent console ready.']);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepId, setActiveStepId] = useState(1);
  const [hasCompletedJustNow, setHasCompletedJustNow] = useState(false);

  // Sync state with selectedFlow analysis results and auto-commence simulation
  useEffect(() => {
    if (selectedFlow) {
      const alreadyWatched = selectedFlow.simulationWatched === true;
      const initialSteps = getInitialStepsFromFlow(selectedFlow, alreadyWatched);
      setSteps(initialSteps);
      setHasCompletedJustNow(false);
      
      if (alreadyWatched) {
        setTerminalLogs(selectedFlow.logs || []);
        setIsSimulating(false);
      } else {
        const persona = selectedFlow.plannerDecision?.persona || 'Selected Persona';
        const type = selectedFlow.plannerDecision?.meeting_type || 'Account Audit';
        setTerminalLogs([
          `[System] Pipeline loaded for session: ${persona}.`,
          `[System] Identified document type: ${type}.`,
          `[System] All agent nodes synced and initialized in queue. Starting trace...`
        ]);

        // Detect if all steps are completed
        const activeCount = initialSteps.filter(s => s.status !== 'skipped').length;
        const completedCount = initialSteps.filter(s => s.status === 'completed').length;
        const alreadyDone = completedCount === activeCount && activeCount > 0;

        if (!alreadyDone && activeCount > 0) {
          setIsSimulating(true);
          const firstActive = initialSteps.find(s => s.status !== 'skipped');
          if (firstActive) {
            setActiveStepId(firstActive.id);
          }
        }
      }
      
      // Clear navigation state
      if (location.state?.runSimulation) {
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [selectedFlow, navigate, location.pathname, location.state]);

  // Handle auto-scroll terminal logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Sequential live execution playback logic
  useEffect(() => {
    let timer;
    if (isSimulating && selectedFlow && selectedFlow.logs && steps.length > 0) {
      // Find non-skipped steps that are not completed
      const pendingSteps = steps.filter(s => s.status !== 'skipped' && s.status !== 'completed');
      
      if (pendingSteps.length > 0) {
        const nextPending = pendingSteps[0];
        const stepIndex = steps.findIndex(s => s.id === nextPending.id);
        
        if (stepIndex !== -1) {
          const step = steps[stepIndex];
          
          if (step.status === 'waiting') {
            // 1. Commencing: mark active step as running
            setSteps(prev => prev.map(s => s.id === step.id ? { ...s, status: 'running' } : s));
            setTerminalLogs(prev => [...prev, `[System] Activating ${step.name}...`]);
            setActiveStepId(step.id);
          } else if (step.status === 'running') {
            // 2. Running: wait 1200ms, fetch actual logs, and mark completed
            timer = setTimeout(() => {
              const agentLogs = getLogsForAgent(step.name, selectedFlow.logs);
              setSteps(prev => prev.map(s => s.id === step.id ? { ...s, status: 'completed' } : s));
              
              setTerminalLogs(prev => [
                ...prev,
                ...agentLogs,
                `[System] ${step.name} completed successfully (${step.duration || '0.2s'}).`
              ]);
              
              // Check if there's any remaining step after this one
              const remaining = steps.slice(stepIndex + 1).filter(s => s.status !== 'skipped');
              if (remaining.length > 0) {
                setActiveStepId(remaining[0].id);
              } else {
                setIsSimulating(false);
                markSimulationWatched(selectedFlow.id);
                setHasCompletedJustNow(true);
                // Append final planner logs
                const plannerLogs = selectedFlow.logs.filter(log => log.startsWith('[Planner]'));
                setTerminalLogs(prev => [
                  ...prev,
                  ...plannerLogs.slice(3), // Skip the header logs we print during initialization
                  `[System] Dynamic decision pipeline completed successfully. Inferences saved.`
                ]);
              }
            }, 1200);
          }
        }
      } else {
        setIsSimulating(false);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSimulating, activeStepId, steps, selectedFlow, markSimulationWatched]);

  // Compute live statistics based on actual execution statuses
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const activeCount = steps.filter(s => s.status !== 'skipped').length;
  const progressPercent = activeCount > 0 ? Math.round((completedCount / activeCount) * 100) : 0;
  const allCompleted = completedCount === activeCount && activeCount > 0;

  // Navigate to results page after completing local playback trace
  useEffect(() => {
    if (hasCompletedJustNow && allCompleted && !isSimulating) {
      const navTimer = setTimeout(() => {
        navigate('/results');
      }, 1500);
      return () => clearTimeout(navTimer);
    }
  }, [allCompleted, isSimulating, hasCompletedJustNow, navigate]);

  // Handle empty state if no active execution loaded
  if (!selectedFlow || !selectedFlow.execution) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-4 text-center">
        <div className="p-4 bg-slate-100 text-slate-400 rounded-full border border-slate-200">
          <Terminal className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Active Pipeline Execution</h2>
        <p className="text-sm text-slate-550 max-w-md">
          Please upload a meeting document from the dashboard to trigger the dynamic Planner Agent workflow routing.
        </p>
        <Button onClick={() => navigate('/dashboard')} variant="primary" className="mt-2">
          Go to Ingestion Center
        </Button>
      </div>
    );
  }

  // Manual Check Override Handler
  const toggleStepCompleted = (stepId) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        if (s.status === 'skipped') {
          alert("This agent node was bypassed by the Planner Agent. Manual override is not permitted for bypassed routes.");
          return s;
        }
        const isComp = s.status === 'completed';
        const nextStatus = isComp ? 'waiting' : 'completed';
        
        if (nextStatus === 'completed') {
          const agentLogs = selectedFlow ? getLogsForAgent(s.name, selectedFlow.logs) : [];
          setTerminalLogs(prevLogs => [
            ...prevLogs,
            `[User Override] Manually authorized node: ${s.name}`,
            ...agentLogs
          ]);
        } else {
          setTerminalLogs(prevLogs => [
            ...prevLogs,
            `[User Override] Manually reset node: ${s.name}`
          ]);
        }
        
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const markAllComplete = () => {
    setSteps(prev => prev.map(s => s.status === 'skipped' ? s : { ...s, status: 'completed' }));
    const allLogs = selectedFlow.logs.filter(log => !log.startsWith('[Planner]'));
    setTerminalLogs(prev => [
      ...prev,
      '[User Action] Force-completed all active pipeline nodes.',
      ...allLogs,
      '[System] Manual override finalized. Pipeline outputs ready.'
    ]);
  };

  const resetAllSteps = () => {
    const initialSteps = getInitialStepsFromFlow(selectedFlow);
    setSteps(initialSteps);
    setIsSimulating(false);
    setActiveStepId(initialSteps.find(s => s.status !== 'skipped')?.id || 1);
    setTerminalLogs([
      `[System] Pipeline re-initialized.`,
      `[System] All active agent nodes reset to idle.`
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              Autonomic Monitor
            </span>
            <span className="text-xs text-slate-400">Step 4 of 6</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Agent Process Monitor</h1>
          <p className="text-sm text-slate-500">Live monitoring console tracking the Planner Agent's orchestration strategy and logs.</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Button onClick={resetAllSteps} variant="outline" className="flex items-center gap-2 bg-white border-slate-200">
            <RotateCcw className="h-4 w-4 text-slate-500" />
            <span>Reset Pipeline</span>
          </Button>

          <Button 
            onClick={markAllComplete} 
            variant="secondary" 
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            disabled={allCompleted}
          >
            <span>Force Complete</span>
          </Button>

          {isSimulating ? (
            <Button 
              onClick={() => setIsSimulating(false)} 
              variant="outline" 
              className="flex items-center gap-2 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
            >
              <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
              <span>Pause Monitor</span>
            </Button>
          ) : (
            <Button 
              onClick={() => setIsSimulating(true)} 
              variant="primary" 
              className="flex items-center gap-2"
              disabled={allCompleted}
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Start Live Trace</span>
            </Button>
          )}
        </div>
      </div>

      {/* Planner Decision Panel Section */}
      {selectedFlow && selectedFlow.plannerDecision && (
        <Card className="border-blue-100 bg-blue-50/5 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100/80">
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-950 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider">
                <BrainCircuit className="h-5 w-5 text-blue-600 animate-pulse-slow shrink-0" />
                <span>Planner Inferences & Selection Strategy</span>
              </CardTitle>
              <Badge variant="blue" className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                Dynamic Route Synced
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-400">
              The Planner evaluated the uploaded document and active persona constraints to dynamically build this execution matrix.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            {/* Column 1: Persona & Meeting Type */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Selected Persona</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">{selectedFlow.plannerDecision.persona}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Meeting Type</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">{selectedFlow.plannerDecision.meeting_type}</span>
              </div>
            </div>

            {/* Column 2: Execution Chain */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Execution Strategy Path</span>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {selectedFlow.plannerDecision.execution_strategy.map((agent, i) => (
                    <React.Fragment key={agent}>
                      {i > 0 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-semibold text-[10px]">
                        {agent}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bypassed Agents & Reason</span>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  <strong className="text-slate-700">Skipped:</strong> {selectedFlow.plannerDecision.skipped_agents.join(', ') || 'None'}.<br/>
                  <strong className="text-slate-700">Reason:</strong> {selectedFlow.plannerDecision.reason}
                </p>
              </div>
            </div>

            {/* Column 3: Metrics & Inferences */}
            <div className="space-y-4 pl-0 md:pl-6 border-l border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Complexity</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">Medium Complexity</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Runtime</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">{selectedFlow.plannerDecision.estimated_runtime || '1.9s'}</span>
                </div>
              </div>
              
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Expected Confidence</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-black text-slate-900">{selectedFlow.plannerDecision.expected_confidence || 92}%</span>
                  <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${selectedFlow.plannerDecision.expected_confidence || 92}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid: Checklist left, terminal log right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive status checklist */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Autonomic Milestones</CardTitle>
                <span className="text-xs font-bold text-blue-605">{progressPercent}%</span>
              </div>
              <CardDescription>Visual progress of active vs bypassed nodes in the runtime pipeline.</CardDescription>
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-3">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="px-6 pb-6 space-y-3">
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  const isCompleted = step.status === 'completed';
                  const isActive = step.status === 'running';
                  const isSkipped = step.status === 'skipped';

                  return (
                    <div 
                      key={step.id} 
                      onClick={() => toggleStepCompleted(step.id)}
                      title={isSkipped ? "Skipped because Planner determined this agent was unnecessary for the uploaded meeting." : ""}
                      className={`
                        flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200
                        ${isCompleted 
                          ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800 cursor-pointer' 
                          : isActive 
                            ? 'bg-blue-50/30 border-blue-200 ring-2 ring-blue-50 text-slate-900 cursor-pointer animate-pulse' 
                            : isSkipped
                              ? 'bg-slate-50 border-slate-200/50 text-slate-300 opacity-60 cursor-not-allowed'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50 hover:border-slate-300 cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status Checkbox */}
                        <div className="shrink-0 transition-transform active:scale-95">
                          {isCompleted ? (
                            <CheckSquare className="h-5 w-5 text-emerald-600" />
                          ) : isSkipped ? (
                            <Square className="h-5 w-5 text-slate-200" />
                          ) : (
                            <Square className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-slate-300'}`} />
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="truncate leading-tight">
                          <span className={`text-xs font-bold ${
                            isCompleted 
                              ? 'text-emerald-950 font-semibold' 
                              : isSkipped 
                                ? 'text-slate-400 font-normal line-through' 
                                : 'text-slate-800'
                          }`}>
                            {step.name}
                          </span>
                          {isSkipped && (
                            <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                              Bypassed
                            </span>
                          )}
                          {isActive && (
                            <span className="block text-[8px] text-blue-500 font-bold uppercase tracking-wider mt-0.5 animate-pulse">
                              Executing
                            </span>
                          )}
                          {isCompleted && (
                            <span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
                              Completed ({step.duration})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right indicator */}
                      <div className="shrink-0 ml-2">
                        {isActive ? (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : (
                          <StepIcon className={`h-4 w-4 ${
                            isCompleted 
                              ? 'text-emerald-500' 
                              : isSkipped 
                                ? 'text-slate-200' 
                                : 'text-slate-400'
                          }`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Console Log Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col bg-slate-950 text-slate-100 border-slate-900 shadow-xl overflow-hidden min-h-[500px]">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-300 font-mono">Autonomic Log Trace</span>
              </div>
              <Badge variant={allCompleted ? 'emerald' : 'blue'}>
                {allCompleted ? 'Trace Ready' : 'Executing'}
              </Badge>
            </div>

            {/* Screen */}
            <CardContent className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-350 space-y-2 select-text leading-relaxed">
              {terminalLogs.map((log, index) => {
                let textStyle = "text-slate-300";
                if (log.includes('[User Override]') || log.includes('[User Action]')) textStyle = "text-amber-400 font-semibold";
                if (log.includes('[System]')) textStyle = "text-blue-400 font-bold";
                if (log.includes('successfully') || log.includes('completed') || log.includes('Offer')) textStyle = "text-emerald-400";
                if (log.includes('[Risk Analysis Agent]') && !log.includes('successfully')) textStyle = "text-red-400";
                
                return (
                  <div key={index} className={`whitespace-pre-wrap ${textStyle}`}>
                    {log}
                  </div>
                );
              })}
              
              {isSimulating && (
                <div className="text-blue-500 font-bold terminal-cursor">
                  [Executing] agent node...
                </div>
              )}
              <div ref={consoleEndRef}></div>
            </CardContent>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono shrink-0">
              <span>CHECKLIST_NODES: {steps.length}</span>
              <span>VERIFIED: {completedCount} COMPLETED | {steps.filter(s => s.status === 'skipped').length} BYPASSED</span>
            </div>
          </Card>
        </div>

      </div>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md mt-8">
        <div>
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Flow Step 4 of 6</span>
          <h3 className="text-lg font-bold mt-1.5">Checklist Step Verification Complete?</h3>
          <p className="text-xs text-slate-400">Once you have marked or observed the pipeline complete, proceed to the Results page to review dynamic recommendations.</p>
        </div>
        <Button 
          onClick={() => navigate('/results')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 flex items-center gap-2"
        >
          <span>Proceed to Results</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Processing;
