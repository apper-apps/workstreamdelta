import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import PostCard from '@/components/molecules/PostCard';
import ApperIcon from '@/components/ApperIcon';
import { userService, postService, connectionService } from '@/services';
import { toast } from 'react-toastify';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [user, posts, userConnections] = await Promise.all([
        userService.getCurrentUser(),
        postService.getByAuthor('1'), // Current user ID
        connectionService.getByUserId('1')
      ]);
      
      setCurrentUser(user);
      setUserPosts(posts);
      setConnections(userConnections);
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'about', label: 'About', icon: 'User' },
    { id: 'posts', label: 'Posts', icon: 'FileText', count: userPosts.length },
    { id: 'experience', label: 'Experience', icon: 'Briefcase' },
    { id: 'skills', label: 'Skills', icon: 'Award' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Profile Header Skeleton */}
            <div className="bg-surface rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-32 bg-surface-200"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
                  <div className="w-32 h-32 bg-surface-300 rounded-full ring-4 ring-surface mb-4 sm:mb-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-8 bg-surface-200 rounded w-1/2 mb-2"></div>
                    <div className="h-5 bg-surface-200 rounded w-3/4 mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-4 bg-surface-200 rounded w-20"></div>
                      <div className="h-4 bg-surface-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="bg-surface rounded-xl p-6 shadow-sm animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-surface-200 rounded"></div>
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              </div>
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
          <h3 className="text-lg font-medium text-secondary mb-2">Unable to load profile</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadProfileData} variant="outline">
            Try again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-xl shadow-sm overflow-hidden"
          >
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-primary to-accent"></div>
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
                <Avatar
                  src={currentUser.photoUrl}
                  name={currentUser.name}
                  size="2xl"
                  className="ring-4 ring-surface mb-4 sm:mb-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-secondary break-words">
                    {currentUser.name}
                  </h1>
                  <p className="text-lg text-surface-600 break-words mb-4">
                    {currentUser.headline}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span>{currentUser.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Users" className="w-4 h-4" />
                      <span>{connections.length} connections</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Eye" className="w-4 h-4" />
                      <span>{currentUser.followers || 0} followers</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                      <ApperIcon name="Edit3" className="w-4 h-4 mr-1" />
                      Edit Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <ApperIcon name="Share" className="w-4 h-4 mr-1" />
                      Share Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <ApperIcon name="Download" className="w-4 h-4 mr-1" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-xl shadow-sm"
          >
            <div className="flex flex-wrap border-b border-surface-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-surface-600 hover:text-primary'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-surface-200 text-surface-600 rounded-full px-2 py-0.5 text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'about' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Bio */}
                  <div>
                    <h3 className="font-semibold text-secondary mb-3">About</h3>
                    <p className="text-surface-600 break-words">
                      {currentUser.bio || 'No bio available.'}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold text-secondary mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="MapPin" className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600">{currentUser.location}</span>
                      </div>
                      {currentUser.website && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Globe" className="w-4 h-4 text-surface-400" />
                          <a
                            href={currentUser.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {currentUser.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'posts' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {userPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <ApperIcon name="FileText" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-secondary mb-2">No posts yet</h3>
                      <p className="text-surface-600">Share your first post to get started!</p>
                    </div>
                  ) : (
                    userPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <PostCard post={post} />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'experience' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-semibold text-secondary mb-4">Work Experience</h3>
                    {currentUser.experience && currentUser.experience.length > 0 ? (
                      <div className="space-y-4">
                        {currentUser.experience.map((exp, index) => (
                          <div key={index} className="border-l-2 border-primary pl-4">
                            <h4 className="font-medium text-secondary">{exp.title}</h4>
                            <p className="text-primary font-medium">{exp.company}</p>
                            <p className="text-sm text-surface-500">{exp.duration}</p>
                            {exp.description && (
                              <p className="text-surface-600 mt-2 break-words">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-surface-600">No work experience added yet.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-secondary mb-4">Education</h3>
                    {currentUser.education && currentUser.education.length > 0 ? (
                      <div className="space-y-4">
                        {currentUser.education.map((edu, index) => (
                          <div key={index} className="border-l-2 border-accent pl-4">
                            <h4 className="font-medium text-secondary">{edu.degree}</h4>
                            <p className="text-accent font-medium">{edu.school}</p>
                            <p className="text-sm text-surface-500">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-surface-600">No education added yet.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-semibold text-secondary mb-4">Skills & Expertise</h3>
                    {currentUser.skills && currentUser.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentUser.skills.map((skill, index) => (
                          <Badge key={index} variant="primary" size="md">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-surface-600">No skills added yet.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-secondary mb-4">Endorsements</h3>
                    <div className="text-center py-8">
                      <ApperIcon name="Award" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                      <p className="text-surface-600">No endorsements yet</p>
                      <p className="text-sm text-surface-500 mt-1">
                        Connect with colleagues to receive skill endorsements
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;