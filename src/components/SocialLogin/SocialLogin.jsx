import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { GoogleIcon } from '../../assets/index';

const SocialLogin = ({ staggerChildren, loginPageData }) => {
  return (
    <div className="or-login-using flex flex-col items-center gap-3">
      <motion.p
        variants={staggerChildren}
        initial={{ y: '-5px' }}
        animate={{ y: 0 }}
        className="text-ffffff text-sm font-genral"
      >
        {loginPageData.orLoginUsing}
      </motion.p>

      <motion.img
        variants={staggerChildren}
        initial={{ y: '-5px' }}
        animate={{ y: 0 }}
        src={GoogleIcon}
        alt="Google Login"
      />

      <motion.p
        variants={staggerChildren}
        initial={{ y: '-5px' }}
        animate={{ y: 0 }}
        className="text-ffffff text-sm font-genral"
      >
        {loginPageData.alreadyHaveAnAccount}
      </motion.p>
    </div>
  );
};

SocialLogin.propTypes = {
  staggerChildren: PropTypes.object,
  loginPageData: PropTypes.object,
};

export default SocialLogin;
