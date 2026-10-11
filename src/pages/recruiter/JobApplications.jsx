import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import {
  Users,
  Briefcase,
  FileText,
  Mail,
  Phone,
  BookOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Download
} from 'lucide-react';

const JobApplications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Resume Viewer Modal state
  const [resumeModal, setResumeModal] = useState({ open: false, title: '', text: '', filename: '', resumeId: null, loading: false });

  // Fetch recruiter's jobs to populate the filter dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await client.get('/recruiter/jobs');
        setJobs(res.data);
      } catch (err) {
        console.warn('Could not fetch jobs list:', err);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applications based on filter
  const fetchApplications = async (jobId) => {
    setLoading(true);
    try {
      const url = jobId ? `/recruiter/jobs/${jobId}/applications` : '/recruiter/applications';
      const res = await client.get(url);
      setApplications(res.data);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to fetch candidate applications' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(selectedJobId);
  }, [selectedJobId]);

  const handleJobFilterChange = (e) => {
    const newId = e.target.value;
    setSelectedJobId(newId);
    setSearchParams(newId ? { jobId: newId } : {});
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await client.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      setAlert({ type: 'success', message: `Candidate status updated to ${newStatus}` });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update candidate status' });
    }
  };

  const handleViewResume = async (resumeId, candidateName) => {
    if (!resumeId) return;
    setResumeModal({ open: true, title: `Resume: ${candidateName}`, text: '', filename: '', resumeId, loading: true });
    try {
      const res = await client.get(`/resumes/candidate/${resumeId}`);
      setResumeModal((prev) => ({
        ...prev,
        text: res.data.extractedText || 'No text extracted from this file.',
        filename: res.data.filename,
        resumeId,
        loading: false,
      }));
    } catch (err) {
      setResumeModal((prev) => ({
        ...prev,
        text: 'Unable to retrieve resume details.',
        loading: false,
      }));
    }
  };

  const handleDownloadResume = async (resumeId, filename) => {
    if (!resumeId) return;
    try {
      const res = await client.get(`/resumes/${resumeId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'candidate_resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to download candidate resume.' });
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="dashboard-title">Candidate Pipeline</h1>
            <p className="dashboard-subtitle">
              Review applicant submissions, inspect extracted PDF resumes, and update hiring decision stages.
            </p>
          </div>

          {/* Job Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              value={selectedJobId}
              onChange={handleJobFilterChange}
              style={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', outline: 'none' }}
            >
              <option value="">All Requisitions ({jobs.length})</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        {loading ? (
          <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner size="lg" />
          </div>
        ) : applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Users size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              No Applications Received Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              When job seekers apply to your active requisitions, their profiles, resumes, and contact credentials will appear here.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied Position</th>
                  <th>Education</th>
                  <th>Verified Skills</th>
                  <th>Applied Date</th>
                  <th>Hiring Status</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.925rem' }}>
                        {app.candidateName}
                      </div>
                      <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                        <Mail size={12} />
                        <span>{app.candidateEmail}</span>
                      </div>
                      {app.candidatePhone && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone size={11} />
                          <span>{app.candidatePhone}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.jobTitle}</div>
                      <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>{app.jobCompany}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>
                        {app.candidateEducation || '—'}
                      </span>
                    </td>
                    <td>
                      {app.candidateSkills ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '220px' }}>
                          {app.candidateSkills.split(',').slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="skill-tag" style={{ fontSize: '0.725rem', padding: '0.15rem 0.4rem' }}>
                              {skill.trim()}
                            </span>
                          ))}
                          {app.candidateSkills.split(',').length > 3 && (
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-light)' }}>
                              +{app.candidateSkills.split(',').length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>None listed</span>
                      )}
                    </td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          background:
                            app.status === 'SHORTLISTED'
                              ? 'var(--success-bg)'
                              : app.status === 'REVIEWING'
                              ? 'var(--warning-bg)'
                              : app.status === 'REJECTED'
                              ? 'var(--danger-bg)'
                              : 'white',
                          color:
                            app.status === 'SHORTLISTED'
                              ? '#065f46'
                              : app.status === 'REVIEWING'
                              ? '#92400e'
                              : app.status === 'REJECTED'
                              ? '#991b1b'
                              : 'inherit',
                        }}
                      >
                        <option value="APPLIED">APPLIED</option>
                        <option value="REVIEWING">REVIEWING</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td>
                      {app.resumeId ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleViewResume(app.resumeId, app.candidateName)}
                            className="btn btn-outline btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="Inspect Extracted Text"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadResume(app.resumeId, app.resumeFilename || `${app.candidateName.replace(/\s+/g, '_')}_Resume.pdf`)}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="Download PDF File"
                          >
                            <Download size={13} />
                            <span>PDF</span>
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          No PDF
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Resume Extracted Text Modal */}
        {resumeModal.open && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{resumeModal.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeModal({ open: false, title: '', text: '', filename: '', resumeId: null, loading: false })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {resumeModal.loading ? (
                <LoadingSpinner text="Retrieving resume..." />
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Document: <strong>{resumeModal.filename}</strong> (Parsed via Apache PDFBox)
                    </div>
                    {resumeModal.resumeId && (
                      <button
                        type="button"
                        onClick={() => handleDownloadResume(resumeModal.resumeId, resumeModal.filename)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        <Download size={13} />
                        <span>Download PDF File</span>
                      </button>
                    )}
                  </div>
                  <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', maxHeight: '350px', overflowY: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {resumeModal.text}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setResumeModal({ open: false, title: '', text: '', filename: '', resumeId: null, loading: false })}
                  className="btn btn-primary btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobApplications;
