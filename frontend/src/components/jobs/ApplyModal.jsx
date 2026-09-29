import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import applicationService from '../../services/applicationService';
import { extractApiError } from '../../utils/errorHelper';
import toast from 'react-hot-toast';

export const ApplyModal = ({
  isOpen,
  onClose,
  job,
  onApplicationSuccess,
}) => {
  const [message, setMessage] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file extension and size (5MB max)
      const allowedExts = ['pdf', 'doc', 'docx'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(fileExt)) {
        setError('Only PDF, DOC, or DOCX files are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds the 5MB limit.');
        return;
      }
      setError('');
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job?.id) return;

    setLoading(true);
    setError('');

    try {
      const res = await applicationService.applyForJob(job.id, {
        message,
        resumeFile,
      });

      if (res.success) {
        toast.success('Your application was submitted successfully!');
        if (onApplicationSuccess) onApplicationSuccess();
        onClose();
      }
    } catch (err) {
      const errorMsg = extractApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${job?.title || 'Job'}`} maxWidth="500px">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Applying to <strong>{job?.company?.name}</strong> for the <strong>{job?.type?.replace('_', ' ')}</strong> role.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              border: '1px solid var(--color-danger-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <Textarea
          label="Cover Letter / Note (Optional)"
          id="message"
          name="message"
          rows={4}
          placeholder="Explain briefly why you are a great fit for this position..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="form-group">
          <label className="form-label">Resume / CV (Optional override)</label>
          <div
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
            />
            {resumeFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{resumeFile.name}</span>
              </div>
            ) : (
              <div>
                <UploadCloud size={24} style={{ color: 'var(--color-brand)', marginBottom: '0.375rem' }} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
                  Click or drag to attach a customized resume
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                  PDF or Word documents (max 5MB). Leave blank to use your profile resume.
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} loadingText="Submitting...">
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
