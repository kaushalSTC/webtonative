
const GameScoreInput = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="00"
    value={value}
    onChange={(e) => {
      const val = e.target.value;
      if (/^\d*$/.test(val)) {
        onChange(val);
      }
    }}
    className="text-center py-4 md:py-7 px-5 md:px-7 placeholder:font-general placeholder:text-1c0e0eb3 placeholder:opacity-45 placeholder:text-2xl text-2xl text-383838 font-general font-medium border border-707070 rounded-3xl max-w-[72px] md:max-w-[90px]"
  />
);

export default GameScoreInput;
