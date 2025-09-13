import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { motion, AnimatePresence, MotionConfig } from "motion/react"

const Drawer = ({ isDrawerOpen, children, className = 'inset-0 z-20 fixed', handleDrawerOpen }) => {

    useEffect(() => {
        if(isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = null;
        }

        return () => {
            document.body.style.overflow = null;
        }
    }, [isDrawerOpen]) 
    
    const handleDraweOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleDrawerOpen(false);
        }
    }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isDrawerOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}  className={className} onClick={handleDraweOverlayClick}>
        {children}
      </motion.div>}
    </AnimatePresence>,
    document.getElementById('portal-drawer')
  )
}


Drawer.propTypes = {
    isDrawerOpen: PropTypes.bool,
    handleDrawerOpen: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string
}


export default Drawer