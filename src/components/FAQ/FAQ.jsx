import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { nanoid } from 'nanoid';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaqMinus, FaqPlus } from '../../assets';

const FAQ = () => {
  

  const baseURL = import.meta.env.VITE_DEV_URL; // Access environment variable
  const [getFaqDatas, setgetFaqDatas] = useState({});

  const getFaqData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/public/homepage-sections?section=faqs`
      );
      setgetFaqDatas(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFaqData();
  }, []);

  const faqs =getFaqDatas?.data?.data[0]?.faqs;
 if (!faqs || faqs.length === 0) return null;
  return (
    faqs?.length > 0 &&
    <div className="bg-white max-w-[750px] mx-auto px-4 md:px-0">
      <h2 className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize opacity-70 md:opacity-100 mb-5 pl-6 md:pl-0">
        Frequently asked questions
      </h2>
      <dl>
        {faqs?.map((faq) => (
          <Disclosure
            key={nanoid()}
            as="div"
            className="group py-3 md:py-4 border border-f2f2f2 rounded-r-20 pl-5 mb-4 transition-shadow data-[open]:shadow-[0px_3px_4px_#0000001C]"
          >
            <dt>
              <DisclosureButton className="group flex w-full items-center justify-start gap-3.5 text-left text-gray-900 cursor-pointer">
                <span className="flex h-7 items-center">
                  <img src={FaqPlus} alt="minus" className="size-6 group-data-[open]:hidden" loading='lazy'/>
                  <img src={FaqMinus} alt="plus" className="size-6 group-not-data-[open]:hidden" loading='lazy'/>
                </span>
                <span className="font-general font-semibold text-383838 text-xs md:text-sm">{faq.question}</span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" className="mt-2 pr-12">
              <p className="font-general font-medium text-383838 text-xs md:text-sm opacity-[82] md:opacity-70">
                {faq.answer}
              </p>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </dl>
    </div>
  );
};

export default FAQ;
