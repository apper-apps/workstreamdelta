import jobData from '../mockData/jobs.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class JobService {
  constructor() {
    this.jobs = [...jobData];
  }

  async getAll() {
    await delay(350);
    // Sort by posted date descending (newest first)
    const sorted = [...this.jobs].sort((a, b) => new Date(b.posted) - new Date(a.posted));
    return sorted;
  }

  async getById(id) {
    await delay(250);
    const job = this.jobs.find(j => j.id === id);
    if (!job) throw new Error('Job not found');
    return { ...job };
  }

  async searchJobs(filters = {}) {
    await delay(450);
    let filtered = [...this.jobs];
    
    if (filters.title) {
      const titleQuery = filters.title.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(titleQuery)
      );
    }
    
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationQuery)
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }
    
    if (filters.remote !== undefined) {
      filtered = filtered.filter(job => job.remote === filters.remote);
    }
    
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills.some(skill =>
          job.requirements.some(req =>
            req.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
    
    return filtered.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  }

  async getRecommended(userId, limit = 5) {
    await delay(400);
    // For demo purposes, return random jobs
    const shuffled = [...this.jobs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  async applyToJob(jobId, userId, applicationData) {
    await delay(500);
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');
    
    // In a real app, this would create an application record
    return {
      success: true,
      applicationId: Date.now().toString(),
      message: 'Application submitted successfully'
    };
  }
}

export default new JobService();