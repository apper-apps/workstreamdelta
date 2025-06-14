import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '@/components/molecules/PostCard';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { postService } from '@/services';
import { toast } from 'react-toastify';
const FeedList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getAll();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = () => {
    loadPosts();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-surface-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-surface-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-200 rounded"></div>
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
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
        <h3 className="text-lg font-medium text-secondary mb-2">Unable to load posts</h3>
        <p className="text-surface-600 mb-4">{error}</p>
        <Button onClick={loadPosts} variant="outline">
          Try again
        </Button>
      </motion.div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="FileText" className="w-8 h-8 text-surface-400" />
        </div>
        <h3 className="text-lg font-medium text-secondary mb-2">No posts yet</h3>
        <p className="text-surface-600 mb-4">
          Be the first to share something with your network!
        </p>
        <Button onClick={loadPosts}>
          Refresh
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard post={post} onPostUpdate={handlePostUpdate} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FeedList;