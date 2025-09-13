import { useQuery } from "@tanstack/react-query";
import { getFixture, getSchedule, getStandings } from "../api/tournamentLive";

export const useTournamentCategoryFixtures = ({ tournamentHandle, categoryId }) => {
  return useQuery({
    queryKey: ["tournamentCategoryFixtures", tournamentHandle, categoryId],
    queryFn: () => getFixture({ tournamentHandle, categoryId }),
  })
}

export const useTournamentCategorySchedule = ({ tournamentHandle, categoryId }) => {
  return useQuery({
    queryKey: ["tournamentCategorySchedule", tournamentHandle, categoryId],
    queryFn: () => getSchedule({ tournamentHandle, categoryId }),
  })
}

export const useGetStanding = ({ fixtureId }) => {
  return useQuery({
    queryKey: ["getStanding", fixtureId],
    queryFn: () => getStandings({ fixtureId }),
  })
}