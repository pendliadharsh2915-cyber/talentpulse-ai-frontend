import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Bookmark, Briefcase } from 'lucide-react';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await client.get('/jobs/saved');
      setSavedJobs(res.data || []);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to load saved jobs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleQuickApply = async (jobId) => {
    setApplyingId(jobId);
    setAlert({ type: '', message: '' });
    try {
      await client.post(`/jobs/${jobId}/apply`);
      setAlert({ type: 'success', message: 'Application submitted successfully!' });
      setSavedJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, hasApplied: true, applicantCount: j.applicantCount + 1 } : j))
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      setAlert({ type: 'danger', message: msg });
    } finally {
      setApplyingId(null);
    }
  };

  const handleBookmarkChange = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="dashboard-title">Saved Requisitions</h1>
            <p className="dashboard-subtitle">Quick access to bookmarked opportunities to apply or track.</p>
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
          <LoadingSpinner text="Loading saved jobs..." />
        ) : savedJobs.length === 0 ? (
          <div className="empty-state">
            <Bookmark size={42} className="empty-icon" />
            <h3 className="empty-title">No saved jobs yet</h3>
            <p className="empty-desc">
              When browsing positions, click the bookmark icon to save roles here for later review and application.
            </p>
            <Link to="/jobs" className="btn btn-primary">
              Discover Jobs to Save
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
              You have {savedJobs.length} bookmarked {savedJobs.length === 1 ? 'position' : 'positions'}:
            </div>
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleQuickApply}
                applyingId={applyingId}
                onBookmarkChange={handleBookmarkChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;
