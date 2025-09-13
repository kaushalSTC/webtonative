import React from 'react';

const TournamentNudge = ({ maxCount, totalCount, label = null }) => {
  if (maxCount && totalCount <= 0) return null;

  const difference = maxCount - totalCount;
  if(difference > 30) return null;

  return (
  <span className={`whitespace-nowrap mr-4 px-2 py-1 ${difference === 0 ? 'bg-gray-500' : 'bg-[#56B918]'} bg-opacity-10 text-white text-xs font-medium rounded-full`}>
    {label ? (
      <>
        {difference === 0 ? `No ${label} slots left !` : `${difference} ${label} slots left !`}
      </>
    ) : (
      <>
        {difference === 0 ? 'No slots left !' : `${difference} slots left !`}
      </>
    )}
  </span>
);
};

export default TournamentNudge;