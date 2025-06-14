import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { jobService } from '@/services';
import { toast } from 'react-toastify';

const JobCard = ({ job }) => {
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await jobService.applyToJob(job.id, '1', {
        coverLetter: 'I am interested in this position and believe my skills align well with your requirements.'
      });
      setApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return null;
    const min = (salary.min / 1000).toFixed(0);
    const max = (salary.max / 1000).toFixed(0);
    return `$${min}k - $${max}k`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-surface rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-surface-100"
    >
      {/* Job Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex-shrink-0 overflow-hidden">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {job.companyName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-secondary mb-1 break-words">{job.title}</h3>
            <p className="text-surface-600 font-medium break-words">{job.companyName}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-surface-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="MapPin" className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
              {job.remote && (
                <Badge variant="accent" size="sm">Remote</Badge>
              )}
              <Badge variant="default" size="sm">{job.type}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="mb-4">
        <p className="text-secondary text-sm break-words mb-3">{job.description}</p>
        
        {job.salary && (
          <div className="flex items-center space-x-2 mb-3">
            <ApperIcon name="DollarSign" className="w-4 h-4 text-success" />
            <span className="font-semibold text-success">{formatSalary(job.salary)}</span>
          </div>
        )}

        {/* Requirements */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-secondary mb-2">Requirements:</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 4).map((req, index) => (
              <Badge key={index} variant="default" size="sm">
                {req}
              </Badge>
            ))}
            {job.requirements.length > 4 && (
              <Badge variant="default" size="sm">
                +{job.requirements.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Job Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-100">
        <div className="flex items-center space-x-4 text-sm text-surface-500">
          <span>{formatDistanceToNow(new Date(job.posted), { addSuffix: true })}</span>
          <span>{job.applicants} applicants</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-surface-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Bookmark" className="w-4 h-4" />
          </motion.button>
          
          <Button
            onClick={handleApply}
            disabled={applied}
            loading={loading}
            variant={applied ? 'secondary' : 'primary'}
            size="sm"
          >
            {applied ? 'Applied' : 'Apply'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;