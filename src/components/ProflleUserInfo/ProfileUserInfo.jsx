import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { DummyCoverImage, DummyProfileImage, Settings } from "../../assets"
import { calculateAge, createErrorToast } from "../../utils/utlis"
import Drawer from "../Drawer/Drawer"
import ProfileSettingsMenu from "../ProfileSettingsMenu/ProfileSettingsMenu"
import ThunderboltIcon from "../ThunderboltIcon/ThunderboltIcon"
import { openDrawer, closeDrawer } from "../../store/reducers/drawerSlice"
import Popup from "../Popup/Popup"
import { useDeletePlayerProfile } from "../../hooks/PlayerHooks"

const ProfileUserInfo = () => {
    const dispatch = useDispatch();
    const isDrawerOpen = useSelector((state) => state.drawer.isDrawerOpen);
    const player = useSelector((state) => state.player);
    const name = player.name;
    const age = player.dob ? calculateAge(player.dob) : '';
    const gender = player.gender;
    const skillLevel = player.skillLevel;
    const playerID = player.id;
    const profilePic = player?.profilePic;
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const { mutate: deleteProfile, isLoading, error } = useDeletePlayerProfile();

    const handleDelete = () => {
        deleteProfile(playerID);
    };

    useEffect(() => {
        if(error) {
            createErrorToast(error?.message || 'Cannot Delete Account');
            setIsDeletePopupOpen(false);
        }
    }, [error]);


    return (
        <div className="px-[15px] md:px-[9px]">
            <div className="aspect-[15/7] md:aspect-[351/106] w-full overflow-hidden rounded-[20px]">
                <img src={DummyCoverImage} alt="profile-cover-image" className="w-full h-full object-cover " />
            </div>
            <div className="flex gap-[5px] md:gap-[16px] flex-col md:flex-row items-center md:items-stretch justify-start py-10 px-[12px] max-md:mt-[-63px] max-md:pt-0">
                <div className="flex items-center justify-between aspect-square overflow-hidden rounded-full max-w-[125.5px] md:max-w-[147px]">
                    <img src={profilePic?.trim() ? profilePic : DummyProfileImage} alt="profile-image" className="w-full h-auto object-cover rounded-full " />
                </div>
                <div className="flex flex-col max-md:w-full justify-center md:justify-between items-center md:items-stretch h-[inherit]">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full md:gap-[92.9px] mb-[19px] md:mb-0">
                        <div className="flex flex-col gap-[10px] md:gap-3 md:items-start items-center justify-center">
                            <div className="flex items-center justify-center gap-[6px]">
                                <p className="text-383838 font-medium font-author text-2xl capitalize">{name}</p>
                                {age && <p className="font-general font-medium text-383838 opacity-70 text-sm uppercase">{age}</p>}
                                {gender && <p className="font-general font-medium text-383838 opacity-70 text-sm uppercase">| {gender}</p>}
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-[5px] md:gap-1">
                                <span className="flex items-center gap-1">
                                    <ThunderboltIcon level={skillLevel} className="flex flex-row w-auto" />
                                    <span className="text-xs font-general font-medium text-383838 opacity-70 capitalize">{skillLevel}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 md:gap-3 border border-[#f0f0f0] w-fit rounded-3xl py-[8px] md:py-3 px-[14px] md:px-5 mt-[14px] md:mt-0 cursor-pointer">
                            <img src={Settings} alt="settings" className="w-[12px] md:w-4 h-[12px] md:h-4 " />
                            <button className="font-general font-medium text-383838 text-xs md:text-sm capitalize cursor-pointer" onClick={() => dispatch(openDrawer())}>Settings</button>
                        </div>
                    </div>
                </div>
            </div>
            <Drawer isDrawerOpen={isDrawerOpen} className='bg-[#0000007a] inset-0 z-[1] fixed grid place-items-end h-[calc(100vh-60px)] sm:h-full mt-auto md:z-[99]' handleDrawerOpen={() => dispatch(closeDrawer())}>
                <motion.div transition={{ delay: 0, duration: 0.25 }}
                    initial={{ opacity: 0, x: '80%' }}
                    animate={{ opacity: 1, x: '0px' }}
                    exit={{ opacity: 0, x: '80%' }}
                    className="relative bg-ffffff w-full py-[46px]  sm:max-w-[448px] h-full sm:rounded-l-[20px]" onClick={(e) => e.stopPropagation()}>
                    <ProfileSettingsMenu handleDrawerOpen={() => dispatch(closeDrawer())} isDeletePopupOpen={isDeletePopupOpen} setIsDeletePopupOpen={setIsDeletePopupOpen} />
                </motion.div>
            </Drawer>

            <Popup
                isOpen={isDeletePopupOpen}
                className='bg-[#0000007a] inset-0 z-20 fixed grid place-items-center'
                handleViewOpen={setIsDeletePopupOpen}
            >
                <div className="bg-white w-[90%] md:w-[30%] min-w-[340px] mt-13 p-4 rounded-lg pt-5 pb-5 relative shadow-2xl max-h-[80vh] overflow-auto flex flex-col items-center justify-center">
                    <p className="font-general font-medium text-383838 opacity-80 text-sm md:text-base text-center">
                        Are you sure you want to delete your profile?
                    </p>
                    <p className="font-general font-medium text-383838 opacity-80 text-sm md:text-base text-center ">
                        All of your data will be deleted permanently.
                    </p>
                    <div className="w-full flex items-center justify-center gap-2">
                    <button className="bg-red-500 text-white text-sm font-general font-medium uppercase px-3 py-2 w-[75px] rounded-[10px] my-3 cursor-pointer drop-shadow-2xl" onClick={handleDelete}>
                        Delete
                    </button>
                    <button className="bg-gray-500 text-white text-sm font-general font-medium uppercase px-3 py-2 w-[85px] rounded-[10px] my-3 cursor-pointer drop-shadow-2xl" onClick={() => setIsDeletePopupOpen(false)}>
                        Cancel
                    </button>

                    </div>
                </div>
            </Popup>

        </div>
    )
}

export default ProfileUserInfo