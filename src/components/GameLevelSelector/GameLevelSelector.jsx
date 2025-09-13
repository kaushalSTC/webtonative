import { useEffect, useState } from "react"
import ThunderboltIcon from "../ThunderboltIcon/ThunderboltIcon"

const levels = [
    { id: 'beginner', label: "Beginner", icon: <ThunderboltIcon max={4} value={1} /> },
    { id: 'amateur', label: "Amateur", icon: <ThunderboltIcon max={4} value={2} /> },
    { id: 'intermediate', label: "Intermediate", icon: <ThunderboltIcon max={4} value={3} /> },
    { id: 'advanced', label: "Advanced", icon: <ThunderboltIcon max={4} value={4} /> },
]

const GameLevelSelector = ({ saveLevel, initialLevel }) => {
    const [selectedLevel, setSelectedLevel] = useState('')
    
    // Set initial level if provided
    useEffect(() => {
        if (initialLevel && !selectedLevel) {
            setSelectedLevel(initialLevel)
        }
    }, [initialLevel])
    
    const handleSelect = (level) => {
        setSelectedLevel(level)
        saveLevel(level)
    }

    return (
        <div className="flex gap-2 md:gap-2 flex-wrap ">
            {levels.map(({ id, label, icon }) => (
                <button 
                    key={id} 
                    className={`flex gap-2 items-center ${selectedLevel === id ? 'border-2 border-56b918 ' : 'border border-cecece '} cursor-pointer rounded-[20px] py-1 md:py-2 px-2 md:px-3 font-general font-medium text-sm text-383838`} 
                    onClick={() => handleSelect(id)} 
                >
                    <span>{icon}</span>
                    <span>{label}</span>
                </button>
            ))}
        </div>
    )
}

export default GameLevelSelector