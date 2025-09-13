import React, { useEffect, useState } from 'react'
import { useGetAboutUs } from '../../hooks/AboutUsHooks';
import Loader from '../Loader/Loader';
import { nanoid } from 'nanoid';

const OurTeam = () => {
    const { data, isLoading, error } = useGetAboutUs({ sectionName: 'ourTeam' });
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
        <div className='bg-white w-full pt-[50px] px-[20px] md:px-[74px]'>
            <p className='font-author font-medium text-2xl text-383838 px-[15px] md:px-0 mb-7'>Meet the Team</p>
            <div className='flex flex-wrap items-start justify-between gap-y-5'>
                {sectionData.ourTeam.map((team) => {
                    return (
                        <div key={nanoid()} className='max-w-[48%] w-full'>
                            <div>
                                <img src={team?.image} alt="our-team" className='w-full h-auto object-cover' />
                            </div>
                            <p className='font-general font-medium text-sm md:text-base text-383838 text-center mt-3 capitalize'>{team?.name}</p>
                            <p className='font-general font-medium text-[12px] md:text-sm text-383838 opacity-70 text-center capitalize'>{team?.designation}</p>
                            <p className='font-general font-medium text-[12px] md:text-sm text-383838 opacity-70 text-center capitalize'>{`(${team?.details})`}</p>  
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OurTeam