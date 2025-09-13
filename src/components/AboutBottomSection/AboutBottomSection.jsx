import { useEffect, useState } from "react";
import { useGetAboutUs } from "../../hooks/AboutUsHooks";
import Loader from "../Loader/Loader";
import { AboutBottomBallImg } from "../../assets";
import { NavLink } from "react-router";

const AboutBottomSection = () => {
    const { data, isLoading, error } = useGetAboutUs({ sectionName: 'bottomAboutUsSection' });
    const [sectionData, setSectionData] = useState(null);

    useEffect(() => {
        if (data) {
            setSectionData(data);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className='bg-white w-full pt-13 pb-10 px-4 md:px-[50px] flex justify-center items-center'>
                <Loader/>
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
        <div className="bg-white w-full flex flex-col items-center py-10">
            <div className="max-w-[100px]">
                <img src={sectionData.images || AboutBottomBallImg} alt="about-bottom-section" className="w-full h-auto object-cover" />
            </div>
            <p className="font-author font-medium text-[34px] text-383838 capitalize leading-none opacity-70">{sectionData?.heading}</p>
            <p className="font-general font-medium text-sm md:text-base text-383838 capitalize leading-none opacity-80 my-2">{sectionData?.subHeading}</p> 
            <NavLink to={'/pages/contactUs'} className='font-general font-medium text-[12px] md:text-sm text-244cb4 capitalize underline'>{sectionData?.linkText}</NavLink>
        </div>
    )
}

export default AboutBottomSection