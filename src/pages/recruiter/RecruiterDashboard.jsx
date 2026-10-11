import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ myJobsCount: 0, receivedApplicationsCount: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchRecruiterData = async () => {
      setLoading(true);
      try {
        const [statsRes, appsRes, jobsRes] = await Promise.all([
          client.get('/profile/dashboard-stats'),
          client.get('/recruiter/applications'),
          client.get('/recruiter/jobs'),
        ]);

        setStats(statsRes.data);
        setRecentApplications(appsRes.data.slice(0, 5));
        setRecentJobs(jobsRes.data.slice(0, 4));
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to load recruiter metrics' });
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await client.patch(`/applications/${appId}/status`, { status: newStatus });
      setRecentApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      setAlert({ type: 'success', message: `Application status updated to ${newStatus}` });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update candidate status' });
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Recruiter Command Center</h1>
            <p className="dashboard-subtitle">Manage open tech requisitions and applicant review cycles</p>
          </div>
          <Link to="/recruiter/create-job" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlusCircle size={18} />
            <span>Post New Job</span>
          </Link>
        </div>

        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        {loading ? (
          <LoadingSpinner text="Fetching recruiter metrics..." />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div>
                  <div className="stat-card-value">{stats.myJobsCount || 0}</div>
                  <div className="stat-card-label">My Job Postings</div>
                </div>
                <div className="stat-card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Briefcase size={22} />
                </div>
              </div>

              <div className="stat-card">
                <div>
                  <div className="stat-card-value">{stats.receivedApplicationsCount || 0}</div>
                  <div className="stat-card-label">Total Candidate Submissions</div>
                </div>
                <div className="stat-card-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                  <Users size={22} />
                </div>
              </div>
            </div>

            {/* Recent Candidate Submissions */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Candidate Applications</h2>
                <Link to="/recruiter/applications" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                  View All Candidates
                </Link>
              </div>

              {recentApplications.length === 0 ? (
                <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
                  <Users size={36} className="empty-icon" />
                  <h4 className="empty-title">No candidate applications yet</h4>
                  <p className="empty-desc">When job seekers apply to your postings, their profiles and extracted skills will appear here.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Job Applied</th>
                        <th>Contact</th>
                        <th>Skills</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <strong>{app.candidateName}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {app.candidateEducation || 'Education not listed'}
                            </div>
                          </td>
                          <td>{app.jobTitle}</td>
                          <td>
                            <div style={{ fontSize: '0.825rem' }}>{app.candidateEmail}</div>
                            {app.candidatePhone && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.candidatePhone}</div>}
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8rem', color: '#475569', display: 'inline-block', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {app.candidateSkills || 'No skills listed'}
                            </span>
                          </td>
                          <td>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              <option value="APPLIED">APPLIED</option>
                              <option value="REVIEWING">REVIEWING</option>
                              <option value="SHORTLISTED">SHORTLISTED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                          </td>
                          <td>
                            <Link to="/recruiter/applications" className="btn btn-outline btn-sm">
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* My Job Postings */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Active Job Listings</h2>
                <Link to="/recruiter/my-jobs" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Manage All Jobs
                </Link>
              </div>

              {recentJobs.length === 0 ? (
                <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
                  <Briefcase size={36} className="empty-icon" />
                  <h4 className="empty-title">You haven't posted any jobs yet</h4>
                  <p className="empty-desc">Create your first tech position listing to start attracting qualified engineers.</p>
                  <Link to="/recruiter/create-job" className="btn btn-secondary btn-sm">
                    Post a Job Now
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Applicants</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentJobs.map((job) => (
                        <tr key={job.id}>
                          <td><strong>{job.title}</strong></td>
                          <td>{job.location}</td>
                          <td>{job.employmentType}</td>
                          <td>
                            <span className="badge badge-primary">{job.applicantCount}</span>
                          </td>
                          <td>
                            <span className={`badge ${job.active ? 'badge-success' : 'badge-neutral'}`}>
                              {job.active ? 'Active' : 'Closed'}
                            </span>
                          </td>
                          <td>
                            <Link to={`/recruiter/edit-job/${job.id}`} className="btn btn-outline btn-sm">
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default RecruiterDashboard;
