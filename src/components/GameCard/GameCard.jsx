/* eslint-disable react/prop-types */
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router';
import { Calendar, Clock, DummyProfileImage, Location } from '../../assets';
import { convertTo12HourFormat, parseTimeStampForDateLongMonth, tournamentSkillLevelDefaults } from '../../utils/utlis';
import Button from '../Button/Button';
import ThunderboltIcon from '../ThunderboltIcon/ThunderboltIcon';

const GameCard = ({ game, disableHover = false, imageLoading = 'lazy' }) => {
  const navigate = useNavigate();
  let skillLevel = tournamentSkillLevelDefaults.findIndex((skill) => skill == game.skillLevel);

  return (
    <div className={`${!disableHover ? 'hover:shadow-2xl transition-shadow duration-500' : ''} w-full border border-f0f0f0 rounded-r-20 p-4 md:p-5 mt-[1px] max-h-[max-content]`}>
      <p className="capitalize font-author font-medium text-383838 text-2xl">{game.name}</p>

      <div className="flex items-center gap-2 mt-2">
        {skillLevel > 0 && (
          <div className="flex items-center gap-1">
            <ThunderboltIcon value={skillLevel} iconClassName="w-[10px] h-[15px] object-cover "/>
            <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70 capitalize">
              {game.skillLevel}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-nowrap items-center border-y border-dbe0fc justify-center mt-4">
        <div className="flex flex-nowrap items-center gap-1">
          <img src={Clock} alt="clock" className="w-auto h-[14px] object-cover" loading='lazy'/>
          <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
            {convertTo12HourFormat(game.time.startTime)} IST
          </p>
        </div>
        <div className="flex flex-nowrap items-center gap-1 border-x border-dbe0fc py-1 px-2 mx-3">
          <img src={Calendar} alt="Calendar" className="w-auto h-[14px] object-cover" loading='lazy'/>
          <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
            {parseTimeStampForDateLongMonth(game.date)}
          </p>
        </div>
        <div className="flex flex-nowrap items-center gap-1">
          <img src={Location} alt="Location" className="w-auto h-[17px]" loading='lazy'/>
          <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
            {game.gameLocation.address.city}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4">
        <div className="flex flex-row items-end justify-between gap-2">
          {game.creatorName && (
            <div className="flex flex-col items-center gap-1 justify-center">
              <p className="font-general font-medium text-383838 text-size-10 opacity-70">(Host)</p>
              <img
                src={game.creatorProfilePic ? game.creatorProfilePic : DummyProfileImage}
                alt="Profile Picture"
                className="w-10 h-10 rounded-full shadow aspect-square grid place-items-center"
                loading='lazy'
              />
              <p className="font-general font-medium text-383838 text-size-10 opacity-70 line-clamp-1 max-w-10">
                {game.creatorName}
              </p>
            </div>
          )}
          <div className="flex flex-col items-start justify-start gap-1">
            <div className="flex flex-row items-center justify-start">
              {game.players.filter(player => player.status == 'ACCEPTED').map((player, index) => {
                if (index > 2) return;
                return <img
                  key={nanoid()}
                  src={player?.playerDetails?.profilePic ? player?.playerDetails?.profilePic : DummyProfileImage}
                  alt="Profile Picture"
                  className={`${index > 0 ? '-ml-3.5' : ''} w-9 h-9 border-2 border-ffffff mb-0.5 rounded-full shadow aspect-square grid place-items-center`}
                  loading='lazy'
                />
              })}
            </div>
            <p className="font-general font-medium text-383838 text-size-10 opacity-70">{game.players.filter(player => player.status == 'ACCEPTED').length} / {game.maxPlayers} Players Joined</p>
          </div>
        </div>

        <Button
          onClick={() => navigate(`/games/${game.handle}`)}
          className="border border-black rounded-3xl font-general font-medium text-sm px-5 md:px-10 py-2 md:py-[11px] text-383838 cursor-pointer"
        >
          View Game
        </Button>
      </div>
    </div>
  );
};

export default GameCard;
