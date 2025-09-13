import { debounce } from 'lodash';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { DefaultProfileImage, PartnerIcon, SearchIcon } from '../../assets';
import { useSearchPlayersQuery } from '../../hooks/PlayerHooks';
import useClickOutside from '../../hooks/UseClickOutside';

const GamePartnerSearch = ({handleInvitePlayer, isGameDatePast = false}) => {
  const [inputSearchQuery, setInputSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerObject, setPartnerObject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingPlayer, setIsChangingPlayer] = useState(false);
  const searchRef = useRef(null);
  const [showAddBtn, setShowAddBtn] = useState(false);

  const { data: searchedPlayers, isLoading: isSearching } = useSearchPlayersQuery(searchQuery);

  useClickOutside(searchRef, () => {
    setIsOpen(false);
  });

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const handlePlayerAdd = () => {
    handleInvitePlayer(partnerObject);
    setShowAddBtn(false);
    setInputSearchQuery('');
  }
  const handleInputChange = (e) => {
    // Only allow input changes if there's no verification error or if we're explicitly changing players
      const value = e.target.value;
      setInputSearchQuery(value);
      setPartnerObject(null);
      setShowAddBtn(false);
      if (value.trim()) {
        debouncedSearch(value);
        setInputSearchQuery(value);
        setIsOpen(true);
    }
  };

  const handleSuggestionClick = async (player) => {
    setInputSearchQuery(player.name);
    setIsOpen(false);
    setPartnerObject(player);
    setShowAddBtn(true);
  };
  // Determine if the input should be readonly
  const isInputReadOnly = isChangingPlayer;

  return (
    <>
      <div className={`flex w-full rounded-full border border-d2d2d2 p-[5px] ${isGameDatePast ? 'opacity-50 pointer-events-none' : ''}`} ref={searchRef}>
        <div className="relative flex flex-row w-full items-center justify-between gap-3">
          <div className="flex grow flex-row items-center gap-3">
            <div className="flex flex-row items-center justify-center bg-f2f2f2 rounded-full min-w-10 h-10 p-1">
              <img src={PartnerIcon} alt="Partner Icon" className="w-5 h-auto rounded-full"></img>
            </div>
            <div className="flex flex-row items-center gap-1 grow">
              <input
                className={`
                    ${isInputReadOnly ? 'bg-[#F2F2F2] border border-[#F2F2F2] text-383838' : ''}
                    w-full px-4 py-2 pl-2 text-383838 text-base font-general font-medium placeholder:text-sm placeholder:font-general placeholder:font-medium rounded-r-20 focus:border focus:border-none focus:outline-hidden
                  `}
                type="text"
                value={inputSearchQuery}
                placeholder={`Search players on Picklebay...`}
                onChange={handleInputChange}
                readOnly={isInputReadOnly}
              />
              {showAddBtn && (
                <button className='text-sm px-[10px] py-1 rounded-full bg-white text-383838 border border-383838 hover:bg-383838 hover:text-white' onClick={handlePlayerAdd}>Add</button>
              )}
              {!showAddBtn && (
                <img src={SearchIcon} alt="Search Icon" className="p-3 "/>
              )}
            </div>
          </div>

          {isOpen && (
            <div className="absolute w-[90%] left-1/2 -translate-x-1/2 bottom-[120%] z-[1] lg:mt-2 mb-2 lg:mb-0 bg-white border border-f0f0f0 rounded-r-20 shadow-lg max-h-64 overflow-y-auto">
              {isSearching && <p className="p-4 text-center text-383838 font-general font-medium text-sm opacity-70">Loading...</p>}
              {searchedPlayers?.length <= 0 && <p className="p-4 text-center text-383838 font-general font-medium text-sm opacity-70">No Players Found</p>}

              {searchedPlayers?.length > 0 && (
                <ul className="px-[18px]">
                  {searchedPlayers.map((player) => (
                    <li
                      key={nanoid()}
                      onClick={() => handleSuggestionClick(player)}
                      className="flex items-center gap-3 py-4 border-b border-b-f0f0f0 hover:bg-gray-100 cursor-pointer"
                    >
                      <img src={player.profilePic ? player.profilePic : DefaultProfileImage} alt="Profile Picture" className="w-10 h-10 rounded-full  object-cover"></img>
                      <p className="text-383838 text-sm font-general font-medium">{player.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GamePartnerSearch