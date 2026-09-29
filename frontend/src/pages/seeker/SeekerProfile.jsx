import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import userService from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { extractApiError } from '../../utils/errorHelper';
import { User, FileText, UploadCloud, CheckCircle2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export const SeekerProfile = () => {
  const { refreshUser } = useAuth();
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    skills: '',
    phone: '',
    location: '',
  });
  const [resumeUrl, setResumeUrl] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userService.getProfile();
      if (res.success && res.data) {
        setProfileExists(true);
        setFormData({
          fullName: res.data.fullName || '',
          bio: res.data.bio || '',
          skills: res.data.skills || '',
          phone: res.data.phone || '',
          location: res.data.location || '',
        });
        setResumeUrl(res.data.resumeUrl || '');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        toast.error('Failed to load profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Full Name is required.');
      return;
    }

    setSaving(true);
    try {
      let res;
      if (profileExists) {
        res = await userService.updateProfile(formData);
      } else {
        res = await userService.createProfile(formData);
        setProfileExists(true);
      }

      if (res.success) {
        toast.success('Profile saved successfully.');
        await refreshUser();
      }
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExts = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(ext)) {
      toast.error('Only PDF, DOC, and DOCX files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File exceeds maximum size of 5MB.');
      return;
    }

    setUploadingResume(true);
    try {
      const res = await userService.uploadResume(file);
      if (res.success && res.data?.resumeUrl) {
        setResumeUrl(res.data.resumeUrl);
        setProfileExists(true);
        toast.success('Resume uploaded successfully.');
        await refreshUser();
      }
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setUploadingResume(false);
    }
  };

  const getFullResumeUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    return `${socketUrl}${path}`;
  };

  return (
    <DashboardLayout
      title="Candidate Profile"
      subtitle="Keep your professional details and resume updated for company applications."
    >
      {loading ? (
        <Loader message="Loading your candidate profile..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }} className="profile-layout">
          {/* Main Info Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
              Personal & Professional Information
            </h3>

            <form onSubmit={handleProfileSubmit}>
              <Input
                label="Full Name"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
              />

              <div className="grid-2">
                <Input
                  label="Contact Phone"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977-9800000000"
                />

                <Input
                  label="Location"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu / Remote"
                />
              </div>

              <Input
                label="Skills (Comma-separated)"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, SQL, TypeScript, Tailwind"
                helpText="Separate each skill with a comma for card tags"
              />

              <Textarea
                label="Professional Summary / Bio"
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Briefly describe your career background, education, and what roles you are seeking..."
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  loadingText="Saving Profile..."
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Resume Upload Box */}
          <div>
            <div className="card">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Official Resume
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Your uploaded resume will be attached automatically when submitting job applications.
              </p>

              {resumeUrl ? (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--color-success-bg)',
                    border: '1px solid var(--color-success-border)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-success)' }}>
                    <CheckCircle2 size={18} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Active Resume on File</span>
                  </div>

                  <a
                    href={getFullResumeUrl(resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm btn-block"
                    style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}
                  >
                    <Download size={14} /> View / Download Document
                  </a>
                </div>
              ) : (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                    textAlign: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.8125rem',
                  }}
                >
                  No resume uploaded yet.
                </div>
              )}

              {/* Upload Input */}
              <div
                style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: uploadingResume ? 'not-allowed' : 'pointer',
                    width: '100%',
                    height: '100%',
                  }}
                />
                <UploadCloud size={28} style={{ color: 'var(--color-brand)', margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {uploadingResume ? 'Uploading File...' : 'Upload New Resume'}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'block', marginTop: '0.25rem' }}>
                  PDF, DOC, DOCX up to 5MB
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default SeekerProfile;
