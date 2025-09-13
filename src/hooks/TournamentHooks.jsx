import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getThisMonthDateRange, getThisWeekDateRange } from "../utils/utlis";
import { useDispatch } from "react-redux";

import { updatePlayerDetails } from "../api/auth";
import {
  createDraftBooking,
  createDraftCheckout,
  createOrderForPayment,
  deleteCategory,
  sendPartnerOTP,
  tournamentByHandle,
  verifyAndUpdatePartner,
  fetchWeeklyTournaments,
  tournamentListing,
  getTournamentScore,
} from "../api/tournament";
import { updatePlayer } from "../store/reducers/player-slice";
import {
  setBooking,
  setDeletedCategory,
  setDraftCheckout,
  setOrder,
} from "../store/reducers/tournament-registeration-slice";
import { createToast } from "../utils/utlis";

export const useTournamentListing = () => {
  const [activeFilters, setActiveFilters] = useState({
    skillLevel: [],
    dateRange: null,
    status: null,
  });

  const [isAllLevelsChecked, setIsAllLevelsChecked] = useState(true);

  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tournaments", activeFilters],
    queryFn: async ({ pageParam }) => {
      return tournamentListing({
        pageParam,
        limit: 17,
        filters: activeFilters,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const { total } = lastPage.data.data;
      const limit = 17;
      const totalFetched = allPages.length * limit;
      return totalFetched < total ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const setFilters = (value, checked, filtertype) => {
    setActiveFilters((prev) => {
      if (filtertype === "dateRange") {
        let dateRange = null;

        if (checked) {
          if (value === "this-week") {
            dateRange = getThisWeekDateRange();
          } else if (value === "this-month") {
            dateRange = getThisMonthDateRange();
          }
        }

        return {
          ...prev,
          dateRange,
          status: checked ? null : prev.status,
        };
      } else if (filtertype === "status") {
        return {
          ...prev,
          status: checked ? value : null,
          dateRange: checked ? null : prev.dateRange,
        };
      } else {
        const currentArray = prev[filtertype] || [];
        const isAlreadyPresent = currentArray.includes(value);

        let updatedFilter;

        if (isAlreadyPresent) {
          updatedFilter = currentArray.filter((item) => item !== value);
        } else if (checked) {
          updatedFilter = [...currentArray, value];
          setIsAllLevelsChecked(false);
        } else {
          updatedFilter = currentArray;
        }

        if (updatedFilter.length === 0) {
          setIsAllLevelsChecked(true);
        }

        return {
          ...prev,
          [filtertype]: updatedFilter,
        };
      }
    });
  };

  const tournamentsToRender =
    data?.pages.flatMap((page) => page.data.data.tournaments) || [];
  const totalResults = data?.pages[0]?.data?.data?.total || 0;

  return {
    tournamentsToRender,
    totalResults,
    isLoading,
    isError,
    error,
    setFilters,
    activeFilters,
    ref,
    isAllLevelsChecked,
    setIsAllLevelsChecked,
  };
};

export const useWeeklyTournaments = () => {
  const { startDate, endDate } = getThisWeekDateRange();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["weekly-tournaments", startDate, endDate],
    queryFn: () => fetchWeeklyTournaments({ startDate, endDate }),
  });

  return {
    tournaments: data?.data?.data?.tournaments || [],
    isLoading,
    isError,
    error,
  };
};

export const useTournamentByHandleQuery = (handle) => {
  return useQuery({
    queryKey: ["tournament", handle],
    retry: false,
    queryFn: () => tournamentByHandle({ handle }),
  });
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Booking Flow Hooks                                                      │
  └─────────────────────────────────────────────────────────────────────────┘
*/

export const usePlayerMutaionForTournamentBooking = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ playerID, player }) => updatePlayerDetails(playerID, player),
    onSuccess: (data) => {
      createToast("Profile Updated!");
      setTimeout(() => {
        dispatch(updatePlayer(data.data));
      }, 2500);
    },
    onError: (error) => {
      console.error(
        `🚀 || TournamentHooks.jsx:34 || usePlayerMutaionForTournamentBooking || error:`,
        error
      );
    },
  });
};

export const useCreateDraftBookingMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ playerId, tournamentId, categoryIds, selectedCategories, discountCode }) => {
      return createDraftBooking({ playerId, tournamentId, categoryIds, selectedCategories, discountCode });
    },
    onSuccess: (data) => {
      dispatch(setBooking(data));
    },
    onError: (error) => {
      console.log('Hook Tournament Draft Booking - Error:', error);
      console.error(
        `🚀 || TournamentHooks.jsx:47 || useCreateDraftBookingMutation || error:`,
        error
      );
    },
  });
};

export const useSendPartnerOTPMutation = () => {
  return useMutation({
    mutationFn: ({ playerId, phone, bookingId, partnerId , tournamentId, countryCode}) =>
      sendPartnerOTP({ playerId, phone, bookingId, partnerId, tournamentId, countryCode }),
    onSuccess: () => {
      createToast("OTP Sent!");
    },
    onError: (error) => {
      console.error(
        `🚀 || TournamentHooks.jsx:59 || useSendPartnerOTPMutation || error:`,
        error
      );
    },
  });
};


export const useVerifyAndUpdatePartnerMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({
      tournamentId,
      categoryId,
      playerId,
      partnerId,
      name,
      gender,
      dob,
      phone,
      otp,
      bookingId,
      countryCode
    }) =>
      verifyAndUpdatePartner({
        tournamentId,
        categoryId,
        playerId,
        partnerId,
        name,
        gender,
        dob,
        phone,
        otp,
        bookingId,
        countryCode
      }),
    onSuccess: (data) => {
      dispatch(setBooking(data.data));
      createToast("Partner Added Successfully!");
    },
    onError: (error) => {
      console.error(
        `🚀 || TournamentHooks.jsx:73 || useVerifyAndUpdatePartnerMutation || error:`,
        error
      );
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ playerId, bookingId, categoryId }) =>
      deleteCategory({ playerId, bookingId, categoryId }),
    onSuccess: (data) => {
      dispatch(setDeletedCategory(data));
      createToast("Category Deleted Successfully!");
    },
    onError: (error) => {
      console.error(
        `🚀 || TournamentHooks.jsx:87 || useDeleteCategoryMutation || error:`,
        error
      );
    },
  });
};

export const useCreateDraftCheckoutMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({
      playerId,
      tournamentId,
      bookingId,
      bookingItems,
      discountCode,
      totalAmount,
      discountAmount,
      finalAmount,
      amountAfterDiscount,
      gstAmount,
    }) =>
      createDraftCheckout({
        playerId,
        tournamentId,
        bookingId,
        bookingItems,
        discountCode,
        totalAmount,
        discountAmount,
        finalAmount,
        amountAfterDiscount,
        gstAmount,
      }),
    onSuccess: (data) => {
      dispatch(setDraftCheckout(data));
    },
    onError: (error) => {
      console.error(
        `🚀 || TournamentHooks.jsx:99 || useCreateDraftCheckoutMutation || error:`,
        error
      );
    },
  });
};

export const useCreateOrderForPaymentMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ amount, playerId, bookingId }) =>
      createOrderForPayment({ amount, playerId, bookingId }),
    onSuccess: (data) => {
      dispatch(setOrder(data));
    },
    onError: (error) => {
      console.error(
        `🚀 || TournamentHooks.jsx:99 || useCreateDraftCheckoutMutation || error:`,
        error
      );
    },
  });
};

export const useGetTournamentScore = ({playerId, fixtureId, tournamentHandle}) => {
  return useQuery({
    queryKey: ['tournament-score', playerId, fixtureId, tournamentHandle],
    queryFn: () => getTournamentScore({playerId, fixtureId, tournamentHandle}),
  });
};