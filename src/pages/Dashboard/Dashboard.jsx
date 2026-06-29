import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  UploadCloud, 
  TrendingUp, 
  Cpu, 
  ArrowRight,
  Sparkles,
  Loader2,
  Trash2
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const { injectAnalysisResult, selectedRole } = usePlatform();
  const navigate = useNavigate();

  // State for drag & drop file upload
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analyzingFile, setAnalyzingFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files) => {
    const formattedFiles = files.map(file => ({
      name: file.name,
      size: formatBytes(file.size),
      rawFile: file
    }));
    setUploadedFiles(prev => [...prev, ...formattedFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Mock document analysis trigger calling FastAPI POST /analyze and navigating to results
  const triggerAnalysis = async (file, index) => {
    setAnalyzingFile(file.name);

    try {
      // 1. Create FormData and upload the file to the backend
      const formData = new FormData();
      formData.append('file', file.rawFile);
      
      const uploadResponse = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      const fileId = uploadResult.file_id;

      // 2. Send request to FastAPI POST /analyze endpoint with the correct file_id
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          file_id: fileId,
          persona: selectedRole?.id || 'customer_success'
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const result = await response.json();
      console.log('FastAPI response received:', result);

      // 3. Inject response into PlatformContext state
      injectAnalysisResult(result);

      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
      setAnalyzingFile(null);

      // 4. Navigate to Agent Pipeline page and auto-run simulation
      navigate('/processing', { state: { runSimulation: true } });

    } catch (error) {
      console.warn('FastAPI backend offline or unavailable. Falling back to local optimization mockup.', error);
      
      // Fallback local simulation logic if backend is not running
      setTimeout(() => {
        const dummyResult = {
          risk_level: 'Medium-High',
          confidence_score: 0.92,
          customer_summary: { contract_value: '$2.4M ACV' },
          explanation: 'Local mockup analysis complete. Storm patterns and strike delays modeled.',
          recommendations: [
            { id: 1, title: 'Redirect 60% Cargo via Algeciras', cost: 'Low Cost' },
            { id: 2, title: 'Secure Spot Contracts with Hapag-Lloyd', cost: 'Medium Cost' },
            { id: 3, title: 'Establish Secondary Trucking Agreements', cost: 'Low Cost' }
          ]
        };

        injectAnalysisResult(dummyResult);

        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
        setAnalyzingFile(null);

        navigate('/processing', { state: { runSimulation: true } });
      }, 1500);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meeting Ingestion Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload client transcripts and decision logs. Autonomous agents orchestrate evaluation pipelines in real-time.
          </p>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hoverable className="border-slate-200/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documents Ingested</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">14 <span className="text-[11px] text-slate-400 font-normal">files</span></h3>
            </div>
            <div className="p-2 bg-blue-50/80 text-blue-600 rounded-lg border border-blue-100/50">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-450 mt-4 flex items-center gap-1.5 border-t border-slate-50 pt-2.5">
            <span className="text-emerald-600 font-semibold">100% Verified</span>
            <span>audit logging active</span>
          </div>
        </Card>

        <Card hoverable className="border-slate-200/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agents Configured</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">7 <span className="text-[11px] text-slate-400 font-normal">nodes</span></h3>
            </div>
            <div className="p-2 bg-indigo-50/80 text-indigo-600 rounded-lg border border-indigo-100/50">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-450 mt-4 flex items-center gap-1.5 border-t border-slate-50 pt-2.5">
            <span className="font-semibold text-indigo-600">Dynamic routing</span>
            <span>orchestrated</span>
          </div>
        </Card>

        <Card hoverable className="border-slate-200/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Decision Accuracy</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">94.8%</h3>
            </div>
            <div className="p-2 bg-emerald-50/80 text-emerald-600 rounded-lg border border-emerald-100/50">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-450 mt-4 flex items-center gap-1.5 border-t border-slate-50 pt-2.5">
            <span className="text-emerald-600 font-bold">↑ +0.4%</span>
            <span>retention stability</span>
          </div>
        </Card>

        <Card hoverable className="border-slate-200/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">$0.18 <span className="text-[11px] text-slate-400 font-normal">/ run</span></h3>
            </div>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[11px] text-slate-450 mt-4 flex items-center gap-1.5 border-t border-slate-50 pt-2.5">
            <span>LLM optimization</span>
            <span className="font-semibold text-slate-700">active</span>
          </div>
        </Card>
      </div>

      {/* Document Ingestion Center */}
      <div className="w-full">
        <Card className="border-slate-200/50 shadow-xs">
          <CardHeader border className="pb-4">
            <CardTitle>Staged Document Dropzone</CardTitle>
            <CardDescription>Drag and drop text transcripts or audio transcript files to initiate the agent orchestration sequence.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Drag and Drop Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`
                border border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
                ${dragActive 
                  ? 'border-blue-600 bg-blue-50/20' 
                  : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/20'}
              `}
            >
              <input 
                type="file" 
                id="file-upload-input"
                multiple 
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,.doc,.docx,.pdf"
              />
              
              <label htmlFor="file-upload-input" className="cursor-pointer block space-y-4">
                <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center border border-blue-100/50">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 block">Click to select files</span>
                  <span className="text-[10px] text-slate-400 block mt-1">or drag and drop them here</span>
                </div>
                <span className="inline-block text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-3 py-1 rounded-md">
                  TXT, DOCX, PDF (MAX. 10MB)
                </span>
              </label>
            </div>

            {/* Queue of Staged Files to Analyze */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staged Documents ({uploadedFiles.length})</h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs transition-all duration-200 hover:bg-slate-100/50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                        <div className="truncate font-semibold text-slate-700 text-xs" title={file.name}>
                          {file.name}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">({file.size})</span>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {analyzingFile === file.name ? (
                          <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-[10px]">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Orchestrating...</span>
                          </div>
                        ) : (
                          <>
                            <Button 
                              onClick={() => triggerAnalysis(file, idx)}
                              variant="primary"
                              className="px-3 py-1 text-[10px] h-7"
                              disabled={analyzingFile !== null}
                            >
                              Analyze
                            </Button>
                            <button 
                              onClick={() => removeFile(idx)}
                              className="text-slate-450 hover:text-red-500 p-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all shadow-xs"
                              disabled={analyzingFile !== null}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Flow Wizard Navigation Banner */}
      <div className="bg-slate-950 border border-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm mt-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-[9px] bg-blue-600 border border-blue-500/20 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Ingestion Sequence Complete</span>
          <h3 className="text-base font-bold mt-1 text-slate-100">Proceed to Agent Pipeline</h3>
          <p className="text-xs text-slate-400">Launch the multi-agent decision model solver and monitor real-time execution steps.</p>
        </div>
        <Button 
          onClick={() => navigate('/processing')} 
          variant="primary"
          className="shrink-0 flex items-center gap-2 relative z-10 py-2.5"
        >
          <span>Open Execution Monitor</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
