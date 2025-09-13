import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { RWebShare } from 'react-web-share';
import { CalendarIcon, ShareIcon } from '../../assets'
import { formatDate } from '../../utils/utlis.js'
import TournamentDetailsSkillLevel from '../../components/Tournament/TournamentDetailsSkillLevel/TournamentDetailsSkillLevel.jsx';

export default function BookingInfo({ booking }) {
  const [isSharing, setIsSharing] = useState(false);
  let tournament = booking?.tournament
  return (
    <>
      <div className="w-full bg-white px-9 md:px-20 py-10 pb-8 gap-2">
        {/*
          ┌─────────────────────────────────────────────────────────────────────────────┐
          │         Skill Level                                                         │
          └─────────────────────────────────────────────────────────────────────────────┘
        */}
        {tournament?.categories?.length > 0 && <TournamentDetailsSkillLevel categories={tournament?.categories}/>}


        <div className="flex flex-row items-center justify-between mb-3 md:mb-1">
          <h1 className="text-[34px] font-author font-medium text-383838 leading-8 tracking-normal">
            {tournament?.tournamentName}
          </h1>

          <div className="flex">
            <RWebShare data={{ text: '', url: location.href, title: '' }} onShareWindowClose={() => setIsSharing(false)} beforeOpen={() => setIsSharing(true)} disabled={isSharing}>
              <img src={ShareIcon} alt="share-icon" className="w-5 h-5 ml-auto" style={{ opacity: isSharing ? 0.5 : 1 }}/>
            </RWebShare>
          </div>
        </div>

        {/*
          ┌─────────────────────────────────────────────────────────────────────────────┐
          │       Tournament Duration                                                   │
          └─────────────────────────────────────────────────────────────────────────────┘
        */}
        <div className="flex flex-col gap-2">
          <p className="text-1c0e0eB3 text-[15px] font-general font-medium">Duration</p>
          <div className="flex flex-row gap-2">
            <img src={CalendarIcon} alt="" className='w-[11px] h-auto '/>
            <p className="text-383838 opacity-70 text-sm font-general font-medium">
              {tournament?.startDate && formatDate(tournament?.startDate, true, true, false)} - {tournament?.endDate && formatDate(tournament?.endDate, true, true, false)}
            </p>
          </div>
        </div>
      </div>

      {/*
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │       Registration Closing Date                                            │
        └─────────────────────────────────────────────────────────────────────────────┘
      */}
      <p className="font-general text-sm font-medium text-383838 bg-f4f5ff text-center p-2">Registration Closes on - {tournament?.bookingEndDate && formatDate(tournament?.bookingEndDate)}</p>

      {/*
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │       Description                                                           │
        └─────────────────────────────────────────────────────────────────────────────┘
      */}
      <div className="w-full bg-white px-9 md:px-20 py-10 pb-8 gap-2">
        <div className="prose max-w-none mx-auto">
          {tournament?.description && parse(tournament?.description)}
        </div>
      </div>
    </>
  );
};




