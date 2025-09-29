/* eslint-disable react/prop-types */
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import parse from "html-react-parser";
import { AnimatePresence, easeOut, motion } from "motion/react";
import { Fragment } from "react";
import { ChevronIcon } from "../../../assets";
import { getDateString } from "../../../utils/utlis";

const SocialEventPreRequisites = ({ event }) => {
  const DefaultPreRequisites = `
    <ul>
      <li>Participants must be at least 16 years old to register.</li>
      <li>Open to all skill levels, but players should have a basic understanding of Pickleball rules and gameplay.</li>
      <li>Ensure you sign up by ${getDateString(event.bookingEndDate)} to secure your spot, as spaces are limited.</li>
    </ul>
  `;

  const preRequisites = event.preRequisites || DefaultPreRequisites;
  if (event.preRequisites === "") return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.2, ease: easeOut }}
      className="w-full bg-white px-9 md:px-20 py-10 pb-5 gap-[18px] flex flex-col my-[10px]"
    >
      <Disclosure as="div" className="w-full" defaultOpen={true}>
        {({ open }) => (
          <>
            <DisclosureButton className="w-full pb-2 group text-left flex flex-row justify-between items-center">
              <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">
                Pre-Requisites
              </h2>
              <img
                src={ChevronIcon}
                alt="Chevron Icon"
                className="size-3 opacity-70 transition rotate-0 group-data-[open]:rotate-90 "
              />
            </DisclosureButton>
            <AnimatePresence>
              {open && (
                <DisclosurePanel static as={Fragment}>
                  <motion.div
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="origin-top"
                  >
                    <div className="prose max-w-none mx-auto text-sm text-black">
                      {parse(preRequisites)}
                    </div>
                  </motion.div>
                </DisclosurePanel>
              )}
            </AnimatePresence>
          </>
        )}
      </Disclosure>
    </motion.div>
  );
};

export default SocialEventPreRequisites;
