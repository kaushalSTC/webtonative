import { useEffect, useState } from 'react';
import { useGetAboutUs } from '../../hooks/AboutUsHooks';
import Loader from '../Loader/Loader';
import { AboutGreenBannerBorder } from '../../assets';

const AboutUsGreenBanner = () => {
    const { data, isLoading, error } = useGetAboutUs({ sectionName: 'greenBanner' });
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

    if (!sectionData) {
        return null
    }


    return (
        <>
            <div className='w-full bg-56b918 py-12'>
                <div className='w-[294px] mx-auto'>
                    <p className='font-author font-medium text-[34px] text-white capitalize text-center leading-tight mb-2'>{sectionData?.heading}</p>
                    <p className='font-general font-medium text-f8f8f8 text-sm md:text-base text-center leading-tight'>{sectionData?.subHeading}</p>
                </div>
            </div>
            <div className='w-full bg-56b918 p-2 mt-[-3px]'>
                <div className='h-[1px] w-full bg-white mb-2'></div>
                <img src={AboutGreenBannerBorder} alt="about-us-green-banner-border" className='w-full h-auto object-cover' />
            </div>
        </>
    )
}

export default AboutUsGreenBanner