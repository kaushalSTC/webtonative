import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { InviteSend, InviteSendIcon } from '../../assets';
import { createErrorToast, createToast } from '../../utils/utlis';
import Loader from '../Loader/Loader';
import { useSelector } from 'react-redux';
import Popup from '../Popup/Popup';
import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import { COUNTRIES, COUNTRY_CODES } from '../../constants';
import Select from 'react-select';

const options = COUNTRIES.map((country) => ({
    value: country,
    label: country,
}));


const TourismForm = () => {
    const userLoaction = useSelector((state) => state.location.city);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        country: '',
        city: '',
        email: '',
        countryCode: '+91',
        phoneNumber: '',
        message: '',
        instagram: '',
        linkedin: ''
    });
    const [errors, setErrors] = useState({ firstName: false, lastName: false, gender: false, dateOfBirth: false, country: false, city: false, email: false, phoneNumber: false });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userLoaction) {
            setFormData(prev => ({ ...prev, city: userLoaction }))
        }
    }, [userLoaction])

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName': return value.trim().length >= 2;
            case 'lastName': return value.trim().length >= 2;
            case 'gender': return value.trim() !== '';
            case 'dateOfBirth': return value.trim() !== '';
            case 'country': return value.trim() !== '';
            case 'city': return value.trim().length >= 2;
            case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'phoneNumber': return /^\d{10}$/.test(value);
            default: return true;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name !== 'message' && name !== 'countryCode' && name !== 'instagram' && name !== 'linkedin') {
            setErrors(prev => ({ ...prev, [name]: !validateField(name, value) }));
        }
    };

    const isFormValid = () => {
        return ['firstName', 'lastName', 'gender', 'dateOfBirth', 'country', 'city', 'email', 'phoneNumber'].every(field =>
            validateField(field, formData[field]) && formData[field].trim() !== ''
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newErrors = {
            firstName: !validateField('firstName', formData.firstName),
            lastName: !validateField('lastName', formData.lastName),
            gender: !validateField('gender', formData.gender),
            dateOfBirth: !validateField('dateOfBirth', formData.dateOfBirth),
            country: !validateField('country', formData.country),
            city: !validateField('city', formData.city),
            email: !validateField('email', formData.email),
            phoneNumber: !validateField('phoneNumber', formData.phoneNumber)
        };
        setErrors(newErrors);

        if (isFormValid()) {
            const sheetUrl = import.meta.env.VITE_TOURISM_SHEET_URL;
            try {
                const response = await fetch(`${sheetUrl}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        gender: formData.gender,
                        dateOfBirth: formData.dateOfBirth,
                        country: formData.country,
                        city: formData.city,
                        email: formData.email,
                        countryCode: formData.countryCode,
                        phoneNumber: formData.phoneNumber,
                        message: formData.message,
                        instagram: formData.instagram,
                        linkedin: formData.linkedin,
                        date: new Date().toISOString().split('T')[0]
                    })
                });

                if (response.ok) {
                    createToast('Form submitted successfully!');
                    setFormData({
                        firstName: '',
                        lastName: '',
                        gender: '',
                        dateOfBirth: '',
                        country: '',
                        city: '',
                        email: '',
                        countryCode: '+91',
                        phoneNumber: '',
                        message: '',
                        instagram: '',
                        linkedin: ''
                    });
                    setErrors({
                        firstName: false,
                        lastName: false,
                        gender: false,
                        dateOfBirth: false,
                        country: false,
                        city: false,
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
                <p className='font-author font-medium text-2xl text-383838 capitalize pl-5 mb-5'>Send us a message</p>
                <div className='bg-white w-full rounded-[20px] p-5 shadow-level-2'>
                    {/* Name */}
                    <div className='flex gap-2'>
                        <div className='w-1/2'>
                            <label htmlFor="firstName" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">First Name *</label>
                            <div className="mt-2 md:mt-5">
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    placeholder="Last Name..."
                                    className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.lastName ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">Please enter a valid last name</p>}
                            </div>
                        </div>
                    </div>

                    {/* Gender */}
                    <div className='mt-5 md:mt-6'>
                        <label htmlFor="gender" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">Gender *</label>
                        <div className="mt-2 md:mt-5">
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 focus:outline-none ${errors.gender ? 'border-red-500' : 'border-f2f2f2'}`}
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-xs mt-1">Please select a gender</p>}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className='mt-5 md:mt-6'>
                        <label htmlFor="dateOfBirth" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">Date of Birth *</label>
                        <div className="mt-2 md:mt-5">
                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 focus:outline-none ${errors.dateOfBirth ? 'border-red-500' : 'border-f2f2f2'}`}
                            />
                            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">Please enter a valid date of birth</p>}
                        </div>
                    </div>

                    {/* Country and City */}
                    <div className='flex gap-2 mt-5 md:mt-6 items-center'>
                        <div className='w-1/2'>
                            <label htmlFor="country" className="ml-px block pl-2 font-general font-medium text-sm text-1c0e0eb3">Country *</label>
                            <div className="mt-2 md:mt-5">
                                <Select
                                    options={options}
                                    value={options.find((opt) => opt.value === formData.country)}
                                    onChange={(selected) => handleChange({ target: { name: 'country', value: selected.value } })}
                                    styles={{
                                        control: (baseStyles, state) => ({
                                          ...baseStyles,
                                          borderColor: state.isFocused ? '#f2f2f2' : '#f2f2f2',  
                                          outlineColor: state.isFocused ? '#f2f2f2' : '#f2f2f2',  
                                        }),
                                    }}
                                />
                                {errors.country && <p className="text-red-500 text-xs mt-1">Please select a country</p>}
                            </div>
                        </div>
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
                                    className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.city ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-transparent`}
                                />
                                {errors.city && <p className="text-red-500 text-xs mt-1">Please enter a valid city</p>}
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className='mt-5 md:mt-6'>
                        <p className='font-general font-medium text-sm text-1c0e0eb3'>Contact Details *</p>
                        <div className='flex-col flex gap-2 mt-2 md:mt-5 mb-2'>
                            <label htmlFor="email" className="ml-px pl-2 font-general font-medium text-sm text-1c0e0eb3 hidden">Email *</label>
                            <div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="E-mail"
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
                                        className={`block w-full border rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm ${errors.phoneNumber ? 'border-red-500' : 'border-f2f2f2'} autofill:bg-red`}
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit phone number</p>}
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className='mt-5 md:mt-6'>
                        <p className='font-general font-medium text-sm text-1c0e0eb3'>Social Links</p>
                        <div className='flex-col flex gap-2 mt-2 md:mt-5'>
                            <div>
                                <input
                                    id="instagram"
                                    name="instagram"
                                    type="text"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="Instagram"
                                    className="block w-full border border-f2f2f2 rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm autofill:bg-transparent"
                                />
                            </div>
                            <div className="mt-2">
                                <input
                                    id="linkedin"
                                    name="linkedin"
                                    type="text"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="LinkedIn"
                                    className="block w-full border border-f2f2f2 rounded-[20px] p-3 font-general font-medium text-sm text-383838 placeholder:text-383838 focus:outline-none placeholder:opacity-80 placeholder:text-sm autofill:bg-transparent"
                                />
                            </div>
                        </div>
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
                            <p className='max-w-[352px] text-center font-general font-medium text-xs md:text-sm text-383838 opacity-70'>Your form has been submitted. A Picklebay associate will reach out to you shortly.</p>
                            <NavLink to={'/'} className="font-medium text-base font-general text-244cb4 underline">Back To Homepage</NavLink>
                        </div>
                    </div>
                </motion.div>
            </Popup>
        </div>
    )
}

export default TourismForm