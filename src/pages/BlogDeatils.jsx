import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
import WriterBlock from "../components/WriterBlock/WriterBlock";
import BlogDetailsJournal from "../components/BlogDetailsJournal/BlogDetailsJournal";
import parse from "html-react-parser";
import { useBlogDetail } from "../hooks/BlogHooks";
import Loader from "../components/Loader/Loader";
import { RWebShare } from "react-web-share";
import { ShareIcon } from "../assets";
import { Helmet } from "react-helmet-async";
const BlogDetails = () => {
  const { handle } = useParams();
  const { data, isLoading, isError, error } = useBlogDetail({ handle });
  const [isSharing, setIsSharing] = useState(false);

  function formatDate(date) {
    if (!date) return "";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-GB", options);
  }

  // Add custom styles to ensure links are underlined
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .blog-content a {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Use the parsed HTML safely
  const renderDescription = () => {
    if (!data?.description) return null;

    const sanitizedHtml = DOMPurify.sanitize(data.description, {
      ADD_ATTR: ["target", "rel"], // Preserve target and rel attributes for links
    });
    return <div className="blog-content">{parse(sanitizedHtml)}</div>;
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader size="lg" color="loading " />
      </div>
    );
  }

  if (isError || data.length === 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h3>Something went wrong</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h3>Something went wrong</h3>
      </div>
    );
  }
  const canonicalUrl = import.meta.env.VITE_CANONICAL_URL;
  return (
    <>
      <Helmet>
        <title>
          {data?.blogName
            ? `${data.blogName} | Picklebay`
            : "Picklebay - Blog Details"}
        </title>
        <meta name="description" content={data?.description} />
        <link rel="canonical" href={`${canonicalUrl}/blogs/${handle}`} />

        <meta
          property="og:title"
          content={data?.blogName || "Picklebay - Discover Pickleball Blogs"}
        />
        <meta
          property="og:description"
          content={data?.description || "Explore top pickleball blogs"}
        />
        <meta property="og:image" content="/images/logo-light.svg" />
        <meta property="og:url" content={`${canonicalUrl}/blogs/${handle}`} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={data?.blogName || "Picklebay - Discover Pickleball Blogs"}
        />
        <meta
          name="twitter:description"
          content={data?.description || "Explore top pickleball blogs"}
        />
        <meta name="twitter:image" content="/images/logo-light.svg" />
      </Helmet>
      <div className="bg-gray-100 min-h-screen flex justify-center p-4">
        <div className="max-w-3xl w-full">
          <article className="bg-white px-[20px] py-[30px] md:p-6 rounded-lg shadow-md">
            <h1
              className="text-[32px] leading-[34px] font-author font-medium text-[#383838] opacity-100 mt-2 sm:text-[36px] sm:leading-[40px] md:text-[44px] md:leading-[46px] max-w-full md:max-w-[766px]"
              style={{ textAlign: "left" }}
            >
              {data?.blogName}
            </h1>
            <div className="flex justify-between items-center">
              <div className="flex justify-between text-[16px] leading-[22px] font-medium font-general text-[#1C0E0EB3] capitalize opacity-100 mt-10">
                <span>Published: {formatDate(data?.createdAt)}</span>
              </div>
              <div className="flex justify-between cursor-pointer text-[16px] leading-[22px] font-medium font-general text-[#1C0E0EB3] capitalize opacity-100 mt-10">
                <RWebShare
                  data={{ text: "", url: location.href, title: "" }}
                  onShareWindowClose={() => setIsSharing(false)}
                  beforeOpen={() => setIsSharing(true)}
                  disabled={isSharing}
                >
                  <img
                    src={ShareIcon}
                    alt="share-icon"
                    className="w-5 h-5 ml-auto"
                    style={{ opacity: isSharing ? 0.5 : 1 }}
                  />
                </RWebShare>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-start gap-x-2 gap-y-2 mt-10 mb-10">
              {data?.tag?.length > 0
                ? data.tag.map((tag, index) => (
                    <span
                      key={index}
                      className="font-general bg-gray-200 text-[12px] leading-[16px] uppercase tracking-normal text-[#383838] px-4 py-2 rounded-full whitespace-nowrap font-medium"
                    >
                      {tag}
                    </span>
                  ))
                : null}
            </div>

            {/* Image */}
            {data?.featureImage && (
              <div className="mt-4">
                <img
                  src={data.featureImage}
                  alt={data.blogName || "Blog feature image"}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="mt-4 text-[#383838] font-general font-medium text-[14px] blog_detail_Page">
              {renderDescription()}
            </div>

            <WriterBlock blogDetails={data} />
            <BlogDetailsJournal />
          </article>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
