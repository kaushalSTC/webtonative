import { useState } from 'react'
import { ShareLink } from '../../assets'
import { RWebShare } from "react-web-share";

const ShareGame = ({playerName, isGameDatePast = false}) => {
    console.log(playerName, 'playerName');
    const currentUrl = window.location.href;
    const [isSharing, setIsSharing] = useState(false);
    
    // Create the message with HTML line breaks for better compatibility
    const shareMessage = `Hi, you've been invited for a Pickleball session by ${playerName}.%0A%0A

Confirm your participation by clicking the Link below.%0A%0A

Happy Dinking!!%0A%0A
Team Picklebay %0A%0A`;
    
    return (
        <div className={`flex items-center justify-start gap-3 bg-f2f2f2 px-2 py-2 rounded-[25px] mt-5 ${isGameDatePast ? 'opacity-50 pointer-events-none' : ''}`}>
            
            <RWebShare
                data={{ 
                    text: shareMessage, 
                    url: currentUrl, 
                    title: "Picklebay Invitation" 
                }}  
                onShareWindowClose={() => setIsSharing(false)}
                beforeOpen={() => setIsSharing(true)}
                disabled={isSharing}
                disableNative={true}
            >
                {/* The entire div should be clickable */}
                <div className="flex items-center cursor-pointer gap-2">
                    <div>
                        <img src={ShareLink} alt="Share Link" className='w-[50px] h-auto '/>
                    </div>
                    <p className='font-general font-medium text-sm md:text-base text-383838 opacity-70'>Share Game Link</p>
                </div>
            </RWebShare>
        </div>
    )
}

export default ShareGame