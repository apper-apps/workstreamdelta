import postData from '../mockData/posts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostService {
  constructor() {
    this.posts = [...postData];
  }

  async getAll() {
    await delay(400);
    // Sort by timestamp descending (newest first)
    const sorted = [...this.posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sorted;
  }

  async getById(id) {
    await delay(250);
    const post = this.posts.find(p => p.id === id);
    if (!post) throw new Error('Post not found');
    return { ...post };
  }

  async getByAuthor(authorId) {
    await delay(300);
    const userPosts = this.posts
      .filter(p => p.authorId === authorId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return [...userPosts];
  }

  async create(postData) {
    await delay(500);
    const newPost = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      ...postData
    };
    this.posts.unshift(newPost);
    return { ...newPost };
  }

  async update(id, updates) {
    await delay(400);
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');
    
    this.posts[index] = { ...this.posts[index], ...updates };
    return { ...this.posts[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');
    
    this.posts.splice(index, 1);
    return { success: true };
  }

  async likePost(postId, userId) {
    await delay(200);
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    post.likes = (post.likes || 0) + 1;
    return { ...post };
  }

  async addComment(postId, comment) {
    await delay(300);
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    const newComment = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...comment
    };
    
    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    
    return { ...post };
  }
}

export default new PostService();