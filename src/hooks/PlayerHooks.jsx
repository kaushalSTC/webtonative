import { useMutation, useQuery } from "@tanstack/react-query";
import { searchPlayers, activitySummary, getEmailOtp, verifyEmailOtp, deletePlayerProfile, getPlayerTournamentsBooking, getUpcomingMatches, getPlayerEventBookings, getPlayerActivity, getPlayerDraftGames, getPlayerTournamentFormData } from "../api/player";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setLogout } from "../store/reducers/auth-slice";
import { resetPlayer } from "../store/reducers/player-slice";
import { resetBooking } from "../store/reducers/tournament-registeration-slice";

export const useSearchPlayersQuery = (searchQuery) => {
  return useQuery({
    queryKey: ["search-players", searchQuery],
    retry: false,
    queryFn: () => searchPlayers({ searchQuery }),
  })
}

export const useActivitySummary = (playerID) => {
  return useQuery({
    queryKey: ["activity-summary", playerID],
    queryFn: () => activitySummary(playerID),
  })
}

export const useGetEmailOtp = () => {
  return useMutation({
    mutationFn: (playerID, emailObj) => getEmailOtp(playerID, emailObj),
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    }
  })
}

export const useVerifyEmailOtp = () => {
  return useMutation({
    mutationFn: (playerID, emailObj) => verifyEmailOtp(playerID, emailObj),
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    }
  })
}

export const useDeletePlayerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (playerID) => deletePlayerProfile(playerID),
    onSuccess: (data) => {
      console.log("✅ Profile deleted:", data);
      dispatch(setLogout());
      dispatch(resetPlayer());
      dispatch(resetBooking());
      navigate('/');

    },
    onError: (error) => {
      console.error("❌ Error deleting profile:", error);
    }
  });
};

export const useGetPlayerTournamentsBooking = (playerID) => {
  return useQuery({
    queryKey: ["tournaments-booking", playerID],
    queryFn: () => getPlayerTournamentsBooking(playerID),
  })
}

export const useGetUpcomingMatches = ({ playerID, tournamentHandle }) => {
  return useQuery({
    queryKey: ["upcoming-matches", playerID, tournamentHandle],
    queryFn: () => getUpcomingMatches({ playerID, tournamentHandle }),
  })
}

export const useGetPlayerEventBookings = (playerID) => {
  return useQuery({
    queryKey: ["event-bookings", playerID],
    queryFn: () => getPlayerEventBookings(playerID),
  })
}

export const useGetPlayerActivity = (playerId) => {
  return useQuery({
    queryKey: ["player-activity", playerId],
    queryFn: () => getPlayerActivity(playerId),
  })
}

export const useGetPlayerDraftGames = (playerId) => {
  return useQuery({
    queryKey: ["player-draft-games", playerId],
    queryFn: () => getPlayerDraftGames(playerId),
  })
}

export const useGetPlayerTournamentFormData = (playerID, tournamentId) => {
  return useQuery({
    queryKey: ["player-tournament-form-data", playerID, tournamentId],
    queryFn: () => getPlayerTournamentFormData(playerID, tournamentId),
  })
}