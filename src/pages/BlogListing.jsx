import { useBlogListing } from "../hooks/BlogHooks";
import Loader from "../components/Loader/Loader";
import BlogCard from "../components/BlogCard/BlogCard";

const BlogListing = () => {
  const { data, isLoading, isError, error } = useBlogListing();

  if(isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader size="lg" color="loading "/>
      </div>
    );
  }

  if(isError || data.length === 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h3>Something went wrong</h3>
      </div>
    );
  }

  if(error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h3>Something went wrong</h3>
      </div>
    );
  }


  return (
    
    <div className="container mx-auto px-4 py-8">
     <h2 className="md:text-[40px] text-[30px] font-medium text-center mb-[30px] mt-[10px] md:mb-[40px] md:mt-[30px]">Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((blog) => (
          blog?.isVisible && blog?.description !== '<html></html>' && <BlogCard key={blog?._id} data={blog} /> 
        ))}
      </div>
    </div>
  );
};

export default BlogListing;
