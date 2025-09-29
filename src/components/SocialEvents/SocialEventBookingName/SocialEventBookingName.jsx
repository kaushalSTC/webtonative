import { useSelector } from 'react-redux';
import { useDeleteEventMutation } from '../../../hooks/SocialEventHooks';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import Loader from '../../Loader/Loader';
import { TrashBinIcon } from '../../../assets';

const SocialEventBookingName = ({ eventName = 'Social Event',  createDraftBookingError }) => {
  const player = useSelector((state) => state.player);
  const socialEventRegistration = useSelector((state) => state.socialEventRegistration);
  const { booking } = socialEventRegistration;

  const {
    mutate: deleteCategory,
    isPending: isCategoryDeleting,
    isError: isCategoryDeletingError,
    error: CategoryDeletingError,
  } = useDeleteEventMutation();

  const categoryDeleteHandler = () => {
    deleteCategory({
      playerId: player.id,
      bookingId: booking.bookingId,
      payload: {isCommunityRemoved: true}
    });
  };

  return (
    <div className="flex justify-between px-[36px] md:px-[88px] py-1.5 bg-f4f5ff w-full">

      {CategoryDeletingError ? (
        <ErrorMessage
          message={CategoryDeletingError}
          className="text-sm text-right text-red-400 font-general font-medium"
        ></ErrorMessage>
      ) : (
        <p className="text-383838 text-sm font-general font-medium">{eventName ? `Social Event: ${eventName}` : 'Social Event'}</p>
      )}

      {!createDraftBookingError && (
        isCategoryDeleting ? (
          <Loader size="sm" color="success " />
        ) : (
          <button onClick={() => categoryDeleteHandler()}>
            <img src={TrashBinIcon} alt="Delete Category " />
          </button>
        )
      )}

    </div>
  )
}

export default SocialEventBookingName;