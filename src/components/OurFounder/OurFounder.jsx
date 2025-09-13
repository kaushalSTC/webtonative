import React, { useEffect, useState } from 'react'
import { useGetAboutUs } from '../../hooks/AboutUsHooks';
import Loader from '../Loader/Loader';

const OurFounder = () => {
    const { data, isLoading, error } = useGetAboutUs({ sectionName: 'ourFounder' });
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

    if (!sectionData || !sectionData.isVisible || !sectionData.image) {
        return null
    }
    return (
        <div>
            <img src={sectionData.image} alt="our-founder" className='w-full h-auto object-cover' />
        </div>
    )
}

export default OurFounder