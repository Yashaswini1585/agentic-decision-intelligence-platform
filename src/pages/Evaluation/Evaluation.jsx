import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  FileDown,
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Evaluation = () => {
  const navigate = useNavigate();
  const { logout, selectedFlow, selectedRole } = usePlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState('all'); // 'all', 'high', 'medium', 'low'
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);

  const handleExportAudit = async () => {
    if (!selectedFlow) {
      alert("No active decision flow available for audit export.");
      return;
    }

    setIsExporting(true);
    setExportMessage(null);

    try {
      const payload = {
        ...selectedFlow,
        persona: selectedRole === 'customer_success' 
          ? 'Customer Success Manager' 
          : selectedRole === 'procurement' 
            ? 'Procurement Officer' 
            : 'Decision Supervisor'
      };

      const response = await fetch('http://localhost:8000/export-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_summary_${selectedFlow.id || 'flow-101'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportMessage({ type: 'success', text: 'Audit summary PDF generated and downloaded successfully!' });
      setTimeout(() => setExportMessage(null), 4000);
    } catch (error) {
      console.error('PDF export error:', error);
      setExportMessage({ type: 'error', text: 'Failed to generate PDF. Make sure backend is running.' });
      setTimeout(() => setExportMessage(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  // Mock dummy audit history representing decisions
  const historicalDecisions = [
    { 
      id: 'flow-101', 
      decision: 'Q3 Global Supply Chain Rerouting via Algeciras', 
      date: '2026-06-27', 
      recTime: '0.52s', 
      confidence: '94%', 
      impact: 'High ($142.4K tariff savings)', 
      status: 'approved' 
    },
    { 
      id: 'flow-102', 
      decision: 'AWS m5.xlarge Instances Downsize Consolidation', 
      date: '2026-06-25', 
      recTime: '0.34s', 
      confidence: '89%', 
      impact: 'Medium ($4.2K/mo infrastructure reduction)', 
      status: 'approved' 
    },
    { 
      id: 'flow-103', 
      decision: 'Supplier credit limit reduction on Credit Drop', 
      date: '2026-06-22', 
      recTime: '0.45s', 
      confidence: '97%', 
      impact: 'High ($140K risk exposure avoidance)', 
      status: 'approved' 
    },
    { 
      id: 'flow-104', 
      decision: 'Competitor Price matching indices synchronization', 
      date: '2026-06-18', 
      recTime: '0.28s', 
      confidence: '32%', 
      impact: 'Low (Crashed SKU alignment)', 
      status: 'failed' 
    },
    { 
      id: 'flow-099', 
      decision: 'Q2 Raw Sourcing logistics re-allocation', 
      date: '2026-06-15', 
      recTime: '0.61s', 
      confidence: '95%', 
      impact: 'High ($48.0K tariff savings)', 
      status: 'approved' 
    },
    { 
      id: 'flow-098', 
      decision: 'AWS Enterprise cloud savings contract lock-in', 
      date: '2026-06-10', 
      recTime: '0.41s', 
      confidence: '92%', 
      impact: 'Medium ($9.2K budget optimization)', 
      status: 'approved' 
    }
  ];

  // Filtering
  const filteredDecisions = historicalDecisions.filter(item => {
    const matchesSearch = item.decision.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImpact = impactFilter === 'all' || 
                          (impactFilter === 'high' && item.impact.includes('High')) ||
                          (impactFilter === 'medium' && item.impact.includes('Medium')) ||
                          (impactFilter === 'low' && item.impact.includes('Low'));
    return matchesSearch && matchesImpact;
  });

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/80 border border-blue-150 px-2 py-0.5 rounded-md">
              Audit Office
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Step 6 of 6</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">Platform Evaluation Summary</h1>
          <p className="text-xs text-slate-550 mt-1">Post-execution audit report measuring recommendation latency, model confidence, and ROI impact.</p>
        </div>
        <Button 
          onClick={handleExportAudit}
          disabled={isExporting}
          variant="outline" 
          className="flex items-center gap-2 bg-white border-slate-200 shadow-xs h-9 text-xs py-1.5 px-3"
        >
          {isExporting ? (
            <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin" />
          ) : (
            <FileDown className="h-3.5 w-3.5 text-slate-500" />
          )}
          <span>{isExporting ? 'Generating PDF...' : 'Export Audit Summary'}</span>
        </Button>
      </div>

      {exportMessage && (
        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 shadow-xs transition-all duration-300 ${
          exportMessage.type === 'success' 
            ? 'bg-emerald-50/70 border-emerald-100 text-emerald-950 font-semibold' 
            : 'bg-red-50/70 border-red-100 text-red-950 font-semibold'
        }`}>
          {exportMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-650 shrink-0" />
          )}
          <span>{exportMessage.text}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* KPI 1: Recommendation Time */}
        <Card hoverable className="border-slate-200/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Latency Speed</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">0.43s</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100/50">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-450 mt-4 flex items-center gap-1.5 border-t border-slate-50 pt-2.5">
            <span className="text-emerald-600 font-bold">↑ 92% faster</span>
            <span>than manual operations</span>
          </div>
        </Card>

        {/* KPI 2: Confidence */}
        <Card hoverable className="border-slate-200/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Solver Confidence</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">91.8%</h3>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100/50">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-450 mt-4 flex items-center gap-1.5 border-t border-slate-50 pt-2.5">
            <span className="text-emerald-600 font-bold">96.4% success</span>
            <span>realization profile</span>
          </div>
        </Card>

        {/* KPI 3: Decision Realization */}
        <Card hoverable className="border-slate-200/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adoption Release Rate</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">92.0%</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-450 mt-4 flex items-center gap-1.5 border-t border-slate-50 pt-2.5">
            <span className="text-slate-650 font-semibold">8.0% overridden</span>
            <span>by administration</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Historical Decisions Summary Table */}
      <Card className="border-slate-200/50 shadow-xs">
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4" border>
          <div>
            <CardTitle>Historical Decisions Registry</CardTitle>
            <CardDescription>Audited trace records comparing recommendation speed, solver confidence, and expected impact metrics.</CardDescription>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search decision registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-405 w-full md:w-48 shadow-inner"
              />
            </div>
            
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className="text-xs font-semibold px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
            >
              <option value="all">All Impacts</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3.5">Audit ID</th>
                  <th className="px-4 py-3.5">Decision Details</th>
                  <th className="px-4 py-3.5">Latency</th>
                  <th className="px-4 py-3.5">Confidence</th>
                  <th className="px-4 py-3.5">Expected Impact</th>
                  <th className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-650">
                {filteredDecisions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-405 italic">
                      No matching historical records found.
                    </td>
                  </tr>
                ) : (
                  filteredDecisions.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                      {/* ID */}
                      <td className="px-6 py-4.5 font-mono text-xs font-bold text-slate-400">
                        {item.id}
                      </td>

                      {/* Decision Details */}
                      <td className="px-4 py-4.5 font-bold text-slate-900 text-xs">
                        {item.decision}
                        <div className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>Audited on {item.date}</span>
                        </div>
                      </td>

                      {/* Latency */}
                      <td className="px-4 py-4.5 font-bold font-mono">
                        {item.recTime}
                      </td>

                      {/* Confidence */}
                      <td className="px-4 py-4.5 font-bold text-blue-600 font-mono">
                        {item.confidence}
                      </td>

                      {/* Expected Impact */}
                      <td className="px-4 py-4.5 font-semibold text-slate-700">
                        {item.impact}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5 text-right">
                        <Badge 
                          variant={item.status === 'approved' ? 'emerald' : 'red'}
                          className="px-2 py-0.5 rounded-md"
                        >
                          {item.status === 'approved' ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-red-650" />
                          )}
                          <span>{item.status}</span>
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-950 border border-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm mt-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-[9px] bg-blue-600 border border-blue-500/20 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Flow Step 6 of 6</span>
          <h3 className="text-base font-bold mt-1 text-slate-100">Decision Lifecycle Terminated</h3>
          <p className="text-xs text-slate-400">You have completed the entire audit cycle. You can restart the simulation workflow or shift personas.</p>
        </div>
        <Button 
          onClick={() => {
            logout();
            navigate('/login');
          }} 
          variant="primary"
          className="shrink-0 flex items-center gap-2 relative z-10 py-2.5"
        >
          <span>Restart Session</span>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Evaluation;
