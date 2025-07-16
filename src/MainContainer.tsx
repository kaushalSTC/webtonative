import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMobileConfig } from './wtnSlice';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import GradientIcon from '@mui/icons-material/Gradient';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

// Extend the Window interface for handleMobileConfig and WTN
declare global {
  interface Window {
    handleMobileConfig?: (config: { isMobileApp: boolean; platform: string }) => boolean;
    navigateTo?: (route: string) => void;
    WTN?: any;
  }
}

function useDeviceInfoDialog() {
  const [open, setOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleClick = () => {
    if (window.WTN && typeof window.WTN.deviceInfo === 'function') {
      setLoading(true);
      window.WTN.deviceInfo().then((value: any) => {
        setDeviceInfo(value);
        setLoading(false);
        setOpen(true);
      }).catch((err: any) => {
        if (
          typeof err === 'string' &&
          err.includes('This function will work in Native App Powered By WebToNative')
        ) {
          dispatch(setMobileConfig({ isMobileApp: false, platform: 'browser' }));
          alert('Good try! But this only works in the real app 😜');
        } else {
          setDeviceInfo({ error: 'Failed to get device info' });
          setLoading(false);
          setOpen(true);
        }
      });
    }
  };
  const handleClose = () => setOpen(false);
  const button = window.WTN && typeof window.WTN.deviceInfo === 'function' ? (
    <Button variant="contained" color="primary" onClick={handleClick} sx={{ mt: 2 }} disabled={loading}>
      {loading ? 'Loading...' : 'Get Device Info'}
    </Button>
  ) : null;
  const dialog = (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Device Info</DialogTitle>
      <DialogContent>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 14, margin: 0 }}>
          {deviceInfo ? JSON.stringify(deviceInfo, null, 2) : 'No data'}
        </pre>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
  // Show device info in UI if available and not an error
  const infoBox = deviceInfo && !deviceInfo.error ? (
    <Paper elevation={2} sx={{ mt: 2, p: 2, textAlign: 'left', background: '#f3f4f6', maxWidth: 480, mx: 'auto', overflowX: 'auto' }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Device Info</Typography>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 14, margin: 0 }}>
        {JSON.stringify(deviceInfo, null, 2)}
      </pre>
    </Paper>
  ) : null;
  return { button, dialog, infoBox };
}

function useClearCacheButtons() {
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string}>({open: false, message: ''});
  const handleClose = () => setSnackbar({open: false, message: ''});
  const clearCache = (reload: boolean) => {
    if (window.WTN && typeof window.WTN.clearAppCache === 'function') {
      try {
        window.WTN.clearAppCache(reload);
        setSnackbar({open: true, message: reload ? 'Cache cleared and app will reload.' : 'Cache cleared.'});
      } catch (e) {
        setSnackbar({open: true, message: 'Failed to clear cache.'});
      }
    }
  };
  const buttons = window.WTN && typeof window.WTN.clearAppCache === 'function' ? (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, mb: 1, justifyContent: 'center' }}>
      <Button variant="outlined" color="secondary" onClick={() => clearCache(false)}>
        Clear App Cache
      </Button>
      <Button variant="contained" color="secondary" onClick={() => clearCache(true)}>
        Clear App Cache & Reload
      </Button>
    </Stack>
  ) : null;
  const snackbarEl = (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={snackbar.message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
  return { buttons, snackbarEl };
}

function useCloseAppButton() {
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string}>({open: false, message: ''});
  const handleClose = () => setSnackbar({open: false, message: ''});
  const handleClick = () => {
    if (window.WTN && typeof window.WTN.closeApp === 'function') {
      try {
        window.WTN.closeApp();
      } catch (e) {
        setSnackbar({open: true, message: 'Something went wrong'});
      }
    }
  };
  const button = window.WTN && typeof window.WTN.closeApp === 'function' ? (
    <Button variant="outlined" color="error" onClick={handleClick} sx={{ mt: 2 }}>
      Close App
    </Button>
  ) : null;
  const snackbarEl = (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={snackbar.message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
  return { button, snackbarEl };
}

// In each screen, render {closeAppButton} and {closeAppSnackbar} below the other buttons
const Home = () => {
  const { button, dialog, infoBox } = useDeviceInfoDialog();
  const { buttons, snackbarEl } = useClearCacheButtons();
  const { button: closeAppButton, snackbarEl: closeAppSnackbar } = useCloseAppButton();
  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
          <GradientIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={700} gutterBottom>Home</Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>Welcome to the Home screen!</Typography>
        <Typography variant="body1" color="text.secondary">Enjoy a seamless native-like experience.</Typography>
        {button}
        {buttons}
        {closeAppButton}
        {infoBox}
        {dialog}
        {snackbarEl}
        {closeAppSnackbar}
      </Paper>
    </Box>
  );
};
const Profile = () => {
  const { button, dialog, infoBox } = useDeviceInfoDialog();
  const { buttons, snackbarEl } = useClearCacheButtons();
  const { button: closeAppButton, snackbarEl: closeAppSnackbar } = useCloseAppButton();
  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center', background: 'linear-gradient(135deg, #fdf6e3 0%, #f5e8c7 100%)' }}>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={700} gutterBottom>Profile</Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>This is your profile page.</Typography>
        <Typography variant="body1" color="text.secondary">Manage your information and settings here.</Typography>
        {button}
        {buttons}
        {closeAppButton}
        {infoBox}
        {dialog}
        {snackbarEl}
        {closeAppSnackbar}
      </Paper>
    </Box>
  );
};
const Settings = () => {
  const { button, dialog, infoBox } = useDeviceInfoDialog();
  const { buttons, snackbarEl } = useClearCacheButtons();
  const { button: closeAppButton, snackbarEl: closeAppSnackbar } = useCloseAppButton();
  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center', background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)' }}>
        <Avatar sx={{ bgcolor: 'info.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
          <SettingsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={700} gutterBottom>Settings</Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>Adjust your preferences here.</Typography>
        <Typography variant="body1" color="text.secondary">Personalize your app experience.</Typography>
        {button}
        {buttons}
        {closeAppButton}
        {infoBox}
        {dialog}
        {snackbarEl}
        {closeAppSnackbar}
      </Paper>
    </Box>
  );
};

const MobileAppUI: React.FC<{ platform: string }> = ({ platform }) => {
  const [nav, setNav] = React.useState(0);
  const navigate = useNavigate();

  // Remote routing support
  useEffect(() => {
    window.navigateTo = (route: string) => {
      navigate(route);
    };
    return () => {
      delete window.navigateTo;
    };
  }, [navigate]);

  useEffect(() => {
    if (nav === 0) navigate('/');
    if (nav === 1) navigate('/profile');
    if (nav === 2) navigate('/settings');
    // eslint-disable-next-line
  }, [nav]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={4} sx={{ background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            WebToNative Demo
          </Typography>
          <Chip
            label={platform.charAt(0).toUpperCase() + platform.slice(1)}
            color={platform === 'android' ? 'success' : platform === 'ios' ? 'secondary' : 'default'}
            variant="filled"
            sx={{ fontWeight: 600, fontSize: '1rem', ml: 2 }}
          />
        </Toolbar>
      </AppBar>
      <Box sx={{ pb: 7 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <BottomNavigation
          showLabels
          value={nav}
          onChange={(_, newValue) => setNav(newValue)}
          sx={{ borderTop: '1px solid #e0e0e0', background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ff 100%)' }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

const NotAvailable: React.FC<{ platform: string }> = ({ platform }) => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
    <Card sx={{ minWidth: 340, borderRadius: 4, boxShadow: 6, p: 2 }}>
      <CardContent>
        <Typography variant="h5" color="error" fontWeight={700} gutterBottom>
          Not Available
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          This website is not available outside the app.
        </Typography>
        <Chip
          label={platform.charAt(0).toUpperCase() + platform.slice(1)}
          color={platform === 'android' ? 'success' : platform === 'ios' ? 'secondary' : 'default'}
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '1rem', mt: 2 }}
        />
      </CardContent>
    </Card>
  </Box>
);

const MainContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { isMobileApp, platform } = useSelector((state: any) => state.wtn);

  useEffect(() => {
    window.handleMobileConfig = (config) => {
      const validPlatforms = ['android', 'ios'];
      if (
        typeof config.isMobileApp === 'boolean' &&
        validPlatforms.includes((config.platform || '').toLowerCase())
      ) {
        dispatch(setMobileConfig({
          isMobileApp: config.isMobileApp,
          platform: config.platform.toLowerCase(),
        }));
        return true; // Indicate success
      } else {
        alert('Invalid config: platform must be "android" or "ios" and isMobileApp must be a boolean.');
        return false; // Indicate failure
      }
    };
    return () => {
      delete window.handleMobileConfig;
    };
  }, [dispatch]);

  if (!isMobileApp) {
    return <NotAvailable platform={platform} />;
  }

  // Remove overlays or banners for android platform
  if (platform === 'android') {
    const banner = document.getElementById('android-debug-banner');
    if (banner) banner.remove();
  }

  return (
    <BrowserRouter>
      <MobileAppUI platform={platform} />
    </BrowserRouter>
  );
};

export default MainContainer; 