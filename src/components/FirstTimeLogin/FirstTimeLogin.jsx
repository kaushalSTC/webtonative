import { AnimatePresence, motion } from 'motion/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { usePlayerMutaion } from '../../hooks/LoginHooks';
import { setFirstTimeLogin, setFirstTimeLoginPlayerInfoPage } from '../../store/reducers/player-slice';
import Button from '../Button/Button';
import DatePicker from '../DatePicker/DatePicker';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import GenderPicker from '../GenderPicker/GenderPicker';
import PlayerLevels from '../PlayerLevels/PlayerLevels';

const firstLoginData = {
  page1: {
    title: 'Oh hey! Heard you love playing Pickleball.',
    subTitle: 'Tell us a little more?',
    desclaimer: 'We use your information to customise your profile for a better experience.',
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
  page2: {
    title: 'Welcome,',
    subTitle: 'Tell us about your playing level?',
    desclaimer: 'We use your information to customise your profile for a better experience.',
    playerLevels: [
      {
        level: 1,
        title: 'Beginner',
        subTitle: 'I am exploring the sport',
      },
      {
        level: 2,
        title: 'Amateur',
        subTitle: 'I play sometimes',
      },
      {
        level: 3,
        title: 'Intermediate',
        subTitle: 'I play multiple times a week',
      },
      {
        level: 4,
        title: 'Advanced',
        subTitle: 'I’m a competitor driven by excellence',
      },
    ],
  },
};

const FirstTimeLogin = ({ staggerConatiner, staggerChildren, redirectionURL =  '/' }) => {
  const auth = useSelector((state) => state.auth);
  const player = useSelector((state) => state.player);
  const { mutate: updatePlayer, isSuccess: isPlayerUpdated, isPending: isPlayerUpdatePending, isError: isPlayerUpdateError, error: playerUpdateError} = usePlayerMutaion();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [level, setLevel] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPlayerUpdated && player.firstTimeLoginPlayerInfoPage === 1) {
      dispatch(setFirstTimeLoginPlayerInfoPage(2));
    } else if (isPlayerUpdated && player.firstTimeLoginPlayerInfoPage === 2) {
      skipHandler();
    }
  }, [isPlayerUpdated]);

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Mutations                                                                 │
    └─────────────────────────────────────────────────────────────────────────────┘
  */

  const skipHandler = () => {
    dispatch(setFirstTimeLogin(false));
    navigate(redirectionURL);
  };

  const setPlayerLevel = (value) => {
    setLevel(value);
  };

  const handleGender = (value) => {
    setGender(value);
  };

  const page1Handler = () => {
    if (name === '' && gender === '' && dob === '') {
      dispatch(setFirstTimeLogin(false));
      navigate(redirectionURL);
    } else {
      let dataObject = {}

      if (name !== '') {
        dataObject.name = name.trim().capitalize();
      }
      if (gender !== '') {
        dataObject.gender = gender.trim().toLowerCase();
      }
      if (dob !== '') {
        dataObject.dob = dob;
      }

      updatePlayer({
        playerID: player.id,
        player: dataObject
      });
    }
  };

  const page2Handler = () => {
    if (level === '') {
      dispatch(setFirstTimeLogin(false));
      navigate(redirectionURL);
    } else {
      updatePlayer({
        playerID: player.id,
        player: {
          skillLevel: level
        }
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div variants={staggerConatiner} initial="initial" animate="default" className="relative first-login-container flex flex-col items-start justify-between gap-16 h-full w-full">

        <motion.div variants={staggerChildren} className="absolute top-0 flex flex-row items-center gap-[6px]">
          {[...Array(2)].map((_, index) => {
            return <motion.button key={index} variants={staggerChildren} className={`rounded-full ${(index == (player.firstTimeLoginPlayerInfoPage - 1)) ? 'bg-abe400 w-[18px] h-[18px]' : 'bg-[#ffffff33] w-[10px] h-[10px]'}`} />
          })}
        </motion.div>

        <div className="flex flex-col items-start gap-3 mt-9">
          <motion.h2 variants={staggerChildren} className={`${player.firstTimeLoginPlayerInfoPage === 2 ? "text-[34px]" : "text-[44px]" } text-ffffff font-author font-medium leading-[1] text-left`}>
            { player.firstTimeLoginPlayerInfoPage === 1 ? `Oh hey! Heard you love playing Pickleball.` : player.firstTimeLoginPlayerInfoPage === 2 && `Welcome,` }
          </motion.h2>

          <motion.p variants={staggerChildren} className={`${player.firstTimeLoginPlayerInfoPage === 2 ? "text-[34px] font-author font-medium leading-[1]" : "font-general text-sm opacity-70" } text-left md:text-center text-ffffff `} >
            { player.firstTimeLoginPlayerInfoPage === 1 ? `Tell us a little more?` : player.firstTimeLoginPlayerInfoPage === 2 && player.name }
          </motion.p>
        </div>

        <div className="w-full block relative">
          <AnimatePresence>
            {
              player.firstTimeLoginPlayerInfoPage === 1 && <form>
                <div className="flex flex-col gap-3 w-full">
                  <motion.input
                    variants={staggerChildren}
                    className="p-5 rounded-r-20 bg-[#f8f8f81A] border border-[#F2F2F21A] text-ffffff placeholder:font-general placeholder:font-medium placeholder:text-ffffff placeholder:opacity-50 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder={firstLoginData.page1.formInputs[0].label}
                    type={firstLoginData.page1.formInputs[0].type}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <div className="flex flex-row gap-3 w-full">
                    <GenderPicker
                      staggerChildren={staggerChildren}
                      formInput={firstLoginData.page1.formInputs[1]}
                      getValue={handleGender}
                      dropDownClassName='absolute flex flex-col items-start gap-3 top-full left-0 mt-2 w-full rounded-r-20 bg-[#f8f8f81A] border border-[#F2F2F21A] text-ffffff backdrop-blur focus:outline-hidden'
                      className="w-full p-5 rounded-r-20 bg-[#f8f8f81A] border border-[#F2F2F21A] text-ffffff placeholder:font-general placeholder:font-medium placeholder:text-ffffff placeholder:opacity-50 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <DatePicker
                      staggerChildren={staggerChildren}
                      getValue={(value) => setDob(value)}
                      type={firstLoginData.page1.formInputs[2].type}
                      placeholder={firstLoginData.page1.formInputs[2].label}
                      className="w-full p-5 rounded-r-20 bg-[#f8f8f81A] border border-[#F2F2F21A] text-ffffff placeholder:font-general placeholder:font-medium placeholder:text-ffffff placeholder:opacity-50 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </form>
            }
            {
              player.firstTimeLoginPlayerInfoPage === 2 && <form>
                <PlayerLevels playerLevels={firstLoginData.page2.playerLevels} staggerConatiner={staggerConatiner} staggerChildren={staggerChildren} getValue={(value) => setPlayerLevel(value)} />
              </form>
            }
          </AnimatePresence>
          {isPlayerUpdateError && <ErrorMessage message={playerUpdateError.message} staggerChildren={staggerChildren}></ErrorMessage>}
        </div>

        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-row w-full items-center justify-between">
            {/* <motion.div variants={staggerChildren}>
              <Button
                onClick={skipHandler}
                className="flex flex-row font-general font-medium text-sm text-ffffff active:scale-[0.97] transition-transform capitalize underline"
              >
                Skip for now
              </Button>
            </motion.div> */}

            <motion.div variants={staggerChildren}>
              <Button
                isLoading={isPlayerUpdatePending}
                disabled={!name || !gender || !dob }
                onClick={player.firstTimeLoginPlayerInfoPage === 1 ? page1Handler : page2Handler }
                className="flex items-center justify-center shadow-2xl px-[45.6px] py-[18px] rounded-full bg-244CB4 text-ffffff font-general font-medium text-base active:scale-[0.97] transition-transform"
              >
                Continue
              </Button>
            </motion.div>
          </div>
          <motion.p
            variants={staggerChildren}
            className="font-general text-sm text-left md:text-center text-ffffff opacity-70"
          >
            {firstLoginData.page2.desclaimer}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

FirstTimeLogin.propTypes = {
  staggerConatiner: PropTypes.object,
  staggerChildren: PropTypes.object,
  redirectionURL: PropTypes.string,
};

export default FirstTimeLogin;
