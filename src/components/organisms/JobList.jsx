import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from '@/components/molecules/JobCard';
import SearchBar from '@/components/molecules/SearchBar';
import { jobService } from '@/services';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const jobFilters = [
    {
      key: 'location',
      label: 'Location',
      type: 'input',
      placeholder: 'e.g. San Francisco, CA'
    },
    {
      key: 'type',
      label: 'Job Type',
      type: 'select',
      options: [
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Internship', label: 'Internship' }
      ]
    },
    {
      key: 'remote',
      label: 'Remote',
      type: 'select',
      options: [
        { value: 'true', label: 'Remote' },
        { value: 'false', label: 'On-site' }
      ]
    }
  ];

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getAll();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, filters) => {
    try {
      const searchFilters = {
        title: query,
        ...filters,
        remote: filters.remote === 'true' ? true : filters.remote === 'false' ? false : undefined
      };
      
      const data = await jobService.searchJobs(searchFilters);
      setFilteredJobs(data);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-surface rounded-xl p-6 shadow-sm animate-pulse">
          <div className="h-10 bg-surface-200 rounded w-full mb-4"></div>
        </div>
        
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 bg-surface-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-surface-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-surface-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-200 rounded"></div>
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-lg font-medium text-secondary mb-2">Unable to load jobs</h3>
        <p className="text-surface-600 mb-4">{error}</p>
        <Button onClick={loadJobs} variant="outline">
          Try again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-surface rounded-xl p-6 shadow-sm">
        <SearchBar
          placeholder="Search jobs by title, company, or skills..."
          onSearch={handleSearch}
          filters={jobFilters}
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-surface-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Briefcase" className="w-8 h-8 text-surface-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary mb-2">No jobs found</h3>
          <p className="text-surface-600 mb-4">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
          <Button onClick={loadJobs}>
            View all jobs
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default JobList;