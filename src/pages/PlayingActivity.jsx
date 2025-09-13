import React from 'react'
import PlayingActivityTopBanner from '../components/PlayingActivityTopBanner/PlayingActivityTopBanner'
import UserDraftGames from '../components/UserDraftGames/UserDraftGames'
import GetPendingGameVerification from '../components/GetPendingGameVerification/GetPendingGameVerification'
import PlayingActivityListing from '../components/PlayingActivityListing/PlayingActivityListing'

const PlayingActivity = () => {
  return (
    <div className="main-container bg-f2f2f2">
      <div className="max-w-[720px] mx-auto px-0 w-full container bg-white pt-2">
        <PlayingActivityTopBanner />
        <UserDraftGames/>
        {/* Homepage section for non admins to verify scores */}
        {/* <GetPendingGameVerification/> */}
        <PlayingActivityListing/>
      </div>
    </div>
  )
}

export default PlayingActivity