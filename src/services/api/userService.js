import userData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...userData];
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(250);
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user };
  }

  async getCurrentUser() {
    await delay(200);
    // Return the first user as current user for demo
    return { ...this.users[0] };
  }

  async getConnections(userId) {
    await delay(300);
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    const connections = this.users.filter(u => 
      user.connections && user.connections.includes(u.id)
    );
    return [...connections];
  }

  async getSuggested(userId, limit = 5) {
    await delay(350);
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    const suggested = this.users
      .filter(u => u.id !== userId && (!user.connections || !user.connections.includes(u.id)))
      .slice(0, limit);
    
    return [...suggested];
  }

  async searchUsers(query) {
    await delay(400);
    const lowercaseQuery = query.toLowerCase();
    const results = this.users.filter(user =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.headline.toLowerCase().includes(lowercaseQuery) ||
      user.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
    );
    return [...results];
  }

  async updateProfile(userId, updates) {
    await delay(500);
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    this.users[index] = { ...this.users[index], ...updates };
    return { ...this.users[index] };
  }
}

export default new UserService();