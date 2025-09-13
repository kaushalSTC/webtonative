import React from 'react';
import { DummyCourtCard } from '../../assets';


function LayoutImageCard({ court, courtWidthCss = 'w-[300px]' }) {
    const courtImages = court;

    return (
        <>
            {courtImages ? (
                <div className=" flex flex-col items-center">
                    <div className={`rounded-2xl overflow-hidden ${courtWidthCss}`}>
                        <img
                            src={courtImages.url}
                            alt="court-image"
                            className={`w-full h-auto`}
                        />
                    </div>
                </div>
            ) : (
                <div className="min-w-[170px] flex flex-col items-center">
                    <div className="rounded-2xl overflow-hidden">
                        <img
                            src={DummyCourtCard}
                            alt="dummy-court-card"
                            className="w-[160px] h-[auto]"
                        />
                    </div>
                </div>
            )}
        </>
    );
}


export default LayoutImageCard