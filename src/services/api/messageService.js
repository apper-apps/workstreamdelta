import messageData from '../mockData/messages.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MessageService {
  constructor() {
    this.conversations = [...messageData];
  }

  async getConversations(userId) {
    await delay(300);
    const userConversations = this.conversations.filter(
      conv => conv.participants.includes(userId)
    );
    
    // Sort by last message timestamp
    return userConversations.sort((a, b) => {
      const aLastMessage = a.messages[a.messages.length - 1];
      const bLastMessage = b.messages[b.messages.length - 1];
      return new Date(bLastMessage.timestamp) - new Date(aLastMessage.timestamp);
    });
  }

  async getConversation(conversationId) {
    await delay(250);
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error('Conversation not found');
    return { ...conversation };
  }

  async getOrCreateConversation(userId1, userId2) {
    await delay(300);
    
    // Find existing conversation
    let conversation = this.conversations.find(conv =>
      conv.participants.includes(userId1) && conv.participants.includes(userId2)
    );
    
    if (!conversation) {
      // Create new conversation
      conversation = {
        id: Date.now().toString(),
        participants: [userId1, userId2],
        messages: [],
        createdAt: new Date().toISOString()
      };
      this.conversations.push(conversation);
    }
    
    return { ...conversation };
  }

  async sendMessage(conversationId, senderId, content) {
    await delay(400);
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error('Conversation not found');
    
    const newMessage = {
      id: Date.now().toString(),
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    conversation.messages.push(newMessage);
    return { ...newMessage };
  }

  async markAsRead(conversationId, userId) {
    await delay(200);
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error('Conversation not found');
    
    conversation.messages.forEach(message => {
      if (message.senderId !== userId) {
        message.read = true;
      }
    });
    
    return { success: true };
  }

  async getUnreadCount(userId) {
    await delay(250);
    let unreadCount = 0;
    
    this.conversations
      .filter(conv => conv.participants.includes(userId))
      .forEach(conv => {
        conv.messages.forEach(message => {
          if (message.senderId !== userId && !message.read) {
            unreadCount++;
          }
        });
      });
    
    return unreadCount;
  }
}

export default new MessageService();