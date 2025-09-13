import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { SearchLightIcon } from '../../assets';
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from '../../constants';
import useClickOutside from '../../hooks/UseClickOutside';

const CountryCodeSelect = ({ selectedCode = DEFAULT_COUNTRY_CODE, getValue, selectedCodeColor = 'text-ffffff' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(selectedCode);
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
    setSearchQuery('');
    getValue(selectedCountryCode.code);
    setCountryCode(COUNTRY_CODES);
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredCodes = COUNTRY_CODES.filter((item) => item.country.toLowerCase().includes(query.toLowerCase()) || item.code.includes(query));
    if (query !== '') {
      setCountryCode(filteredCodes);
    } else {
      setCountryCode(COUNTRY_CODES);
    }
  }

  const handleSelect = (code) => {
    getValue(code);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedCountryCode(COUNTRY_CODES.find((item) => item.code === code));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-2 p-1 rounded-lg font-general text-sm ${selectedCodeColor} font-medium hover:bg-[#f8f8f81a] active:scale-[0.97] transition-transform ${isOpen ? 'bg-[#f8f8f81a]' :  'bg-transparent'}`}
        onClick={() => setIsOpen(!isOpen)}
        type='button'
      >
        {selectedCountryCode.code}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 backdrop-blur bg-[#2b3a82e6] rounded-lg shadow-lg overflow-hidden transition-all duration-200 opacity-100">
          <div className="p-2 border-b">
            <div className="relative active:scale-[0.97] transition-transform">
              <img src={ SearchLightIcon } alt="" className="absolute left-2 top-2.5 w-4 h-4"/>
              <input
                className="w-full pl-8 pr-8 py-2 text-sm bg-[#f8f8f81a] text-ffffff rounded-md focus:outline-hidden focus:border-blue-500 "
                type="text" value={searchQuery} placeholder="Search country or code"
                onChange={(e) => handleSearch(e.target.value)}
              />
              { searchQuery && <button type='button' onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5 active:scale-[0.97] transition-transform">
                  {/* <X className="w-4 h-4 text-gray-400 hover:text-gray-600 "/> */}
                </button>
              }
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-hide">
            {countryCode.map((item, index) => (
              <button key={item.code + index} onClick={() => handleSelect(item.code)} className="flex items-center gap-3 w-full px-3 py-1 hover:bg-[#191c2430] active:scale-[0.97] transition-colors">
                <p className="font-general text-sm text-ffffff text-right w-full max-w-13">{item.code}</p>
                <p className="font-general text-sm text-ffffff text-left">{item.country}</p>
              </button>
            ))}

            {countryCode.length === 0 && (
              <div className="px-4 py-3 text-sm font-general text-ffffff text-center">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

CountryCodeSelect.propTypes = {
  selectedCode: PropTypes.string,
  getValue: PropTypes.func,
};

export default CountryCodeSelect;
