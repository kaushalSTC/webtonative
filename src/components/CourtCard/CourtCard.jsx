import React from 'react';
import { DummyCourtCard } from '../../assets';


function CourtCard({ court, courtWidthCss = 'w-[168px]' }) {
    const courtImages = court?.desktopBannerImages;

    const features = court?.features?.length > 0
    ? `(${court.features.join(', ')})`
    : '';

    return (
        <>
            {courtImages && courtImages.length > 0 ? (
                <div className=" flex flex-col items-center">
                    <div className={`rounded-2xl overflow-hidden ${courtWidthCss}`}>
                        <img
                            src={courtImages[0].url}
                            alt="court-image"
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="mt-2">
                        <p className="text-center font-medium font-general text-base text-1c0e0e capitalize max-md:text-[12px]">
                            {court.courtName || 'Court'}
                        </p>
                        <p className="text-center font-medium font-general text-base text-1c0e0e capitalize max-md:text-[12px]">
                            {features}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="min-w-[168px] flex flex-col items-center">
                    <div className="rounded-2xl overflow-hidden">
                        <img
                            src={DummyCourtCard}
                            alt="dummy-court-card"
                            className="w-[168px] h-[145px]"
                        />
                    </div>
                    <div className="mt-2">
                        <p className="text-center font-medium font-general text-base text-1c0e0e capitalize max-md:text-[12px]">
                            {court.courtName || 'Court'}
                        </p>
                        <p className="text-center font-medium font-general text-base text-1c0e0e capitalize max-md:text-[12px]">
                            {features}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}


export default CourtCard