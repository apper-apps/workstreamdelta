import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  filters = [],
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleSearch = () => {
    onSearch?.(query, selectedFilters);
  };

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setQuery('');
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search Input */}
      <div className="flex space-x-2 mb-4">
        <div className="flex-1 relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            icon="Search"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        {filters.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Filter" className="w-4 h-4" />
            <span>Filters</span>
            {Object.keys(selectedFilters).length > 0 && (
              <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {Object.keys(selectedFilters).length}
              </span>
            )}
          </Button>
        )}
        
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-surface-50 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-secondary">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-secondary mb-1">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={selectedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full p-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={selectedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;