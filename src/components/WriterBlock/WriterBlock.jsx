
const WriterBlock = ({blogDetails}) => {
    console.log("check blog details", blogDetails);

    return(
        <div className='p-6 cardShadow rounded-[15px] mt-[50px]'>
            <div className="flex items-center gap-4">
                <div className="w-[61px] h-[61px]">
                    <img src={blogDetails?.writerImage } alt="Writer image" className="rounded-full "/>
                </div>
                <div className="text-[#383838] flex flex-col gap-1 justify-center">
                    <h1 className="text-[24px] font-general-medium leading-[20px]">{blogDetails?.writerName}</h1>
                    <p className="text-[12px] font-general flex gap-2">
                        {blogDetails?.writerDesignation &&
                        <span className="uppercase tracking-wide">{blogDetails?.writerDesignation}</span>
}
                      {blogDetails?.totalBlogs &&  <span className="tracking-wide">{blogDetails.totalBlogs} Articles</span>}
                    </p>
                </div>
            </div>
            <div className="text-[#383838] font-general-medium text-[14px] mt-2">
                <p>{blogDetails?.writerShortname}</p>
            </div>
        </div>
    )
}

export default WriterBlock;