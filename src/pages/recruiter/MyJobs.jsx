import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import {
  Briefcase,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  Eye,
  AlertTriangle,
  CheckCircle,
  Search
} from 'lucide-react';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, jobId: null, jobTitle: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await client.get('/recruiter/jobs');
      setJobs(res.data);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to load your job listings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenDeactivateModal = (id, title) => {
    setConfirmModal({ open: true, jobId: id, jobTitle: title });
  };

  const handleConfirmDeactivate = async () => {
    if (!confirmModal.jobId) return;

    setActionLoading(true);
    try {
      await client.delete(`/jobs/${confirmModal.jobId}`);
      setAlert({ type: 'success', message: `Position "${confirmModal.jobTitle}" has been closed` });
      setConfirmModal({ open: false, jobId: null, jobTitle: '' });
      fetchJobs();
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to deactivate job' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      j.requiredSkills?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Job Listings</h1>
            <p className="dashboard-subtitle">Manage open positions and track applicant flow</p>
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

        {/* Filter Bar */}
        <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={18} color="var(--text-light)" />
          <input
            type="text"
            placeholder="Search your listings by title, skills or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>

        {loading ? (
          <LoadingSpinner text="Loading listings..." />
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={40} className="empty-icon" />
            <h3 className="empty-title">No job listings found</h3>
            <p className="empty-desc">
              {jobs.length === 0
                ? "You haven't posted any jobs yet. Create your first listing to start hiring."
                : 'No postings match your search filter.'}
            </p>
            {jobs.length === 0 && (
              <Link to="/recruiter/create-job" className="btn btn-secondary">
                Post Job
              </Link>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title & Skills</th>
                  <th>Location & Type</th>
                  <th>Salary Range</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Posted On</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ maxWidth: '240px' }}>
                      <Link to={`/jobs/${job.id}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {job.title}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>
                        {job.requiredSkills}
                      </div>
                    </td>
                    <td>
                      <div>{job.location}</div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                        {job.employmentType}
                      </span>
                    </td>
                    <td>{job.salary || 'Competitive'}</td>
                    <td>
                      <Link
                        to={`/recruiter/applications?jobId=${job.id}`}
                        className="badge badge-primary"
                        style={{ cursor: 'pointer', padding: '0.35rem 0.65rem' }}
                        title="View candidates for this job"
                      >
                        <Users size={12} />
                        <span>{job.applicantCount} candidates</span>
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${job.active ? 'badge-success' : 'badge-neutral'}`}>
                        {job.active ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <Link
                          to={`/recruiter/applications?jobId=${job.id}`}
                          className="btn btn-outline btn-sm"
                          title="View Candidates"
                        >
                          <Users size={14} />
                        </Link>
                        <Link
                          to={`/recruiter/edit-job/${job.id}`}
                          className="btn btn-outline btn-sm"
                          title="Edit Position"
                        >
                          <Edit size={14} />
                        </Link>
                        {job.active && (
                          <button
                            type="button"
                            onClick={() => handleOpenDeactivateModal(job.id, job.title)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--danger)' }}
                            title="Deactivate / Close Listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Confirmation Modal before Destructive Action */}
        {confirmModal.open && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '440px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Close Job Listing?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Are you sure you want to deactivate <strong>"{confirmModal.jobTitle}"</strong>?
                Job seekers will no longer be able to submit new applications for this role.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setConfirmModal({ open: false, jobId: null, jobTitle: '' })}
                  className="btn btn-outline"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeactivate}
                  className="btn btn-danger"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Closing...' : 'Confirm Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyJobs;
