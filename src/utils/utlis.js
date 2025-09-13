import toast from 'react-hot-toast';

// Debounce function to limit API calls
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '+91 $1 $2 $3');
};

// Function - To Return Skill Level if Skill Levels are Same across Categories
// Else Return All Levels if Skill Levels are Different across Categories

const tournamentSkillLevelDefaults = [ 'all levels', 'beginner', 'amateur', 'intermediate',  'advanced'];

const getSkillLevelsFromTournamentCategory = (categories) => {
  const skillLevels = categories.map((category) => category.skillLevel);
  const uniqueSkillLevels = new Set(skillLevels);

  if (uniqueSkillLevels.size === 1) {
    const skillLevel = tournamentSkillLevelDefaults.indexOf(skillLevels[0]);
    return {
      level: skillLevel,
      name: tournamentSkillLevelDefaults[skillLevel],
    };
  } else {
    return {
      level: 4,
      name: 'All Levels',
    };
  }
};

const formatDate = (date, day = true, month = true, year = true) => {
  if (!date) {
    return null;
  }
  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Function To Convert Date DD / MM / YYYY --> DD Month YYYY                 │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  if (typeof date === 'string') {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (month === 'MMM') {
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    const [dayToShow, monthToShow, yearToShow] = date.split('/').map(Number);
    return `${day ? dayToShow : ''} ${month ? months[monthToShow - 1] : ''} ${year ? yearToShow : ''}`;
  }

  let d = date.getDate().toString().padStart(2, '0');
  let m = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  let y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const formatDateObject = (isoString, options = { day: 'numeric', month: 'long' }) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', options);
};

const getDuration = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let durationHours = endHour - startHour;
  let durationMinutes = endMinute - startMinute;

  if (durationMinutes < 0) {
    durationHours -= 1;
    durationMinutes += 60;
  }

  const totalMinutes = durationHours * 60 + durationMinutes;

  // If the duration is 60 minutes or less, show only minutes
  if (totalMinutes <= 60) {
    return `${totalMinutes}m`;
  }

  return `${durationHours}h ${durationMinutes}m`;
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ calculate age from DOB. Profile page                                    │
  └─────────────────────────────────────────────────────────────────────────┘
*/

const calculateAge = (dobString) => {
  const [day, month, year] = dobString.split('/').map(Number);
  const dob = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Get the start date and end date for week fitler. Tournament listing     │
  └─────────────────────────────────────────────────────────────────────────┘
*/

const getThisWeekDateRange = () => {
  const today = new Date();
  // Calculate start of the week (Sunday)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay());
  startDate.setHours(0, 0, 0, 0);

  // Calculate end of the week (Saturday)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  // Format dates as DD/MM/YYYY
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

const getThisMonthDateRange = () => {
  const today = new Date();
  // First day of current month
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  startDate.setHours(0, 0, 0, 0);

  // Last day of current month
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endDate.setHours(23, 59, 59, 999);

  // Format dates as DD/MM/YYYY
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

const getCardsPerSection = () => {
  return window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 4 : 6;
};

const createToast = (message) => {
  if (typeof message === 'object') {
    message = message.message || 'Operation completed successfully';
  }
  toast.success(message, {
    duration: 3000,
    position: 'bottom-center',
    style: {
      borderRadius: '10px',
      color: '#383838',
      backgroundColor: '#ffffff',
      fontFamily: 'GeneralSans, Arial, Helvetica, Tahoma, Verdana, Trebuchet MS, Geneva, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      padding: '10px',
    },
  });
};

const createErrorToast = (message) => {
  if (typeof message === 'object') {
    message = message.message || 'An error occurred';
  }
  toast.error(message, {
    duration: 3000,
    position: 'bottom-center',
    style: {
      borderRadius: '10px',
      color: '#383838',
      backgroundColor: '#ffffff',
      fontFamily: 'GeneralSans, Arial, Helvetica, Tahoma, Verdana, Trebuchet MS, Geneva, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      padding: '10px',
    },
  });
};

// Function to parse timestamp to get date
const parseTimeStamp = (timestamp) => {
  const date = new Date(timestamp).toISOString().split('T')[0];
  return date;
};

// Function to parse timestamp to get date and long month
const parseTimeStampForDateLongMonth = (isoString) => {
  if (!isoString) return 'Invalid Date';

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
};

// DD/MM/YYYY --> 01/Jan
const getDateString = (dateString) => {
  if (!dateString || typeof dateString !== "string") return "";

  const parts = dateString.split("/");
  if (parts.length < 2) return "";

  const [day, month] = parts.map(Number);
  if (!day || !month) return "";

  const date = new Date(2025, month - 1, day);
  return `${day} ${date.toLocaleString("en-US", { month: "short" })}`;
};


// Function to check if current date is between start and end dates (inclusive)
// function canBookOnDate(bookingStartDate, bookingEndDate) {
//   const [startDay, startMonth, startYear] = bookingStartDate.split('/').map(Number);
//   const [endDay, endMonth, endYear] = bookingEndDate.split('/').map(Number);

//   const startDate = new Date(startYear, startMonth - 1, startDay);
//   const endDate = new Date(endYear, endMonth - 1, endDay);
//   const currentDate = new Date();

//   currentDate.setHours(0, 0, 0, 0);

//   return currentDate >= startDate && currentDate <= endDate;
// }

function canBookOnDate(bookingEndDate) {
  if (!bookingEndDate) return false;

  const [day, month, year] = bookingEndDate.split('/').map(Number);
  const endDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return currentDate <= endDate;
}


// Formatting address
const formatAddress = (address) => {
  return [address?.line1, address?.line2, address?.city].filter(Boolean).join(', ');
};

// Format 9:30 AM - 12:00 PM => {time: {"startTime": "12:10","endTime": "15:00"}}
function convertTimeRangeToObject(timeRange) {
  const [start, end] = timeRange.split(' - ');

  const convertTo24Hour = (time) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return {
    startTime: convertTo24Hour(start),
    endTime: convertTo24Hour(end),
  };
}

// Format {time: {"startTime": "12:10","endTime": "15:00"}} => 9:30 AM - 12:00 PM
function convertTo12HourFormat(time) {
  let [hours, minutes] = time.split(':').map(Number);
  let period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Convert "14:30" => "2:30 PM"
function convertSingleTimeTo12Hour(time) {
  if (!time) return '';
  let [hours, minutes] = time.split(':').map(Number);
  let period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Reverse the date
function reverseDateFormat(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// handle to name
const formatVenueName = (handle) => {
  if (!handle.includes('-')) {
    return handle;
  }
  return handle
    .split('-') // Split by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join words with space
};

const isObjectEmpty = (obj) => {
  if(typeof obj !== 'object') return false;
  Object.keys(obj).length === 0
};

function timeStampToDMY(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
// TimeStamp -> isPastDate
function isPastDate(timestampString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const providedDate = new Date(timestampString);
  providedDate.setHours(0, 0, 0, 0);
  return providedDate < today;
}
function formatDateStringForLive(dateString) {
  // Check if the input is valid
  if (!dateString || typeof dateString !== 'string') {
    return 'Invalid date';
  }
  
  // Split the date string by '/'
  const parts = dateString.split('/');
  
  // Check if the date string has the expected format
  if (parts.length !== 3) {
    return 'Invalid date format';
  }
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
  const year = parseInt(parts[2], 10);
  
  // Create a new Date object
  const date = new Date(year, month, day);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Get the day of week abbreviation
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  
  // Get the month abbreviation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthAbbr = months[date.getMonth()];
  
  // Format the date as "Day, DD Mon"
  return `${dayOfWeek}, ${day} ${monthAbbr}`;
}

// 2023-09-15T18:30:00.000Z -> 15-09-2023
function formatISOToCustomDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function removeCountryCode(countryCode, fullPhoneNumber) {
  if (!countryCode || !fullPhoneNumber) return '';

  if (fullPhoneNumber.startsWith(countryCode)) {
    return fullPhoneNumber.slice(countryCode.length);
  }

  return fullPhoneNumber;
}

export {
  calculateAge,
  canBookOnDate,
  convertTimeRangeToObject,
  convertTo12HourFormat,
  convertSingleTimeTo12Hour,
  createErrorToast,
  createToast,
  debounce,
  formatAddress,
  formatDate,
  formatDateObject,
  formatISOToCustomDate,
  formatPhoneNumber,
  formatVenueName,
  getCardsPerSection,
  getDateString,
  getDuration,
  getSkillLevelsFromTournamentCategory,
  getThisMonthDateRange,
  getThisWeekDateRange,
  isObjectEmpty,
  parseTimeStamp,
  parseTimeStampForDateLongMonth,
  reverseDateFormat,
  timeStampToDMY,
  tournamentSkillLevelDefaults,
  isPastDate,
  formatDateStringForLive,
  removeCountryCode
};
