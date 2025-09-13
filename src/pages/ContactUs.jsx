import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { InviteSend, InviteSendIcon, OrganizerDefaultImgae } from '../assets';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { createErrorToast, createToast } from '../utils/utlis';
import Loader from '../components/Loader/Loader';
import { useSelector } from 'react-redux';
import Popup from '../components/Popup/Popup';
import { motion } from 'motion/react';
import { NavLink } from 'react-router';

const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "US" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+81", name: "Japan" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+39", name: "Italy" },
  { code: "+86", name: "China" },
];

const purpose = [
  { id: 1, name: 'Venue Listing' },
  { id: 2, name: 'Tournament and Leagues' },
  { id: 3, name: 'Infrastructure' },
  { id: 4, name: 'Facility Management' },
  { id: 5, name: 'Picklebay Retreats' },
  { id: 6, name: 'Sponsorships and Partnerships' },
  { id: 7, name: 'Others' },
];

const ContactUs = () => {
  const userLoaction = useSelector((state) => state.location.city);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    pinCode: '',
    email: '',
    countryCode: '+91',
    phoneNumber: '',
    purpose: purpose[3],
    message: ''
  });

  useEffect(() => {
    if(userLoaction){
      setFormData(prev => ({...prev, city: userLoaction}))
    }
  }, [userLoaction])

  const [errors, setErrors] = useState({
    fullName: false,
    city: false,
    pinCode: false,
    email: false,
    phoneNumber: false
  });

  const [loading, setLoading] = useState(false); // Add loading state

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName': return value.trim().length >= 2;
      case 'city': return value.trim().length >= 2;
      case 'pinCode': return /^\d{6}$/.test(value);
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phoneNumber': return /^\d{10}$/.test(value);
      default: return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name !== 'message' && name !== 'purpose' && name !== 'countryCode') {
      setErrors(prev => ({ ...prev, [name]: !validateField(name, value) }));
    }
  };

  const handlePurposeChange = (selected) => {
    setFormData(prev => ({ ...prev, purpose: selected }));
  };

  const isFormValid = () => {
    return ['fullName', 'city', 'pinCode', 'email', 'phoneNumber'].every(field => 
      validateField(field, formData[field]) && formData[field].trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    const newErrors = {
      fullName: !validateField('fullName', formData.fullName),
      city: !validateField('city', formData.city),
      pinCode: !validateField('pinCode', formData.pinCode),
      email: !validateField('email', formData.email),
      phoneNumber: !validateField('phoneNumber', formData.phoneNumber)
    };
    setErrors(newErrors);

    if (isFormValid()) {
      const sheetUrl = import.meta.env.VITE_CONTACT_US_SHEET_URL;
      try {
        const response = await fetch(`${sheetUrl}`, {
          method: 'POST',
          body: JSON.stringify({
            fullName: formData.fullName,
            city: formData.city,
            pinCode: formData.pinCode,
            email: formData.email,
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber,
            purpose: formData.purpose.name,
            message: formData.message,
            date: new Date().toISOString().split('T')[0]
          })
        });

        if (response.ok) {
          createToast('Form submitted successfully!');
          setFormData({
            fullName: '',
            city: '',
            pinCode: '',
            email: '',
            countryCode: '+91',
            phoneNumber: '',
            purpose: purpose[3],
            message: ''
          });
          setErrors({
            fullName: false,
            city: false,
            pinCode: false,
            email: false,
            phoneNumber: false
          });
          setIsOpen(true);
        } else {
          createErrorToast('Failed to submit form. Please try again.');
        }
      } catch (error) {
        console.error('Submission error:', error);
        createErrorToast('An error occurred. Please try again.');
      }
    } else {
      createErrorToast('Please fill all required fields correctly.');
    }
    
    setLoading(false); // Hide loader after completion
  };

  const handleViewOpen = (state) => {
    setIsOpen(state);
  }

  return (
    <div className='bg-f2f2f2'>
      <form onSubmit={handleSubmit} className='px-4 md:px-[74px] bg-f4f5ff max-w-[720px] mx-auto pt-9 h-full pb-10 md:pb-30'>
        {/* Logo */}
        <div className='mb-5 px-5 md:px-0'>
          <img src={OrganizerDefaultImgae} alt="picklebay logo" className='w-[40px] md:w-[60px] h-[40px] md:h-[60px]' />
        </div>
        <p className='font-author font-medium text-2xl md:text-[34px] text-383838 px-5 md:px-0 mb-5'>Contact Us</p>
        <div className='flex items-center justify-between mb-[35px] md:mb-[50px] px-5 md:px-0'>
          <p className='font-general font-medium text-base text-1c0e0eb3'>E-Mail</p>
          <p className='email-access font-general font-medium text-sm text-244cb4'>connect@picklebay.com</p>
        </div>
        <div className='w-full h-[1px] bg-383838 opacity-50 mb-6'></div>
        <p className='font-author font-medium text-2xl text-383838 capitalize pl-5 mb-5'>Connect with us</p>
        <div className='bg-white w-full rounded-[20px] p-5 shadow-[0px_13px_16px_#A7A7A729]'>
          {/* Name */}
          <div>
            <label htmlFor="fullName" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">Full Name *</label>
            <div className="mt-2 md:mt-5">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name..."
                className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm 
                  ${errors.fullName ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">Please enter a valid name</p>}
            </div>
          </div>

          {/* City and Pincode */}
          <div className='flex gap-2 mt-5 md:mt-6'>
            <div className='w-1/2'>
              <label htmlFor="city" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">City *</label>
              <div className="mt-2 md:mt-5">
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm
                    ${errors.city ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">Please enter a valid city</p>}
              </div>
            </div>
            <div className='w-1/2'>
              <label htmlFor="pinCode" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">Pin Code *</label>
              <div className="mt-2 md:mt-5">
                <input
                  id="pinCode"
                  name="pinCode"
                  type="text"
                  maxLength={6}
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="Pin-Code"
                  className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm
                    ${errors.pinCode ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                />
                {errors.pinCode && <p className="text-red-500 text-xs mt-1">Please enter a valid 6-digit pin code</p>}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className='mt-5 md:mt-6'>
            <p className='font-general font-medium text-sm text-1c0e0eb3'>Contact Details *</p>
            <div className='flex-col flex gap-2 mt-2 md:mt-5 mb-2'>
              <label htmlFor="email" className="ml-px pl-2 font-general font-medium text-sm text-1c0e0eb3">Email *</label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm
                    ${errors.email ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">Please enter a valid email</p>}
              </div>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="font-general font-medium text-sm text-1c0e0eb3">
                Phone number *
              </label>
              <div>
                <div className="flex gap-2 rounded-md bg-white">
                  <div className="grid shrink-0 grid-cols-1 focus-within:relative border border-f2f2f2 rounded-[20px]">
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={(e) => setFormData(prev => ({...prev, countryCode: e.target.value}))}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    maxLength={10}
                    type="text"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone"
                    className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm
                      ${errors.phoneNumber ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-red`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit phone number</p>}
              </div>
            </div>
          </div>

          {/* Purpose dropdown */}
          <div className='mt-5 md:mt-6'>
            <Listbox value={formData.purpose} onChange={handlePurposeChange}>
              <Label className="block font-general font-medium text-sm text-1c0e0eb3">Purpose *</Label>
              <div className="relative mt-2">
                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 sm:text-sm/6 border border-f2f2f2">
                  <span className="col-start-1 row-start-1 truncate pr-6">{formData.purpose.name}</span>
                  <ChevronUpDownIcon
                    aria-hidden="true"
                    className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </ListboxButton>

                <ListboxOptions
                  transition
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                >
                  {purpose.map((item) => (
                    <ListboxOption
                      key={item.id}
                      value={item}
                      className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                    >
                      <span className="block truncate font-normal group-data-selected:font-semibold">{item.name}</span>

                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                        <CheckIcon aria-hidden="true" className="size-5" />
                      </span>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          {/* Message textarea */}
          <div className='mt-5 md:mt-6'>
            <label htmlFor="message" className="font-general font-medium text-sm text-1c0e0eb3">
              Message
            </label>
            <div className="mt-2">
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="block w-full border border-f2f2f2 rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm"
                placeholder='Send us your query...'
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end mt-5'>
            <button 
              type="submit"
              disabled={!isFormValid() || loading}
              className={`rounded-[25px] py-2 px-4 font-general font-medium text-sm text-ffffff flex items-center gap-2
                ${isFormValid() && !loading 
                  ? 'bg-383838 hover:bg-gray-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {loading ? <Loader size="sm" color="white" /> : 'Submit'}
            </button>
          </div>
        </div>
      </form>
      
      <Popup isOpen={isOpen} className='bg-[#0000007a] inset-0 z-20 fixed grid place-items-center' handleViewOpen={handleViewOpen}>
          <motion.div transition={{ delay: 0, duration: 0.4 }}
              initial={{ opacity: 0, x: '50px', y: 0 }}
              animate={{ opacity: 1, x: '0px', y: 0 }}
              exit={{ opacity: 0, x: '0px', y: '50px' }} className="relative bg-ffffff w-full max-w-[318px] md:max-w-[400px] rounded-[30px]" onClick={(e) => e.stopPropagation()}>
              <div className='rounded-[20px] overflow-hidden'>
                  <div className='relative flex items-center justify-center'>
                      <img src={InviteSend} alt="Invite Send" className="w-full h-auto inline-block " />
                      <img src={InviteSendIcon} alt="Invite Send Icon" className="w-full max-w-[67px] h-auto block absolute top-[37px] md:top-[47px]" />
                  </div>
                  <div className='h-[200px] flex items-center justify-center flex-col gap-3'>
                      <p className='font-general font-medium text-383838 text-[20px]'>Sent Successfully</p>
                      <p className='max-w-[352px] text-center font-general font-medium text-xs md:text-sm text-383838 opacity-70'>Your form has been submitted. A Picklebay associate will reach out to you shortly.</p>
                      <NavLink to={'/'} className="font-medium text-base font-general text-244cb4 underline">Back To Homepage</NavLink>
                  </div>
              </div>
          </motion.div>
      </Popup>
    </div>
  )
}

export default ContactUs