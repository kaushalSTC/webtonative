import { useState } from "react"

const playerNumbers = [2, 3, 4, 5, 6]

const PlayerNumberSelector = ({ savePlayerNumber, initialNumber }) => {
    const [selectedPlayerNumber, setSelectedPlayerNumber] = useState()
    if(initialNumber && !selectedPlayerNumber){
        setSelectedPlayerNumber(initialNumber)
    }
    const handlePlayerNumberSelect = (number) => {
        setSelectedPlayerNumber(number)
        savePlayerNumber(number)
    }
    

  return (
    <div className="flex gap-3 flex-wrap">
        {playerNumbers.map((number) => (
            <button 
            key={number} 
            className=
            {`flex gap-2 items-center ${selectedPlayerNumber === number ? 'border-2 border-56b918 ' : 'border border-cecece '} cursor-pointer rounded-[20px] font-general font-medium text-[20px] md:text-2xl text-383838 px-4 md:px-6 py-[10px] md:py-4`}
            onClick={() => handlePlayerNumberSelect(number)}
            >
                {number}
            </button>
        ))}
    </div>
  )
}

export default PlayerNumberSelector