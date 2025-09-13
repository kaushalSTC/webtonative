import { useEffect, useState } from 'react'
import { useGetAboutUs } from '../../hooks/AboutUsHooks';
import Loader from '../Loader/Loader';
import { nanoid } from 'nanoid';
import { Link } from 'react-router';

const PicklebayInTheNews = () => {
    const { data, isLoading, error } = useGetAboutUs({ sectionName: 'aboutUsNews' });
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
        <div className='bg-white w-full py-5 px-4 md:px-[74px]'>
            <p className='px-5 md:px-0 font-author font-medium text-2xl text-383838 capitalize mb-5'>{sectionData?.sectionTitle}</p>
            <div className='flex flex-col gap-5'>
                {sectionData?.aboutUsNews.map((slide) => {
                    return (
                        <Link to={slide?.link} target="_blank" className='flex items-center gap-3' key={nanoid()}>
                            <div className='w-full border border-f0f0f0 rounded-[20px] shadow-[0px_13px_16px_#A7A7A729] p-5'>
                                <p className='font-general font-medium text-sm md:text-[16px] text-383838 capitalize'>{slide?.title}</p>
                                <p className='font-general font-medium text-[14px] md:text-[14px] text-383838 capitalize'>{slide?.description}</p>
                                <p className='font-general font-medium text-[10px] md:text-[12px] text-383838 opacity-80 capitalize'>{slide?.date}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default PicklebayInTheNews