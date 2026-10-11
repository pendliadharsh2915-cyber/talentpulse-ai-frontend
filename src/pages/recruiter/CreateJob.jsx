import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import AlertMessage from '../../components/AlertMessage';
import { PlusCircle, ArrowLeft, Briefcase } from 'lucide-react';

const CreateJob = () => {
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

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

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

    if (formData.description.length < 20) {
      setAlert({ type: 'danger', message: 'Job description must be at least 20 characters long' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      await client.post('/jobs', formData);
      navigate('/recruiter/my-jobs');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post new job';
      setAlert({ type: 'danger', message: msg });
    } finally {
      setLoading(false);
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
            <h1 className="dashboard-title">Post New Tech Position</h1>
            <p className="dashboard-subtitle">Publish a job opening and attract matched engineers</p>
          </div>
        </div>

        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        <div className="card" style={{ maxWidth: '800px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Senior Full-Stack Java Developer"
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
                  placeholder="e.g. Acme Cloud Corp"
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
                  placeholder="e.g. Remote, US or San Francisco, CA"
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
                <label className="form-label">Salary Range (optional)</label>
                <input
                  type="text"
                  name="salary"
                  className="form-control"
                  placeholder="e.g. $120,000 - $150,000 or $50/hr"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">
                  Required Technical Skills * (comma-separated)
                </label>
                <input
                  type="text"
                  name="requiredSkills"
                  className="form-control"
                  placeholder="e.g. Java, Spring Boot, React, SQL, PostgreSQL, Docker, Git"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  required
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  The Resume Intelligence system matches candidates against these exact competencies.
                </span>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Job Description & Responsibilities *</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Describe the role, day-to-day responsibilities, stack, team culture, and hiring process..."
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
              <button type="submit" className="btn btn-secondary" disabled={loading}>
                <PlusCircle size={18} />
                <span>{loading ? 'Publishing...' : 'Publish Job Listing'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
