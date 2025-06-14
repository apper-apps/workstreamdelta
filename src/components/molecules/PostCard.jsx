import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { userService, postService } from '@/services';
import { toast } from 'react-toastify';

const PostCard = ({ post, onPostUpdate }) => {
  const [author, setAuthor] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Load author data
  useState(() => {
    const loadAuthor = async () => {
      try {
        const authorData = await userService.getById(post.authorId);
        setAuthor(authorData);
      } catch (error) {
        console.error('Failed to load author:', error);
      }
    };
    loadAuthor();
  }, [post.authorId]);

  const handleLike = async () => {
    try {
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
      
      await postService.likePost(post.id, '1'); // Current user ID
      toast.success(liked ? 'Post unliked' : 'Post liked');
    } catch (error) {
      // Revert optimistic update
      setLiked(liked);
      setLikeCount(likeCount);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const comment = {
        authorId: '1', // Current user ID
        content: newComment.trim()
      };
      
      await postService.addComment(post.id, comment);
      setNewComment('');
      toast.success('Comment added');
      
      if (onPostUpdate) {
        onPostUpdate();
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  if (!author) {
    return (
      <div className="bg-surface rounded-xl p-6 shadow-sm animate-pulse">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-surface-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-surface-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-200 rounded"></div>
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Post Header */}
      <div className="flex items-start space-x-3 mb-4">
        <Avatar
          src={author.photoUrl}
          name={author.name}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary break-words">{author.name}</h3>
          <p className="text-sm text-surface-600 break-words">{author.headline}</p>
          <p className="text-xs text-surface-500 mt-1">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
        </div>
        <button className="p-2 text-surface-400 hover:text-surface-600 transition-colors">
          <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-secondary whitespace-pre-wrap break-words">{post.content}</p>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between mb-4 py-3 border-t border-b border-surface-100">
        <div className="flex items-center space-x-4 text-sm text-surface-600">
          <span>{likeCount} likes</span>
          <span>{post.comments?.length || 0} comments</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            liked
              ? 'text-accent bg-accent/5'
              : 'text-surface-600 hover:text-accent hover:bg-surface-50'
          }`}
        >
          <ApperIcon name="Heart" className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">Like</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-surface-600 hover:text-primary hover:bg-surface-50 transition-colors"
        >
          <ApperIcon name="MessageCircle" className="w-4 h-4" />
          <span className="text-sm font-medium">Comment</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-surface-600 hover:text-primary hover:bg-surface-50 transition-colors"
        >
          <ApperIcon name="Share" className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </motion.button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-surface-100 pt-4"
        >
          {/* Add Comment */}
          <div className="flex space-x-3 mb-4">
            <Avatar
              src="https://images.unsplash.com/photo-1494790108755-2616b68f7d1b?w=400&h=400&fit=crop&crop=face"
              name="Current User"
              size="sm"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 bg-surface-50 border border-surface-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  loading={loading}
                  size="sm"
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                    name="Commenter"
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-surface-50 rounded-lg p-3">
                      <p className="text-sm text-secondary break-words">{comment.content}</p>
                    </div>
                    <p className="text-xs text-surface-500 mt-1">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;