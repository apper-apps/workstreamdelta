import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ProfileCard = ({ user, variant = 'full', onConnect, onMessage, showActions = true }) => {
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-surface rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-surface-100"
      >
        <div className="flex items-center space-x-3">
          <Avatar
            src={user.photoUrl}
            name={user.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-secondary break-words">{user.name}</h3>
            <p className="text-sm text-surface-600 truncate">{user.headline}</p>
            <div className="flex items-center space-x-1 mt-1">
              <ApperIcon name="MapPin" className="w-3 h-3 text-surface-400" />
              <span className="text-xs text-surface-500">{user.location}</span>
            </div>
          </div>
          {showActions && (
            <Button size="sm" variant="outline" onClick={() => onConnect?.(user.id)}>
              Connect
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-surface rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-surface-100 overflow-hidden"
    >
      {/* Profile Header */}
      <div className="relative h-20 bg-gradient-to-r from-primary to-accent">
        <div className="absolute -bottom-6 left-6">
          <Avatar
            src={user.photoUrl}
            name={user.name}
            size="xl"
            className="ring-4 ring-surface"
          />
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-8 px-6 pb-6">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-secondary break-words">{user.name}</h3>
          <p className="text-surface-600 break-words">{user.headline}</p>
          <div className="flex items-center space-x-1 mt-2">
            <ApperIcon name="MapPin" className="w-4 h-4 text-surface-400" />
            <span className="text-sm text-surface-500">{user.location}</span>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-surface-600 mb-4 break-words">{user.bio}</p>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-secondary mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {user.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 4 && (
                <Badge variant="default" size="sm">
                  +{user.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-surface-600">
          <span>{user.followers || 0} followers</span>
          <span>{user.connections?.length || 0} connections</span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <Button
              onClick={() => onConnect?.(user.id)}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              <ApperIcon name="UserPlus" className="w-4 h-4 mr-1" />
              Connect
            </Button>
            <Button
              onClick={() => onMessage?.(user.id)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <ApperIcon name="MessageCircle" className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileCard;