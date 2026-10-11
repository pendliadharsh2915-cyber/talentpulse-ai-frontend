import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  RefreshCw,
  Search,
  Check,
  Download,
  Copy,
  BookOpen
} from 'lucide-react';

const ResumeIntelligence = () => {
  const { user, updateUser } = useAuth();

  // State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(true);

  // Manual skills fallback state
  const [manualSkills, setManualSkills] = useState(user?.skills || '');
  const [savingSkills, setSavingSkills] = useState(false);

  // Job analysis simulator state
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  const [alert, setAlert] = useState({ type: '', message: '' });

  // 1. Fetch current user's resume and active jobs
  useEffect(() => {
    const initData = async () => {
      try {
        const [resumeRes, jobsRes] = await Promise.all([
          client.get('/resumes/my').catch(() => ({ data: { hasResume: false } })),
          client.get('/jobs'),
        ]);

        if (resumeRes.data.hasResume) {
          setResumeData(resumeRes.data);
        }
        setJobs(jobsRes.data || []);
        if (jobsRes.data?.length > 0) {
          setSelectedJobId(jobsRes.data[0].id.toString());
        }
      } catch (err) {
        console.error('Error fetching resume info:', err);
      } finally {
        setLoadingResume(false);
      }
    };

    initData();
  }, []);

  // 2. Run analysis when selectedJobId changes
  useEffect(() => {
    if (selectedJobId) {
      runAnalysis(selectedJobId);
    }
  }, [selectedJobId, resumeData]);

  const runAnalysis = async (jobId) => {
    setAnalyzing(true);
    try {
      const res = await client.get(`/resumes/analysis/${jobId}`);
      setAnalysis(res.data);
    } catch (err) {
      console.warn('Analysis error:', err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setAlert({ type: 'danger', message: 'Only PDF format resumes are supported.' });
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ type: 'danger', message: 'File size exceeds maximum 5 MB limit.' });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setAlert({ type: '', message: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setAlert({ type: 'danger', message: 'Please choose a PDF document before submitting.' });
      return;
    }

    setUploading(true);
    setAlert({ type: '', message: '' });

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await client.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAlert({ type: 'success', message: 'Resume uploaded and extracted successfully!' });
      setSelectedFile(null);

      // Refresh resume status
      const myResumeRes = await client.get('/resumes/my');
      setResumeData(myResumeRes.data);

      // Refresh current user profile to get newly detected skills
      const profileRes = await client.get('/profile');
      if (updateUser) updateUser(profileRes.data);
      if (profileRes.data.skills) setManualSkills(profileRes.data.skills);

      if (selectedJobId) {
        runAnalysis(selectedJobId);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload and parse resume.';
      setAlert({ type: 'danger', message: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveManualSkills = async () => {
    setSavingSkills(true);
    setAlert({ type: '', message: '' });
    try {
      const res = await client.put('/profile', {
        name: user.name,
        phone: user.phone,
        education: user.education,
        skills: manualSkills,
      });
      if (updateUser) updateUser(res.data);
      setAlert({ type: 'success', message: 'Skills profile updated successfully.' });

      if (selectedJobId) {
        runAnalysis(selectedJobId);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update skills profile.' });
    } finally {
      setSavingSkills(false);
    }
  };

  const handleDownloadResume = async (resumeId, filename) => {
    try {
      const res = await client.get(`/resumes/${resumeId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to download resume file from server.' });
    }
  };

  const handleCopySummary = () => {
    if (analysis?.aiExecutiveSummary) {
      navigator.clipboard.writeText(analysis.aiExecutiveSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  const handleCopyCoverLetter = () => {
    if (analysis?.aiCoverLetter) {
      navigator.clipboard.writeText(analysis.aiCoverLetter);
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2500);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Resume Intelligence System</h1>
            <p className="dashboard-subtitle">
              Automated Apache PDFBox text extraction, algorithmic skill verification, and AI cover letter drafting.
            </p>
          </div>
        </div>

        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Top Section: Upload Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Upload PDF Resume</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Parses text via Apache PDFBox to detect Java, Spring Boot, React, SQL, and core competencies.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpload}>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: 'var(--radius-lg)', padding: '2rem 1.5rem', textAlign: 'center', background: '#fafbfc', marginBottom: '1.25rem' }}>
                <FileText size={44} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  {selectedFile ? selectedFile.name : 'Select PDF Resume to parse'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Maximum file size: 5 MB (PDF format only)
                </div>

                <input
                  type="file"
                  id="resume-upload-input"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <label htmlFor="resume-upload-input" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  Browse Files
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  {resumeData?.hasResume ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.825rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={16} />
                        Active: {resumeData.filename} ({new Date(resumeData.uploadedAt).toLocaleDateString()})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadResume(resumeData.resumeId, resumeData.filename)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Download size={13} />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      No resume uploaded yet.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="btn btn-primary"
                >
                  <Cpu size={18} />
                  <span>{uploading ? 'Extracting Text...' : 'Parse & Save Resume'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Fallback / Complementary Manual Skills Editor */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Verified Skills & Fallback Input</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Extracted from your resume or manually added. Edit anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveManualSkills}
                disabled={savingSkills}
                className="btn btn-outline btn-sm"
              >
                <Check size={14} />
                <span>{savingSkills ? 'Saving...' : 'Update Skills'}</span>
              </button>
            </div>

            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. Java, Spring Boot, React, JavaScript, SQL, HTML, CSS, Git, Docker, Kubernetes"
              value={manualSkills}
              onChange={(e) => setManualSkills(e.target.value)}
            />
          </div>

          {/* Skill Matching Engine & Job Match Simulator */}
          <div className="card" style={{ border: '2px solid #e0e7ff', background: '#fafbff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>
                  <Sparkles size={13} />
                  <span>Explainable AI Engine</span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Real-Time Skill Compatibility Simulator
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Select any live job opening to test your profile alignment and missing skill recommendations.
                </p>
              </div>

              {/* Job Dropdown Selector */}
              <div style={{ minWidth: '260px' }}>
                <label className="form-label">Evaluate against active job:</label>
                <select
                  className="form-control"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  style={{ background: 'white' }}
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.company})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {analyzing ? (
              <LoadingSpinner text="Computing skill compatibility metrics..." />
            ) : analysis ? (
              <div>
                {/* Score Banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.75rem', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '2.75rem', fontWeight: 900, lineHeight: '1', color: analysis.matchPercentage >= 70 ? 'var(--success)' : analysis.matchPercentage >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
                      {analysis.matchPercentage}%
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Skill Match
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '7px', overflow: 'hidden', marginBottom: '0.65rem' }}>
                      <div
                        style={{
                          width: `${analysis.matchPercentage}%`,
                          height: '100%',
                          background: analysis.matchPercentage >= 70 ? 'linear-gradient(90deg, #10b981, #059669)' : analysis.matchPercentage >= 40 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                          transition: 'width 0.6s ease'
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {analysis.summary}
                    </p>
                  </div>
                </div>

                {/* Skills Breakdown Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      <CheckCircle2 size={18} />
                      <span>Matched Skills ({analysis.matchedSkills?.length || 0})</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {analysis.matchedSkills?.length > 0 ? (
                        analysis.matchedSkills.map((s, idx) => (
                          <span key={idx} className="skill-tag matched" style={{ fontSize: '0.85rem' }}>
                            {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                          No exact matching skills detected
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9f1239', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      <AlertTriangle size={18} />
                      <span>Missing Skills to Learn ({analysis.missingSkills?.length || 0})</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {analysis.missingSkills?.length > 0 ? (
                        analysis.missingSkills.map((s, idx) => (
                          <span key={idx} className="skill-tag missing" style={{ fontSize: '0.85rem' }}>
                            {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                          No missing skills! You possess 100% of required competencies.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Practical Skill Roadmaps */}
                {analysis.skillRecommendations?.length > 0 && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                      <BookOpen size={18} />
                      <span>Practical Skill Gap Learning Pathways</span>
                    </div>
                    <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {analysis.skillRecommendations.map((rec, idx) => (
                        <li key={idx} style={{ lineHeight: 1.5 }}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Executive Summary */}
                {analysis.aiExecutiveSummary && (
                  <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                        <Sparkles size={18} />
                        <span>AI Executive Resume Summary</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {copiedSummary ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                        <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                      </button>
                    </div>
                    <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.6', margin: 0, border: '1px solid #e2e8f0' }}>
                      {analysis.aiExecutiveSummary}
                    </p>
                  </div>
                )}

                {/* AI Tailored Cover Letter */}
                {analysis.aiCoverLetter && (
                  <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                        <FileText size={18} />
                        <span>AI-Tailored Cover Letter for this Requisition</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCoverLetter}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {copiedCoverLetter ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                        <span>{copiedCoverLetter ? 'Copied Cover Letter!' : 'Copy Cover Letter'}</span>
                      </button>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'pre-line', lineHeight: '1.6', maxHeight: '250px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
                      {analysis.aiCoverLetter}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeIntelligence;
