import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Briefcase, RefreshCw, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const BrowseJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [applyingId, setApplyingId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const { user, isSeeker } = useAuth();

  const fetchJobs = async (pageNumber = 0, currentSearch = search, currentType = selectedType, currentLoc = locationFilter) => {
    setLoading(true);
    try {
      const typeParam = currentType === 'ALL' ? '' : currentType;
      const locParam = currentLoc === 'ALL' ? '' : currentLoc;
      const url = `/jobs?search=${encodeURIComponent(currentSearch)}&employmentType=${encodeURIComponent(typeParam)}&location=${encodeURIComponent(locParam)}&page=${pageNumber}&size=5`;

      const res = await client.get(url);
      if (res.data && res.data.content) {
        setJobs(res.data.content);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
        setPage(res.data.page || 0);
      } else {
        setJobs(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(res.data) ? res.data.length : 0);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to load jobs from server' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page, initialSearch, selectedType, locationFilter);
  }, [page, selectedType, locationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
    setPage(0);
    fetchJobs(0, search, selectedType, locationFilter);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('ALL');
    setLocationFilter('ALL');
    setSearchParams({});
    setPage(0);
    fetchJobs(0, '', 'ALL', 'ALL');
  };

  const handleQuickApply = async (jobId) => {
    if (!user) {
      setAlert({ type: 'danger', message: 'Please sign in as a job seeker to apply' });
      return;
    }
    if (!isSeeker) {
      setAlert({ type: 'danger', message: 'Recruiter accounts cannot apply for jobs' });
      return;
    }

    setApplyingId(jobId);
    setAlert({ type: '', message: '' });
    try {
      await client.post(`/jobs/${jobId}/apply`);
      setAlert({ type: 'success', message: 'Application submitted successfully!' });
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, hasApplied: true, applicantCount: j.applicantCount + 1 } : j))
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      setAlert({ type: 'danger', message: msg });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Browse Tech Positions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Search open roles across Java, Frontend, AI/ML, Cloud, and Data Engineering.
          </p>
        </div>

        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        {/* Filter & Search Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.2rem 0.75rem', background: 'white' }}>
              <Search size={18} color="var(--text-light)" />
              <input
                type="text"
                placeholder="Search title, skills (e.g. Java, Docker), or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', padding: '0.6rem 0.5rem', width: '100%', fontSize: '0.925rem' }}
              />
            </div>

            {/* Employment Type */}
            <div style={{ minWidth: '140px' }}>
              <select
                className="form-control"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(0);
                }}
                style={{ cursor: 'pointer', background: 'white' }}
              >
                <option value="ALL">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            {/* Work Mode / Location */}
            <div style={{ minWidth: '140px' }}>
              <select
                className="form-control"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setPage(0);
                }}
                style={{ cursor: 'pointer', background: 'white' }}
              >
                <option value="ALL">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Austin">Austin, TX</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Seattle">Seattle, WA</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              Search
            </button>

            {(search || selectedType !== 'ALL' || locationFilter !== 'ALL') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-outline"
                title="Reset filters"
                style={{ padding: '0.65rem 0.85rem' }}
              >
                <RefreshCw size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Result Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {jobs.length} of {totalElements} {totalElements === 1 ? 'position' : 'positions'}
          </span>
          {totalPages > 1 && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Page {page + 1} of {totalPages}
            </span>
          )}
        </div>

        {/* Jobs List */}
        {loading ? (
          <LoadingSpinner text="Searching positions..." />
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={40} className="empty-icon" />
            <h3 className="empty-title">No jobs match your criteria</h3>
            <p className="empty-desc">
              Try adjusting your search terms or clearing filters to see all available openings.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn btn-primary btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={isSeeker ? handleQuickApply : null}
                applyingId={applyingId}
              />
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    className={`btn btn-sm ${page === i ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '34px', padding: '0.35rem 0.5rem', fontWeight: 700 }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
