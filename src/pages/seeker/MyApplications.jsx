import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Briefcase, MapPin, Calendar, ExternalLink, CheckCircle, Clock, Download, FileText } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await client.get('/applications/my');
        setApplications(res.data);
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to load your applications' });
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleDownloadResume = async (resumeId, filename) => {
    if (!resumeId) return;
    try {
      const res = await client.get(`/resumes/${resumeId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'my_resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to download resume document.' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SHORTLISTED':
        return <span className="badge badge-success">Shortlisted</span>;
      case 'REVIEWING':
        return <span className="badge badge-warning">In Review</span>;
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
            <h1 className="dashboard-title">My Applications</h1>
            <p className="dashboard-subtitle">Track real-time hiring decisions and review submitted resume snapshots.</p>
          </div>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            Browse More Jobs
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
          <LoadingSpinner text="Loading applications..." />
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={40} className="empty-icon" />
            <h3 className="empty-title">No job applications yet</h3>
            <p className="empty-desc">
              You haven't submitted any job applications yet. Browse open roles and apply to start receiving recruiter updates!
            </p>
            <Link to="/jobs" className="btn btn-primary">
              Explore Active Jobs
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Position</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Employment Type</th>
                  <th>Submitted Date</th>
                  <th>Resume Attached</th>
                  <th>Current Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {app.jobTitle}
                      </strong>
                    </td>
                    <td>{app.company}</td>
                    <td>{app.location}</td>
                    <td>
                      <span className="badge badge-neutral">{app.employmentType}</span>
                    </td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      {app.resumeId ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadResume(app.resumeId, app.resumeFilename || 'resume.pdf')}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                          title="Download Submitted Resume Snapshot"
                        >
                          <Download size={13} />
                          <span>PDF</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>None</span>
                      )}
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <Link to={`/jobs/${app.jobId}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>View</span>
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
