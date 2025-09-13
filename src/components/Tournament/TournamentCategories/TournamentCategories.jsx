import { Checkbox } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronIcon } from '../../../assets';
import { ANIMATE_CATEGORY, ANIMATE_CATEGORY_EXIT, ANIMATE_CATEGORY_INIT, CATEGORY_NAMES } from '../../../constants';
import { resetBooking, setCatgories } from '../../../store/reducers/tournament-registeration-slice';
import { canBookOnDate } from '../../../utils/utlis';
import Nudge from '../TournamentNudge/TournamentNudge';

/* eslint-disable react/prop-types */
const TournamentCategories = forwardRef(({ tournament }, ref) => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  const { tournament: { categories, _id: tournamentID } } = useSelector((state) => state.tournamentRegisteration);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(resetBooking());
    }

    const persistedCategories =
      categories?.filter((cat) => cat.isSelected)?.map((cat) => cat._id) || [];

    const categoriesWithSelection = tournament.categories.map((category) => ({
      ...category,
      isSelected: persistedCategories.includes(category._id),
      selectedGender: categories?.find(cat => cat._id === category._id)?.selectedGender || null,
    }));

    dispatch(
      setCatgories({
        ...tournament,
        categories: categoriesWithSelection,
      })
    );
  }, [tournament, dispatch]);

  useEffect(() => {
    // Unselect any category that is now disabled but still selected
    const updatedCategories = categories?.map((category) => {
      if (category.isSelected && isDisabled(category)) {
        return { ...category, isSelected: false, selectedGender: null };
      }
      return category;
    });
    // Only dispatch if any changes
    const hasChanges = categories?.some((cat, idx) => cat.isSelected !== updatedCategories[idx].isSelected);
    if (hasChanges) {
      dispatch(
        setCatgories({
          ...tournament,
          categories: updatedCategories,
        })
      );
    }
  }, [categories, tournament]);

  // Helper function to check if category requires gender selection
  const requiresGenderSelection = (category) => {
    return category?.format === 'LEAGUE' && category?.type === 'MIL';
  };

  const handleInputChange = (categoryID, checked) => {
    const category = categories.find(cat => cat._id === categoryID);

    if (checked) {
      // If it requires gender selection, open the card but don't mark as selected yet
      if (requiresGenderSelection(category)) {
        setOpenCategoryId(categoryID);
        // Don't dispatch selection yet - wait for gender selection
        return;
      } else {
        // For non-MIL LEAGUE categories, select immediately
        dispatch(
          setCatgories({
            ...tournament,
            categories: categories.map((cat) =>
              cat._id === categoryID
                ? { ...cat, isSelected: true }
                : cat
            ),
          })
        );
      }
    } else {
      // When unchecking, always clear selection and gender
      dispatch(
        setCatgories({
          ...tournament,
          categories: categories.map((cat) =>
            cat._id === categoryID
              ? {
                ...cat,
                isSelected: false,
                selectedGender: null
              }
              : cat
          ),
        })
      );

      // Close the category if it was open
      if (openCategoryId === categoryID) {
        setOpenCategoryId(null);
      }
    }
  };

  const handleGenderSelection = (categoryID, gender) => {
    dispatch(
      setCatgories({
        ...tournament,
        categories: categories.map((category) =>
          category._id === categoryID
            ? {
              ...category,
              selectedGender: gender,
              isSelected: true // NOW we mark it as selected since gender is chosen
            }
            : category
        ),
      })
    );
  };

  const handleCardClick = (categoryID) => {
    setOpenCategoryId((prev) => (prev === categoryID ? null : categoryID));
  };

  const isDisabled = (category) => {
    const isFull = category.maxPlayers - category.totalBookings === 0;
    const isBookingClosed = !canBookOnDate(tournament.bookingEndDate);
    return isFull || isBookingClosed;
  };

  const isGenderDisabled = (category, gender) => {
    if (!category.bookingsByGender) return false;

    const genderBookings = category.bookingsByGender[gender] || 0;
    const maxPlayers = gender === 'male' ? category.mensMaxPlayers : category.womensMaxPlayers;

    return genderBookings >= maxPlayers;
  };

  const isLeagueSelectionComplete = (category) => {
    return !requiresGenderSelection(category) || (requiresGenderSelection(category) && category.selectedGender);
  };

  if (!categories || categories?.length <= 0) return null;

  return (
    <div className="w-full bg-white px-5 md:px-20 py-10 pt-5 gap-[18px] flex flex-col" ref={ref}>
      <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize ml-4 md:ml-8">Select Categories</h2>
      <div className="flex flex-col">
        {categories.map((category) => (
          <div key={category.categoryName} className={`flex flex-row items-center gap-2 py-2 ${isDisabled(category) ? 'opacity-50' : ''}`}>
            <div className="w-full">
              <div className="flex flex-row items-start gap-5">
                <Checkbox
                  key={category._id}
                  checked={category.isSelected && isLeagueSelectionComplete(category)}
                  onChange={(checked) => !isDisabled(category) && handleInputChange(category._id, checked)}
                  disabled={isDisabled(category)}
                  className={`mt-5 block w-5 h-5 rounded border ${isDisabled(category) ? 'border-gray-400 cursor-not-allowed' : 'border-56b918'} bg-transparent transition data-[checked]:bg-transparent`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    style={{
                      strokeDashoffset: (category.isSelected && isLeagueSelectionComplete(category)) ? '0' : '-30',
                      strokeDasharray: '30',
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round'
                    }}
                    className={`w-5 h-5 fill-none cursor-pointer ${isDisabled(category) ? 'stroke-gray-400' : 'stroke-56b918'} stroke-2 transition-[stroke-dashoffset] duration-250 ease-in-out`}
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </Checkbox>

                <div className={`${(category.isSelected && isLeagueSelectionComplete(category)) ? 'border-56b918' : 'border-f0f0f0'} ${isDisabled(category) ? 'border-gray-300' : ''} md:static relative border rounded-r-20 flex flex-col w-full`}>
                  <button
                    type="button"
                    onClick={() => !isDisabled(category) && handleCardClick(category._id)}
                    disabled={isDisabled(category)}
                    className={`${openCategoryId === category._id ? 'pl-5 pt-5 pr-5 pb-2' : 'p-5'} w-full text-left flex flex-row justify-between items-center ${isDisabled(category) ? 'cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <p className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">
                          {category.categoryName}
                        </p>
                        {requiresGenderSelection(category) && category.isSelected && category.selectedGender && (
                          <p className="font-general font-normal text-sm text-56b918 capitalize mt-1">
                            Gender: {category.selectedGender}
                          </p>
                        )}
                      </div>
                      {canBookOnDate(tournament.bookingEndDate) && (
                        <>
                          {requiresGenderSelection(category) ?
                            <div className='flex flex-col gap-3'>
                              <Nudge maxCount={category.mensMaxPlayers} totalCount={category.bookingsByGender?.male || 0} label='Men' />
                              <Nudge maxCount={category.womensMaxPlayers} totalCount={category.bookingsByGender?.female || 0} label='Women' />
                            </div>
                            :
                            <div className='md:static absolute right-2 top-[-14px]'>
                              <Nudge maxCount={category.maxPlayers} totalCount={category.totalBookings} />
                            </div>
                          }
                        </>
                      )}
                    </div>
                    <motion.img
                      src={ChevronIcon}
                      alt="Chevron Icon"
                      animate={{ rotate: openCategoryId === category._id ? 270 : 90 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
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
                        <ul className={`border-f2f2f2 pb-2 mb-0 ${requiresGenderSelection(category) ? '' : "border-b-2"}`}>
                          {category.format && (
                            <li>
                              Format: {CATEGORY_NAMES[category.format]}
                            </li>
                          )}
                          {category.skillLevel && (
                            <li>
                              Skill Level:{' '}
                              {category.skillLevel
                                .charAt(0)
                                .toUpperCase() +
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
                                const isDisabled = isGenderDisabled(category, gender);
                                const selected = category.selectedGender === gender;
                                const bookings = category.bookingsByGender?.[gender] || 0;
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
                                      onChange={() => handleGenderSelection(category._id, gender)}
                                      disabled={isDisabled}
                                      className="w-4 h-4 accent-[#56b918] border border-[#56b918] focus:ring-[#56b918] text-[#56b918] bg-[#56b918]"
                                    />
                                    <span
                                      className={`font-general text-sm ${isDisabled ? "text-gray-400" : "text-1c0e0e"
                                        }`}
                                    >
                                      {gender === "male" ? "Male" : "Female"} ({bookings}/{maxPlayers})
                                      {fee && (
                                        <span className="ml-2 text-xs text-gray-500">- INR {fee}</span>
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


                        <div className={`flex flex-col xs:flex-row justify-between items-start xs:items-center mt-[12.5px] ${requiresGenderSelection(category) ? 'hidden' : ''}`}>
                          <p className="font-general font-medium text-sm text-383838 opacity-70 capitalize mt-0 mb-0 p-0">
                            Registration Cost
                          </p>
                          <div className="flex flex-row gap-[2px] items-center">
                            <p className="font-general md:leading-0 font-semibold text-base text-1c0e0e capitalize mt-0 mb-0 p-0">
                              INR {requiresGenderSelection(category) ?
                                (category.selectedGender === 'male' ? category.registrationFeeForMen :
                                  category.selectedGender === 'female' ? category.registrationFeeForWomen :
                                    category.registrationFee) :
                                category.registrationFee}
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
    </div>
  );
});

TournamentCategories.displayName = 'TournamentCategories';

export default TournamentCategories;