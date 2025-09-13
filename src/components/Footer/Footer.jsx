import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import {
  FacebookIcon,
  FooterCurveBGDesktop,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon
} from "../../assets";
import BottomNavBar from "../BottomNavBar/BottomNavBar";
import Logo from "../Logo/Logo";

const footer = {
  // subtext: "Your Pickleball Community App",
  links: [
    {
      hidden: false,
      name: "Help & FAQ",
      link: "/pages/faq",
    },
    {
      hidden: false,
      name: "Terms & Conditions",
      link: "/pages/termsConditions",
    },
    {
      hidden: false,
      name: "Refunds & Cancellations",
      link: "/pages/refundsCancellations",
    },
    {
      hidden: false,
      name: "Privacy Policy",
      link: "/pages/privacyPolicy",
    },
    {
      hidden: false,
      name: "Picklebay Guidelines",
      link: "/pages/guidelines",
    },
    {
      hidden: false,
      name: "Contact Us",
      link: "/pages/contactUs",
    },
    // {
    //   hidden: false,
    //   name: "About Us",
    //   link: "/pages/about-us",
    // },
  ],
  social: {
    heading: "Get in Touch",
    links: [
      {
        hidden: false,
        name: "Instagram",
        link: "https://www.instagram.com/picklebayofficial?igsh=ZHJ6a2p6OHcxdHB2&utm_source=qr",
        icon: InstagramIcon,
      },
      {
        hidden: false,
        name: "Facebook",
        link: "https://www.facebook.com/profile.php?id=61572835575849",
        icon: FacebookIcon,
      },
      {
        hidden: false,
        name: "Linkedin",
        link: "https://www.linkedin.com/company/picklebay/",
        icon: LinkedinIcon,
      },
      {
        hidden: false,
        name: "Youtube",
        link: "https://www.youtube.com/@Picklebayofficial",
        icon: YoutubeIcon,
      },
    ],
  },
};

export default function Footer() {
  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the footer is visible
        rootMargin: "0px", // No margin around the viewport
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer className="w-full">
      <div className="relative w-full mt-10 main-footer-wrapper" ref={footerRef}>
        <img
          src={FooterCurveBGDesktop}
          alt=""
          className="block w-full h-auto relative top-[1px]"
        />

        <div className="w-full bg-244cb4 py-16">
          <div className="w-full flex flex-col items-center max-w-[357px] mx-auto gap-12 px-4">
            <div className="w-full flex flex-col items-center flex-no-wrap gap-3">
              <Logo light className={"w-full h-auto max-w-[327px]"}></Logo>
              <p className="text-fbfbfb text-sm font-medium font-general capitalize">
                {footer.subtext}
              </p>
            </div>
            <div className="w-full flex flex-col items-center flex-no-wrap gap-7">
              <div className="flex flex-col items-center gap-[10px]">
                {footer.links.map((link, index) => {
                  if (link.hidden) return null;
                  return (
                    <NavLink
                      to={link.link}
                      key={nanoid()}
                      className="text-white text-sm font-medium font-general capitalize hover:underline hover:font-semibold"
                    >
                      {link.name}
                    </NavLink>
                  );
                })}
              </div>
              <div className="w-full max-w-60 h-[0.1px] bg-[#f2f2f2]"></div>
              <div className="flex flex-row items-center gap-7 mt-4">
                <p className="text-white text-sm font-general font-medium">
                  {footer.social.heading}
                </p>
                <div className="flex flex-row gap-[14px]">
                  {footer.social.links.map((social, index) => {
                    if (social.hidden) return null;
                    return (
                      <NavLink
                        to={social.link}
                        target="_blank"
                        key={nanoid()}
                        className="text-sm font-medium font-general capitalize"
                      >
                        <img
                          src={social.icon}
                          alt={`Icon for ${social.name}`}
                          className="w-auto h-[26.52px]"
                        />
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Only show BottomNavBar when footer is not visible */}
      {!isFooterVisible && (
        <div className="bottom-nav-bar-wrapper">
          <BottomNavBar />
        </div>
      )}
    </footer>
  );
}
