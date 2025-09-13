/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TournamentBookingFlowUpdateUserBg } from '../../../assets';
import { usePlayerMutaionForTournamentBooking } from '../../../hooks/TournamentHooks';
import { formatPhoneNumber } from '../../../utils/utlis';
import Button from '../../Button/Button';
import DatePicker from '../../DatePicker/DatePicker';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import GenderPicker from '../../GenderPicker/GenderPicker';

const firstLoginData = {
  page1: {
    formInputs: [
      {
        label: 'Full Name',
        placeholder: 'Full Name',
        type: 'text',
      },
      {
        label: 'Gender',
        placeholder: 'Gender',
        type: 'text',
      },
      {
        label: 'D.O.B.',
        placeholder: 'D.O.B.',
        type: 'text',
      },
    ],
  },
};

const UpdatePlayerDetails = () => {
  const player = useSelector((state) => state.player);
  const [name, setName] = useState(player.name && player.name !== 'Picklebay Player' ? player.name : '');
  const [gender, setGender] = useState(player.gender ? player.gender : '');
  const [dob, setDob] = useState(player.dob ? player.dob : '');
  const [isFormValid, setIsFormValid] = useState(false);

  const { mutate: updatePlayer, isSuccess: isPlayerUpdated, isPending: isPlayerUpdatePending, isError: isPlayerUpdateError, error: playerUpdateError} = usePlayerMutaionForTournamentBooking();
  const handleGender = (value) => {
    setGender(value);
  };

  useEffect(() => {
    if(name && gender && dob) {
      setIsFormValid(true);
    }
  }, [name, gender, dob]);

  const verifyDetailsHandler = () => {
    if(isFormValid) {
      let playerDetails = {
        name: name,
        dob: dob,
      }
      if(!player.gender) {
        playerDetails.gender = gender;
      }
      updatePlayer({
        playerID: player.id,
        player: playerDetails
      });
    }
  };

  return (
    <main className="w-full mx-auto bg-f2f2f2">
      <div className="max-w-[720px] mx-auto relative">
        <div className="flex flex-col gap-6 w-full bg-white relative">
          <div className="block w-full relative">
            <img src={TournamentBookingFlowUpdateUserBg} alt="" className="w-full h-auto "/>
            <div className="flex flex-col gap-0 items-start justify-start absolute top-1/2 left-9 transform -translate-y-1/2">
              <p className="text-sm md:text-base font-general font-medium text-383838">You&apos;re almost there!</p>
              <p className="text-xs md:text-sm font-general font-medium text-383838 opacity-70">
                Fill in the details below to proceed
              </p>
            </div>
          </div>

          <div className="flex flex-row item-center justify-between px-9">
            <p className="text-sm md:text-base font-general font-medium text-383838">Name</p>
            <p className="text-sm md:text-base font-general font-medium text-383838">{name ? name : player.name}</p>
          </div>
          <div className="mx-auto w-[85%] h-0 border border-f0f0f0"></div>

          <form className={`${isPlayerUpdated ? 'pb-48' : ''} flex flex-col gap-3 w-full px-9`}>
            <input
              readOnly={player.name && player.name !== 'Picklebay Player' ? true : false}
              className={`${player.name && player.name !== 'Picklebay Player' ? 'bg-[#F2F2F2]' : 'bg-[#ffffff]'}
                p-5 rounded-r-20 border border-[#F2F2F2] text-383838 placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              `}
              placeholder={firstLoginData.page1.formInputs[0].label}
              type={firstLoginData.page1.formInputs[0].type}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <div className="flex flex-row gap-3 w-full">
              <GenderPicker
                disabled={player.gender ? true : false}
                formInput={firstLoginData.page1.formInputs[1]}
                getValue={handleGender}
                dropDownClassName='absolute z-10 flex flex-col items-start gap-3 top-full left-0 mt-2 w-full rounded-r-20 bg-ffffff border border-[#F2F2F2] text-383838 focus:outline-hidden'
                className={`${player.gender ? 'bg-[#F2F2F2]' : 'bg-[#ffffff]'}
                w-full p-5 rounded-r-20  border border-[#F2F2F2] text-383838 placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                `}
              />
              <DatePicker
                disabled={player.dob ? true : false}
                getValue={(value) => setDob(value)}
                type={firstLoginData.page1.formInputs[2].type}
                placeholder={firstLoginData.page1.formInputs[2].label}
                containerClassName='w-1/2'
                className={`${player.dob ? 'bg-[#F2F2F2]' : 'bg-[#ffffff]'}
                  w-full p-5 rounded-r-20 border border-[#F2F2F2] text-383838 placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                `}
              />
            </div>

            <div className="flex p-5 rounded-r-20 bg-[#F2F2F2] border border-[#F2F2F2] text-383838 focus:outline-hidden">{formatPhoneNumber(player.phone)}</div>
            {isPlayerUpdateError && <ErrorMessage message={playerUpdateError.message} className="text-sm text-red-400 font-general font-medium mt-2 text-center"></ErrorMessage>}
          </form>
          {!isPlayerUpdated && <Button
              onClick={verifyDetailsHandler}
              isLoading={isPlayerUpdatePending}
              className={
                  `${isFormValid ? 'opacity-100 cursor-pointer' : 'opacity-70 cursor-not-allowed'}
                  mx-auto my-[10vh] w-auto inline-flex justify-center px-12 py-3.5 text-center rounded-full bg-383838 text-ffffff font-general font-medium text-base active:scale-[0.97]
              `}
            >Verify</Button>
          }
        </div>
      </div>
    </main>
  );
};

export default UpdatePlayerDetails;
