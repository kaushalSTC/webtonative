// SocialEventsCategories.js
import { Checkbox } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetBooking,
  resetBookingOnly,
  setCategories,
  setSocialEvent,
} from "../../../store/reducers/social-event-registration-slice";
import { canBookOnDate } from "../../../utils/utlis";
import { ChevronIcon } from "../../../assets";
import {
  ANIMATE_CATEGORY,
  ANIMATE_CATEGORY_EXIT,
  ANIMATE_CATEGORY_INIT,
  CATEGORY_NAMES,
} from "../../../constants";
import TournamentNudge from "../../Tournament/TournamentNudge/TournamentNudge";

const SocialEventsCategories = forwardRef(({ event }, ref) => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  const { selectedSocialEvent } = useSelector(
    (s) => s.socialEventRegistration
  );

  const {
    event: {
      tournamentData,
      _id: eventID,
    },
  } = useSelector((state) => state.socialEventRegistration);

  const categories = tournamentData?.categories || [];
  const hasCategories = categories.length > 0;

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(resetBooking());
    }

    // Auto-select social event if there are no categories (social event only)
    if (!hasCategories) {
      dispatch(
        setSocialEvent({
          eventId: event._id,
          isSocialEventSelected: true,
        })
      );
    }

    if (event?.tournamentData?.categories) {
      const persistedCategories =
        categories?.filter((cat) => cat.isSelected)?.map((cat) => cat._id) || [];

      const categoriesWithSelection = event.tournamentData.categories.map(
        (category) => ({
          ...category,
          isSelected: persistedCategories.includes(category._id),
          selectedGender:
            categories?.find((cat) => cat._id === category._id)
              ?.selectedGender || null,
        })
      );

      dispatch(
        setCategories({
          ...event,
          tournamentData: {
            ...event.tournamentData,
            categories: categoriesWithSelection,
          },
        })
      );
    } else {
      // For events without tournament data, still need to set the event data
      dispatch(setCategories(event));
    }
  }, [event, dispatch, hasCategories]);

  useEffect(() => {
    const updatedCategories = categories?.map((category) => {
      if (category.isSelected && isDisabled(category)) {
        return { ...category, isSelected: false, selectedGender: null };
      }
      return category;
    });

    const hasChanges = categories?.some(
      (cat, idx) => cat.isSelected !== updatedCategories[idx].isSelected
    );
    if (hasChanges) {
      dispatch(
        setCategories({
          ...event,
          tournamentData: {
            ...event.tournamentData,
            categories: updatedCategories,
          },
        })
      );
    }
  }, [categories, event, dispatch]);

  const requiresGenderSelection = (category) =>
    category?.format === "LEAGUE" && category?.type === "MIL";

  const handleInputChange = (categoryID, checked) => {
    const category = categories.find((cat) => cat._id === categoryID);

    if (checked) {
      if (requiresGenderSelection(category)) {
        setOpenCategoryId(categoryID);
        return;
      } else {
        dispatch(
          setCategories({
            ...event,
            tournamentData: {
              ...event.tournamentData,
              categories: categories.map((cat) =>
                cat._id === categoryID ? { ...cat, isSelected: true } : cat
              ),
            },
          })
        );
      }
    } else {
      dispatch(
        setCategories({
          ...event,
          tournamentData: {
            ...event.tournamentData,
            categories: categories.map((cat) =>
              cat._id === categoryID
                ? { ...cat, isSelected: false, selectedGender: null }
                : cat
            ),
          },
        })
      );

      if (openCategoryId === categoryID) {
        setOpenCategoryId(null);
      }
    }
  };

  const handleGenderSelection = (categoryID, gender) => {
    dispatch(
      setCategories({
        ...event,
        tournamentData: {
          ...event.tournamentData,
          categories: categories.map((category) =>
            category._id === categoryID
              ? {
                ...category,
                selectedGender: gender,
                isSelected: true,
              }
              : category
          ),
        },
      })
    );
  };

  const handleCardClick = (categoryID) => {
    setOpenCategoryId((prev) => (prev === categoryID ? null : categoryID));
  };

  const isDisabled = (category) => {
    const isFull = category.maxPlayers - category.totalBookings === 0;
    const isBookingClosed = !canBookOnDate(
      event?.tournamentData?.bookingEndDate
    );
    return isFull || isBookingClosed;
  };

  const isGenderDisabled = (category, gender) => {
    if (!category.bookingsByGender) return false;
    const genderBookings = category.bookingsByGender[gender] || 0;
    const maxPlayers =
      gender === "male" ? category.mensMaxPlayers : category.womensMaxPlayers;
    return genderBookings >= maxPlayers;
  };

  const handleEventInputChange = (checked) => {
    dispatch(
      setSocialEvent({
        eventId: event._id,
        isSocialEventSelected: checked,
      })
    );
  };

  const isLeagueSelectionComplete = (category) =>
    !requiresGenderSelection(category) ||
    (requiresGenderSelection(category) && category.selectedGender);

  return (
    <div
      className={`w-full bg-white px-5 ${hasCategories ? "md:px-20 py-10 pt-5" : "" } gap-[18px] flex flex-col`}
      ref={ref}
    >
      {/* Only show social event checkbox if there are categories */}
      {hasCategories && (
        <div className="">
          <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize ml-4 md:ml-8">
            Social Event
          </h2>
          <div className="flex flex-row items-center gap-5 py-2 cursor-pointer">
            <Checkbox
              key={event._id}
              checked={selectedSocialEvent}
              onChange={handleEventInputChange}
              className="block w-5 h-5 rounded border border-56b918 bg-transparent transition data-[checked]:bg-transparent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{
                  strokeDashoffset: selectedSocialEvent ? "0" : "-30",
                  strokeDasharray: "30",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                }}
                className={`w-5 h-5 fill-none cursor-pointer ${selectedSocialEvent ? "stroke-56b918" : "stroke-f0f0f0"
                  } stroke-2 transition-[stroke-dashoffset] duration-250 ease-in-out`}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </Checkbox>
            <p className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize p-5 w-full text-left border border-f0f0f0 rounded-r-20">
              Join Social Event
            </p>
          </div>
        </div>
      )}
      {categories.length > 0 && (
        <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize ml-4 md:ml-8">
          Select Categories
        </h2>
      )}
      {categories.length > 0 && (
        <div className="flex flex-col">
          {categories.map((category) => (
            <div
              key={category.categoryName}
              className={`flex flex-row items-center gap-2 py-2 ${isDisabled(category) ? "opacity-50" : ""
                }`}
            >
              <div className="w-full">
                <div className="flex flex-row items-start gap-5">
                  <Checkbox
                    key={category._id}
                    checked={
                      category.isSelected && isLeagueSelectionComplete(category)
                    }
                    onChange={(checked) =>
                      !isDisabled(category) &&
                      handleInputChange(category._id, checked)
                    }
                    disabled={isDisabled(category)}
                    className={`mt-5 block w-5 h-5 rounded border ${isDisabled(category)
                      ? "border-gray-400 cursor-not-allowed"
                      : "border-56b918"
                      } bg-transparent transition data-[checked]:bg-transparent`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      style={{
                        strokeDashoffset:
                          category.isSelected &&
                            isLeagueSelectionComplete(category)
                            ? "0"
                            : "-30",
                        strokeDasharray: "30",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }}
                      className={`w-5 h-5 fill-none cursor-pointer ${isDisabled(category)
                        ? "stroke-gray-400"
                        : "stroke-56b918"
                        } stroke-2 transition-[stroke-dashoffset] duration-250 ease-in-out`}
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </Checkbox>

                  <div
                    className={`${category.isSelected && isLeagueSelectionComplete(category)
                      ? "border-56b918"
                      : "border-f0f0f0"
                      } ${isDisabled(category) ? "border-gray-300" : ""} md:static relative border rounded-r-20 flex flex-col w-full`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        !isDisabled(category) && handleCardClick(category._id)
                      }
                      disabled={isDisabled(category)}
                      className={`${openCategoryId === category._id
                        ? "pl-5 pt-5 pr-5 pb-2"
                        : "p-5"
                        } w-full text-left flex flex-row justify-between items-center ${isDisabled(category) ? "cursor-not-allowed" : ""
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <p className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">
                            {category.categoryName}
                          </p>
                          {requiresGenderSelection(category) &&
                            category.isSelected &&
                            category.selectedGender && (
                              <p className="font-general font-normal text-sm text-56b918 capitalize mt-1">
                                Gender: {category.selectedGender}
                              </p>
                            )}
                        </div>
                        {canBookOnDate(event.bookingEndDate) && (
                          <>
                            {requiresGenderSelection(category) ? (
                              <div className="flex flex-col gap-3">
                                <TournamentNudge
                                  maxCount={category.mensMaxPlayers}
                                  totalCount={
                                    category.bookingsByGender?.male || 0
                                  }
                                  label="Men"
                                />
                                <TournamentNudge
                                  maxCount={category.womensMaxPlayers}
                                  totalCount={
                                    category.bookingsByGender?.female || 0
                                  }
                                  label="Women"
                                />
                              </div>
                            ) : (
                              <div className="md:static absolute right-2 top-[-14px]">
                                <TournamentNudge
                                  maxCount={category.maxPlayers}
                                  totalCount={category.totalBookings}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <motion.img
                        src={ChevronIcon}
                        alt="Chevron Icon"
                        animate={{ rotate: openCategoryId === category._id ? 270 : 90 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="size-3 opacity-70"
                      />
                    </button>

                    <AnimatePresence mode="wait">
                      {openCategoryId === category._id && (
                        <motion.div
                          initial={ANIMATE_CATEGORY_INIT}
                          animate={ANIMATE_CATEGORY}
                          exit={ANIMATE_CATEGORY_EXIT}
                          className="origin-top overflow-hidden prose max-w-none px-5 pb-4"
                        >
                          <ul
                            className={`border-f2f2f2 pb-2 mb-0 ${requiresGenderSelection(category)
                              ? ""
                              : "border-b-2"
                              }`}
                          >
                            {category.format && (
                              <li>Format: {CATEGORY_NAMES[category.format]}</li>
                            )}
                            {category.skillLevel && (
                              <li>
                                Skill Level:{" "}
                                {category.skillLevel.charAt(0).toUpperCase() +
                                  category.skillLevel.slice(1)}
                              </li>
                            )}
                          </ul>

                          {/* Gender Selection for League Categories with MIL type */}
                          {requiresGenderSelection(category) && (
                            <div className="mt-4 mb-4">
                              <p className="font-general font-medium text-sm text-1c0e0e opacity-70 mb-3">
                                Select Gender:
                              </p>

                              <div className="flex flex-col gap-3">
                                {["male", "female"].map((gender) => {
                                  const isDisabled =
                                    isGenderDisabled(category, gender);
                                  const selected =
                                    category.selectedGender === gender;
                                  const bookings =
                                    category.bookingsByGender?.[gender] || 0;
                                  const maxPlayers =
                                    gender === "male"
                                      ? category.mensMaxPlayers
                                      : category.womensMaxPlayers;
                                  const fee =
                                    gender === "male"
                                      ? category.registrationFeeForMen
                                      : category.registrationFeeForWomen;

                                  return (
                                    <label
                                      key={gender}
                                      className="flex items-center gap-3 cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name={`gender-${category._id}`}
                                        value={gender}
                                        checked={selected}
                                        onChange={() =>
                                          handleGenderSelection(
                                            category._id,
                                            gender
                                          )
                                        }
                                        disabled={isDisabled}
                                        className="w-4 h-4 accent-[#56b918] border border-[#56b918] focus:ring-[#56b918] text-[#56b918] bg-[#56b918]"
                                      />
                                      <span
                                        className={`font-general text-sm ${isDisabled
                                          ? "text-gray-400"
                                          : "text-1c0e0e"
                                          }`}
                                      >
                                        {gender === "male" ? "Male" : "Female"} (
                                        {bookings}/{maxPlayers})
                                        {fee && (
                                          <span className="ml-2 text-xs text-gray-500">
                                            - INR {fee}
                                          </span>
                                        )}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>

                              {!category.selectedGender && (
                                <p className="text-red-500 text-xs mt-2">
                                  Please select a gender to continue
                                </p>
                              )}
                            </div>
                          )}

                          <div
                            className={`flex flex-col xs:flex-row justify-between items-start xs:items-center mt-[12.5px] ${requiresGenderSelection(category) ? "hidden" : ""
                              }`}
                          >
                            <p className="font-general font-medium text-sm text-383838 opacity-70 capitalize mt-0 mb-0 p-0">
                              Registration Cost
                            </p>
                            <div className="flex flex-row gap-[2px] items-center">
                              <p className="font-general md:leading-0 font-semibold text-base text-1c0e0e capitalize mt-0 mb-0 p-0">
                                INR{" "}
                                {requiresGenderSelection(category)
                                  ? category.selectedGender === "male"
                                    ? category.registrationFeeForMen
                                    : category.selectedGender === "female"
                                      ? category.registrationFeeForWomen
                                      : category.registrationFee
                                  : category.registrationFee}
                              </p>
                              <p className="font-general md:leading-0 font-medium text-sm text-383838 opacity-70 capitalize mt-0 mb-0 p-0">
                                /
                              </p>
                              <p className="font-general md:leading-0 font-medium text-sm text-383838 opacity-70 capitalize mt-0 mb-0 p-0">
                                Per entry
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SocialEventsCategories.displayName = "SocialEventsCategories";
export default SocialEventsCategories;