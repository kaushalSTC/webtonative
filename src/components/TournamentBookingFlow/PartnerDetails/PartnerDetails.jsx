/* eslint-disable react/prop-types */
import AddPartnerManually from '../AddPartnerManually/AddPartnerManually';
import PartnerSearch from '../PartnerSearch/PartnerSearch';
import TournamentCatgoryPlayerInfo from '../TournamentDraftBooking/TournamentCategoryPlayerInfo/TournamentCatgoryPlayerInfo';

const PartnerDetails = ({ category }) => {
  if (category.partnerDetails) return <TournamentCatgoryPlayerInfo player={category.partnerDetails}></TournamentCatgoryPlayerInfo>;

  return (
    <>
      <PartnerSearch categoryId={category.categoryId}></PartnerSearch>
      <AddPartnerManually categoryId={category.categoryId}></AddPartnerManually>
    </>
  );
};

export default PartnerDetails;
