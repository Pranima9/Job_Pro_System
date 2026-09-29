import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import jobService from '../../services/jobService';
import { useAuth } from '../../hooks/useAuth';
import { extractApiError } from '../../utils/errorHelper';
import { Briefcase, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateJob = () => {
  const navigate = useNavigate();
  const { companyStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'FULL_TIME',
    salary: '',
    skills: '',
    deadline: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        type: formData.type,
        salary: formData.salary || null,
        skills: formData.skills || null,
        deadline: formData.deadline || null,
      };

      const res = await jobService.createJob(payload);
      if (res.success) {
        toast.success('Job posted successfully!');
        navigate('/company/jobs');
      }
    } catch (err) {
      const msg = extractApiError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (companyStatus === 'PENDING') {
    return (
      <DashboardLayout title="Post a Job">
        <div style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <AlertTriangle size={40} style={{ color: 'var(--color-warning)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '0.5rem' }}>Company Not Approved</h3>
          <p style={{ color: '#92400e', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
            Your company account is pending administrator approval. You cannot post jobs until your company is approved.
          </p>
          <Button variant="secondary" onClick={() => navigate('/company/profile')}>
            View Company Status
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Post a New Job" subtitle="Create a new job posting to attract qualified candidates.">
      <div className="card" style={{ maxWidth: '720px' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', color: 'var(--color-danger)', fontSize: '0.875rem' }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Job Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior React Developer"
            required
            icon={Briefcase}
          />

          <div className="grid-2">
            <Select
              label="Job Type"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'FULL_TIME', label: 'Full Time' },
                { value: 'PART_TIME', label: 'Part Time' },
                { value: 'CONTRACT', label: 'Contract' },
                { value: 'INTERNSHIP', label: 'Internship' },
              ]}
              required
            />
            <Input
              label="Location"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Kathmandu, Nepal"
              required
            />
          </div>

          <div className="grid-2">
            <Input
              label="Salary (Optional)"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. NPR 80,000 - 120,000"
            />
            <Input
              label="Application Deadline (Optional)"
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Skills (Comma-separated)"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, TypeScript, SQL"
            helpText="Separate each skill with a comma"
          />

          <Textarea
            label="Job Description"
            id="description"
            name="description"
            rows={8}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity great..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => navigate('/company/jobs')} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} loadingText="Publishing...">
              Publish Job
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;
