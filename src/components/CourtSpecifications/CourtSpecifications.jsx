import DOMPurify from "dompurify";

function CourtSpecifications({ data }) {

    const Specifications = data?.data?.description;
    return (
        <div>
            <div className='w-full h-[10px] bg-f2f2f2 my-7 md:my-12'></div>
            <div className='px-[35px] md:px-12 pb-7 md:pb-10'>
                <div className="font-general font-medium text-sm md:text-base text-383838 ">
                    <p className="font-medium font-general text-base text-1c0e0eb3 mb-4 md:mb-6 max-md:text-sm">
                        Court Specifications
                    </p>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(Specifications),
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CourtSpecifications