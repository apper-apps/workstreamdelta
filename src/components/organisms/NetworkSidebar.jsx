import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '@/components/molecules/ProfileCard';
import { userService, connectionService } from '@/services';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NetworkSidebar = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [suggestedUsers, pending] = await Promise.all([
        userService.getSuggested('1', 3), // Current user ID
        connectionService.getPendingRequests('1')
      ]);
      
      setSuggestions(suggestedUsers);
      setPendingRequests(pending);
    } catch (err) {
      setError(err.message || 'Failed to load network data');
      console.error('Network data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await connectionService.sendRequest('1', userId, 'I would like to connect with you!');
      toast.success('Connection request sent!');
      
      // Remove from suggestions
      setSuggestions(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      toast.error('Failed to send connection request');
    }
  };

  const handleAcceptRequest = async (fromUserId) => {
    try {
      await connectionService.acceptRequest(fromUserId, '1');
      toast.success('Connection request accepted!');
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.userId1 !== fromUserId));
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (fromUserId) => {
    try {
      await connectionService.rejectRequest(fromUserId, '1');
      toast.success('Connection request declined');
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.userId1 !== fromUserId));
    } catch (err) {
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-surface rounded-xl p-6 shadow-sm animate-pulse">
          <div className="h-5 bg-surface-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-surface-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-xl p-6 shadow-sm">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error mx-auto mb-2" />
          <p className="text-sm text-error">Failed to load network data</p>
          <Button
            onClick={loadNetworkData}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Connection Requests */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-2 mb-4">
            <ApperIcon name="UserCheck" className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-secondary">Pending Requests</h3>
            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {pendingRequests.length}
            </span>
          </div>
          
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.userId1} className="border-b border-surface-100 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    U
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary">Connection Request</p>
                    <p className="text-sm text-surface-600 break-words">{request.message}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAcceptRequest(request.userId1)}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleRejectRequest(request.userId1)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* People You May Know */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-secondary">People You May Know</h3>
            </div>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              See all
            </button>
          </div>
          
          <div className="space-y-4">
            {suggestions.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProfileCard
                  user={user}
                  variant="compact"
                  onConnect={handleConnect}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Industry Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="TrendingUp" className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-secondary">Trending Topics</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { topic: 'Remote Work', posts: '2,847 discussions' },
            { topic: 'AI in Tech', posts: '1,923 posts' },
            { topic: 'Career Growth', posts: '3,156 insights' }
          ].map((trend, index) => (
            <div key={index} className="p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer">
              <h4 className="font-medium text-secondary">#{trend.topic}</h4>
              <p className="text-sm text-surface-600">{trend.posts}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NetworkSidebar;