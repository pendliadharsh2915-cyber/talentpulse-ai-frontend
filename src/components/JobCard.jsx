import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, CheckCircle2, ChevronRight, Users, Bookmark } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job, onApply, applyingId, onBookmarkChange }) => {
  const { user, isSeeker } = useAuth();
  const [isSaved, setIsSaved] = useState(job.saved || false);
  const [saving, setSaving] = useState(false);

  const skills = job.requiredSkills
    ? job.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff}d ago`;
  };

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !isSeeker || saving) return;

    setSaving(true);
    try {
      const res = await client.post(`/jobs/${job.id}/save`);
      const newStatus = res.data.saved;
      setIsSaved(newStatus);
      if (onBookmarkChange) {
        onBookmarkChange(job.id, newStatus);
      }
    } catch (err) {
      console.warn('Error saving job:', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div style={{ flex: 1 }}>
          <h3 className="job-title">
            <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
              {job.title}
            </Link>
          </h3>
          <div className="job-company">{job.company}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isSeeker && (
            <button
              type="button"
              onClick={handleToggleBookmark}
              disabled={saving}
              title={isSaved ? 'Remove from saved jobs' : 'Save job'}
              style={{
                background: isSaved ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                border: '1px solid',
                borderColor: isSaved ? 'var(--primary, #4338ca)' : 'var(--border-color, #e2e8f0)',
                color: isSaved ? 'var(--primary, #4338ca)' : 'var(--text-muted, #64748b)',
                borderRadius: '8px',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}

          {job.hasApplied ? (
            <span className="badge badge-success">
              <CheckCircle2 size={13} />
              <span>Applied</span>
            </span>
          ) : !job.active ? (
            <span className="badge badge-neutral">Closed</span>
          ) : (
            <span className="badge badge-primary">{job.employmentType}</span>
          )}
        </div>
      </div>

      <div className="job-meta">
        <div className="job-meta-item">
          <MapPin size={15} />
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="job-meta-item">
            <DollarSign size={15} />
            <span>{job.salary}</span>
          </div>
        )}
        <div className="job-meta-item">
          <Calendar size={15} />
          <span>{timeAgo(job.createdAt)}</span>
        </div>
        {job.applicantCount > 0 && (
          <div className="job-meta-item">
            <Users size={15} />
            <span>{job.applicantCount} applicants</span>
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.885rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        {job.description && job.description.length > 180
          ? `${job.description.substring(0, 180)}...`
          : job.description}
      </p>

      {skills.length > 0 && (
        <div className="job-skills">
          {skills.slice(0, 5).map((skill, idx) => (
            <span key={idx} className="skill-tag">
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="skill-tag" style={{ color: 'var(--text-light)' }}>
              +{skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <span>View Details</span>
          <ChevronRight size={14} />
        </Link>

        {onApply && !job.hasApplied && job.active && (
          <button
            onClick={() => onApply(job.id)}
            disabled={applyingId === job.id}
            className="btn btn-primary btn-sm"
          >
            {applyingId === job.id ? 'Applying...' : 'Quick Apply'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
