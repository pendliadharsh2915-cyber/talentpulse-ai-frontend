import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Sparkles, LogOut, User as UserIcon, PlusCircle, FileText, Bookmark } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logout, isSeeker, isRecruiter } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-wrapper">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <div className="brand-name">
            Talent<span>Pulse</span> AI
          </div>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Browse Jobs
              </NavLink>
            </li>

            {isSeeker && (
              <>
                <li>
                  <NavLink to="/seeker/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seeker/applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Applications
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seeker/saved-jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Saved Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/seeker/resume" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Resume AI
                  </NavLink>
                </li>
              </>
            )}

            {isRecruiter && (
              <>
                <li>
                  <NavLink to="/recruiter/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Recruiter Hub
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/recruiter/my-jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    My Jobs
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <NotificationDropdown />

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: isRecruiter ? 'var(--secondary)' : 'var(--primary)', fontWeight: 600 }}>
                  {isRecruiter ? 'Recruiter' : 'Job Seeker'}
                </span>
              </div>

              {isRecruiter && (
                <Link to="/recruiter/create-job" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <PlusCircle size={15} />
                  <span>Post Job</span>
                </Link>
              )}

              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
