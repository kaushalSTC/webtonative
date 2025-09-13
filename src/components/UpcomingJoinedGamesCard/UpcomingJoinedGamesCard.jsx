/* eslint-disable react/prop-types */
import { motion } from "motion/react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { Clock, DummyProfileImage, Location, NotificationIcon } from "../../assets"
import { convertTo12HourFormat, formatDateObject, getDuration } from "../../utils/utlis"
import Button from "../Button/Button"
import Popup from "../Popup/Popup"

const UpcomingJoinedGamesCard = ({ gameInvite }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();
  const handleViewOpen = (state) => {
    setIsOpen(state);
  }

  return (
    <div className="flex flex-row w-full">
      <div className="relative flex flex-col w-full gap-2 bg-f4f5ff py-[15px] md:py-[21px] pr-[19px] md:pr-[25px] pl-[21px] md:pl-[18px] border border-dbe0fc rounded-r-20">
        <p className='font-general font-semibold md:font-medium text-sm md:text-[15px] text-383838 md:text-1c0e0e capitalize pl-[26px] md:pl-[30px]'>{gameInvite.name}</p>
        <span className="absolute left-[25px] top-1/2 -translate-1/2">
          <img src={NotificationIcon} alt="notification-icon" className='w-auto h-[18px] '/>
        </span>
        <div className="flex flex-row max-xs:flex-col max-xs:justify-start justify-between max-xs:items-start items-center max-xs:gap-1 gap-0 pl-[26px] md:pl-[30px]">
          <div className="flex flex-row justify-start gap-1 items-center">
            <p className="font-general font-medium text-383838 text-xs md:text-sm opacity-70">{formatDateObject(gameInvite.date)}</p>
            <p className="font-general font-medium text-383838 text-xs md:text-sm opacity-70"> - {convertTo12HourFormat(gameInvite.time.startTime)} IST</p>
            <p className="font-general font-medium text-383838 text-xs md:text-sm opacity-70"> ({getDuration(gameInvite.time.startTime, gameInvite.time.endTime)})</p>
          </div>
          <button className="font-general font-medium text-244cb4 text-xs md:text-sm underline capitalize cursor-pointer" onClick={() => handleViewOpen(true)}>View</button>
        </div>
      </div>

      <Popup isOpen={isOpen} className='bg-[#0000007a] inset-0 z-20 fixed grid place-items-center' handleViewOpen={handleViewOpen}>
        <motion.div transition={{ delay: 0, duration: 0.4 }}
          initial={{ opacity: 0, x: '50px', y: 0 }}
          animate={{ opacity: 1, x: '0px', y: 0 }}
          exit={{ opacity: 0, x: '0px', y: '50px' }} className="relative bg-ffffff w-full px-[30px] py-[23px] max-w-[354px] md:max-w-[536px] rounded-[30px]" onClick={(e) => e.stopPropagation()}>
          <p className="font-author font-medium text-383838 text-2xl capitalize">{gameInvite.name}</p>
          <div className="flex items-center gap-[10px]">
            <div className="aspect-square overflow-hidden rounded-full">
              <img src={gameInvite.creatorProfilePic ? gameInvite.creatorProfilePic : DummyProfileImage} alt="organizer-image" className="w-[44px] h-[44px] rounded-full "/>
            </div>
            <div className="flex-grow">
              <p className="font-general font-medium md:font-semibold text-383838 md:text-1c0e0eb3 text-sm md:text-base capitalize">{gameInvite.creator.name}</p>
              <div className="flex justify-between items-end">
                <p className="font-general font-regular md:font-medium text-xs md:text-sm text-383838 opacity-70 capitalize">Organizer</p>
                <Button
                  onClick={() => navigate(`/games/${gameInvite.handle}`)}
                  className="font-general font-medium text-xs text-244cb4 capitalize hover:underline">
                  View Game Details
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-f0f0f0 my-[22px]"></div>

          <div>
            <img src={Location} alt="location" className="w-[13px] h-[16px] inline-block "/>
            <span className="font-general font-medium text-base text-1c0e0eb3 capitalize inline ml-[7px]" >Where</span>
            <p className="font-general font-medium text-base text-1c0e0eb3 max-w-[323px] capitalize">{gameInvite.gameLocation.address.line1}, {gameInvite.gameLocation.address.line2}, {gameInvite.gameLocation.address.city}, {gameInvite.gameLocation.address.state}</p>
          </div>

          <div className="w-full h-[1px] bg-f0f0f0 my-[22px]"></div>

          <div>
            <img src={Clock} alt="clock" className="w-[15px] h-[15px] inline-block "/>
            <span className="font-general font-medium text-base text-1c0e0eb3 capitalize inline ml-[7px]" >When</span>
            <div className="flex flex-row justify-start gap-1 items-center">
              <p className="font-general font-medium text-base text-1c0e0eb3 max-w-[323px] capitalize">{formatDateObject(gameInvite.date)}</p>
              <p className="font-general font-medium text-base text-1c0e0eb3 max-w-[323px] capitalize"> - {convertTo12HourFormat(gameInvite.time.startTime)} IST</p>
              <p className="font-general font-medium text-base text-1c0e0eb3 max-w-[323px] capitalize"> ({getDuration(gameInvite.time.startTime, gameInvite.time.endTime)})</p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-f0f0f0 my-[22px]"></div>
          <button className="flex items-center justify-center bg-ffffff w-8 h-8 rounded-full absolute -bottom-20 right-1/2 translate-x-1/2 pb-[3px]" onClick={() => handleViewOpen(false)}>x</button>
        </motion.div>
      </Popup>
    </div>
  )
}

export default UpcomingJoinedGamesCard