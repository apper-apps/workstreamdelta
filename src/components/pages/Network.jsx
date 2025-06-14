import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '@/components/molecules/ProfileCard';
import SearchBar from '@/components/molecules/SearchBar';
import { userService, connectionService } from '@/services';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Network = () => {
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('connections');

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allUsers, userConnections] = await Promise.all([
        userService.getAll(),
        connectionService.getByUserId('1') // Current user ID
      ]);
      
      // Get connected user profiles
      const connectedUserIds = userConnections.map(conn => 
        conn.userId1 === '1' ? conn.userId2 : conn.userId1
      );
      
      const connectedUsers = allUsers.filter(user => 
        connectedUserIds.includes(user.id)
      );
      
      // Get suggested users (not connected)
      const suggestedUsers = allUsers.filter(user => 
        user.id !== '1' && !connectedUserIds.includes(user.id)
      );
      
      setConnections(connectedUsers);
      setSuggestions(suggestedUsers.slice(0, 12)); // Limit suggestions
    } catch (err) {
      setError(err.message || 'Failed to load network data');
      toast.error('Failed to load network data');
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
      setSearchResults(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      toast.error('Failed to send connection request');
    }
  };

  const handleMessage = async (userId) => {
    // Navigate to messages page with specific user
    toast.info('Message feature coming soon!');
  };

  const handleSearch = async (query, filters) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await userService.searchUsers(query);
      // Filter out current user and existing connections
      const filteredResults = results.filter(user => 
        user.id !== '1' && !connections.some(conn => conn.id === user.id)
      );
      setSearchResults(filteredResults);
      setActiveTab('search');
    } catch (err) {
      toast.error('Search failed');
    }
  };

  const tabs = [
    { id: 'connections', label: 'My Connections', count: connections.length },
    { id: 'suggestions', label: 'Discover People', count: suggestions.length },
    { id: 'search', label: 'Search Results', count: searchResults.length }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'connections':
        return connections;
      case 'suggestions':
        return suggestions;
      case 'search':
        return searchResults;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-surface rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-8 bg-surface-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-surface-200 rounded w-full"></div>
            </div>
            
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface rounded-xl p-6 shadow-sm animate-pulse"
                >
                  <div className="h-16 bg-surface-200 rounded mb-4"></div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-16 h-16 bg-surface-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-surface-200 rounded"></div>
                    <div className="h-3 bg-surface-200 rounded w-2/3"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-medium text-secondary mb-2">Unable to load network</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadNetworkData} variant="outline">
            Try again
          </Button>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-secondary mb-4">My Network</h1>
            <SearchBar
              placeholder="Search professionals by name, skills, or company..."
              onSearch={handleSearch}
            />
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-surface-600 hover:text-primary hover:bg-surface-50'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-200 text-surface-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {getCurrentData().length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon 
                  name={activeTab === 'connections' ? 'Users' : activeTab === 'search' ? 'Search' : 'UserPlus'} 
                  className="w-8 h-8 text-surface-400" 
                />
              </div>
              <h3 className="text-lg font-medium text-secondary mb-2">
                {activeTab === 'connections' && 'No connections yet'}
                {activeTab === 'suggestions' && 'No suggestions available'}
                {activeTab === 'search' && 'No search results'}
              </h3>
              <p className="text-surface-600 mb-4">
                {activeTab === 'connections' && 'Start connecting with professionals in your industry'}
                {activeTab === 'suggestions' && 'Check back later for new connection suggestions'}
                {activeTab === 'search' && 'Try different search terms or browse suggested connections'}
              </p>
              {activeTab !== 'search' && (
                <Button onClick={() => setActiveTab('suggestions')}>
                  Discover People
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentData().map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProfileCard
                    user={user}
                    variant="full"
                    onConnect={handleConnect}
                    onMessage={handleMessage}
                    showActions={activeTab !== 'connections'}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Network;