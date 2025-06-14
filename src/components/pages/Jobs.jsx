import { motion } from 'framer-motion';
import JobList from '@/components/organisms/JobList';

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-xl p-6 shadow-sm"
          >
            <h1 className="text-2xl font-bold text-secondary mb-2">Job Opportunities</h1>
            <p className="text-surface-600">
              Discover your next career opportunity from top companies worldwide.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="bg-surface rounded-xl p-6 shadow-sm text-center">
              <div className="text-2xl font-bold text-primary mb-1">250+</div>
              <div className="text-sm text-surface-600">Active Jobs</div>
            </div>
            <div className="bg-surface rounded-xl p-6 shadow-sm text-center">
              <div className="text-2xl font-bold text-accent mb-1">65%</div>
              <div className="text-sm text-surface-600">Remote Friendly</div>
            </div>
            <div className="bg-surface rounded-xl p-6 shadow-sm text-center">
              <div className="text-2xl font-bold text-success mb-1">120k</div>
              <div className="text-sm text-surface-600">Avg. Salary</div>
            </div>
            <div className="bg-surface rounded-xl p-6 shadow-sm text-center">
              <div className="text-2xl font-bold text-warning mb-1">1.2k</div>
              <div className="text-sm text-surface-600">New This Week</div>
            </div>
          </motion.div>

          {/* Job List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <JobList />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;