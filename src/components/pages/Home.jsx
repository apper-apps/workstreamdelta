import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FeedList from '@/components/organisms/FeedList';
import NetworkSidebar from '@/components/organisms/NetworkSidebar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { userService, postService } from '@/services';
import { toast } from 'react-toastify';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    
    setLoading(true);
    try {
      await postService.create({
        authorId: currentUser?.id || '1',
        content: postContent.trim(),
        type: 'update'
      });
      
      setPostContent('');
      setShowCreatePost(false);
      toast.success('Post shared successfully!');
      
      // Refresh feed (the FeedList component will handle this)
      window.location.reload();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Avatar
                  src={currentUser?.photoUrl}
                  name={currentUser?.name || 'You'}
                  size="md"
                />
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left p-3 bg-surface-50 rounded-full text-surface-500 hover:bg-surface-100 transition-colors"
                >
                  Share your professional insights...
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 text-surface-600 hover:text-primary hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Image" className="w-4 h-4" />
                    <span className="text-sm font-medium">Photo</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 text-surface-600 hover:text-primary hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Video" className="w-4 h-4" />
                    <span className="text-sm font-medium">Video</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 text-surface-600 hover:text-primary hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="FileText" className="w-4 h-4" />
                    <span className="text-sm font-medium">Article</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Create Post Modal */}
            {showCreatePost && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowCreatePost(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-surface rounded-xl shadow-xl max-w-lg w-full p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary">Create a post</h3>
                    <button
                      onClick={() => setShowCreatePost(false)}
                      className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-start space-x-3 mb-4">
                    <Avatar
                      src={currentUser?.photoUrl}
                      name={currentUser?.name || 'You'}
                      size="md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-secondary">{currentUser?.name || 'Your Name'}</p>
                      <p className="text-sm text-surface-600">{currentUser?.headline || 'Your professional headline'}</p>
                    </div>
                  </div>
                  
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What do you want to talk about?"
                    className="w-full p-4 border border-surface-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="6"
                    autoFocus
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-surface-400 hover:text-primary transition-colors">
                        <ApperIcon name="Image" className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-surface-400 hover:text-primary transition-colors">
                        <ApperIcon name="Video" className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-surface-400 hover:text-primary transition-colors">
                        <ApperIcon name="Hash" className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <Button
                      onClick={handleCreatePost}
                      disabled={!postContent.trim()}
                      loading={loading}
                    >
                      Post
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Feed */}
            <FeedList />
          </div>

          {/* Left Sidebar - Profile Summary */}
          <div className="lg:order-first space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface rounded-xl shadow-sm overflow-hidden"
            >
              {/* Profile Header */}
              <div className="h-16 bg-gradient-to-r from-primary to-accent"></div>
              
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-8">
                  <Avatar
                    src={currentUser?.photoUrl}
                    name={currentUser?.name || 'You'}
                    size="xl"
                    className="ring-4 ring-surface mb-3"
                  />
                  <h3 className="font-bold text-lg text-secondary text-center break-words">
                    {currentUser?.name || 'Your Name'}
                  </h3>
                  <p className="text-surface-600 text-center break-words mb-4">
                    {currentUser?.headline || 'Add your professional headline'}
                  </p>
                  
                  <div className="w-full space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-surface-600">Profile views</span>
                      <span className="font-semibold text-primary">127</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-surface-600">Connections</span>
                      <span className="font-semibold text-primary">{currentUser?.connections?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface rounded-xl p-6 shadow-sm"
            >
              <h3 className="font-semibold text-secondary mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-surface-50 transition-colors flex items-center space-x-3">
                  <ApperIcon name="UserPlus" className="w-4 h-4 text-primary" />
                  <span className="text-sm text-surface-700">Find connections</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-surface-50 transition-colors flex items-center space-x-3">
                  <ApperIcon name="Briefcase" className="w-4 h-4 text-primary" />
                  <span className="text-sm text-surface-700">Browse jobs</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-surface-50 transition-colors flex items-center space-x-3">
                  <ApperIcon name="BookOpen" className="w-4 h-4 text-primary" />
                  <span className="text-sm text-surface-700">Learn new skills</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <NetworkSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;