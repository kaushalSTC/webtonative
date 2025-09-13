import { useNavigate } from "react-router";
import { usePublishGameScore, useUpdateGameScore } from "../../hooks/GameHooks";
import { createErrorToast, createToast } from "../../utils/utlis";

export const GameScorePublisher = ({ playerId, gameId, matches, format, targetApi, gameHandle, isDisabled }) => {
  const { mutate: publishScore, isLoading, isSuccess, isError } = usePublishGameScore();
  const { mutate: updateScore, isLoading: isUpdating, isSuccess: isScoreUpdated, isError: isScoreUpdateError } = useUpdateGameScore();
  const navigate = useNavigate();

  const handlePublish = () => {
    const scoreObj = {
      matches,
      format, // e.g. 'SE'
    };
    if (targetApi === 'publish') {
      publishScore({ playerId, gameHandle, scoreObj }, {
        onSuccess: () => {
          createToast('Game scores published successfully');
          setTimeout(() => {
            navigate(`/games/${gameHandle}/score/conformation`)
          }, 2000);
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to publish game scores';
          createErrorToast(errorMessage);
        }
      });
    } else if (targetApi === 'update') {
      updateScore({ playerId, gameHandle, scoreObj }, {
        onSuccess: () => {
          createToast('Game scores updated successfully');
          setTimeout(() => {
            navigate(`/games/${gameHandle}/score/conformation`)
          }, 2000);
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Failed to update game scores';
          createErrorToast(errorMessage);
        }
      });
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePublish}
        className={`py-5 bg-383838 text-fcfdff rounded-3xl w-full text-center font-general font-medium text-sm md:text-base ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading || isDisabled}
      >
        {
          targetApi === 'publish' && isLoading ? 'Publishing...' :
          targetApi === 'publish' ? 'Publish Score' :
          targetApi === 'update' && isUpdating ? 'Updating...' :
          targetApi === 'update' ? 'Update Score' :
          'Publish Score'
        }
      </button>

      {/* {isSuccess && <p className="text-green-600 mt-2">Published successfully!</p>}
      {isError && <p className="text-red-600 mt-2">Error occurred while publishing score.</p>} */}
    </div>
  );
};
