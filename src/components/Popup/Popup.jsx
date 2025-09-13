import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { motion, AnimatePresence, MotionConfig } from "motion/react"
import { useEffect } from 'react'

const Popup = ({ isOpen, children, className = 'inset-0 z-20 fixed', handleViewOpen }) => {
    useEffect(() => {
        if(isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = null;
        }
        
        return () => {
            document.body.style.overflow = null;
        };
    }, [isOpen])

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleViewOpen(false);
        }
    }

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={className} onClick={handleOverlayClick}>
                {children}
            </motion.div>}
        </AnimatePresence>,
        document.getElementById('portal-popup')
    );
}

Popup.propTypes = {
    isOpen: PropTypes.bool,
    handleViewOpen: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string
}

export default Popup;