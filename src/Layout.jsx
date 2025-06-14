import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-surface border-b border-surface-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-display font-bold text-xl text-secondary">WorkStream</span>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search professionals, companies, jobs..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-surface-600 hover:text-primary hover:bg-surface-50'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Profile & Notifications - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="relative p-2 text-surface-600 hover:text-primary transition-colors">
                <ApperIcon name="Bell" className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full"></div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-surface-600 hover:text-primary transition-colors"
            >
              <ApperIcon name={mobileMenuOpen ? 'X' : 'Menu'} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-64 bg-surface shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-display font-bold text-lg text-secondary">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-surface-600 hover:text-primary transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'text-primary bg-primary/5 border-l-4 border-primary'
                            : 'text-surface-600 hover:text-primary hover:bg-surface-50'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} className="w-5 h-5" />
                      <span className="font-medium">{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex-shrink-0 bg-surface border-t border-surface-200 z-40">
        <div className="flex justify-around py-2">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 min-w-0 flex-1 transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-surface-600'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;