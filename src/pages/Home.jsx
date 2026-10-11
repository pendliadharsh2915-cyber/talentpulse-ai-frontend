import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Sparkles,
  Search,
  Briefcase,
  Cpu,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Target
} from 'lucide-react';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await client.get('/jobs');
        const jobsList = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        setFeaturedJobs(jobsList.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Driven Career Matching & Resume Intelligence</span>
          </div>

          <h1 className="hero-title">
            Find Your Next <span>Opportunity</span>
          </h1>

          <p className="hero-desc">
            Discover premier engineering and tech roles matched to your verified skillset.
            Upload your resume for algorithmic skill extraction and instant job compatibility scoring.
          </p>

          <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '0 auto 2rem', display: 'flex', gap: '0.5rem', background: 'white', padding: '0.4rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', color: 'var(--text-light)', flex: 1 }}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Job title, tech stack (e.g. Java, React, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', padding: '0.6rem 0.75rem', width: '100%', fontSize: '0.95rem', background: 'transparent' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
              Search Jobs
            </button>
          </form>

          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-outline btn-lg">
              <Briefcase size={18} />
              <span>Browse All Openings</span>
            </Link>
            <Link to="/seeker/resume" className="btn btn-secondary btn-lg">
              <Sparkles size={18} />
              <span>Analyze My Resume</span>
            </Link>
          </div>

          {/* Stats Ribbon */}
          <div className="stats-ribbon">
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Transparent Skill Matching</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">PDFBox</div>
              <div className="stat-label">Automated Resume Parser</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Java 21</div>
              <div className="stat-label">Enterprise Spring Security</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0s</div>
              <div className="stat-label">Instant Application Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section style={{ padding: '4.5rem 0', background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Intelligent Platform
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Engineered for Precision Hiring
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.75rem' }}>
              Cut through recruiter noise with rule-based skill verification and real-time candidate workflows.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Resume Intelligence</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Our integrated PDF parser extracts technical proficiencies like Java, Spring, React, and SQL directly from your resume document.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Explainable Skill Match</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Clear match percentages based on exact requirements. See matched skills, missing capabilities, and targeted improvement roadmaps.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Recruiter Decision Hub</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Recruiters review genuine candidate backgrounds with human decision control. Candidates are never auto-rejected by black-box AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem' }}>How TalentPulse AI Works</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.3rem', fontWeight: 800 }}>
                1
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Profile & Upload PDF</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Sign up as a Job Seeker and upload your PDF resume. Our system automatically parses your core competencies.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.3rem', fontWeight: 800 }}>
                2
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Inspect Match Compatibility</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Compare your extracted profile with active job listings. Review strengths and recommended skill enhancements.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.3rem', fontWeight: 800 }}>
                3
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Apply & Track In Real-Time</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Submit applications with 1 click. Watch application status move from Applied to Reviewing, Shortlisted, or Decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '4.5rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Featured Opportunities
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem' }}>
                Top Tech Roles Open Now
              </h2>
            </div>
            <Link to="/jobs" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>View All Openings</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching active job listings..." />
          ) : featuredJobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={36} className="empty-icon" />
              <h3 className="empty-title">No job listings yet</h3>
              <p className="empty-desc">Check back soon or post a new job opening if you are an employer.</p>
            </div>
          ) : (
            <div>
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
