import connectionData from '../mockData/connections.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ConnectionService {
  constructor() {
    this.connections = [...connectionData];
  }

  async getAll() {
    await delay(300);
    return [...this.connections];
  }

  async getByUserId(userId) {
    await delay(250);
    const userConnections = this.connections.filter(
      conn => (conn.userId1 === userId || conn.userId2 === userId) && conn.status === 'accepted'
    );
    return [...userConnections];
  }

  async getPendingRequests(userId) {
    await delay(300);
    const pending = this.connections.filter(
      conn => conn.userId2 === userId && conn.status === 'pending'
    );
    return [...pending];
  }

  async sendRequest(fromUserId, toUserId, message = '') {
    await delay(400);
    
    // Check if connection already exists
    const existing = this.connections.find(
      conn => (conn.userId1 === fromUserId && conn.userId2 === toUserId) ||
              (conn.userId1 === toUserId && conn.userId2 === fromUserId)
    );
    
    if (existing) {
      throw new Error('Connection request already exists');
    }
    
    const newConnection = {
      userId1: fromUserId,
      userId2: toUserId,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      message
    };
    
    this.connections.push(newConnection);
    return { ...newConnection };
  }

  async acceptRequest(fromUserId, toUserId) {
    await delay(350);
    const connection = this.connections.find(
      conn => conn.userId1 === fromUserId && conn.userId2 === toUserId && conn.status === 'pending'
    );
    
    if (!connection) {
      throw new Error('Connection request not found');
    }
    
    connection.status = 'accepted';
    connection.connectedAt = new Date().toISOString();
    
    return { ...connection };
  }

  async rejectRequest(fromUserId, toUserId) {
    await delay(300);
    const index = this.connections.findIndex(
      conn => conn.userId1 === fromUserId && conn.userId2 === toUserId && conn.status === 'pending'
    );
    
    if (index === -1) {
      throw new Error('Connection request not found');
    }
    
    this.connections.splice(index, 1);
    return { success: true };
  }

  async removeConnection(userId1, userId2) {
    await delay(350);
    const index = this.connections.findIndex(
      conn => ((conn.userId1 === userId1 && conn.userId2 === userId2) ||
               (conn.userId1 === userId2 && conn.userId2 === userId1)) &&
               conn.status === 'accepted'
    );
    
    if (index === -1) {
      throw new Error('Connection not found');
    }
    
    this.connections.splice(index, 1);
    return { success: true };
  }
}

export default new ConnectionService();