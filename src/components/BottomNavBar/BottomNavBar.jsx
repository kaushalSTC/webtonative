import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router";
import { BottomBarEventActiveIcon, BottomBarEventIcon, BottomBarExploreActiveIcon, BottomBarExploreIcon, BottomBarHomeActiveIcon, BottomBarHomeIcon, BottomBarPlayActiveIcon, BottomBarPlayIcon, BottomBarProfileActiveIcon, BottomBarProfileIcon } from "../../assets";
import { PATHS_TO_NOT_SHOW_BOTTOM_NAV_BAR } from "../../constants";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const DEFAULT_BOTTOM_NAV_BAR_LINKS = [
  {
    hidden: false,
    name: "Home",
    link: "/",
    icon: BottomBarHomeIcon,
    activeIcon: BottomBarHomeActiveIcon
  },
  {
    hidden: false,
    name: "Events",
    link: "/tournaments",
    icon: BottomBarEventIcon,
    activeIcon: BottomBarEventActiveIcon
  },
  {
    hidden: false,
    name: "Play",
    link: "/",
    icon: BottomBarPlayIcon,
    activeIcon: BottomBarPlayActiveIcon
  },
  {
    hidden: false,
    name: "Explore",
    link: "/venues",
    icon: BottomBarExploreIcon,
    activeIcon: BottomBarExploreActiveIcon
  },
  {
    hidden: false,
    name: "Login",
    link: "/login",
    icon: BottomBarProfileIcon,
    activeIcon: BottomBarProfileActiveIcon
  },
]

const BottomNavBar = () => {
  const { pathname } = useLocation();
  const auth = useSelector((state) => state.auth);
  const [bottomNavBarLinks, setBottomNavBarLinks] = useState(DEFAULT_BOTTOM_NAV_BAR_LINKS)

  useEffect(() => {
    setBottomNavBarLinks(prevState => prevState.map(item =>
      item.link === "/login"
        ? { ...item, name: auth.isLoggedIn ? "Profile" : "Login", link: auth.isLoggedIn ? "/account" : "/login" }
        : item
    ));
  }, [auth.isLoggedIn]);

  // Skips Renderingon Cerntain Pages
  if (PATHS_TO_NOT_SHOW_BOTTOM_NAV_BAR.some(path => pathname.includes(path))) {
    return null;
  }

  const isTournamentDetailsPage = /^\/(tournaments|social-events)\/[^/]+$/.test(pathname);

  return (
    <div className={`fixed w-full left-0 z-20 md:hidden bottom-0 ${isTournamentDetailsPage ? 'py-0 px-0' : 'py-5 px-[15px]'}`}>
      <div className={`navigation-container relative flex items-center justify-between bg-white gap-3 p-5 pb-2 ${isTournamentDetailsPage ? 'rounded-none border-0 border-t border-t-f2f2f2' : 'rounded-r-20 border border-t-f2f2f2 border-l-f2f2f2 border-r-f2f2f2'}`}>
        {bottomNavBarLinks.map((link) => {
          if (link.name === "Play") {
            return (
              <Popover className="relative" key={nanoid()}>
                <PopoverButton as="button" className="flex flex-col items-center">
                  <img src={link.icon} alt={link.name} className="block h-6 w-auto "/>
                  <p className="text-xs font-medium capitalize">{link.name}</p>
                </PopoverButton>

                <PopoverPanel className="absolute w-screen max-w-[327px] z-10 left-1/2 -translate-x-1/2 bottom-[63px] bg-white shadow-lg rounded-2xl p-4 border border-f2f2f2">
                  <NavLink
                    to={auth.isLoggedIn ? "/create-game" : "/login?redirect=/create-game"}
                    className="flex items-center gap-3 p-3 rounded-lg transition bg-white"
                  >
                    <img src={link.icon} alt="Create Game" className="w-5 h-5 "/>
                    <p className="text-sm font-medium">Create A Game</p>
                  </NavLink>

                  <NavLink
                    to={auth.isLoggedIn ? "/games" : "/login?redirect=/games"}
                    className="flex items-center gap-3 p-3 rounded-lg transition bg-white"
                  >
                    <img src={link.icon} alt="Join Game" className="w-5 h-5 "/>
                    <p className="text-sm font-medium">Join A Game</p>
                  </NavLink>
                </PopoverPanel>
              </Popover>
            );
          }

          return (
            <NavLink
              to={link.link}
              key={link.link}
              className={({ isActive }) => `disabled-tabs flex flex-col items-center ${isActive ? "active-tab text-blue-600 active" : ""}`}
            >
              <img src={link.icon} alt={link.name} className="block h-6 w-auto [.active_&]:hidden "/>
              <img src={link.activeIcon} alt={link.name} className="hidden h-6 w-auto [.active_&]:block [.active_&]:-mt-2 "/>
              <p className="text-xs font-medium font-general capitalize [.active_&]:text-244cb4">{link.name}</p>
              <span className="absolute bottom-0 hidden h-2 w-12 rounded-tl-md rounded-tr-md bg-56b918 [.active_&]:block"></span>
            </NavLink>

          );
        })}
      </div>
    </div>
  );
}

export default BottomNavBar