import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import BrowseJobs from './pages/BrowseJobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import MyProfile from './pages/seeker/MyProfile';
import MyApplications from './pages/seeker/MyApplications';
import SavedJobs from './pages/seeker/SavedJobs';
import ResumeIntelligence from './pages/seeker/ResumeIntelligence';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import MyJobs from './pages/recruiter/MyJobs';
import CreateJob from './pages/recruiter/CreateJob';
import EditJob from './pages/recruiter/EditJob';
import JobApplications from './pages/recruiter/JobApplications';

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/seeker/dashboard"
            element={
              <ProtectedRoute allowedRole="JOB_SEEKER">
                <SeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/profile"
            element={
              <ProtectedRoute allowedRole="JOB_SEEKER">
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/applications"
            element={
              <ProtectedRoute allowedRole="JOB_SEEKER">
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/saved-jobs"
            element={
              <ProtectedRoute allowedRole="JOB_SEEKER">
                <SavedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/resume"
            element={
              <ProtectedRoute allowedRole="JOB_SEEKER">
                <ResumeIntelligence />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Protected Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/my-jobs"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <MyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/create-job"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/edit-job/:id"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applications"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <JobApplications />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
