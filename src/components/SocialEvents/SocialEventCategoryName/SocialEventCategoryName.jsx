import { useSelector } from 'react-redux';
import { useDeleteCategoryMutation } from '../../../hooks/SocialEventHooks';
import { useEffect, useState } from 'react';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import Loader from '../../Loader/Loader';
import { TrashBinIcon } from '../../../assets';

const SocialEventCategoryName = ({ category, createDraftBookingError }) => {
  const player = useSelector((state) => state.player);
  const socialEventRegistration = useSelector((state) => state.socialEventRegistration);
  const { booking } = socialEventRegistration;

  const [categoryIdToDelete, setcategoryIdToDelete] = useState('');
  const [categoryDeleteErrors, setCategoryDeleteErrors] = useState({});

  const deleteError = categoryDeleteErrors[category.categoryId];

  const {
    mutate: deleteCategory,
    isPending: isCategoryDeleting,
    isError: isCategoryDeletingError,
    error: CategoryDeletingError,
  } = useDeleteCategoryMutation();

  const categoryDeleteHandler = (category) => {
    setcategoryIdToDelete(category.categoryId);
    deleteCategory({
      playerId: player.id,
      bookingId: booking.bookingId,
      payload: {categoryId: category.categoryId,  isCommunityRemoved: false}
    });
  };

  useEffect(() => {
    if (isCategoryDeletingError) {
      setCategoryDeleteErrors((prev) => ({ ...prev, [categoryIdToDelete]: CategoryDeletingError.message }));
    }
  }, [isCategoryDeletingError, categoryIdToDelete, CategoryDeletingError]);


  return (
    <div className="flex justify-between px-[36px] md:px-[88px] py-1.5 bg-f4f5ff w-full">

      {deleteError ? (
        <ErrorMessage
          message={deleteError}
          className="text-sm text-right text-red-400 font-general font-medium"
        ></ErrorMessage>
      ) : (
        <p className="text-383838 text-sm font-general font-medium">{category.categoryName}</p>
      )}

      {!createDraftBookingError && (
        isCategoryDeleting ? (
          <Loader size="sm" color="success " />
        ) : (
          <button onClick={() => categoryDeleteHandler(category)}>
            <img src={TrashBinIcon} alt="Delete Category " />
          </button>
        )
      )}

    </div>
  )
}

export default SocialEventCategoryName;