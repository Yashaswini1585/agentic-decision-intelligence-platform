import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight,
  TrendingUp,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  Calendar
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Results = () => {
  const navigate = useNavigate();
  const { selectedFlow } = usePlatform();
  const [decisionState, setDecisionState] = useState('pending'); // 'pending', 'accepted', 'rejected'
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleAccept = () => {
    setDecisionState('accepted');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please enter a reason for rejecting the recommendations.');
      return;
    }
    setDecisionState('rejected');
    setShowRejectForm(false);
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
    healthScore: 84, // 84/100
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
      } catch (e) {
        // Fallback string
      }
    }

    if (explanation && typeof explanation === 'object') {
      return (
        <div className="space-y-5 text-slate-650 text-xs leading-relaxed font-sans">
          {explanation.meeting_evidence && explanation.meeting_evidence.length > 0 && (
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                Meeting Evidence
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                {explanation.meeting_evidence.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {explanation.risks && explanation.risks.length > 0 && (
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Detected Risks
              </h4>
              <div className="flex flex-wrap gap-2">
                {explanation.risks.map((risk, idx) => (
                  <Badge key={idx} variant="red" className="text-[10px] font-semibold">
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {explanation.reasoning && (
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                Reasoning
              </h4>
              <p className="text-slate-600 leading-relaxed pr-2">{explanation.reasoning}</p>
            </div>
          )}

          {explanation.why_this_recommendation && (
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Why this Recommendation
              </h4>
              <p className="text-slate-600 leading-relaxed pr-2">{explanation.why_this_recommendation}</p>
            </div>
          )}

          {explanation.business_impact && explanation.business_impact.length > 0 && (
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Expected Business Impact
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                {explanation.business_impact.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {explanation.sources && explanation.sources.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                Evidence Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {explanation.sources.map((source, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-100 border border-slate-200 text-slate-600 rounded font-semibold">
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
      <div className="p-4.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs leading-relaxed text-slate-600 font-sans relative">
        <Info className="absolute right-4 top-4 h-5 w-5 text-slate-300" />
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
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              Auditor Output
            </span>
            <span className="text-xs text-slate-400">Step 5 of 6</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Optimization Analysis Results</h1>
          <p className="text-sm text-slate-500">Review optimization decisions compiled for account reviews.</p>
        </div>

        {decisionState !== 'pending' && (
          <Button onClick={handleReset} variant="outline" className="text-xs bg-white py-1.5 px-3 flex items-center gap-1.5 border-slate-200">
            <span>Reset Decision State</span>
          </Button>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (2/3) - Customer Details, Top 3 Recommendations, Narrative Explanation */}
        <div className="lg:col-span-2 space-y-6">
          

          {/* Card 2: Top 3 Recommendations */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Top 3 Strategic Recommendations</CardTitle>
              <CardDescription>Optimized adjustments calculated to mitigate logistical risk events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendationsList.map((rec) => (
                <div 
                  key={rec.id} 
                  className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-slate-300 transition-colors flex gap-4"
                >
                  {/* Step ID badge */}
                  <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {rec.id}
                  </div>
                  {/* Content details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                      <div className="flex gap-1.5">
                        <Badge variant={rec.badgeColor}>{rec.impact}</Badge>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded">
                          {rec.cost}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-550 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 3: Narrative Explanation */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Decision Justification Explanation</CardTitle>
              <CardDescription>Auditable explanation detailing the model constraint variables checked.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {getExplanationContent()}
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1/3) - Confidence Score, Risk Level, Accept/Reject Action Controls */}
        <div className="space-y-6">
          
          {/* Card 4: Assessment Metrics (Confidence & Risk) */}
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle>Analysis Assessment</CardTitle>
              <CardDescription>Reliability rating and impact variance scores.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center space-y-6">
              {/* Confidence Score Big Circle */}
              <div className="h-28 w-28 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-slate-100 stroke-8 fill-none" />
                  <circle cx="56" cy="56" r="48" className="stroke-blue-600 stroke-8 fill-none" strokeDasharray="300" strokeDashoffset={300 - (300 * confidenceScore) / 100} />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">{confidenceScore}%</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Confidence</span>
                </div>
              </div>

              {/* Risk Level Badge */}
              <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Risk Level</span>
                  <span className="text-sm font-bold text-slate-850 block mt-0.5">{riskLevel === 'High' ? 'High Risk Profile' : riskLevel === 'Low' ? 'Low Risk Profile' : 'Medium Risk Profile'}</span>
                </div>
                <Badge variant={riskLevel === 'High' ? 'red' : riskLevel === 'Low' ? 'emerald' : 'amber'} className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{riskLevel}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Action Authorization (Accept / Reject) */}
          <Card className={`transition-all duration-300 border-2 ${
            decisionState === 'accepted' 
              ? 'border-emerald-500 bg-emerald-50/5' 
              : decisionState === 'rejected' 
                ? 'border-red-500 bg-red-50/5' 
                : 'border-slate-200'
          }`}>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle>Decision Authorization</CardTitle>
              <CardDescription>Commit decision recommendations to execution loop.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {decisionState === 'pending' ? (
                <div className="space-y-4">
                  {!showRejectForm ? (
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={handleAccept}
                        variant="success" 
                        className="w-full py-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Accept Recommendation</span>
                      </Button>
                      
                      <Button 
                        onClick={() => setShowRejectForm(true)}
                        variant="outline" 
                        className="w-full py-3 flex items-center justify-center gap-2 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-slate-200 font-bold"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Reject Strategy</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Reason for Rejection
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Provide audit justification details (e.g. Budget variance, override parameters)..."
                          className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-550 text-slate-800 placeholder-slate-400 min-h-[90px]"
                          required
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            setShowRejectForm(false);
                            setRejectReason('');
                          }} 
                          variant="ghost" 
                          className="flex-1 py-2 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleReject} 
                          variant="danger" 
                          className="flex-1 py-2 text-xs bg-red-650 hover:bg-red-750 text-white"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : decisionState === 'accepted' ? (
                <div className="text-center p-4 space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check className="h-6 w-6 stroke-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Pathway Accepted</h4>
                    <p className="text-xs text-slate-400 mt-1">Recommendations committed. Triggering outbound execution triggers.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <X className="h-6 w-6 stroke-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Pathway Rejected</h4>
                    <p className="text-xs text-slate-400 mt-1">Audit log updated. Rejection reason recorded.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md mt-8">
        <div>
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Flow Step 5 of 6</span>
          <h3 className="text-lg font-bold mt-1.5">Decision Finalized?</h3>
          <p className="text-xs text-slate-400">After reviewing or authorizing, proceed to the Evaluation Summary to audit outcomes and savings.</p>
        </div>
        <Button 
          onClick={() => navigate('/evaluation')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 flex items-center gap-2"
        >
          <span>Evaluation Summary</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Results;
