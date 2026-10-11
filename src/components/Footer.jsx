import React from 'react';
import { Sparkles, Shield, Cpu, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Sparkles size={20} color="#38bdf8" />
              <span>TalentPulse AI</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem', color: '#94a3b8' }}>
              Next-generation AI Job Portal and Resume Intelligence System. Bridging high-impact software talent with leading engineering teams via transparent skill matching.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#38bdf8' }}>
              <Cpu size={14} />
              <span>Powered by Java 21, Spring Boot & React</span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">For Job Seekers</h4>
            <ul className="footer-links">
              <li><a href="/jobs" className="footer-link">Browse Job Openings</a></li>
              <li><a href="/seeker/resume" className="footer-link">Resume Intelligence</a></li>
              <li><a href="/seeker/dashboard" className="footer-link">Application Tracker</a></li>
              <li><a href="/seeker/profile" className="footer-link">Skill Profile</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">For Employers</h4>
            <ul className="footer-links">
              <li><a href="/recruiter/create-job" className="footer-link">Post a Tech Job</a></li>
              <li><a href="/recruiter/dashboard" className="footer-link">Recruiter Dashboard</a></li>
              <li><a href="/recruiter/my-jobs" className="footer-link">Manage Listings</a></li>
              <li><a href="/register" className="footer-link">Recruiter Sign Up</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Platform & Security</h4>
            <ul className="footer-links">
              <li><span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Shield size={14} color="#10b981" /> BCrypt Password Hashing</span></li>
              <li><span>Role-Based JWT Security</span></li>
              <li><span>Apache PDFBox Parser</span></li>
              <li><a href="/api/health" target="_blank" rel="noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>System Health <ExternalLink size={12} /></a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TalentPulse AI - Job Portal & Resume Intelligence System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
