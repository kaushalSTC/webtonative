/* eslint-disable react/prop-types */
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import { Fragment } from 'react';
import { DefaultProfileImage, DownArrow } from '../../../../assets';
import { formatPhoneNumber } from '../../../../utils/utlis';

const TournamentCatgoryPlayerInfo = ({ player, showBorder = true, self = false }) => {
  return (
    <Disclosure as="div" className={`${showBorder ? 'border border-d2d2d2' : ''} px-4 py-3 data-[open]:px-5 data-[open]:py-5 rounded-r-20 transition-all bg-fffff`}>
      {({ open }) => (
        <>
          <DisclosureButton className="w-full flex gap-3 items-center focus:outline-hidden justify-between">
            <div className='flex items-center justify-start gap-3'>
              <img
                src={player.profilePic ? player.profilePic : DefaultProfileImage}
                alt="Profile Picture"
                className="w-10 h-auto rounded-full"
              />
              <p className="text-383838 text-base font-general font-medium capitalize">{player.name} {self ? ' (You)' : ''}</p>
            </div>
            <div>
              <img src={DownArrow} alt="Down Arrow" className={`w-[25px] h-[25px] inline-block mr-[6px] ${open ? 'rotate-180' : ''}`} />
            </div>
          </DisclosureButton>
          <AnimatePresence>
            {open && (
              <DisclosurePanel static as={Fragment} className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="origin-top flex flex-col gap-3 mt-3"
                >
                  {player.email && (
                    <div className="flex flex-col w-full items-center gap-3">
                      <div className="flex flex-row w-full justify-between items-center">
                        <p className="text-383838 text-sm opacity-70 font-general font-medium">Email</p>
                        <p className="text-383838 text-base font-general font-medium">{player.email}</p>
                      </div>
                      <div className="w-[95%] h-0 border border-d2d2d2"></div>
                    </div>
                  )}

                  {player.phone && (
                    <div className="flex flex-col w-full items-center gap-3">
                      <div className="flex flex-row w-full justify-between items-center">
                        <p className="text-383838 text-sm opacity-70 font-general font-medium">Phone</p>
                        <p className="text-383838 text-base font-general font-medium">
                          {player?.countryCode || "+91"}{player?.phone}
                        </p>
                      </div>
                      <div className="w-[95%] h-0 border border-d2d2d2"></div>
                    </div>
                  )}
                </motion.div>
              </DisclosurePanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
};

export default TournamentCatgoryPlayerInfo;
