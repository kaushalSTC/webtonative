import PropTypes from 'prop-types';

const Loader = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size mapping
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  // Color mapping
  const colorClasses = {
    loading: 'border-1c4ba3',
    primary: 'border-1c4ba3',
    secondary: 'border-56B918',
    success: 'border-abe400',
    error: 'border-red-600',
    warning: 'border-yellow-600',
  };

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div
        className={`
          border-4
          rounded-full
          border-t-transparent
          animate-spin
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['loading', 'primary', 'secondary', 'success', 'error', 'warning']),
  className: PropTypes.string,
};

export default Loader;
