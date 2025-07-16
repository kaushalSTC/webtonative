import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMobileConfig } from './wtnSlice';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Extend the Window interface for handleMobileConfig and WTN
declare global {
  interface Window {
    handleMobileConfig?: (config: { isMobileApp: boolean; platform: string; secret?: string }) => boolean;
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

function usePrintingButtons() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [printSize, setPrintSize] = useState("ISO_A4");

  const handlePrint = async () => {
    if (
      window.WTN &&
      window.WTN.Printing &&
      typeof window.WTN.Printing.setPrintSize === "function" &&
      typeof window.WTN.printFunction === "function"
    ) {
      try {
        await window.WTN.Printing.setPrintSize({
          printSize,
          label: printSize.replace('_', ' ')
        });
        const htmlToPrint = document.body.innerHTML;
        await window.WTN.printFunction({
          type: "html",
          url: htmlToPrint
        });
        setSnackbar({ open: true, message: `Print size set to ${printSize} and print function called` });
      } catch (e) {
        setSnackbar({ open: true, message: "Printing API error" });
      }
    } else {
      setSnackbar({ open: true, message: "Printing API not available" });
    }
  };

  const snackbarEl = (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar({ open: false, message: "" })}
      message={snackbar.message}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
  );

  return {
    printingButtons: (
      <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: "center", alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="print-size-label">Print Size</InputLabel>
          <Select
            labelId="print-size-label"
            value={printSize}
            label="Print Size"
            onChange={e => setPrintSize(e.target.value)}
          >
            <MenuItem value="ISO_A4">ISO_A4</MenuItem>
            <MenuItem value="ISO_B1">ISO_B1</MenuItem>
            <MenuItem value="JIS_B3">JIS_B3</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handlePrint}>
          Print (HTML)
        </Button>
      </Stack>
    ),
    snackbarEl
  };
}

// In each screen, render {closeAppButton} and {closeAppSnackbar} below the other buttons
const Home = () => {
  const { button, dialog, infoBox } = useDeviceInfoDialog();
  const { buttons, snackbarEl } = useClearCacheButtons();
  const { button: closeAppButton, snackbarEl: closeAppSnackbar } = useCloseAppButton();
  const { printingButtons, snackbarEl: printSnackbar } = usePrintingButtons();
  const { isMobileApp, platform } = useSelector((state: any) => state.wtn);
  const showPrint = isMobileApp && platform !== "ios";
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
        {showPrint && printingButtons}
        {infoBox}
        {dialog}
        {snackbarEl}
        {closeAppSnackbar}
        {showPrint && printSnackbar}
      </Paper>
    </Box>
  );
};
const Profile = () => {
  const { button, dialog, infoBox } = useDeviceInfoDialog();
  const { buttons, snackbarEl } = useClearCacheButtons();
  const { button: closeAppButton, snackbarEl: closeAppSnackbar } = useCloseAppButton();
  const { printingButtons, snackbarEl: printSnackbar } = usePrintingButtons();
  const { isMobileApp, platform } = useSelector((state: any) => state.wtn);
  const showPrint = isMobileApp && platform !== "ios";
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
        {showPrint && printingButtons}
        {infoBox}
        {dialog}
        {snackbarEl}
        {closeAppSnackbar}
        {showPrint && printSnackbar}
      </Paper>
    </Box>
  );
};
const Settings = () => {
  const { button, dialog, infoBox } = useDeviceInfoDialog();
  const { buttons, snackbarEl } = useClearCacheButtons();
  const { button: closeAppButton, snackbarEl: closeAppSnackbar } = useCloseAppButton();
  const { printingButtons, snackbarEl: printSnackbar } = usePrintingButtons();
  const { isMobileApp, platform } = useSelector((state: any) => state.wtn);
  const showPrint = isMobileApp && platform !== "ios";
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
        {showPrint && printingButtons}
        {infoBox}
        {dialog}
        {snackbarEl}
        {closeAppSnackbar}
        {showPrint && printSnackbar}
      </Paper>
    </Box>
  );
};

const MobileAppUI: React.FC<{ platform: string; needsSafeArea?: boolean }> = ({ platform, needsSafeArea }) => {
  const [nav, setNav] = React.useState(0);
  const navigate = useNavigate();
  const bottomNavRef = React.useRef<HTMLDivElement>(null);

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

  // Apply safe area padding to bottom nav if needed
  useEffect(() => {
    if (needsSafeArea && bottomNavRef.current) {
      const updatePadding = () => {
        const safeAreaPadding = window.innerHeight * 0.018;
        bottomNavRef.current!.style.paddingBottom = `${safeAreaPadding}px`;
      };
      updatePadding();
      window.addEventListener('resize', updatePadding);
      return () => {
        window.removeEventListener('resize', updatePadding);
        if (bottomNavRef.current) bottomNavRef.current.style.paddingBottom = '';
      };
    }
  }, [needsSafeArea]);

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Box
        ref={bottomNavRef}
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      >
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

const NotAvailableRoutes: React.FC<{ platform: string }> = ({ platform }) => {
  const location = useLocation();
  if (location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }
  return <NotAvailable platform={platform} />;
};

const MainContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { isMobileApp, platform } = useSelector((state: any) => state.wtn);

  const APP_SECRET = import.meta.env.VITE_APP_SECRET;
  const [showFirstLoadModal, setShowFirstLoadModal] = useState(false);

  useEffect(() => {
    window.handleMobileConfig = (config: { isMobileApp: boolean; platform: string; secret?: string }) => {
      if (config.secret !== APP_SECRET) {
        alert('Unauthorized config attempt!');
        return false;
      }
      const validPlatforms = ['android', 'ios'];
      if (
        typeof config.isMobileApp === 'boolean' &&
        validPlatforms.includes((config.platform || '').toLowerCase())
      ) {
        dispatch(setMobileConfig({
          isMobileApp: config.isMobileApp,
          platform: config.platform.toLowerCase(),
        }));
        return true;
      } else {
        alert('Invalid config: platform must be "android" or "ios" and isMobileApp must be a boolean.');
        return false;
      }
    };
    return () => {
      delete window.handleMobileConfig;
    };
  }, [dispatch]);

  // Enable pull to refresh for mobile app
  useEffect(() => {
    if (isMobileApp && window.WTN && typeof window.WTN.enablePullToRefresh === 'function') {
      window.WTN.enablePullToRefresh(true);
      return () => {
        window.WTN.enablePullToRefresh(false);
      };
    } else if (window.WTN && typeof window.WTN.enablePullToRefresh === 'function') {
      window.WTN.enablePullToRefresh(false);
    }
  }, [isMobileApp]);

  // Show beautiful modal on first app launch
  useEffect(() => {
    let cancelled = false;
    if (isMobileApp && window.WTN && typeof window.WTN.appFirstLoad === 'function') {
      window.WTN.appFirstLoad().then((value: any) => {
        if (!cancelled && value && value.result === true) {
          setShowFirstLoadModal(true);
        }
      });
    }
    return () => { cancelled = true; };
  }, [isMobileApp]);

  // Only pass safe area prop for iOS mobile app
  const needsSafeArea = isMobileApp && platform === 'ios';

  return (
    <>
      {showFirstLoadModal && (
        <Dialog
          open={showFirstLoadModal}
          onClose={() => setShowFirstLoadModal(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
              borderRadius: 4,
              boxShadow: 8,
              overflow: 'visible',
              position: 'relative',
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0, fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
            <span style={{ color: '#6366f1' }}>Welcome!</span>
            <IconButton onClick={() => setShowFirstLoadModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', pt: 1, pb: 0 }}>
            {/* Confetti effect using emoji */}
            <Box sx={{ fontSize: 32, mb: 1, userSelect: 'none' }}>🎊🎉✨</Box>
            <img
              src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png"
              alt="Party"
              width={96}
              height={96}
              style={{ marginBottom: 16, marginTop: 8, filter: 'drop-shadow(0 4px 16px #6366f1aa)' }}
            />
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: '#3730a3', letterSpacing: 1 }}>
              App Launched!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18, mb: 2 }}>
              Welcome to the app.<br />
              <span style={{ color: '#6366f1', fontWeight: 600 }}>This is your first launch of this session.</span><br />
              <span style={{ fontSize: 20 }}>Enjoy your experience! <span role="img" aria-label="confetti">🎊</span></span>
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setShowFirstLoadModal(false)}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: 18,
                background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
                boxShadow: '0 4px 16px #6366f155',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)',
                }
              }}
            >
              Get Started
            </Button>
          </DialogActions>
          {/* Extra confetti at the bottom */}
          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: -24, textAlign: 'center', fontSize: 28, pointerEvents: 'none' }}>
            🎉✨🎊
          </Box>
        </Dialog>
      )}
      {(!isMobileApp) ? (
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<NotAvailableRoutes platform={platform} />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <MobileAppUI platform={platform} needsSafeArea={isMobileApp && platform === 'ios'} />
        </BrowserRouter>
      )}
    </>
  );
};

export default MainContainer; 