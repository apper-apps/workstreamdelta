import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { messageService, userService } from '@/services';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [users, setUsers] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadConversations();
    loadUsers();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await messageService.getConversations('1'); // Current user ID
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getAll();
      const userMap = {};
      allUsers.forEach(user => {
        userMap[user.id] = user;
      });
      setUsers(userMap);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const message = await messageService.sendMessage(
        selectedConversation.id,
        '1', // Current user ID
        newMessage.trim()
      );

      // Update conversation with new message
      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, message]
      };

      setSelectedConversation(updatedConversation);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id ? updatedConversation : conv
        )
      );

      setNewMessage('');
      toast.success('Message sent');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    const otherUserId = conversation.participants.find(id => id !== '1');
    return users[otherUserId];
  };

  const getLastMessage = (conversation) => {
    const messages = conversation.messages || [];
    return messages[messages.length - 1];
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex">
        <div className="w-80 bg-surface border-r border-surface-200 animate-pulse">
          <div className="p-6">
            <div className="h-6 bg-surface-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
        <div className="flex-1 animate-pulse">
          <div className="h-16 bg-surface border-b border-surface-200"></div>
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className="max-w-xs p-3 rounded-lg bg-surface-200">
                    <div className="h-4 bg-surface-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-medium text-secondary mb-2">Unable to load messages</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadConversations} variant="outline">
            Try again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 bg-surface border-r border-surface-200 flex flex-col">
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-xl font-bold text-secondary mb-4">Messages</h2>
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <ApperIcon name="MessageCircle" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {conversations.map((conversation) => {
                const otherUser = getOtherParticipant(conversation);
                const lastMessage = getLastMessage(conversation);
                
                if (!otherUser) return null;

                return (
                  <motion.button
                    key={conversation.id}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary/5 border-r-2 border-primary'
                        : 'hover:bg-surface-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={otherUser.photoUrl}
                        name={otherUser.name}
                        size="md"
                        showOnline={true}
                        online={Math.random() > 0.5} // Random online status for demo
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-secondary truncate">
                            {otherUser.name}
                          </h3>
                          {lastMessage && (
                            <span className="text-xs text-surface-500">
                              {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-surface-600 truncate">
                          {lastMessage ? lastMessage.content : 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-surface border-b border-surface-200 flex items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                {(() => {
                  const otherUser = getOtherParticipant(selectedConversation);
                  return otherUser ? (
                    <>
                      <Avatar
                        src={otherUser.photoUrl}
                        name={otherUser.name}
                        size="md"
                        showOnline={true}
                        online={Math.random() > 0.5}
                      />
                      <div>
                        <h3 className="font-medium text-secondary">{otherUser.name}</h3>
                        <p className="text-sm text-surface-600">{otherUser.headline}</p>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-surface-400 hover:text-primary transition-colors">
                  <ApperIcon name="Phone" className="w-5 h-5" />
                </button>
                <button className="p-2 text-surface-400 hover:text-primary transition-colors">
                  <ApperIcon name="Video" className="w-5 h-5" />
                </button>
                <button className="p-2 text-surface-400 hover:text-primary transition-colors">
                  <ApperIcon name="MoreVertical" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedConversation.messages?.map((message) => {
                const isOwnMessage = message.senderId === '1';
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${
                      isOwnMessage
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 text-secondary'
                    }`}>
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-white/70' : 'text-surface-500'
                      }`}>
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-surface-200">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button className="p-1 text-surface-400 hover:text-primary transition-colors">
                      <ApperIcon name="Paperclip" className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-surface-400 hover:text-primary transition-colors">
                      <ApperIcon name="Image" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  loading={sendingMessage}
                  className="px-6"
                >
                  <ApperIcon name="Send" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="MessageCircle" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary mb-2">Select a conversation</h3>
              <p className="text-surface-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;