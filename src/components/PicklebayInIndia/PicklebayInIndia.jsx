import React, { useEffect, useState } from 'react'
import { useGetAboutUs } from '../../hooks/AboutUsHooks';
import Loader from '../Loader/Loader';
import { nanoid } from 'nanoid';

const PicklebayInIndia = () => {
    const { data, isLoading, error } = useGetAboutUs({ sectionName: 'picklebayInIndia' });
    const [sectionData, setSectionData] = useState(null);

    useEffect(() => {
        if (data) {
            setSectionData(data);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className='bg-white w-full pt-13 pb-10 px-4 md:px-[50px] flex justify-center items-center'>
                <Loader />
            </div>
        );
    }

    if (error) {
        return null;
    }

    if (!sectionData || !sectionData.isVisible) {
        return null
    }
    return (
        <div className='bg-white w-full py-4 md:py-10 px-[35px] md:px-[74px]'>
            <div className='flex items-start justify-between flex-col md:flex-row gap-3 md:gap-0    '>
                <p className='font-author font-medium text-2xl md:text-[34px] text-383838 max-w-[100%] md:max-w-[155px] capitalize leading-none '>{sectionData?.sectionTitle}</p>
                <div className='flex items-center flex-wrap max-w-[100%] md:max-w-[360px] gap-[10px] md:gap-[30px]'>
                    {sectionData?.picklebayInIndia.map((slide) => {
                        return (
                            <div className='flex-none w-[22%] md:w-[32%] max-w-[90px] border border-f2f2f2 rounded-[10px] p-2' key={nanoid()}>
                                <img src={slide?.image} alt="picklebay-in-india" className='w-full h-auto object-cover' />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PicklebayInIndia