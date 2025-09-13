import PropTypes from 'prop-types';
import Loader from '../Loader/Loader';

const Button = ({children, onClick, ondblclick, type, value, disabled = false, className = "", icon, isLoading = false}) => {
  return (
    <button
      onClick={onClick? () => onClick() : undefined}
      onDoubleClick={ondblclick ? () => ondblclick() : undefined}
      type={type}
      value={value}
      disabled={disabled || isLoading}
      className={`${className} ${icon ? 'flex items-center gap-2' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isLoading ? 'cursor-wait relative' : ''} active:scale-[0.97]`}
    >
      {isLoading && <Loader size='md' color='primary' className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '/>}
      {!isLoading && icon && <img src={icon} alt="icon "/>}
      <span className={`${!isLoading ? 'opacity-100' : 'opacity-0'}`}>{children}</span>
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func,
  ondblclick: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string,
  isLoading: PropTypes.bool,
}

export default Button;