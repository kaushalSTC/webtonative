import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader/Loader";
import StaticHeading from "../components/StaticPage/StaticHeading";

const StaticPage = () => {
  const { handle } = useParams();
  const fetchStaticData = async () => {
    const baseURL = import.meta.env.VITE_DEV_URL;
    const response = await axios.get(
      `${baseURL}/api/public/static-pages/${handle}`
    );
    return response.data.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: [handle],
    queryFn: fetchStaticData,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" color="loading "/>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-4 px-8 bg-red-50 text-red-700 font-semibold rounded shadow-md">
        Could not load content.
      </div>
    );
  }

  const content = data?.description;
  

  if (!content) {
    return (
      <div className="w-full bg-white px-9 md:px-20 py-10 pb-5 gap-[18px] flex flex-col mt-[10px]">
        <div className="text-center font-medium text-gray-700">
          No content available
        </div>
      </div>
    );
  }
  const pageType=data.pageType

  return (
    <div className="w-full lg:w-[70%] lg:m-auto bg-white px-6 md:px-16 py-10 pb-5 flex flex-col mt-[10px]">
      <StaticHeading pageType={pageType} />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default StaticPage;
