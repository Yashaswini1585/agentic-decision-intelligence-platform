import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Info,
  Building,
  DollarSign,
  User,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Results = () => {
  const navigate = useNavigate();
  const { selectedFlow, approveDecision, rejectDecision } = usePlatform();
  const [decisionState, setDecisionState] = useState('pending'); // 'pending', 'accepted', 'rejected'
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleAccept = () => {
    setDecisionState('accepted');
    if (selectedFlow) {
      approveDecision(selectedFlow.id, 'Approved via Results review dashboard.');
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please enter a reason for rejecting the recommendations.');
      return;
    }
    setDecisionState('rejected');
    setShowRejectForm(false);
    if (selectedFlow) {
      rejectDecision(selectedFlow.id, rejectReason);
    }
  };

  const handleReset = () => {
    setDecisionState('pending');
    setRejectReason('');
    setShowRejectForm(false);
  };

  // Mock placeholder data
  const customerData = {
    name: 'Acme Global Conglomerate Inc.',
    industry: 'Advanced Logistics & Manufacturing',
    value: '$2.4M Annual Contract Value',
    owner: 'Sarah Jenkins',
    healthScore: 84,
    riskLevel: 'Medium-High',
    confidenceScore: 92,
    explanation: 'The risk model detected a 24% spike in European maritime tariffs coupled with labor union strikes at the Antwerp port. In order to safeguard Acme\'s Q3 supply schedules without exceeding budgetary guidelines, the solver calculated that a multi-channel rerouting strategy via Mediterranean ports yields the lowest disruption profile while keeping cost margins under the 5% threshold.',
    recommendations: [
      {
        id: 1,
        title: 'Redirect 60% Cargo via Algeciras',
        description: 'Shift incoming container shipments from Rotterdam/Antwerp to Algeciras and Valencia ports to bypass strike zones.',
        impact: 'High Impact',
        cost: 'Low Cost (+$12,400 tariff variance)',
        badgeColor: 'blue'
      },
      {
        id: 2,
        title: 'Secure Spot Contracts with Hapag-Lloyd',
        description: 'Lock in 20% spot rate cargo space immediately to hedge against rising freight rates over the next 30 days.',
        impact: 'High Impact',
        cost: 'Medium Cost (+$24,000 spot premium)',
        badgeColor: 'indigo'
      },
      {
        id: 3,
        title: 'Establish Secondary Trucking Agreements',
        description: 'Authorize short-term agreements with Spanish regional freight carriers to facilitate inland logistics distribution.',
        impact: 'Medium Impact',
        cost: 'Low Cost (Pre-negotiated rate tables)',
        badgeColor: 'sky'
      }
    ]
  };

  const flowRec = selectedFlow?.recommendation;
  const hasDynamicData = !!flowRec;

  // Resolve recommendations dynamically
  const recommendationsList = hasDynamicData
    ? flowRec.alternatives.map((alt, idx) => ({
        id: idx + 1,
        title: alt.name,
        description: idx === 0 
          ? "Primary optimization pathway recommended by the solver nodes." 
          : idx === 1 
            ? "Secondary fallback option to hedge against high-risk variances." 
            : "Tertiary mitigation option proposed for localized containment.",
        impact: alt.risk === 'High' ? 'High Impact' : 'Medium Impact',
        cost: alt.cost,
        badgeColor: idx === 0 ? 'blue' : idx === 1 ? 'indigo' : 'sky'
      }))
    : customerData.recommendations;

  // Resolve confidence score
  let rawConfidence = hasDynamicData ? flowRec.confidence : `${customerData.confidenceScore}%`;
  if (typeof rawConfidence === 'string') {
    rawConfidence = rawConfidence.replace('%', '');
  }
  const confidenceScore = parseInt(rawConfidence) || 92;

  // Resolve risk level
  const riskLevel = hasDynamicData ? flowRec.riskLevel : customerData.riskLevel;

  // Resolve explanation block HTML
  const getExplanationContent = () => {
    const rawExplanation = flowRec?.explanation || customerData.explanation;

    let explanation = null;
    if (typeof rawExplanation === 'object' && rawExplanation !== null) {
      explanation = rawExplanation;
    } else if (typeof rawExplanation === 'string') {
      try {
        explanation = JSON.parse(rawExplanation);
      } catch {
        // Fallback string
      }
    }

    if (explanation && typeof explanation === 'object') {
      return (
        <div className="space-y-6 text-xs leading-relaxed font-sans text-slate-600">
          {explanation.meeting_evidence && explanation.meeting_evidence.length > 0 && (
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                Meeting Evidence
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-550">
                {explanation.meeting_evidence.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {explanation.risks && explanation.risks.length > 0 && (
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Detected Risks
              </h4>
              <div className="flex flex-wrap gap-2">
                {explanation.risks.map((risk, idx) => (
                  <Badge key={idx} variant="red" className="text-[9.5px]">
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {explanation.reasoning && (
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                Reasoning
              </h4>
              <p className="text-slate-550 leading-relaxed pr-2">{explanation.reasoning}</p>
            </div>
          )}

          {explanation.why_this_recommendation && (
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Why this Recommendation
              </h4>
              <p className="text-slate-550 leading-relaxed pr-2">{explanation.why_this_recommendation}</p>
            </div>
          )}

          {explanation.business_impact && explanation.business_impact.length > 0 && (
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Expected Business Impact
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-550">
                {explanation.business_impact.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {explanation.sources && explanation.sources.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                Evidence Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {explanation.sources.map((source, idx) => (
                  <span key={idx} className="px-2 py-1 text-[9.5px] bg-slate-50 border border-slate-200 text-slate-650 rounded-md font-semibold shadow-xs">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl text-xs leading-relaxed text-slate-550 font-sans relative">
        <Info className="absolute right-4 top-4 h-4 w-4 text-slate-350" />
        <p className="pr-6">{rawExplanation}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/80 border border-blue-150 px-2 py-0.5 rounded-md">
              Auditor Output
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Step 5 of 6</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">Optimization Analysis Results</h1>
          <p className="text-xs text-slate-500 mt-1">Review optimization decisions compiled for account reviews.</p>
        </div>

        {decisionState !== 'pending' && (
          <Button onClick={handleReset} variant="outline" className="text-xs bg-white py-1.5 px-3 flex items-center gap-1.5 border-slate-200 shadow-xs h-9">
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset Decision State</span>
          </Button>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (2/3) - Customer Details, Top 3 Recommendations, Narrative Explanation */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Account Context Details */}
          <Card className="border-slate-200/50 shadow-xs">
            <CardHeader className="pb-3" border>
              <CardTitle>Account Context & Parameters</CardTitle>
              <CardDescription>Enterprise details synced with central accounts database.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <Building className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Enterprise Account</span>
                  <span className="font-bold text-slate-800 truncate block mt-0.5" title={selectedFlow?.meetingNotes?.company || customerData.name}>
                    {selectedFlow?.meetingNotes?.company || customerData.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <DollarSign className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Contract Valuation</span>
                  <span className="font-bold text-slate-800 truncate block mt-0.5">
                    {selectedFlow?.customerSummary?.contract_value || customerData.value}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <User className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Account Director</span>
                  <span className="font-bold text-slate-800 truncate block mt-0.5">
                    {selectedFlow?.initiator || customerData.owner}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Top 3 Recommendations */}
          <Card className="border-slate-200/50 shadow-xs">
            <CardHeader className="pb-3" border>
              <CardTitle>Top 3 Strategic Recommendations</CardTitle>
              <CardDescription>Optimized adjustments calculated to mitigate logistical risk events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-4">
              {recommendationsList.map((rec) => (
                <div 
                  key={rec.id} 
                  className="p-4 bg-white border border-slate-200/60 hover:border-slate-350 rounded-xl shadow-xs transition-all duration-200 flex gap-4"
                >
                  {/* Step ID badge */}
                  <div className="h-6 w-6 rounded-full bg-blue-50/80 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {rec.id}
                  </div>
                  {/* Content details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                      <div className="flex gap-1.5">
                        <Badge variant={rec.badgeColor}>{rec.impact}</Badge>
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 rounded">
                          {rec.cost}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{rec.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 3: Narrative Explanation */}
          <Card className="border-slate-200/50 shadow-xs">
            <CardHeader className="pb-3" border>
              <CardTitle>Orchestrator Inferences & Narrative Reasoning</CardTitle>
              <CardDescription>Narrative report justification explaining target decisions and data evidence.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {getExplanationContent()}
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1/3) - Decision Authorization Control Center */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200/50 shadow-xs sticky top-6">
            <CardHeader className="pb-4" border>
              <CardTitle>Decision Authorization Hub</CardTitle>
              <CardDescription>Human-in-the-loop audit check controls to authorize optimization execution.</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-4 text-xs">
              
              {/* Confidence metrics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Inference Confidence</span>
                  <span className="text-slate-800 font-extrabold">{confidenceScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${confidenceScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Risk Level pill */}
              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Evaluation Profile</span>
                <Badge variant={riskLevel?.toLowerCase().includes('high') ? 'red' : 'amber'}>
                  {riskLevel} Risk
                </Badge>
              </div>

              {/* Dynamic state check */}
              {decisionState === 'pending' ? (
                <div className="space-y-3.5">
                  <div className="text-center p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <span className="text-[11px] text-blue-700 font-semibold block">Awaiting Manual Verification</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Operator signature required for release.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <Button 
                      onClick={() => setShowRejectForm(true)} 
                      variant="outline"
                      className="border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center gap-1.5 h-10 shadow-xs text-slate-650"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      <span>Reject Route</span>
                    </Button>
                    <Button 
                      onClick={handleAccept} 
                      variant="success"
                      className="flex items-center gap-1.5 h-10 shadow-xs"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Authorize</span>
                    </Button>
                  </div>

                  {/* Slide down reject input form */}
                  {showRejectForm && (
                    <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl transition-all duration-300">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Audit Rejection Comment
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="e.g. Budget margins exceeded, recalculate with spot hedges."
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 shadow-inner resize-none h-20"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => setShowRejectForm(false)} 
                          variant="ghost"
                          className="px-2.5 py-1 text-[10px]"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleReject} 
                          variant="danger"
                          className="px-3 py-1 text-[10px]"
                        >
                          Submit Rejection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : decisionState === 'accepted' ? (
                <div className="space-y-3">
                  <div className="p-4 bg-emerald-50/55 border border-emerald-250 text-emerald-800 rounded-xl flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-emerald-950">Recommendations Released</span>
                      <span className="text-[11px] text-emerald-650 block mt-0.5 leading-relaxed">The optimized parameters have been committed and released to active shipments.</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/evaluation')} 
                    variant="primary"
                    className="w-full flex items-center justify-center gap-1.5 h-10"
                  >
                    <span>View Performance Audit</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-red-50/55 border border-red-250 text-red-800 rounded-xl flex items-start gap-3">
                    <X className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-red-950">Decision Rejected</span>
                      <span className="text-[11px] text-red-650 block mt-0.5 leading-relaxed">
                        Rejection logged. Rerouting model parameters sent back to Planner agent for correction.
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    variant="outline"
                    className="w-full flex items-center justify-center gap-1.5 h-10 border-slate-200 text-slate-700 bg-white"
                  >
                    <span>Re-upload Ingestion Notes</span>
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-950 border border-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm mt-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-[9px] bg-blue-600 border border-blue-500/20 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Flow Step 5 of 6</span>
          <h3 className="text-base font-bold mt-1 text-slate-100">Review Inferences Complete?</h3>
          <p className="text-xs text-slate-400">Proceed to the Evaluation summary dashboard to run simulations and audit cumulative KPI savings.</p>
        </div>
        <Button 
          onClick={() => navigate('/evaluation')} 
          variant="primary"
          className="shrink-0 flex items-center gap-2 relative z-10 py-2.5"
        >
          <span>Open Evaluation Summary</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Results;
