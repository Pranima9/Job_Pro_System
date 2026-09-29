import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0',
        marginTop: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{total}</strong> results
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, padding: '0 0.5rem' }}>
          {page} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
