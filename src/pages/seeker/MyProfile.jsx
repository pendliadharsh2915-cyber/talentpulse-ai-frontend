import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Save, Mail, Phone, BookOpen, Wrench } from 'lucide-react';

const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    skills: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get('/profile');
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          education: res.data.education || '',
          skills: res.data.skills || '',
        });
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setAlert({ type: 'danger', message: 'Name cannot be empty' });
      return;
    }

    setSaving(true);
    setAlert({ type: '', message: '' });
    try {
      const res = await client.put('/profile', {
        name: formData.name,
        phone: formData.phone,
        education: formData.education,
        skills: formData.skills,
      });
      updateUser(res.data);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
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
            <h1 className="dashboard-title">My Candidate Profile</h1>
            <p className="dashboard-subtitle">Manage your personal and career credentials</p>
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
          <LoadingSpinner text="Fetching profile details..." />
        ) : (
          <div className="card" style={{ maxWidth: '750px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Registered Account)</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    disabled
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>
                  Email address is linked to your authentication credentials.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Education / University Degree</label>
                <input
                  type="text"
                  name="education"
                  className="form-control"
                  placeholder="e.g. B.S. in Computer Science - University of California"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Core Technical Skills (comma-separated)</label>
                <textarea
                  name="skills"
                  className="form-control"
                  placeholder="e.g. Java, Spring Boot, React, JavaScript, SQL, Git, Docker, Kubernetes"
                  value={formData.skills}
                  onChange={handleChange}
                  rows={4}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  These skills are verified when computing compatibility scores with jobs across the platform.
                </span>
              </div>

              <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={18} />
                  <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProfile;
