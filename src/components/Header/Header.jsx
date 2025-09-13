import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { BookingsIcon, ChevronIcon, GroupsIcon, HeaderCloseIcon, HeaderMenuIcon, NewsIcon, ReferAndEarnIcon, SettingsIcon, PlayNowSvg, CommunityIcon } from '../../assets';
import { useLogoutMutation } from '../../hooks/LoginHooks';
import LocationSelector from '../LocationSelector/LocationSelector';
import Logo from '../Logo/Logo';
import CommunityButton from '../CommunityButton/CommunityButton';
import { openDrawer } from '../../store/reducers/drawerSlice';

const defaultDesktopMenu = [
  {
    hidden: false,
    link: '/login',
    name: 'Login',
  },
  {
    hidden: false,
    link: '/tournaments',
    name: 'Events',
  },
  {
    hidden: false,
    link: '/venues',
    name: 'Explore',
  },
]

const defaultDesktopSecondMenu = [
  {
    hidden: true,
    link: '/account',
    name: 'Groups',
    icon: GroupsIcon,
    featureEnabled: false,
    allowedOnLogin: false,
    publicLink: false,
  },
  {
    hidden: true,
    link: '/account',
    name: 'Bookings',
    icon: BookingsIcon,
    featureEnabled: true,
    allowedOnLogin: true,
    publicLink: false,
  },
  {
    hidden: false,
    link: '/blogs',
    name: 'Blogs',
    icon: NewsIcon,
    featureEnabled: true,
    allowedOnLogin: true,
    publicLink: true,
  },
  {
    hidden: false,
    link: 'pages/about-us',
    name: 'About Us',
    icon: NewsIcon,
    featureEnabled: true,
    allowedOnLogin: true,
    publicLink: true,
  },
  {
    hidden: false,
    link: 'pages/picklebay-retreats',
    name: 'Picklebay Retreats',
    icon: NewsIcon,
    featureEnabled: true,
    allowedOnLogin: true,
    publicLink: true,
  },
  {
    hidden: true,
    link: '/account',
    name: 'Refer & Earn',
    icon: ReferAndEarnIcon,
    featureEnabled: false,
    allowedOnLogin: false,
    publicLink: false,
  },
];

const defaultPlayNowMenu = [
  {
    hidden: false,
    link: '/create-game',
    name: 'Create A Game',
    icon: PlayNowSvg,
    featureEnabled: true,
    allowedOnLogin: true,
    publicLink: false,
  },
  {
    hidden: false,
    link: '/games',
    name: 'Join A Game',
    icon: PlayNowSvg,
    featureEnabled: true,
    allowedOnLogin: true,
    publicLink: false,
  }
]

export default function Header() {
  const [desktopMenu, setDesktopMenu] = useState(defaultDesktopMenu)
  const [desktopSecondMenu, setDesktopSecondMenu] = useState(defaultDesktopSecondMenu)
  const [playNowMenu, setPlayNowMenu] = useState(defaultPlayNowMenu)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: logout, isSuccess: isLogoutSuccess } = useLogoutMutation();

  // Prevent background scrolling when mobile menu is open (mobile only)
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // md breakpoint

    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (auth.isLoggedIn) {

      setDesktopMenu((prevState) => prevState.map(item => item.link === '/login' ? { ...item, name: 'Profile', link: '/account' } : item));
      setDesktopSecondMenu((prevState) => prevState.map(item => item.allowedOnLogin && item.featureEnabled && !item.publicLink ? { ...item, hidden: false } : item));
    } else {
      setDesktopMenu((prevState) => prevState.map(item => item.link === '/account' ? { ...item, name: 'Login', link: '/login' } : item));
      setDesktopSecondMenu((prevState) => prevState.map(item => item.allowedOnLogin && item.featureEnabled && !item.publicLink ? { ...item, hidden: true } : item));
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      const redirectPath = location.pathname;
      console.log("adfs", redirectPath)
      setDesktopMenu((prevState) =>
        prevState.map((item) =>
          item.link.includes('login') || item.link.includes('account')
            ? { ...item, name: 'Login', link: `/login?redirect=${redirectPath}` }
            : item
        )
      );

    }
  }, [location, auth.isLoggedIn])

  useEffect(() => {
    if (isLogoutSuccess) {
      navigate('');
    }
  }, [isLogoutSuccess, navigate]);

  const logoutHandler = (callBackFn) => {
    logout();
    if (callBackFn) callBackFn();
  };

  return (
    <header className="bg-white shadow-level-2 py-[15px] sticky top-0  z-50">
      <nav aria-label="Global" className="max-w-[80rem] px-5 w-full mx-auto flex items-center justify-between">
        {/* Logo Container */}
        <div className="flex gap-5 items-center">
          <Logo dark className={"hidden md:block h-[26px] w-auto"}></Logo>

          {/* Desktop Menu */}
          <PopoverGroup className="flex gap-x-5 lg:gap-x-12 items-center">
            {/* Location Picker */}
            <LocationSelector className="flex gap-x-12 items-center"></LocationSelector>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-x-5 lg:gap-x-12 items-center">
              {desktopMenu.map((menuItem, index) => {
                if (menuItem.hidden) return null;
                return (
                  <NavLink
                    to={menuItem.link}
                    key={nanoid()}
                    className={({ isActive }) =>
                      `text-sm font-general font-medium ${isActive ? 'text-56b918' : 'text-383838'}`
                    }
                  >
                    {menuItem.name}
                  </NavLink>
                );
              })}

              {auth.isLoggedIn &&
                <div>
                  <CommunityButton buttonTitle={'Community'} />
                </div>
              }

            </div>
          </PopoverGroup>
        </div>

        {/* Desktop && Mobile Hamburer Menu */}
        <div className="flex flex-1 justify-end items-center gap-4">
          <div>
            <Popover className="hidden md:block md:relative group">
              <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 focus-visible:outline-hidden cursor-pointer bg-abe400 px-[15px] py-[11px] rounded-[20px]">
                <span className="border border-383838 rounded-[4px] p-[3px]">
                  <img src={PlayNowSvg} alt="button" className="w-[12px] " />
                </span>
                <p className="font-general font-medium text-sm text-383838">Play now</p>
              </PopoverButton>

              <PopoverPanel
                transition
                className="w-screen max-w-[327px] absolute z-10 right-1/2 translate-x-1/2 top-[63px] overflow-hidden bg-white shadow-lg transition rounded-bl-2xl rounded-br-2xl md:-right-7 md:rounded-3xl md:translate-x-[unset] data-[closed]:-translate-y-8 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-300 data-[enter]:cubic-bezier(0,0,.3,1) data-[leave]:cubic-bezier(0,0,.3,1)"
              >
                {({ close }) => (
                  <div className="flex flex-col px-3 py-4 gap-4">
                    {playNowMenu.map((item) => (
                      <NavLink
                        key={item.link}
                        to={item.link}
                        className='flex items-center gap-3 p-3 rounded-lg transition bg-white'
                        onClick={() => {
                          close();
                          navigate(item.link);
                        }}
                      >
                        <img src={item.icon} alt={item.name} className="w-5 h-5 " />
                        <p className="font-general font-medium text-sm text-383838">
                          {item.name}
                        </p>
                      </NavLink>
                    ))}
                  </div>
                )}
              </PopoverPanel>
            </Popover>
          </div>
          <Popover className="md:relative group">
            {({ open }) => {
              // Update mobile menu state when panel opens/closes
              useEffect(() => {
                setIsMobileMenuOpen(open);
              }, [open]);

              return (
                <>
                  <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 focus-visible:outline-hidden cursor-pointer">
                    <img className="hidden group-data-[open]:block" src={HeaderCloseIcon} alt=" " />
                    <img className="block group-data-[open]:hidden" src={HeaderMenuIcon} alt=" " />
                  </PopoverButton>
                  <PopoverPanel
                    transition
                    className="w-screen max-w-96 absolute z-10 right-1/2 translate-x-1/2 top-[63px] max-h-[calc(100vh-63px)] overflow-y-auto bg-white shadow-lg transition rounded-bl-2xl rounded-br-2xl md:-right-7 md:top-[55px] md:rounded-3xl md:translate-x-[unset] data-[closed]:-translate-y-8 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-300 data-[enter]:cubic-bezier(0,0,.3,1) data-[leave]:cubic-bezier(0,0,.3,1)"
                  >
                    {({ close }) => (
                <div className="flex flex-col px-8">
                  {desktopSecondMenu.map((menuItem, index) => {
                    if (menuItem.hidden) return null;
                    return (
                      <NavLink
                        to={menuItem.link}
                        key={nanoid()}
                        onClick={() => { close() }}
                        className="flex flex-row items-center justify-between font-general font-medium text-383838 text-sm border-b border-dbe0fc py-6 pr-6"
                      >
                        <div className="flex flex-row items-center gap-3">
                          <img className="h-[15px] w-auto" src={menuItem.icon} alt=" " />
                          <p className="font-general font-medium text-383838cc text-sm">{menuItem.name}</p>
                        </div>
                        <img src={ChevronIcon} alt=" " />
                      </NavLink>
                    );
                  })}
                  {
                    auth.isLoggedIn && <button
                      onClick={() => {
                        close();
                        navigate('/account');
                        dispatch(openDrawer())
                      }}
                      className="cursor-pointer flex flex-row items-center justify-between font-general font-medium text-383838 text-sm border-b border-dbe0fc py-6 pr-6"
                    >
                      <div className="flex flex-row items-center gap-3">
                        <img className="h-[15px] w-auto" src={SettingsIcon} alt="settings-icon" />
                        <p className="font-general font-medium text-383838cc text-sm">Settings</p>
                      </div>
                    </button>
                  }
                  {
                    auth.isLoggedIn &&
                    <div className=" flex flex-row items-center justify-between font-general font-medium text-383838 text-sm border-b border-dbe0fc py-6 pr-6 md:hidden" onClick={() => close()}>
                      <div className="flex flex-row items-center gap-3">
                        <img className="h-[15px] w-auto" src={CommunityIcon} alt=" " />
                        <CommunityButton handleCommunityButtonClick={() => { close(); navigate('/community') }} />
                      </div>
                    </div>
                  }
                  {auth.isLoggedIn && <button
                    onClick={() => logoutHandler(close)}
                    className="flex flex-row items-center justify-between font-general font-medium text-383838 text-sm border-b border-dbe0fc py-6 pr-6 pl-7 pb-8"
                  >
                    <p className="font-general font-medium text-1c4ba3 text-sm underline cursor-pointer">Logout</p>
                  </button>
                  }
                    </div>
                    )}
                  </PopoverPanel>
                </>
              );
            }}
          </Popover>
        </div>
      </nav>
    </header>
  );
}
