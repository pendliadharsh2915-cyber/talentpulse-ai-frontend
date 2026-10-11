import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Building,
  Users,
  AlertTriangle,
  Lightbulb,
  Edit3,
  Bookmark,
  Copy,
  Check,
  FileText
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSeeker, isRecruiter } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Resume Intelligence Analysis state
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await client.get(`/jobs/${id}`);
        setJob(res.data);
        setIsSaved(res.data.saved || false);
      } catch (err) {
        setAlert({ type: 'danger', message: 'Job not found or unavailable' });
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Fetch resume analysis for seeker
  useEffect(() => {
    if (isSeeker && id) {
      const fetchAnalysis = async () => {
        setLoadingAnalysis(true);
        try {
          const res = await client.get(`/resumes/analysis/${id}`);
          setAnalysis(res.data);
        } catch (err) {
          console.log('No resume analysis available:', err.message);
        } finally {
          setLoadingAnalysis(false);
        }
      };
      fetchAnalysis();
    }
  }, [id, isSeeker]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (!isSeeker) {
      setAlert({ type: 'danger', message: 'Only job seekers can apply for jobs' });
      return;
    }

    setApplying(true);
    setAlert({ type: '', message: '' });
    try {
      await client.post(`/jobs/${id}/apply`);
      setAlert({ type: 'success', message: 'Congratulations! Your application has been submitted successfully.' });
      setJob((prev) => ({
        ...prev,
        hasApplied: true,
        applicantCount: (prev?.applicantCount || 0) + 1
      }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setAlert({ type: 'danger', message: msg });
    } finally {
      setApplying(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user || !isSeeker || savingBookmark) return;
    setSavingBookmark(true);
    try {
      const res = await client.post(`/jobs/${id}/save`);
      setIsSaved(res.data.saved);
      setAlert({
        type: 'success',
        message: res.data.saved ? 'Job added to saved bookmarks' : 'Job removed from bookmarks'
      });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Could not update bookmark status' });
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (analysis?.aiCoverLetter) {
      navigator.clipboard.writeText(analysis.aiCoverLetter);
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2500);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Job Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The requisition you are looking for does not exist or has been removed.
        </p>
        <Link to="/jobs" className="btn btn-primary">
          Browse All Jobs
        </Link>
      </div>
    );
  }

  const skills = job.requiredSkills
    ? job.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const isOwnerRecruiter = isRecruiter && job.recruiterId === user?.id;

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Jobs</span>
        </Link>

        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Main Job Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {job.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <Building size={18} />
                  <span>{job.company}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isSeeker && (
                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    disabled={savingBookmark}
                    className="btn btn-outline"
                    title={isSaved ? 'Remove from saved' : 'Save job'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderColor: isSaved ? 'var(--primary)' : undefined,
                      color: isSaved ? 'var(--primary)' : undefined
                    }}
                  >
                    <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    <span>{isSaved ? 'Saved' : 'Save Job'}</span>
                  </button>
                )}

                {job.hasApplied ? (
                  <span className="badge badge-success" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} />
                    <span>Applied to this Job</span>
                  </span>
                ) : !job.active ? (
                  <span className="badge badge-neutral" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                    Position Closed
                  </span>
                ) : isOwnerRecruiter ? (
                  <Link to={`/recruiter/edit-job/${job.id}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Edit3 size={15} />
                    <span>Edit Job</span>
                  </Link>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="btn btn-primary btn-lg"
                  >
                    {applying ? 'Submitting Application...' : 'Apply Now'}
                  </button>
                )}
              </div>
            </div>

            {/* Meta Info Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={17} color="var(--primary)" />
                <strong style={{ color: 'var(--text-main)' }}>Location:</strong>
                <span>{job.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={17} color="var(--primary)" />
                <strong style={{ color: 'var(--text-main)' }}>Type:</strong>
                <span>{job.employmentType}</span>
              </div>
              {job.salary && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={17} color="var(--primary)" />
                  <strong style={{ color: 'var(--text-main)' }}>Compensation:</strong>
                  <span>{job.salary}</span>
                </div>
              )}
              {job.applicantCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={17} color="var(--primary)" />
                  <strong style={{ color: 'var(--text-main)' }}>Applicants:</strong>
                  <span>{job.applicantCount} candidates applied</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                About the Role & Responsibilities
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            {skills.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                  Required Skills & Technologies
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag" style={{ fontSize: '0.875rem', padding: '0.35rem 0.8rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Seeker AI Resume Match Section */}
          {isSeeker && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.6) 0%, rgba(245, 243, 255, 0.4) 100%)', border: '1px solid #c7d2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '10px' }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      TalentPulse AI Match & Compatibility Analysis
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Evaluates your uploaded resume qualifications against this requisition's tech requirements.
                    </span>
                  </div>
                </div>

                <Link to="/seeker/resume" className="btn btn-outline btn-sm">
                  <span>Manage Resume</span>
                </Link>
              </div>

              {loadingAnalysis ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <LoadingSpinner size="md" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
                    Analyzing skill alignment...
                  </span>
                </div>
              ) : analysis ? (
                <div>
                  {/* Score Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ textAlign: 'center', minWidth: '90px' }}>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: analysis.matchPercentage >= 70 ? 'var(--success)' : analysis.matchPercentage >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
                        {analysis.matchPercentage}%
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Match Score
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div
                          style={{
                            width: `${analysis.matchPercentage}%`,
                            height: '100%',
                            background: analysis.matchPercentage >= 70 ? 'linear-gradient(90deg, #10b981, #059669)' : analysis.matchPercentage >= 40 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                            transition: 'width 0.6s ease'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {analysis.summary}
                      </span>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.65rem' }}>
                        <CheckCircle2 size={16} />
                        <span>Matched Skills ({analysis.matchedSkills?.length || 0})</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {analysis.matchedSkills?.length > 0 ? (
                          analysis.matchedSkills.map((s, idx) => (
                            <span key={idx} className="skill-tag matched">{s}</span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>No exact matches found yet</span>
                        )}
                      </div>
                    </div>

                    <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9f1239', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.65rem' }}>
                        <AlertTriangle size={16} />
                        <span>Missing Skills ({analysis.missingSkills?.length || 0})</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {analysis.missingSkills?.length > 0 ? (
                          analysis.missingSkills.map((s, idx) => (
                            <span key={idx} className="skill-tag missing">{s}</span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.825rem', color: '#059669', fontWeight: 600 }}>All requirements satisfied!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Practical Skill Roadmaps */}
                  {analysis.skillRecommendations?.length > 0 && (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                        <Lightbulb size={17} />
                        <span>Practical Skill Gap Learning Pathway</span>
                      </div>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {analysis.skillRecommendations.map((rec, idx) => (
                          <li key={idx} style={{ lineHeight: 1.5 }}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tailored Cover Letter Generator */}
                  {analysis.aiCoverLetter && (
                    <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                          <FileText size={17} />
                          <span>AI-Generated Tailored Cover Letter</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyCoverLetter}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          {copiedCoverLetter ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                          <span>{copiedCoverLetter ? 'Copied to Clipboard!' : 'Copy Cover Letter'}</span>
                        </button>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'pre-line', lineHeight: '1.6', maxHeight: '250px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
                        {analysis.aiCoverLetter}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'white', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Upload your PDF resume to generate a personalized skill compatibility breakdown for this position.
                  </p>
                  <Link to="/seeker/resume" className="btn btn-secondary btn-sm">
                    <Sparkles size={16} />
                    <span>Upload Resume for Analysis</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
