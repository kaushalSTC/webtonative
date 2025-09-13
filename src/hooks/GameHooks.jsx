import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { changeGameVisibility, createGame, fetchGameByHandle, getCreatedGames, getDeletedGames, getJoinedGames, getPlayerGameInvites, invitePlayerToGame, joinGame, leaveGame, updateGame, getGameByLocation, getGamesByVenue, removePlayer, getGamesHomepage, createGamePost, changeGameStatus, acceptGameInvite, rejectGameInvite, getGameById, publishGameScore, getPendingGameVerification, acceptGameScore, rejectGameScore, getAllPlayingActivity, updateGameScore, addPlayerInGame, resendScoreVerification } from '../api/game';

export const useCreateGame = () => {
  return useMutation({
    mutationFn: ({ userID, gameObj }) => createGame(userID, gameObj),
    onSuccess: () => {
      console.log('Game created successfully');
    },
    onError: () => {
      console.log('Error creating game');
    },
  });
};

export const useGameDetails = (handle) => {
  return useQuery({
    queryKey: ['game', handle],
    queryFn: () => fetchGameByHandle(handle),
    enabled: !!handle,
  });
};

export const useInvitePlayer = () => {
  return useMutation({
    mutationFn: ({ userID, gameHandle, inviteObj }) => invitePlayerToGame(userID, gameHandle, inviteObj),
    onSuccess: () => {
      console.log('Player joined game successfully');
    },
    onError: () => {
      console.log('Error joining game');
    },
  });
};

export const useChangeGameVisibility = () => {
  return useMutation({
    mutationFn: ({ userID, handle, visibilityObj }) => changeGameVisibility({ userID, handle, visibilityObj }),
    onSuccess: () => {
      console.log('Game visibility changed successfully');
    },
    onError: () => {
      console.log('Error changing game visibility');
    },
  });
};

export const useJoinGame = () => {
  return useMutation({
    mutationFn: ({ userID, handle, joinObj }) => joinGame({ userID, handle, joinObj }),
    onSuccess: () => {
      console.log('Player joined game successfully');
    },
    onError: () => {
      console.log('Error joining game');
    },
  });
};

export const useLeaveGame = () => {
  return useMutation({
    mutationFn: ({ userID, handle }) => leaveGame({ userID, handle }),
    onSuccess: () => {
      console.log('Player left game successfully');
    },
    onError: () => {
      console.log('Error leaving game');
    },
  });
};

export const useUpdateGame = () => {
  return useMutation({
    mutationFn: ({ userID, handle, gameObj }) => updateGame({ userID, handle, gameObj }),
    onSuccess: () => {
      console.log('Game updated successfully');
    },
    onError: () => {
      console.log('Error updating game');
    },
  });
};

export const useGetPlayerGameInvites = (playerId) => {
  return useQuery({
    queryKey: ['game-invites', playerId],
    queryFn: () => getPlayerGameInvites(playerId),
  });
};

export const useGetCreatedGames = (playerId) => {
  return useQuery({
    queryKey: ['created-games', playerId],
    queryFn: () => getCreatedGames(playerId),
  });
};

export const useGetPlayerJoinedGames = (playerId, currentDate) => {
  return useQuery({
    queryKey: ['joined-games', playerId, currentDate],
    queryFn: () => getJoinedGames(playerId, currentDate),
  });
};

export const  useGetGamesByLocation = ({ lat, lng }) => {
  return useInfiniteQuery({
    queryKey: ['games-by-location', lat, lng],
    queryFn: ({ pageParam = 1 }) => getGameByLocation({ lat, lng, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedGamesCount = allPages.flatMap(page => page.games).length;
      return loadedGamesCount < lastPage.total ? allPages.length + 1 : undefined;
    },
    enabled: !!lat && !!lng,
  })
}

export const useGetGamesByVenue = (venueHandle) => {
  return useQuery({
    queryKey: ['games-by-venue', venueHandle],
    queryFn: () => getGamesByVenue(venueHandle),
  })
}

export const useRemovePlayer = () => {
  return useMutation({
    mutationFn: ({ userID, handle, removePlayerObj }) => removePlayer({ userID, handle, removePlayerObj }),
    onSuccess: () => {
      console.log('Player removed successfully');
    },
    onError: () => {
      console.log('Error removing player');
    },
  })
}

export const useGetGamesHomepage = ({lat, lng}) => {
  return useQuery({
    queryKey: ['homepage-games', lat, lng],
    queryFn: () => getGamesHomepage({lat, lng}),
  })
}

export const useCreateGamePost = () => {
  return useMutation({
    mutationFn: ({ playerID, gameHandle, gameLinkObj }) => createGamePost({ playerID, gameHandle, gameLinkObj }),
    onSuccess: () => {
      console.log('Game post created successfully');
    },
    onError: () => {
      console.log('Error creating game post');
    },
  });
};

export const useChangeGameStatus = () => {
  return useMutation({
    mutationFn: ({playerID, gameHandle, gameObj}) => changeGameStatus({playerID, gameHandle, gameObj}),
    onSuccess: () => {
      console.log('Game status changed successfully');
    },
    onError: () => {
      console.log('Error changing game status');
    },
  })
}

export const useGetDeletedGames = (playerId) => {
  return useQuery({
    queryKey: ['deleted-games', playerId],
    queryFn: () => getDeletedGames(playerId),
  });
};

export const useAcceptGameInvite = () => {
  return useMutation({
    mutationFn: ({ playerID, gameHandle, acceptObj }) => acceptGameInvite(playerID, gameHandle, acceptObj),
    onSuccess: () => {
      console.log('Game invite accepted successfully');
    },
    onError: () => {
      console.log('Error accepting game invite');
    },
  });
};

export const useRejectGameInvite = () => {
  return useMutation({
    mutationFn: ({ playerID, gameHandle, rejectObj }) => rejectGameInvite(playerID, gameHandle, rejectObj),
    onSuccess: () => {
      console.log('Game invite rejected successfully');
    },
    onError: () => {
      console.log('Error rejecting game invite');
    },
  });
};

export const useGetGameById = (playerId, handle) => {
  return useQuery({
    queryKey: ['gameById', playerId, handle],
    queryFn: () => getGameById(playerId, handle),
    enabled: !!handle && !!playerId,
  });
};

export const usePublishGameScore = () => {
  return useMutation({
    mutationFn: ({playerId, gameHandle, scoreObj}) => publishGameScore({playerId, gameHandle, scoreObj}),
    onSuccess: () => {
      console.log('Game score published successfully');
    },
    onError: () => {
      console.log('Error publishing game score');
    }
  })
}

export const useGetPendingGameVerification = ({playerID}) => {
  return useQuery({
    queryKey: ['pending-game-verification', playerID],
    queryFn: () => getPendingGameVerification({playerID: playerID}),
  })
}

export const useAcceptGameScore = () => {
  return useMutation({
    mutationFn: ({playerID, gameHandle, acceptObj}) => acceptGameScore({playerID, gameHandle, acceptObj}),
    onSuccess: () => {
      console.log('Game score accepted successfully');
    },
    onError: () => {
      console.log('Error accepting game score');
    },
  });
};

export const useRejectGameScore = () => {
  return useMutation({
    mutationFn: ({playerID, gameHandle, rejectObj}) => rejectGameScore({playerID, gameHandle, rejectObj}),
    onSuccess: () => {
      console.log('Game score rejected successfully');
    },
    onError: () => {
      console.log('Error rejecting game score');
    },
  });
};

export const useGetAllPlayingActivity = (playerID, filter = 'game') => {
  return useQuery({
    queryKey: ['all-playing-activity', playerID, filter],
    queryFn: () => getAllPlayingActivity(playerID, filter),
  });
};

export const useUpdateGameScore = () => {
  return useMutation({
    mutationFn: ({ playerId, gameHandle, scoreObj }) => updateGameScore({ playerId, gameHandle, scoreObj }),
    onSuccess: () => {
      console.log('Game score updated successfully');
    },
    onError: () => {
      console.log('Error updating game score');
    },
  });
};

export const useAddPlayerInGame = () => {
  return useMutation({
    mutationFn: ({ playerId, gameHandle, playerObj }) => addPlayerInGame({ playerId, gameHandle, playerObj }),
    onSuccess: () => {
      console.log('Player added successfully');
    },
    onError: () => {
      console.log('Error adding player');
    },
  });
};

export const useResendScoreVerification = () => {
  return useMutation({
    mutationFn: ({playerId, gameHandle}) => resendScoreVerification({playerId, gameHandle}),
    onSuccess: () => {
      console.log('Score verification resent successfully');
    },
    onError: () => {
      console.log('Error resending score verification');
    },
  })
}