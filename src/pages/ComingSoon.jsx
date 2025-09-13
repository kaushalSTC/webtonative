import { ComingSoonBall, ComingSoonBGPattern, ErrorDesktopBanner, ErrorMobileBanner } from "../assets/index";
import { NavLink } from "react-router";

let staticPages = [
  {
    hidden: true,
    name: "Help & FAQ",
    link: "pages/faq",
  },
  {
    hidden: false,
    name: "Terms & Conditions",
    link: "pages/termsConditions",
  },
  {
    hidden: false,
    name: "Refunds & Cancellations",
    link: "pages/refundsCancellations",
  },
  {
    hidden: false,
    name: "Privacy Policy",
    link: "pages/privacyPolicy",
  },
  {
    hidden: false,
    name: "Picklebay Guidelines",
    link: "pages/guidelines",
  },
  {
    hidden: false,
    name: "Contact Us",
    link: "pages/contactUs",
  },
]

const ComingSoon = () => {
  return (
    <div className="h=[92vh] ">
      <div className="hidden md:block">
        <img src={ErrorDesktopBanner} alt="Error Banner Desktop" className="w-full h-full object-cover "/>
      </div>
      <div className="md:hidden">
        <img src={ErrorMobileBanner} alt="Error Banner Mobile" className="w-full h-full object-cover "/>
      </div>
    </div>
  )
}


export default ComingSoon;