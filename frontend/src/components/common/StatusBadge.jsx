import React from 'react';

export const StatusBadge = ({ status, type = 'status' }) => {
  if (!status) return null;

  const getBadgeStyle = () => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'ACCEPTED':
      case 'ACTIVE':
        return 'badge-success';

      case 'PENDING':
        return 'badge-warning';

      case 'REJECTED':
      case 'INACTIVE':
        return 'badge-danger';

      case 'INTERNSHIP':
        return 'badge-info';

      case 'FULL_TIME':
        return 'badge-neutral';

      case 'PART_TIME':
      case 'CONTRACT':
        return 'badge-neutral';

      case 'ADMIN':
        return 'badge-danger';

      case 'COMPANY':
        return 'badge-info';

      case 'SEEKER':
        return 'badge-neutral';

      default:
        return 'badge-neutral';
    }
  };

  const formatText = (text) => {
    return text.replace(/_/g, ' ');
  };

  return <span className={`badge ${getBadgeStyle()}`}>{formatText(status)}</span>;
};

export default StatusBadge;
