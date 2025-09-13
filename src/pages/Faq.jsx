import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import parse from "html-react-parser";
import { AnimatePresence, easeOut, motion } from "motion/react";
import { Fragment } from "react";
import Loader from "../components/Loader/Loader";
import { Helmet } from "react-helmet";

// Helper function to decode HTML entities
const decodeHtmlEntities = (html) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
};
const generateFaqSchema = (sections) => {
  const mainEntity = [];
  for (let i = 0; i < sections.length; i += 2) {
    const question = sections[i]?.trim();
    const answer = sections[i + 1]?.trim().replace(/<\/?[^>]+(>|$)/g, "");
    if (question && answer) {
      mainEntity.push({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
};
const Faq = () => {
  const fetchFaqData = async () => {
    const baseURL = import.meta.env.VITE_DEV_URL;
    const response = await axios.get(
      `${baseURL}/api/public/static-pages/helpFaqs`
    );
    return response.data.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["faq"],
    queryFn: fetchFaqData,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" color="loading" />
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

  // Decode HTML entities before processing
  const faqContent = data?.description ? decodeHtmlEntities(data.description) : "";

  if (!faqContent) {
    return (
      <motion.div className="w-full bg-white px-9 md:px-20 py-10 pb-5 gap-[18px] flex flex-col mt-[10px]">
        <div className="text-center font-medium text-gray-700">
          No content available
        </div>
      </motion.div>
    );
  }

  const sections = faqContent
    .split(/<h3>(.*?)<\/h3>/g)
    .filter((item) => item.trim() !== "");
    const faqSchema = generateFaqSchema(sections);
    const canonicalUrl = import.meta.env.VITE_CANONICAL_URL;
  return (
    <>
     <Helmet>
     <title>Picklebay - FAQ page</title> 
     <meta name="description" content="Help & FAQ for Picklebay. Your one-stop destination for everything pickleball." />
     <link rel="canonical" href={`${canonicalUrl}/pages/faq`} />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <motion.div
        layout
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.2, ease: easeOut }}
        className="w-full lg:w-[50%] 2xl:w-[40%] lg:m-auto bg-white px-6 md:px-16 py-10 pb-5 gap-[18px] flex flex-col mt-[10px]"
      >
        <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">
          {data?.pageTitle ? decodeHtmlEntities(data.pageTitle) : "Frequently Asked Questions"}
        </h1>
        {sections.length === 0 ? (
          <div className="text-center font-medium text-gray-700">
            No FAQ content available
          </div>
        ) : (
          sections.map((content, index) => {
            if (index % 2 === 0) {
              const title = content.trim();
              const panelContent = sections[index + 1] || "";

              return (
                <Disclosure key={index} as="div" className="w-full mb-4">
                  {({ open }) => (
                    <>
                      <DisclosureButton
                        className={`w-full py-4 group text-left flex items-center border-2 border-gray-200 ${open ? "rounded-t-4xl" : "rounded-4xl"
                          } transition-all duration-300 cursor-pointer justify-start gap-3 px-4`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-6 h-6 transform transition-transform duration-300 ${open ? "rotate-45" : "rotate-0"
                            }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>

                        <h2 className="font-medium text-gray-600 capitalize">
                          {title}
                        </h2>
                      </DisclosureButton>
                      <AnimatePresence>
                        {open && (
                          <DisclosurePanel static as={Fragment}>
                            <motion.div
                              initial={{ opacity: 0, y: -24 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -24 }}
                              transition={{ duration: 0.2, ease: easeOut }}
                              className="py-4 px-[52px] rounded-b-4xl border-2 border-t-0 border-gray-200"
                            >
                              <div className="prose max-w-none mx-auto">
                                {parse(panelContent)}
                              </div>
                            </motion.div>
                          </DisclosurePanel>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </Disclosure>
              );
            }
            return null;
          })
        )}
      </motion.div>
    </>
  );
};

export default Faq;