import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import jobService from '../../services/jobService';
import bookmarkService from '../../services/bookmarkService';
import { useAuth } from '../../hooks/useAuth';
import { Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const { isSeeker } = useAuth();

  // Extract filters from URL query parameters
  const currentFilters = {
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    salary: searchParams.get('salary') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 9,
  };

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobService.getJobs(currentFilters);
      if (res.success) {
        setJobs(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch (err) {
      setError('Unable to load job listings. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [
    currentFilters.search,
    currentFilters.type,
    currentFilters.location,
    currentFilters.salary,
    currentFilters.page,
  ]);

  // Load seeker bookmarks if authenticated
  useEffect(() => {
    if (isSeeker) {
      bookmarkService
        .getBookmarks()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setBookmarkedIds(new Set(res.data.map((b) => b.jobId)));
          }
        })
        .catch(() => {});
    }
  }, [isSeeker]);

  useEffect(() => {
    loadJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadJobs]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.salary) params.set('salary', newFilters.salary);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleBookmarkToggle = async (jobId) => {
    const isSaved = bookmarkedIds.has(jobId);
    try {
      if (isSaved) {
        await bookmarkService.removeBookmark(jobId);
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.success('Removed from bookmarks.');
      } else {
        await bookmarkService.addBookmark(jobId);
        setBookmarkedIds((prev) => new Set(prev).add(jobId));
        toast.success('Job bookmarked.');
      }
    } catch {
      toast.error('Failed to update bookmark.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Explore Available Positions
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Filter by role type, location, or keywords to find your next career step.
            </p>
          </div>

          {/* Job Filter Bar */}
          <JobFilter
            filters={currentFilters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {/* Job Listings Grid */}
          {loading ? (
            <Loader message="Fetching job listings..." />
          ) : error ? (
            <ErrorState title="Error Loading Jobs" message={error} onRetry={loadJobs} />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs matched your criteria"
              description="Try adjusting or resetting your search keywords, role type, or location filters."
              action={
                <button
                  onClick={handleResetFilters}
                  className="btn btn-secondary btn-sm"
                >
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isBookmarked={bookmarkedIds.has(job.id)}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>

              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
