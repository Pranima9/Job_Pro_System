import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import jobService from '../../services/jobService';
import { extractApiError } from '../../utils/errorHelper';
import { Briefcase, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'FULL_TIME',
    salary: '',
    skills: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobService.getJobById(id);
        if (res.success && res.data) {
          const job = res.data;
          setFormData({
            title: job.title || '',
            description: job.description || '',
            location: job.location || '',
            type: job.type || 'FULL_TIME',
            salary: job.salary || '',
            skills: job.skills || '',
            deadline: job.deadline ? job.deadline.split('T')[0] : '',
          });
        }
      } catch {
        setError('Unable to load job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSaving(true);
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

      const res = await jobService.updateJob(id, payload);
      if (res.success) {
        toast.success('Job updated successfully!');
        navigate('/company/jobs');
      }
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Job">
        <Loader message="Loading job details..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Edit Job">
        <ErrorState title="Error" message={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Job" subtitle="Update your job posting details.">
      <div className="card" style={{ maxWidth: '720px' }}>
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
            placeholder="Describe the role, responsibilities, requirements..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => navigate('/company/jobs')} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving} loadingText="Updating...">
              Update Job
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditJob;
