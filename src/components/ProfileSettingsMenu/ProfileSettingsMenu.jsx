import { SwiperButton, Settings, ProfileSettingIcon } from "../../assets"
import { NavLink } from "react-router";

const AccountSettings = [
    {
        hidden: false,
        name: "Personal Details",
        link: "/account/personal-details",
    },
    {
        hidden: true,
        name: "Your Public Profile",
        link: "/",
    },
    {
        hidden: true,
        name: "Notifications",
        link: "/",
    },
    {
        hidden: true,
        name: "Location Access",
        link: "/",
    },
    {
        hidden: false,
        name: "Delete Account",
        link: "/",
    },
]

const GeneralSettings = [
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
        hidden: true,
        name: "Help & Support",
        link: "/",
    },
]


const ProfileSettingsMenu = ({ handleDrawerOpen, isDeletePopupOpen, setIsDeletePopupOpen }) => {
    return (
        <div>
            <div className="px-[50px]">
                <div className="flex items-center justify-between">
                    <div>
                        <img src={ProfileSettingIcon} alt="profile-icon" className="w-[15px] h-[15px] inline mr-[10px] " />
                        <p className="font-general font-medium md:font-semibold text-sm md:text-base text-#383838 opacity-80 capitalize inline">Account Settings</p>
                    </div>
                    <button className="font-general font-medium text-244cb4 text-sm underline capitalize cursor-pointer" onClick={() => handleDrawerOpen(false)}>Close</button>
                </div>
                {
                    AccountSettings.filter(link => !link.hidden).map((link, index, filteredLinks) => {
                        const isLastItem = index === filteredLinks.length - 1;

                        if (link.name === 'Delete Account') {
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between py-[20px]  cursor-pointer ${isLastItem ? '' : 'border-b border-dbe0fc'
                                        }`}
                                    onClick={() => {
                                        handleDrawerOpen(false);
                                        setIsDeletePopupOpen(true);
                                    }}

                                >
                                    <p className="font-general font-medium text-383838 opacity-80 text-sm md:text-base">
                                        {link.name}
                                    </p>
                                    <img
                                        src={SwiperButton}
                                        alt="swiper-button"
                                        className="w-[10px] h-[10px] inline-block"
                                    />
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                to={link.link}
                                key={index}
                                className={`flex items-center justify-between py-[20px] ${isLastItem ? '' : 'border-b border-dbe0fc'
                                    }`}
                            >
                                <p className="font-general font-medium text-383838 opacity-80 text-sm md:text-base">
                                    {link.name}
                                </p>
                                <img
                                    src={SwiperButton}
                                    alt="swiper-button"
                                    className="w-[10px] h-[10px] inline-block"
                                />
                            </NavLink>
                        );
                    })
                }

            </div>

            <div className="w-full h-[8px] bg-f0f0f0 mb-[30px]"></div>

            <div className="px-[50px]">
                <div className="flex items-center justify-between">
                    <div>
                        <img src={Settings} alt="settings-icon" className="w-[15px] h-[15px] inline mr-[10px] " />
                        <p className="font-general font-medium md:font-semibold text-sm md:text-base text-#383838 opacity-80 capitalize inline">General Settings</p>
                    </div>
                </div>
                {
                    GeneralSettings.filter(link => !link.hidden).map((link, index, filteredLinks) => {
                        const isLastItem = index === filteredLinks.length - 1;

                        return (
                            <NavLink
                                to={link.link}
                                key={index}
                                className={`flex items-center justify-between py-[20px] ${isLastItem ? '' : 'border-b border-dbe0fc'}`}
                            >
                                <p className="font-general font-medium text-383838 opacity-80 text-sm md:text-base">{link.name}</p>
                                <img src={SwiperButton} alt="swiper-button" className="w-[10px] h-[10px] inline-block " />
                            </NavLink>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default ProfileSettingsMenu