import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import { Sparkles, UserPlus, UserCheck, Briefcase, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'JOB_SEEKER',
    phone: '',
    education: '',
    skills: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill out all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await register(formData);
      if (user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please verify your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 1.25rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '540px', padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '44px', height: '44px' }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join TalentPulse AI to accelerate your career or recruit top engineers
          </p>
        </div>

        {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

        {/* Role Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => handleRoleSelect('JOB_SEEKER')}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${formData.role === 'JOB_SEEKER' ? 'var(--primary)' : 'var(--border)'}`,
              background: formData.role === 'JOB_SEEKER' ? 'var(--primary-light)' : 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)',
            }}
          >
            <UserCheck size={22} color={formData.role === 'JOB_SEEKER' ? 'var(--primary)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.role === 'JOB_SEEKER' ? 'var(--primary)' : 'var(--text-main)' }}>
              Job Seeker
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Find jobs & analyze resume
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('RECRUITER')}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${formData.role === 'RECRUITER' ? 'var(--secondary)' : 'var(--border)'}`,
              background: formData.role === 'RECRUITER' ? 'var(--secondary-light)' : 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)',
            }}
          >
            <Briefcase size={22} color={formData.role === 'RECRUITER' ? 'var(--secondary)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.role === 'RECRUITER' ? 'var(--secondary)' : 'var(--text-main)' }}>
              Recruiter / Employer
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Post jobs & hire candidates
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password * (minimum 6 characters)</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+1-555-0123"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {formData.role === 'JOB_SEEKER' && (
            <>
              <div className="form-group">
                <label className="form-label">Education / Degree</label>
                <input
                  type="text"
                  name="education"
                  className="form-control"
                  placeholder="e.g. B.S. in Computer Science"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Core Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="form-control"
                  placeholder="e.g. Java, Spring Boot, React, SQL, Git"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
