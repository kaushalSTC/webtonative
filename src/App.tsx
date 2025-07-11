import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMobileConfig } from './wtnSlice'

function App() {
  const dispatch = useDispatch();
  const { isMobileApp, platform } = useSelector((state: any) => state.wtn);

  const handleMobileConfig = (config: { isMobileApp: boolean; platform: string }) => {
    const validPlatforms = ['android', 'ios'];
    if (
      typeof config.isMobileApp === 'boolean' &&
      validPlatforms.includes(config.platform.toLowerCase())
    ) {
      dispatch(setMobileConfig({
        isMobileApp: config.isMobileApp,
        platform: config.platform.toLowerCase(),
      }));
    } else {
      alert('Invalid config: platform must be "android" or "ios" and isMobileApp must be a boolean.');
    }
  };

  useEffect(() => {
    // @ts-ignore
    window.handleMobileConfig = handleMobileConfig;
    return () => {
      // @ts-ignore
      delete window.handleMobileConfig;
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        padding: '2.5rem 3rem',
        minWidth: '340px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: '#3730a3',
          letterSpacing: '-1px',
        }}>Welcome!</h1>
        <p style={{
          fontSize: '1.15rem',
          color: '#64748b',
          marginBottom: '2rem',
        }}>Your app is ready.</p>
        <div style={{
          background: isMobileApp ? '#fef9c3' : '#dbeafe',
          color: isMobileApp ? '#b45309' : '#1e40af',
          borderRadius: '0.75rem',
          padding: '1rem 1.5rem',
          fontWeight: 600,
          fontSize: '1.1rem',
          boxShadow: '0 2px 8px 0 rgba(59, 130, 246, 0.07)',
          display: 'inline-block',
        }}>
          Running in: <span style={{ fontWeight: 700 }}>{isMobileApp ? `Mobile (${platform})` : `Browser (${platform})`}</span>
        </div>
      </div>
    </div>
  )
}

export default App
