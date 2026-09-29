import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import JobCard from '../../components/jobs/JobCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import bookmarkService from '../../services/bookmarkService';
import { Bookmark, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeDialogState, setRemoveDialogState] = useState({ isOpen: false, jobId: null });

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookmarkService.getBookmarks();
      if (res.success) {
        setBookmarks(res.data || []);
      }
    } catch {
      setError('Unable to load bookmarked jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveConfirm = async () => {
    const { jobId } = removeDialogState;
    if (!jobId) return;

    try {
      await bookmarkService.removeBookmark(jobId);
      setBookmarks((prev) => prev.filter((b) => b.jobId !== jobId));
      toast.success('Job removed from your bookmarks.');
    } catch {
      toast.error('Failed to remove bookmark.');
    } finally {
      setRemoveDialogState({ isOpen: false, jobId: null });
    }
  };

  return (
    <DashboardLayout
      title="Saved Jobs & Internships"
      subtitle="Quick access to opportunities you've bookmarked for later application."
      actions={
        <Link to="/jobs" className="btn btn-primary btn-sm">
          Browse Openings
        </Link>
      }
    >
      {loading ? (
        <Loader message="Loading your saved jobs..." />
      ) : error ? (
        <ErrorState title="Error Loading Bookmarks" message={error} onRetry={fetchBookmarks} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarked jobs"
          description="When browsing positions, click the bookmark icon on any job to save it here for later."
          action={
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Discover Jobs
            </Link>
          }
        />
      ) : (
        <div className="grid-3">
          {bookmarks.map((b) => (
            <JobCard
              key={b.id}
              job={b.job}
              isBookmarked={true}
              onBookmarkToggle={() => setRemoveDialogState({ isOpen: true, jobId: b.jobId })}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={removeDialogState.isOpen}
        onClose={() => setRemoveDialogState({ isOpen: false, jobId: null })}
        onConfirm={handleRemoveConfirm}
        title="Remove Saved Job?"
        message="Are you sure you want to remove this job from your bookmarks?"
        confirmText="Remove"
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default Bookmarks;
