import { useEffect, useState } from 'react';
import { GameScorePublisher } from '../GameScorePublisher/GameScorePublisher';
import { useDispatch, useSelector } from 'react-redux';
import GameTeam from '../GameTeam/GameTeam';
import GameScoreInput from '../GameScoreInputs/GameScoreInputs';
import Skeleton from 'react-loading-skeleton';
import { setGameScores } from '../../store/reducers/gameScore-slice';

const TrackGameScores = ({ gameId, matches, gameType, isLoading, error, refetch, players, gameHandle }) => {
  const playerId = useSelector((state) => state.player?.id);
  const gameFormat = gameType;
  const [allMatches, setAllMatches] = useState(matches || []);
  const acceptedPlayers = players?.filter(p => p.status === 'ACCEPTED') || [];
  const [targetApi, setTargetApi] = useState('update');
  const [initialMatches, setInitialMatches] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

  // Function to add a new empty match based on format
  const handleAddMatch = (format) => {
    let newMatch = null;

    if (format === 'DE') {
      newMatch = {
        team1: [{ playerId: '' }, { playerId: '' }],
        team2: [{ playerId: '' }, { playerId: '' }],
        sets: [{ scoreTeam1: '', scoreTeam2: '' }],
      };
    } else if (format === 'SE') {
      newMatch = {
        team1: [{ playerId: '' }],
        team2: [{ playerId: '' }],
        sets: [{ scoreTeam1: '', scoreTeam2: '' }],
      };
    }

    if (newMatch) {
      setAllMatches((prev) => [...prev, newMatch]);
      setInitialMatches((prev) => [...prev, newMatch]);
    }
  };
  const dispatch = useDispatch();
  const savedGameScore = useSelector(state => state.gameScore?.gameScores?.[gameId]);
  // Add an initial match if none exist
  useEffect(() => {
    if (savedGameScore) {
      const clonedMatches = JSON.parse(JSON.stringify(savedGameScore.matches || []));
      setAllMatches(clonedMatches);
      setTargetApi(savedGameScore.targetApi || 'update');
      setInitialMatches(clonedMatches); // avoid shared reference
    } else {
      if (!matches || matches.length === 0) {
        const emptyMatch = [];
        setAllMatches(emptyMatch);
        setInitialMatches(emptyMatch);
        handleAddMatch(gameFormat);
        setTargetApi('publish');
      } else {
        const formattedMatches = matches.map(match => {
          if (gameFormat === 'SE') {
            return {
              ...match,
              team1: match.team1?.slice(0, 1) || [{ playerId: '' }],
              team2: match.team2?.slice(0, 1) || [{ playerId: '' }],
            };
          } else {
            return {
              ...match,
              team1: match.team1?.length === 2 ? match.team1 : [{ playerId: '' }, { playerId: '' }],
              team2: match.team2?.length === 2 ? match.team2 : [{ playerId: '' }, { playerId: '' }],
            };
          }
        });
        setAllMatches(formattedMatches);
        setInitialMatches(formattedMatches);
        setTargetApi('update');
      }
    }
  }, [matches, gameFormat, savedGameScore]);

  const hasEmptyNestedValues = (data) => {
    const check = (item) => {
      if (Array.isArray(item)) {
        return item.some(check);
      } else if (item && typeof item === 'object') {
        return Object.values(item).some(check);
      } else {
        return item === '' || item === null || item === undefined;
      }
    };

    return check(data);
  };

  const isMatchDataEqual = (a, b) => {
    const hasEmptyValues = hasEmptyNestedValues(a);
    return JSON.stringify(a) === JSON.stringify(b) || hasEmptyValues;
  };

  useEffect(() => {
    const disabled = isMatchDataEqual(allMatches, initialMatches);
    setIsDisabled(disabled);
  }, [allMatches, initialMatches]);




  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-12 bg-gray-300 rounded w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        <p>Something went wrong. Please try again.</p>
        <button onClick={refetch} className="underline text-blue-500 mt-2">Retry</button>
      </div>
    );
  }

  return (
    <div>
      {allMatches.map((match, index) => (
        <div key={index} className="w-full mb-10">
          {/* Match Title */}
          {isLoading ? <Skeleton height={20} width={150} /> : (
            <p className="font-general font-medium text-1c0e0eb3 text-sm md:text-base capitalize mb-5">
              Match {index + 1}
            </p>
          )}

          {/* Teams */}
          <div className="flex items-center justify-between mb-10">
            {isLoading ? <Skeleton height={20} width={150} /> : (
              <GameTeam
                teamNumber={1}
                match={match}
                gameFormat={gameFormat}
                matchIndex={index}
                allMatches={allMatches}
                setAllMatches={setAllMatches}
                acceptedPlayers={acceptedPlayers}
                gameId={gameId}
                refetch={refetch}
                gameHandle={gameHandle}
              />
            )}
            {isLoading ? <Skeleton height={20} width={100} /> : (
              <p className="font-xs text-1c0e0eb3 opacity-80">vs</p>
            )}
            {isLoading ? <Skeleton height={20} width={150} /> : (
              <GameTeam
                teamNumber={2}
                match={match}
                gameFormat={gameFormat}
                matchIndex={index}
                allMatches={allMatches}
                setAllMatches={setAllMatches}
                acceptedPlayers={acceptedPlayers}
                gameId={gameId}
                refetch={refetch}
                gameHandle={gameHandle}
              />
            )}
          </div>

          {/* Scores */}
          <p className="font-general font-medium text-1c0e0eb3 text-sm md:text-base capitalize mb-5">Scores</p>

          {match.sets.map((set, setIndex) => (
            <div key={setIndex} className="flex items-center justify-around mb-4 relative group">
              <GameScoreInput value={set.scoreTeam1} onChange={(val) => {
                const updatedMatches = JSON.parse(JSON.stringify(allMatches));
                updatedMatches[index].sets[setIndex].scoreTeam1 = val;
                setAllMatches(updatedMatches);
              }}
              />
              <p className="font-general font-medium text-sm md:text-base text-1c0e0eb3">Game {setIndex + 1}</p>
              <GameScoreInput value={set.scoreTeam2} onChange={(val) => {
                const updatedMatches = JSON.parse(JSON.stringify(allMatches));
                updatedMatches[index].sets[setIndex].scoreTeam2 = val;
                setAllMatches(updatedMatches);
              }}
              />
              {/* Delete Button */}
              {match.sets.length > 1 && (
                <button
                  onClick={() => {
                    const updatedMatches = JSON.parse(JSON.stringify(allMatches));
                    updatedMatches[index].sets.splice(setIndex, 1);
                    setAllMatches(updatedMatches);
                  }}
                  className={`absolute left-[-10px] md:left-0 text-xs md:text-base text-707070 font-bold bg-f2f2f2 py-1 px-2 rounded-full ${setIndex === 0 ? 'invisible' : ''}`}
                  title="Delete Game"
                >
                  ✕
                </button>
              )}
            </div>
          ))}


          <div className="w-full h-[2px] bg-dbe0fc mt-7"></div>
        </div>
      ))}

      {/* Buttons */}
      {isLoading ? (
        <>
          <Skeleton height={20} width={150} />
          <Skeleton height={20} width={150} />
          <Skeleton height={20} width={150} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mt-7 gap-12 pb-10">
          <button
            className="font-general font-medium underline text-xs md:text-sm text-244cb4 m-auto w-fit text-center"
            onClick={() => {
              const updatedMatches = JSON.parse(JSON.stringify(allMatches));
              const lastMatch = updatedMatches[updatedMatches.length - 1];
              if (lastMatch) {
                lastMatch.sets.push({ scoreTeam1: '', scoreTeam2: '' });
                setAllMatches(updatedMatches);

                dispatch(setGameScores({
                  gameId,
                  matches: updatedMatches,
                  targetApi
                }));
              }
            }}
          >
            + Add Game
          </button>

          <button
            className="font-general font-medium text-sm md:text-base text-383838 py-4 md:py-5 px-10 md:px-30 border border-383838 rounded-3xl text-center capitalize"
            onClick={() => handleAddMatch(gameFormat)}
          >
            Add a new match
          </button>
          <GameScorePublisher playerId={playerId} gameId={gameId} matches={allMatches} format={gameFormat} targetApi={targetApi} gameHandle={gameHandle} isDisabled={isDisabled} />
        </div>
      )}
    </div>
  );
};

export default TrackGameScores;

