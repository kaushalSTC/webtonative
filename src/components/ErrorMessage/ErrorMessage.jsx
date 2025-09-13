import { motion } from 'motion/react';
import PropTypes from 'prop-types';

const defaultClassName = 'text-sm text-red-400 font-general font-medium mt-2'

const ErrorMessage = ({staggerChildren = null, message, className = defaultClassName}) => {
  return <motion.p variants={staggerChildren} className={className}>{message}</motion.p>
}

ErrorMessage.propTypes = {
  staggerChildren: PropTypes.object,
  message: PropTypes.string,
  className: PropTypes.string,
};

export default ErrorMessage