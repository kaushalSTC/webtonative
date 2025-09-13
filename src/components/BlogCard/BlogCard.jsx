import { Link } from "react-router"
import { BlogListingImg } from "../../assets";
import parse from 'html-react-parser';


const BlogCard = ({ data }) => {
    const handle = data?.handle;
    return (
        <div className="rounded-[20px] hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <Link to={`/blogs/${handle}`} className='group'>
                <div className='aspect-372/205 overflow-hidden w-full rounded-tl-[20px] rounded-tr-[20px]'>
                    <img src={data?.featureImage || BlogListingImg } alt="journal-card-img" className="w-full h-full object-cover "/>
                </div>
                <div className='p-5 border border-f0f0f0 rounded-bl-[20px] rounded-br-[20px] bg-white'>
                    <p className='font-general font-regular md:font-medium text-383838 text-[10px] md:text-xs'>Blog</p>
                    <p className='font-general font-semibold text-383838 text-sm md:text-base line-clamp-1'>{data?.blogName}</p>
                    <div className='font-general font-medium text-383838 text-xs md:text-sm line-clamp-2 md:line-clamp-3'>
                        {parse(data?.description)}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default BlogCard