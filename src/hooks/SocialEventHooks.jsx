import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import { getPublicEvents, eventByHandle, eventById, createEventDraftBooking, createEventDraftCheckout, createOrderForPayment, getTrendingCommunityEvents, createEventPost, deleteSocialEventBooking, socialEventSendPartnerOTP, SocialEventVerifyAndUpdatePartner } from '../api/socialEvent'
import { useDispatch } from 'react-redux';
import { setBooking, setBookingItem, setDeletedCategory, setDeletedSocialEvent, setDraftCheckout, setOrder } from '../store/reducers/social-event-registration-slice';
import { createToast } from '../utils/utlis';

export const useGetPublicEvents = (dateRange, filterType) => {
  return useInfiniteQuery({
    queryKey: ['PublicEvents', dateRange, filterType],
    queryFn: ({ pageParam }) => getPublicEvents({
      pageParam,
      limit: 17,
      dateRange,
      filterType
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const { total } = lastPage.data.data;
      const limit = 17;
      const totalFetched = allPages.length * limit;
      return totalFetched < total ? allPages.length + 1 : undefined;
    }
  })
}

export const useEventByHandleQuery = (handle) => {
  return useQuery({
    queryKey: ["event", handle],
    retry: false,
    queryFn: () => eventByHandle({ handle }),
  });
};

export const useEventByIdQuery = (eventId) => {
  return useQuery({
    queryKey: ["event-by-id", eventId],
    retry: false,
    queryFn: () => eventById({ eventId }),
    enabled: !!eventId,
  });
};

export const useCreateEventDraftBooking = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (params) => {
      return createEventDraftBooking(params);
    },
    onSuccess: (data) => {
      dispatch(setBooking(data));
      createToast('Draft booking created successfully!');
    },
    onError: (error) => {
      console.log('Hook Social Event Draft Booking - Error:', error);
      createToast(error.message || 'Failed to create draft booking');
    }
  });
};

export const useDeleteCategoryMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ playerId, bookingId, payload }) =>
      deleteSocialEventBooking({ playerId, bookingId, payload }),
    onSuccess: (data) => {
      dispatch(setDeletedCategory(data));
      createToast("Category Deleted Successfully!");
    },
    onError: (error) => {
      console.error(
        `🚀 || SocialEventHooks.jsx:87 || useDeleteCategoryMutation || error:`,
        error
      );
    },
  });
};
export const useDeleteEventMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ playerId, bookingId, payload }) =>
      deleteSocialEventBooking({ playerId, bookingId, payload }),
    onSuccess: (data) => {
      dispatch(setDeletedSocialEvent(data));
      createToast("Category Deleted Successfully!");
    },
    onError: (error) => {
      console.error(
        `🚀 || SocialEventHooks.jsx:87 || useDeleteCategoryMutation || error:`,
        error
      );
    },
  });
};

export const useCreateEventDraftCheckout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createEventDraftCheckout,
    onSuccess: (data) => {
      dispatch(setDraftCheckout(data));
      createToast('Draft checkout created successfully!');
    },
    onError: (error) => {
      createToast(error.message || 'Failed to create draft checkout');
    }
  });
};

export const useCreateOrderForPayment = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createOrderForPayment,
    onSuccess: (data) => {
      dispatch(setOrder({ order: data }));
    },
    onError: (error) => {
      createToast(error.message || 'Failed to create order for payment');
    }
  });
};

export const useTrendingCommunityEvents = () => {
  return useQuery({
    queryKey: ['trending-community-events'],
    queryFn: getTrendingCommunityEvents,
  });
};

export const useCreateEventPost = () => {
  return useMutation({
    mutationFn: ({ playerID, eventHandle, eventLinkObj }) => createEventPost({ playerID, eventHandle, eventLinkObj }),
    onSuccess: () => {
      console.log('Event post created successfully');
    },
    onError: () => {
      console.log('Error creating event post');
    },
  });
};

export const useSendPartnerOTPMutation = () => {
  return useMutation({
    mutationFn: ({ playerId, phone, bookingId, partnerId, tournamentId, countryCode }) =>
      socialEventSendPartnerOTP({ playerId, phone, bookingId, partnerId, tournamentId, countryCode }),
    onSuccess: () => {
      createToast("OTP Sent!");
    },
    onError: (error) => {
      console.error(
        `🚀 || SocialEventHooks.jsx:59 || useSendPartnerOTPMutation || error:`,
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
      SocialEventVerifyAndUpdatePartner({
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
      console.log(data.data,'liksjdf')
      dispatch(setBookingItem(data.data.booking.bookingItems));
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