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
  Sparkles
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const INITIAL_STEPS = [
  { 
    id: 1, 
    name: 'Reading Meeting Notes', 
    icon: BookOpen,
    logs: [
      '[00:01] Ingesting meeting transcript document...',
      '[00:03] NLP Parser: Extracted 3 vendor proposals and 2 pricing constraints.',
      '[00:05] Context parsing completed. Segmented 12 discussion items.'
    ]
  },
  { 
    id: 2, 
    name: 'Fetching CRM Data', 
    icon: Database,
    logs: [
      '[00:08] Connecting to Salesforce CRM API...',
      '[00:10] Ingested customer account histories and outstanding credit profiles.',
      '[00:12] CRM synchronization verified. 0 anomalies detected.'
    ]
  },
  { 
    id: 3, 
    name: 'Searching Knowledge Base', 
    icon: Search,
    logs: [
      '[00:15] Accessing Vector Database cluster...',
      '[00:17] Semantic match query: "tariff optimization" and "port strikes compliance".',
      '[00:20] Retrieved 4 active legal files and 2 standard operational guidelines.'
    ]
  },
  { 
    id: 4, 
    name: 'Checking Previous Memory', 
    icon: Brain,
    logs: [
      '[00:22] Fetching historical decisions database...',
      '[00:24] Identified flow-092 (Supplier credit reallocation) as a 86% match.',
      '[00:26] Extracted overrides and audit logs from matching historical data.'
    ]
  },
  { 
    id: 5, 
    name: 'Business Analysis', 
    icon: TrendingUp,
    logs: [
      '[00:29] Activating Cost Optimizer Linear Solver...',
      '[00:32] Run Monte Carlo risk models across alternative shipping lanes.',
      '[00:35] Cost vectors solved. Disruption costs calculated.'
    ]
  },
  { 
    id: 6, 
    name: 'Generating Recommendations', 
    icon: Award,
    logs: [
      '[00:38] Starting Recommendation Engine...',
      '[00:41] Synthesizing optimal routing and contract distribution matrix.',
      '[00:44] Recommendation complete. Confidence index set at 94%.'
    ]
  },
  { 
    id: 7, 
    name: 'Preparing Explanation', 
    icon: Sparkles,
    logs: [
      '[00:47] Generating natural language justification draft...',
      '[00:50] Compliance and legal audits verified.',
      '[00:52] Explanation logs packed. Ready for executive authorization.'
    ]
  }
];

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const consoleEndRef = useRef(null);

  // Core state: Step checklist (unchecked, active, completed)
  const [steps, setSteps] = useState(INITIAL_STEPS.map(s => ({ ...s, status: 'unchecked' })));
  const [activeStepId, setActiveStepId] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  // Auto-trigger simulation if routed from document upload
  useEffect(() => {
    if (location.state?.runSimulation) {
      setIsSimulating(true);
      setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'unchecked' })));
      setActiveStepId(1);
      setTerminalLogs(['[System] Pipeline initialized. All agent nodes idle.']);
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);
  const [terminalLogs, setTerminalLogs] = useState(['[System] Pipeline initialized. All agent nodes idle.']);

  // Handle auto-scroll terminal logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Sequential auto-simulation logic
  useEffect(() => {
    let timer;
    if (isSimulating) {
      const stepIndex = steps.findIndex(s => s.id === activeStepId);
      if (stepIndex !== -1) {
        const step = steps[stepIndex];
        
        if (step.status === 'unchecked') {
          // 1. Commencing: mark the step as active
          setSteps(prev => prev.map(s => 
            s.id === activeStepId ? { ...s, status: 'active' } : s
          ));
          setTerminalLogs(prev => [...prev, `[System] Commencing step ${step.id}: ${step.name}...`]);
        } else if (step.status === 'active') {
          // 2. Active: wait 1.5 seconds, then mark completed and advance activeStepId
          timer = setTimeout(() => {
            setSteps(prev => prev.map(s => 
              s.id === activeStepId ? { ...s, status: 'completed' } : s
            ));
            setTerminalLogs(prev => [...prev, ...step.logs, `[System] Step ${step.id} completed.`]);
            
            if (activeStepId < steps.length) {
              setActiveStepId(prevId => prevId + 1);
            } else {
              setIsSimulating(false);
              setTerminalLogs(prev => [...prev, '[System] All steps completed successfully. Ready for review.']);
            }
          }, 1500);
        } else if (step.status === 'completed') {
          // 3. Completed: if already completed, move onto the next step
          if (activeStepId < steps.length) {
            setActiveStepId(prevId => prevId + 1);
          } else {
            setIsSimulating(false);
          }
        }
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSimulating, activeStepId, steps]);

  // Functions to manually mark steps complete/incomplete
  const toggleStepCompleted = (stepId) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        const nextStatus = s.status === 'completed' ? 'unchecked' : 'completed';
        
        // Output log entry on change
        if (nextStatus === 'completed') {
          setTerminalLogs(prevLogs => [
            ...prevLogs,
            `[User Override] Manually checked: ${s.name}`,
            ...s.logs
          ]);
        } else {
          setTerminalLogs(prevLogs => [
            ...prevLogs,
            `[User Override] Manually unchecked: ${s.name}`
          ]);
        }
        
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const markAllComplete = () => {
    setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    setTerminalLogs(prev => [
      ...prev,
      '[User Action] Marked all steps complete.',
      ...INITIAL_STEPS.flatMap(s => s.logs)
    ]);
  };

  const resetAllSteps = () => {
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'unchecked' })));
    setIsSimulating(false);
    setActiveStepId(1);
    setTerminalLogs(['[System] Pipeline reset. All steps unchecked.']);
  };

  // Compute stats
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const allCompleted = completedCount === steps.length;

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              Checklist Control
            </span>
            <span className="text-xs text-slate-400">Step 4 of 6</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Agent Process Checklist</h1>
          <p className="text-sm text-slate-500">Interactive execution steps detailing document processing, CRM lookups, and recommendation models.</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Button onClick={resetAllSteps} variant="outline" className="flex items-center gap-2 bg-white">
            <RotateCcw className="h-4 w-4 text-slate-500" />
            <span>Reset Checklist</span>
          </Button>

          <Button 
            onClick={markAllComplete} 
            variant="secondary" 
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          >
            <span>Check All Steps</span>
          </Button>

          {isSimulating ? (
            <Button 
              onClick={() => setIsSimulating(false)} 
              variant="outline" 
              className="flex items-center gap-2 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Pause Auto-Run</span>
            </Button>
          ) : (
            <Button 
              onClick={() => setIsSimulating(true)} 
              variant="primary" 
              className="flex items-center gap-2"
              disabled={allCompleted}
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Simulate Pipeline</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Animated checklist left, terminal log right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive animated checklist */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Agent Milestones</CardTitle>
                <span className="text-xs font-bold text-blue-600">{progressPercent}%</span>
              </div>
              <CardDescription>Click rows to manually complete steps or watch them animate.</CardDescription>
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
                  const isActive = step.status === 'active';

                  return (
                    <div 
                      key={step.id} 
                      onClick={() => toggleStepCompleted(step.id)}
                      className={`
                        flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200
                        ${isCompleted 
                          ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800' 
                          : isActive 
                            ? 'bg-blue-50/30 border-blue-200 ring-2 ring-blue-50 text-slate-900' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50 hover:border-slate-300'}
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Interactive Checkbox with icon */}
                        <div className="shrink-0 transition-transform active:scale-95">
                          {isCompleted ? (
                            <CheckSquare className="h-5 w-5 text-emerald-600 animate-pulse-slow" />
                          ) : (
                            <Square className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-slate-300'}`} />
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="truncate leading-tight">
                          <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-950 font-semibold' : 'text-slate-800'}`}>
                            {step.name}
                          </span>
                        </div>
                      </div>

                      {/* Right indicator */}
                      <div className="shrink-0 ml-2">
                        {isActive ? (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : (
                          <StepIcon className={`h-4 w-4 ${isCompleted ? 'text-emerald-500' : 'text-slate-355'}`} />
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
                {allCompleted ? 'Ready' : 'Checking'}
              </Badge>
            </div>

            {/* Screen */}
            <CardContent className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 select-text leading-relaxed">
              {terminalLogs.map((log, index) => {
                let textStyle = "text-slate-300";
                if (log.includes('[User Override]') || log.includes('[User Action]')) textStyle = "text-amber-400 font-semibold";
                if (log.includes('[System]')) textStyle = "text-blue-400 font-bold";
                if (log.includes('completed') || log.includes('complete')) textStyle = "text-emerald-400";
                
                return (
                  <div key={index} className={`whitespace-pre-wrap ${textStyle}`}>
                    {log}
                  </div>
                );
              })}
              
              {isSimulating && (
                <div className="text-blue-500 font-bold terminal-cursor">
                  [Processing] step {activeStepId}...
                </div>
              )}
              <div ref={consoleEndRef}></div>
            </CardContent>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono shrink-0">
              <span>CHECKLIST_NODES: {steps.length}</span>
              <span>VERIFIED: {completedCount} COMPLETED</span>
            </div>
          </Card>
        </div>

      </div>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md mt-8">
        <div>
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Flow Step 4 of 6</span>
          <h3 className="text-lg font-bold mt-1.5">Checklist Step Verification Complete?</h3>
          <p className="text-xs text-slate-400">Once you have marked the milestones complete, proceed to the Results page to review recommendations.</p>
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
