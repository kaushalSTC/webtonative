import React from 'react'
import SocialeventsPartnerSearch from '../SocialeventsPartnerSearch/SocialeventsPartnerSearch'
import TournamentCatgoryPlayerInfo from '../../TournamentBookingFlow/TournamentDraftBooking/TournamentCategoryPlayerInfo/TournamentCatgoryPlayerInfo';
import AddSocialEventPartnerManually from '../AddSocialEventPartnerManually/AddSocialEventPartnerManually';

const SocialEventsPartnerDetails = ({ category }) => {
  if (category.partnerDetails) return <TournamentCatgoryPlayerInfo player={category.partnerDetails}></TournamentCatgoryPlayerInfo>;
  return (
    <>
      <SocialeventsPartnerSearch categoryId={category.categoryId}></SocialeventsPartnerSearch>
      <AddSocialEventPartnerManually categoryId={category.categoryId}></AddSocialEventPartnerManually>
    </>
  )
}

export default SocialEventsPartnerDetails