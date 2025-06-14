import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            focused || hasValue
              ? 'top-2 text-xs text-primary'
              : 'top-4 text-sm text-surface-500'
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {icon && (
          <ApperIcon
            name={icon}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4"
          />
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={focused ? placeholder : ''}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-3 ${icon ? 'pl-10' : ''} ${label ? 'pt-6 pb-2' : 'py-3'}
            bg-surface border border-surface-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-surface-50 disabled:text-surface-500
            transition-all duration-200
            ${error ? 'border-error focus:ring-error' : ''}
          `}
          {...props}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;