import Home from '@/components/pages/Home';
import Network from '@/components/pages/Network';
import Jobs from '@/components/pages/Jobs';
import Messages from '@/components/pages/Messages';
import Profile from '@/components/pages/Profile';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  network: {
    id: 'network',
    label: 'Network',
    path: '/network',
    icon: 'Users',
    component: Network
  },
  jobs: {
    id: 'jobs',
    label: 'Jobs',
    path: '/jobs',
    icon: 'Briefcase',
    component: Jobs
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
    component: Messages
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  }
};

export const routeArray = Object.values(routes);
export default routes;