import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { InviteSend, InviteSendIcon } from '../../assets';
import { createErrorToast, createToast } from '../../utils/utlis';
import Loader from '../Loader/Loader';
import { useSelector } from 'react-redux';
import Popup from '../Popup/Popup';
import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import { COUNTRY_CODES } from '../../constants';
import { nanoid } from 'nanoid';

const TourismForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        corporateName: '',
        firstName: '',
        lastName: '',
        designation: '',
        email: '',
        countryCode: '+91',
        phoneNumber: '',
        message: ''
    });
    const [errors, setErrors] = useState({ 
        corporateName: false, 
        firstName: false, 
        lastName: false, 
        designation: false, 
        email: false, 
        phoneNumber: false 
    });
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            case 'corporateName': return value.trim().length >= 2;
            case 'firstName': return value.trim().length >= 2;
            case 'lastName': return value.trim().length >= 2;
            case 'designation': return value.trim().length >= 2;
            case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'phoneNumber': return /^\d{10}$/.test(value);
            default: return true;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name !== 'message' && name !== 'countryCode') {
            setErrors(prev => ({ ...prev, [name]: !validateField(name, value) }));
        }
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
         const filteredValue = value.replace(/[^A-Za-z\s]/g, "");
        setFormData(prev => ({ ...prev, [name]: filteredValue }));

        if (name !== 'message' && name !== 'countryCode') {
            setErrors(prev => ({ ...prev, [name]: !validateField(name, filteredValue) }));
        }
    };

    const isFormValid = () => {
        return ['corporateName', 'firstName', 'lastName', 'designation', 'email', 'phoneNumber'].every(field =>
            validateField(field, formData[field]) && formData[field].trim() !== ''
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newErrors = {
            corporateName: !validateField('corporateName', formData.corporateName),
            firstName: !validateField('firstName', formData.firstName),
            lastName: !validateField('lastName', formData.lastName),
            designation: !validateField('designation', formData.designation),
            email: !validateField('email', formData.email),
            phoneNumber: !validateField('phoneNumber', formData.phoneNumber)
        };
        setErrors(newErrors);

        if (isFormValid()) {
            const sheetUrl = import.meta.env.VITE_CORPORATE_SHEET_URL;
            try {
                const response = await fetch(`${sheetUrl}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        corporateName: formData.corporateName,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        designation: formData.designation,
                        email: formData.email,
                        countryCode: formData.countryCode,
                        phoneNumber: formData.phoneNumber,
                        message: formData.message,
                        date: new Date().toISOString().split('T')[0]
                    })
                });

                if (response.ok) {
                    createToast('Form submitted successfully!');
                    setFormData({
                        corporateName: '',
                        firstName: '',
                        lastName: '',
                        designation: '',
                        email: '',
                        countryCode: '+91',
                        phoneNumber: '',
                        message: ''
                    });
                    setErrors({
                        corporateName: false,
                        firstName: false,
                        lastName: false,
                        designation: false,
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

        setLoading(false);
    };

    const handleViewOpen = (state) => {
        setIsOpen(state);
    }

    return (
        <div className='bg-white'>
            <form onSubmit={handleSubmit} className='px-4 md:px-[74px] bg-white max-w-[720px] mx-auto pt-9 h-full pb-10 md:pb-30'>
                {/* Logo */}
                <p className='font-author font-medium text-2xl text-383838 capitalize pl-5 mb-5'>Corporate Inquiry</p>
                <div className='bg-white w-full rounded-[20px] p-5 shadow-level-2'>
                    
                    {/* Corporate Name */}
                    <div className='mb-5 md:mb-6'>
                        <label htmlFor="corporateName" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">Name of Corporate *</label>
                        <div className="mt-2 md:mt-5">
                            <input
                                id="corporateName"
                                name="corporateName"
                                type="text"
                                value={formData.corporateName}
                                onChange={handleTextChange}
                                placeholder="Enter corporate name..."
                                className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.corporateName ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                            />
                            {errors.corporateName && <p className="text-red-500 text-xs mt-1">Please enter a valid corporate name</p>}
                        </div>
                    </div>

                    {/* First Name and Last Name */}
                    <div className='flex gap-2 mb-5 md:mb-6'>
                        <div className='w-1/2'>
                            <label htmlFor="firstName" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">First Name *</label>
                            <div className="mt-2 md:mt-5">
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleTextChange}
                                    placeholder="First Name..."
                                    className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.firstName ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">Please enter a valid first name</p>}
                            </div>
                        </div>
                        <div className='w-1/2'>
                            <label htmlFor="lastName" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">Last Name *</label>
                            <div className="mt-2 md:mt-5">
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleTextChange}
                                    placeholder="Last Name..."
                                    className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.lastName ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">Please enter a valid last name</p>}
                            </div>
                        </div>
                    </div>

                    {/* Designation */}
                    <div className='mb-5 md:mb-6'>
                        <label htmlFor="designation" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">Designation *</label>
                        <div className="mt-2 md:mt-5">
                            <input
                                id="designation"
                                name="designation"
                                type="text"
                                value={formData.designation}
                                onChange={handleTextChange}
                                placeholder="Enter your designation..."
                                className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.designation ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                            />
                            {errors.designation && <p className="text-red-500 text-xs mt-1">Please enter a valid designation</p>}
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className='mb-5 md:mb-6'>
                        <p className='font-general font-medium text-sm text-1c0e0eb3'>Contact Details *</p>
                        <div className='flex-col flex gap-2 mt-2 md:mt-5 mb-2'>
                            <label htmlFor="email" className="ml-px pl-2 font-general font-medium text-sm text-1c0e0eb3 hidden">Email ID *</label>
                            <div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email ID"
                                    className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.email ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">Please enter a valid email</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="font-general font-medium text-sm text-1c0e0eb3 hidden">
                                Phone number *
                            </label>
                            <div>
                                <div className="flex gap-2 rounded-md bg-white">
                                    <div className="grid shrink-0 grid-cols-1 focus-within:relative border border-f2f2f2 rounded-[20px]">
                                        <select
                                            id="countryCode"
                                            name="countryCode"
                                            value={formData.countryCode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2"
                                        >
                                            {COUNTRY_CODES.map((country) => (
                                                <option key={nanoid()} value={country.code}>
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
                                        placeholder="Phone Number"
                                        className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.phoneNumber ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-red`}
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit phone number</p>}
                            </div>
                        </div>
                    </div>

                    {/* Message textarea */}
                    <div className='mb-5 md:mb-6'>
                        <label htmlFor="message" className="font-general font-medium text-sm text-1c0e0eb3">
                            Message – Send us your Query
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
                            className={`rounded-[25px] py-2 px-4 font-general font-medium text-sm text-ffffff flex items-center gap-2 ${isFormValid() && !loading ? 'bg-383838 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}`} >
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
                            <p className='max-w-[352px] text-center font-general font-medium text-xs md:text-sm text-383838 opacity-70'>Your inquiry has been submitted. A Picklebay associate will reach out to you shortly.</p>
                            <NavLink to={'/'} className="font-medium text-base font-general text-244cb4 underline">Back To Homepage</NavLink>
                        </div>
                    </div>
                </motion.div>
            </Popup>
        </div>
    )
}

export default TourismForm