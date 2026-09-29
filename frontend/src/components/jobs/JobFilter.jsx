import React from 'react';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

export const JobFilter = ({
  filters,
  onChange,
  onReset,
}) => {
  const jobTypes = [
    { value: '', label: 'All Job Types' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.type || filters.location || filters.salary
  );

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end',
        }}
      >
        {/* Search */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Search size={14} /> Search Keywords
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Title, skill, or keyword..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>

        {/* Job Type */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Filter size={14} /> Job Type
          </label>
          <select
            className="form-control"
            value={filters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            {jobTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <MapPin size={14} /> Location
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Remote, Lalitpur..."
            value={filters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>

        {/* Salary */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Salary Range</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. NPR 50k..."
            value={filters.salary || ''}
            onChange={(e) => handleInputChange('salary', e.target.value)}
          />
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <Button
              variant="secondary"
              onClick={onReset}
              icon={RotateCcw}
              style={{ width: '100%' }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFilter;
