import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalActiveJobs: 0, myApplicationsCount: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, jobsRes, appsRes, resumeRes] = await Promise.all([
          client.get('/profile/dashboard-stats'),
          client.get('/jobs'),
          client.get('/applications/my'),
          client.get('/resumes/my').catch(() => ({ data: { hasResume: false } })),
        ]);

        setStats(statsRes.data);
        setRecentJobs(jobsRes.data.slice(0, 3));
        setRecentApplications(appsRes.data.slice(0, 5));
        setResumeInfo(resumeRes.data);
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to load dashboard metrics' });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SHORTLISTED':
        return <span className="badge badge-success">Shortlisted</span>;
      case 'REVIEWING':
        return <span className="badge badge-warning">Under Review</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Not Selected</span>;
      case 'APPLIED':
      default:
        return <span className="badge badge-primary">Applied</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
            <p className="dashboard-subtitle">Here is your job hunt and application summary</p>
          </div>
          <Link to="/seeker/resume" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} />
            <span>Resume Intelligence</span>
          </Link>
        </div>

        {alert.message && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />}

        {loading ? (
          <LoadingSpinner text="Loading dashboard metrics..." />
        ) : (
          <>
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card">
                <div>
                  <div className="stat-card-value">{stats.totalActiveJobs || 0}</div>
                  <div className="stat-card-label">Active Job Openings</div>
                </div>
                <div className="stat-card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Briefcase size={22} />
                </div>
              </div>

              <div className="stat-card">
                <div>
                  <div className="stat-card-value">{stats.myApplicationsCount || 0}</div>
                  <div className="stat-card-label">Submitted Applications</div>
                </div>
                <div className="stat-card-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                  <Clock size={22} />
                </div>
              </div>

              <div className="stat-card">
                <div>
                  <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>
                    {resumeInfo?.hasResume ? 'Active' : 'Missing'}
                  </div>
                  <div className="stat-card-label">
                    {resumeInfo?.hasResume ? 'Parsed PDF on File' : 'Upload PDF Resume'}
                  </div>
                </div>
                <div className="stat-card-icon" style={{ background: resumeInfo?.hasResume ? '#ecfdf5' : '#fffbeb', color: resumeInfo?.hasResume ? 'var(--success)' : 'var(--warning)' }}>
                  <FileText size={22} />
                </div>
              </div>
            </div>

            {/* Resume Callout if not uploaded */}
            {!resumeInfo?.hasResume && (
              <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1px solid #c7d2fe', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    Boost your application speed with Resume Intelligence
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Upload your PDF to automatically detect technical skills (Java, Spring, React, SQL) and see match percentages on all jobs.
                  </p>
                </div>
                <Link to="/seeker/resume" className="btn btn-secondary">
                  <Sparkles size={16} />
                  <span>Upload Resume Now</span>
                </Link>
              </div>
            )}

            {/* Recent Applications Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Applications</h2>
                <Link to="/seeker/applications" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                  View All ({recentApplications.length})
                </Link>
              </div>

              {recentApplications.length === 0 ? (
                <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
                  <Briefcase size={32} className="empty-icon" />
                  <h4 className="empty-title">You haven't applied to any jobs yet</h4>
                  <p className="empty-desc">Explore open positions and submit your first application today.</p>
                  <Link to="/jobs" className="btn btn-primary btn-sm">Browse Openings</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((app) => (
                        <tr key={app.id}>
                          <td><strong>{app.jobTitle}</strong></td>
                          <td>{app.company}</td>
                          <td>{app.location}</td>
                          <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                          <td>{getStatusBadge(app.status)}</td>
                          <td>
                            <Link to={`/jobs/${app.jobId}`} className="btn btn-outline btn-sm">
                              View Job
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recommended / Recent Jobs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Featured Job Openings</h2>
                <Link to="/jobs" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Explore All Jobs
                </Link>
              </div>

              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SeekerDashboard;
