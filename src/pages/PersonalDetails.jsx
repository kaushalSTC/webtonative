import { DeleteProfileImageIcon, DummyProfileImage, EditProfile } from "../assets";
import { useState, useEffect, useRef } from "react";
import LevelSelector from "../components/LevelSelector/LevelSelector";
import { useSelector } from "react-redux";
import { MdSaveAlt } from "react-icons/md";
import { format, parse } from "date-fns";
import { usePlayerMutaion } from "../hooks/LoginHooks";
import { useGetEmailOtp, useVerifyEmailOtp } from "../hooks/PlayerHooks";
import UpdateProfileImage from "../components/UpdateProfileImage/UpdateProfileImage";
import SplitNumberInput from "../components/SplitNumberInput/SplitNumberInput";
import Loader from "../components/Loader/Loader";
import { createToast, createErrorToast } from "../utils/utlis";
import { useNavigate } from 'react-router';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};


const PersonalDetails = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate('/login');
    }
  }, [auth.isLoggedIn]);
  const { mutate: updatePlayer, isSuccess: isPlayerUpdated, isPending: isPlayerUpdatePending, isError: isPlayerUpdateError, error: playerUpdateError, } = usePlayerMutaion();
  const { mutate: sendOTP, isSuccess: isOTPSent, isPending: isOTPSendPending, isError: isOTPSendError, error: otpSendError, } = useGetEmailOtp();
  const { mutate: verifyOTP, isSuccess: isOTPVerified, isPending: isOTPVerifyPending, isError: isOTPVerifyError, error: otpVerifyError, } = useVerifyEmailOtp();
  const { name, dob, gender, phone, email, skillLevel, id, profilePic } = useSelector((state) => state.player);
  const [formData, setFormData] = useState({
    name,
    dob,
    gender: gender ? capitalizeFirstLetter(gender) : '',
    phone,
    email: email || "",
    skillLevel,
    profilePic
  });
  const [emailOtpState, setEmailOtpState] = useState({ showOtpInput: false, otp: "", newEmail: "", isVerified: false, clearOtpInput: false });
  const [showCalendar, setShowCalendar] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(profilePic); // Store uploaded image URL
  const [genderError, setGenderError] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef(null);
  const calendarRef = useRef(null);

  const handleImageUploadClick = () => {
    if (uploadRef.current) {
      uploadRef.current.triggerFileInput();
    }
  };

  // Function to handle API response from upload
  const handleUploadSuccess = (responseData) => {
    if (responseData.data.url) {
      setProfilePicUrl(responseData.data.url);

      // Send only updated profile image to the API
      updatePlayer({
        playerID: id,
        player: { profilePic: responseData.data.url },
      });

      createToast("Profile picture updated successfully");

      // Reset the file input after successful upload
      if (uploadRef.current && uploadRef.current.resetFileInput) {
        uploadRef.current.resetFileInput();
      }
    }
  };

  const [isEditAble, setIsEditAble] = useState({
    personalDetails: false,
    contactDetails: false,
    playingDetails: false,
  });

  const playerID = id;

  useEffect(() => {
    // Reset OTP state when contact details editing is disabled
    if (!isEditAble.contactDetails) {
      setEmailOtpState(prev => ({
        ...prev,
        showOtpInput: false,
        otp: "",
        clearOtpInput: true
      }));
    }
  }, [isEditAble.contactDetails]);

  // Handle OTP verification success
  useEffect(() => {
    if (isOTPVerified) {
      // Update the user's email in the system after successful verification
      updatePlayer({
        playerID: id,
        player: { email: emailOtpState.newEmail },
      });

      // Reset OTP state and mark as verified
      setEmailOtpState(prev => ({
        ...prev,
        isVerified: true,
        showOtpInput: false,
        otp: "",
        clearOtpInput: true
      }));

      // Update form data with the new verified email
      setFormData(prev => ({
        ...prev,
        email: emailOtpState.newEmail
      }));

      // Close edit mode
      setIsEditAble(prev => ({
        ...prev,
        contactDetails: false
      }));

      createToast("Email verification successful!");
    }
  }, [isOTPVerified]);

  // Handle OTP verification error
  useEffect(() => {
    if (isOTPVerifyError) {
      createErrorToast(otpVerifyError?.response?.data?.message || "Failed to verify OTP. Please try again.");
    }
  }, [isOTPVerifyError, otpVerifyError]);

  // Handle OTP sending success
  useEffect(() => {
    if (isOTPSent) {
      setEmailOtpState(prev => ({
        ...prev,
        showOtpInput: true,
        clearOtpInput: false
      }));
      createToast(`OTP has been sent to ${emailOtpState.newEmail}`);
    }
  }, [isOTPSent]);

  // Handle OTP sending error
  useEffect(() => {
    if (isOTPSendError) {
      createErrorToast(otpSendError?.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  }, [isOTPSendError, otpSendError]);

  // Handle player update success
  useEffect(() => {
    if (isPlayerUpdated) {
      createToast("Profile updated successfully");
    }
  }, [isPlayerUpdated]);

  // Handle player update error
  useEffect(() => {
    if (isPlayerUpdateError) {
      createErrorToast(playerUpdateError?.response?.data?.message || "Failed to update profile. Please try again.");
    }
  }, [isPlayerUpdateError, playerUpdateError]);

  const handleEditClick = (editTarget) => {
    setIsEditAble((prev) => ({
      ...prev,
      [editTarget]: true,
    }));

    // Ensure formData syncs with Redux state when editing begins
    setFormData({
      name,
      dob,
      gender: gender ? capitalizeFirstLetter(gender) : '',
      phone,
      email,
      skillLevel,
      profilePic
    });
  };

  const handleSaveClick = (editTarget) => {
    let updatedData = {};

    const addIfChanged = (key, initialValue, updatedValue) => {
      if ((initialValue || "") !== (updatedValue || "")) {
        updatedData[key] = updatedValue;
      }
    };

    if (editTarget === "personalDetails") {
      addIfChanged("name", name, formData.name);

      if (formData.dob) {
        try {
          const apiFormattedDob = format(parse(formData.dob, "dd/MM/yyyy", new Date()), "dd/MM/yyyy");
          addIfChanged("dob", dob, apiFormattedDob);
        } catch (error) {
          console.error("Error formatting DOB:", formData.dob, error);
          createErrorToast("Invalid date format. Please use DD/MM/YYYY format.");
        }
      }

      addIfChanged("gender", gender, formData.gender?.toLowerCase());
    }

    if (editTarget === "contactDetails") {
      const emailRegex = /^[^\s@]+@[^\s@]+$/;
      const phoneChanged = phone !== formData.phone;
      const emailChanged = email !== formData.email;

      if (emailChanged && formData.email !== "" && !emailRegex.test(formData.email)) {
        createErrorToast("Please enter a valid email address");
        return;
      }

      if (phoneChanged && (formData.phone.length !== 10 || isNaN(formData.phone))) {
        createErrorToast("Phone number must be exactly 10 digits and contain only numbers.");
        return;
      }

      // Handle phone number change
      addIfChanged("phone", phone, formData.phone);

      // Handle email change
      if (emailChanged) {
        // Store the new email
        setEmailOtpState(prev => ({
          ...prev,
          newEmail: formData.email,
          isVerified: false,
          clearOtpInput: true
        }));

        // Send OTP for email verification
        sendOTP({
          playerID: id,
          emailObj: {
            email: formData.email
          }
        });

        // Don't update email yet - it will be updated after OTP verification
        return;
      }
    }

    if (editTarget === "playingDetails") {
      addIfChanged("skillLevel", skillLevel, formData.skillLevel);
    }

    // Prevent alert from triggering unnecessarily
    if (Object.keys(updatedData).length === 0) {
      setIsEditAble((prev) => ({
        ...prev,
        [editTarget]: false,
      }));
      return; // Stop execution
    }

    // Disable editing after saving
    setIsEditAble((prev) => ({
      ...prev,
      [editTarget]: false,
    }));

    updatePlayer({
      playerID: id,
      player: updatedData,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "phone") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // if (name === "gender") {
    //   formattedValue = value?.toLowerCase();
    // }

    if (name === "dob") {
      if (value) {
        const parsedDate = parse(value, "yyyy-MM-dd", new Date()); // Handle input format
        if (!isNaN(parsedDate)) {
          formattedValue = format(parsedDate, "dd/MM/yyyy"); // Store as DD/MM/YYYY
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // Handle OTP input from SplitNumberInput
  const handleOtpChange = (otpValue) => {
    setEmailOtpState(prev => ({
      ...prev,
      otp: otpValue,
      clearOtpInput: false
    }));
  };

  const handleVerifyOtp = () => {
    if (emailOtpState.otp.length < 4) {
      createErrorToast("Please enter a valid OTP");
      return;
    }

    // Updated to match the required payload format
    verifyOTP({
      playerID: id,
      emailObj: {
        email: emailOtpState.newEmail,
        otp: emailOtpState.otp
      }
    });
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy"); // Convert to DD/MM/YYYY
      setFormData((prev) => ({
        ...prev,
        dob: formattedDate,
      }));
      setShowCalendar(false); // Close calendar after selection
    }
  };

  useEffect(() => {
    // Function to handle clicks outside the calendar
    const handleOutsideClick = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) &&
        !event.target.closest('div').textContent.includes("Select Date")) {
        setShowCalendar(false);
      }
    };

    // Add the event listener when the calendar is shown
    if (showCalendar) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showCalendar]);

  const handleImageDeleteClick = async () => {
    try {
      const response = await fetch(DummyProfileImage);
      const blob = await response.blob();

      const file = new File([blob], "dummy-profile-image.png", { type: blob.type });

      const formData = new FormData();
      formData.append("uploaded-file", file);

      const baseURL = import.meta.env.VITE_DEV_URL;

      const uploadResponse = await fetch(`${baseURL}/api/upload-file`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const responseData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(responseData.message || "Upload failed!");
      }

      if (responseData.data.url) {
        setProfilePicUrl(responseData.data.url);

        // Send only updated profile image to the API
        updatePlayer({
          playerID: id,
          player: { profilePic: responseData.data.url },
        });

        createToast("Profile picture deleted successfully");
      }

      // Reset the file input after delete operation
      if (uploadRef.current && uploadRef.current.resetFileInput) {
        uploadRef.current.resetFileInput();
      }

      console.log("✅ File uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload Error:", error);
      alert("Error uploading file");
      // Reset the file input even on error
      if (uploadRef.current && uploadRef.current.resetFileInput) {
        uploadRef.current.resetFileInput();
      }
    }
  };

  const handleLoadingImage = (laoding) => {
    setUploading(laoding);
  }


  return (
    <>
      <UpdateProfileImage ref={uploadRef} onUploadSuccess={handleUploadSuccess} onLoadingImage={handleLoadingImage} />
      <div className="main-container bg-f2f2f2">
        <div className="max-w-[720px] mx-auto px-0 w-full container bg-white pt-2">
          <div className="w-full px-[40px] md:px-[92px] py-[40px] md:py-[50px]">
            <p className="mb-[20px] font-general font-medium md:font-semibold text-sm md:text-base text-1c0e0eb3 md:text-383838 opacity-100 md:opacity-80">
              Your Profile
            </p>

            <div className="flex items-center flex-col pb-0 md:pb-10 border-none md:border-b border-f2f2f2">
              {uploading ? (
                <div className="overflow-hidden rounded-full aspect-square w-[125px] md:w-[147px] h-[125px] md:h-[147px] mb-2 md:mb-3 flex items-center justify-center">
                  <Loader size="lg" color="loading" />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute bottom-[16px] right-[11px] bg-white p-[5px] rounded-full" onClick={handleImageUploadClick}>
                    <img src={EditProfile} alt="edit-profile" className="w-5 h-5 cursor-pointer" />
                  </div>
                  <div className="overflow-hidden rounded-full aspect-square w-[125px] md:w-[147px] h-[125px] md:h-[147px] mb-2 md:mb-3">
                    <img
                      src={profilePicUrl || DummyProfileImage}
                      alt="profile-image"
                      className="w-full rounded-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 items-center cursor-pointer">
                <div onClick={handleImageDeleteClick} >
                  <img src={DeleteProfileImageIcon} alt="delete-profile-image" className="w-5 h-5" />
                </div>
              </div>

              <p className="text-center text-sm text-383838 opacity-70 mt-2">Image size should be less than 5MB</p>
            </div>

          </div>
          <div className="w-full px-[40px] md:px-[92px] mb-5 md:mb-10">
            <div className="flex items-center justify-between mb-5 md:mb-10">
              <p className="font-general font-medium text-383838 opacity-80 text-sm md:text-base">
                Personal Details
              </p>
              {isEditAble.personalDetails ? (
                <MdSaveAlt
                  className="w-[20px] h-[20px] text-244cb4 cursor-pointer"
                  onClick={() => handleSaveClick("personalDetails")}
                />
              ) : (
                <img
                  src={EditProfile}
                  alt="edit-profile"
                  className="w-[20px] h-[20px] cursor-pointer"
                  onClick={() => handleEditClick("personalDetails")}
                />
              )}
            </div>

            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!isEditAble.personalDetails}
              onChange={handleInputChange}
              className={`w-full border border-f2f2f2 py-4 md:py-5 px-5 rounded-r-20 font-general font-medium text-sm md:text-base text-383838 ${isEditAble.personalDetails ? "opacity-100" : "opacity-70"
                } focus:outline-none mb-3 md:mb-10`}
            />

            <div className="flex items-center justify-between gap-3">
              <select
                name="gender"
                value={formData.gender}
                disabled={!isEditAble.personalDetails}
                onChange={handleInputChange}
                className={`w-full border border-f2f2f2 py-4 md:py-5 px-5 rounded-r-20 font-general font-medium text-sm md:text-base text-383838 focus:outline-none mb-3 md:mb-10 ${isEditAble.personalDetails ? "opacity-100" : "opacity-70"}`}
              >
                <option value="" disabled hidden>
                  Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>


              <div className="flex items-center justify-between gap-3 relative w-full">
                <div
                  onClick={() => isEditAble.personalDetails && setShowCalendar(!showCalendar)}
                  className={`w-full border border-f2f2f2 py-4 md:py-5 px-5 rounded-r-20 font-general font-medium text-sm md:text-base text-383838 
        ${isEditAble.personalDetails ? "opacity-100 cursor-pointer" : "opacity-70 cursor-not-allowed"}
        focus:outline-none mb-3 md:mb-10`}
                >
                  {formData.dob ? formData.dob : "Select Date"}
                </div>

                {showCalendar && (
                  <div
                    ref={calendarRef}
                    className="absolute z-10 mt-2 bg-white shadow-lg left-[-16px] md:left-1/2 transform -translate-x-1/2 border border-cecece rounded-[0px] w-[90vw] max-w-[350px]"
                  >
                    <Calendar
                      className="border-none w-full"
                      onChange={handleDateChange}
                      value={formData.dob ? parse(formData.dob, "dd/MM/yyyy", new Date()) : new Date()}
                    />
                  </div>
                )}
              </div>
            </div>
            {genderError && <p className="text-red-500 text-sm">{genderError}</p>}
          </div>

          <div className="w-full px-[40px] md:px-[92px] mb-5 md:mb-10">
            <div className="flex items-center justify-between mb-5 md:mb-10">
              <p className="font-general font-medium text-383838 opacity-80 text-sm md:text-base">
                Contact Details
              </p>
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={!isEditAble.contactDetails}
              onChange={handleInputChange}
              placeholder="Email Address"
              className={`w-full border border-f2f2f2 py-4 md:py-5 px-5 rounded-r-20 font-general font-medium text-sm md:text-base text-383838 ${isEditAble.contactDetails ? "opacity-100" : "opacity-70"
                } focus:outline-none mb-3 md:mb-10`}
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              disabled={true}
              pattern="[0-9]{10}"
              maxLength="10"
              inputMode="numeric"
              onInput={(e) =>
              (e.target.value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10))
              }
              onChange={handleInputChange}
              placeholder="Phone Number"
              className={`w-full border border-f2f2f2 py-4 md:py-5 px-5 rounded-r-20 font-general font-medium text-sm md:text-base text-383838 ${isEditAble.contactDetails ? "opacity-100" : "opacity-70"
                } focus:outline-none mb-3 md:mb-10`}
            />

            <div className="mb-3 md:mb-10">
              {/* <input
                type="email"
                name="email"
                value={formData.email}
                disabled={!isEditAble.contactDetails}
                onChange={handleInputChange}
                placeholder="Email"
                autoComplete="off"
                className={`w-full border border-f2f2f2 py-4 md:py-5 px-5 rounded-r-20 font-general font-medium text-sm md:text-base text-383838 ${isEditAble.contactDetails ? "opacity-100" : "opacity-70"
                  } focus:outline-none`}
              /> */}


              {/* OTP input field that shows up after sending OTP - using SplitNumberInput */}
              {/* {emailOtpState.showOtpInput && (
                <div className="mt-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2">
                      <SplitNumberInput
                        digits={4}
                        className="w-12 h-12 text-center text-slate-900 border border-f2f2f2 rounded-md font-medium focus:border-244cb4 focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        getValue={handleOtpChange}
                        clearInput={emailOtpState.clearOtpInput}
                      />
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={isOTPVerifyPending}
                      className="w-full bg-244cb4 text-white py-3 rounded-r-20 font-general font-medium text-sm mt-2"
                    >
                      {isOTPVerifyPending ? "Verifying..." : "Verify OTP"}
                    </button>

                    <p className="text-gray-500 text-xs mt-1">
                      Enter the OTP sent to {emailOtpState.newEmail}
                    </p>
                  </div>
                </div>
              )} */}
            </div>
          </div>

          <div className="w-full px-[40px] md:px-[92px] mb-5 md:mb-10">
            <div className="flex items-center justify-between mb-5 md:mb-10">
              <p className="font-general font-medium text-383838 opacity-80 text-sm md:text-base">
                Playing Details
              </p>
              {isEditAble.playingDetails ? (
                <MdSaveAlt
                  className="w-[20px] h-[20px] text-244cb4 cursor-pointer"
                  onClick={() => handleSaveClick("playingDetails")}
                />
              ) : (
                <img
                  src={EditProfile}
                  alt="edit-profile"
                  className="w-[20px] h-[20px] cursor-pointer"
                  onClick={() => handleEditClick("playingDetails")}
                />
              )}
            </div>
            <LevelSelector
              skillLevel={formData.skillLevel}
              isEditAble={isEditAble.playingDetails}
              onChange={(selectedName) => {
                setFormData((prev) => ({ ...prev, skillLevel: selectedName.toLowerCase() }));
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;