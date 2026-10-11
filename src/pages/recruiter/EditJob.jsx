import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Save, ArrowLeft } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    employmentType: 'Full-time',
    salary: '',
    requiredSkills: '',
    description: '',
    active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await client.get(`/jobs/${id}`);
        setFormData({
          title: res.data.title || '',
          company: res.data.company || '',
          location: res.data.location || '',
          employmentType: res.data.employmentType || 'Full-time',
          salary: res.data.salary || '',
          requiredSkills: res.data.requiredSkills || '',
          description: res.data.description || '',
          active: res.data.active ?? true,
        });
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to load job details' });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.location || !formData.requiredSkills || !formData.description) {
      setAlert({ type: 'danger', message: 'Please fill out all required fields' });
      return;
    }

    setSaving(true);
    setAlert({ type: '', message: '' });

    try {
      await client.put(`/jobs/${id}`, formData);
      navigate('/recruiter/my-jobs');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update job';
      setAlert({ type: 'danger', message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <Link to="/recruiter/my-jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <ArrowLeft size={14} />
              <span>Back to My Jobs</span>
            </Link>
            <h1 className="dashboard-title">Edit Job Listing</h1>
            <p className="dashboard-subtitle">Update requirements, description or active status</p>
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
          <LoadingSpinner text="Fetching position data..." />
        ) : (
          <div className="card" style={{ maxWidth: '800px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Employment Type *</label>
                  <select
                    name="employmentType"
                    className="form-control"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-control"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Active Status</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <input
                      type="checkbox"
                      id="active-toggle"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="active-toggle" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                      Listing is currently accepting new applications
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Required Skills * (comma-separated)</label>
                  <input
                    type="text"
                    name="requiredSkills"
                    className="form-control"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Job Description *</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Link to="/recruiter/my-jobs" className="btn btn-outline">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={18} />
                  <span>{saving ? 'Saving Changes...' : 'Save Job Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditJob;
