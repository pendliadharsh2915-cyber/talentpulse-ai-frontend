import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Briefcase,
  PlusCircle,
  Users,
  Search,
  Sparkles,
  Bookmark
} from 'lucide-react';

const Sidebar = () => {
  const { user, isSeeker, isRecruiter } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-user-name">{user?.name || 'User'}</div>
        <div className="sidebar-user-role">
          {isRecruiter ? '👔 Recruiter Portal' : '🎯 Job Seeker Portal'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem', wordBreak: 'break-all' }}>
          {user?.email}
        </div>
      </div>

      <ul className="sidebar-menu">
        {isSeeker && (
          <>
            <li>
              <NavLink to="/seeker/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/seeker/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <UserCheck size={18} />
                <span>My Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/seeker/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Briefcase size={18} />
                <span>My Applications</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/seeker/saved-jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Bookmark size={18} />
                <span>Saved Jobs</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/seeker/resume" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Sparkles size={18} />
                <span>Resume Intelligence</span>
              </NavLink>
            </li>
          </>
        )}

        {isRecruiter && (
          <>
            <li>
              <NavLink to="/recruiter/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/recruiter/my-jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Briefcase size={18} />
                <span>My Job Listings</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/recruiter/create-job" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <PlusCircle size={18} />
                <span>Post New Job</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/recruiter/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Users size={18} />
                <span>All Candidates</span>
              </NavLink>
            </li>
          </>
        )}

        <li style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <NavLink to="/jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Search size={18} />
            <span>Browse All Jobs</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
