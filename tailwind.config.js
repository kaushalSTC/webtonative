/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      padding: {
        DEFAULT: "1.25rem",
      },
    },
    extend: {
      aspectRatio: {
        "124/75": "124/75",
      },
      backgroundImage: {
        "login-pattern": "url('/src/assets/images/login/background-pattern.png')",
        "dotted-custom": "linear-gradient(to right, #56b918 50%, transparent 50%)",
        "white-to-f4f5ff": "linear-gradient(0deg,rgba(255, 255, 255, 1) 3%, rgba(244, 245, 255, 1) 22%)",
      },
      borderRadius: {
        "r-20": "1.25rem",
        "r-15": "0.9375rem",
      },
      boxShadow: {
        "level-1": "0px 8px 16px #A7A7A729",
        "level-2": "0px 3px 26px #00000029",
        "level-3": "0px 13px 16px #A7A7A729;",
      },
      colors: {
        d2d2d2: "#d2d2d2",
        707070: "#707070",
        dbe0fc: "#DBE0FC",
        f4f5ff: "#F4F5FF",
        abe400: "#ABE400",
        "1c4ba3": "#1C4BA3",
        383838: "#383838",
        "383838cc": "#383838cc",
        "56b918": "#56B918",
        ffffff: "#FFFFFF",
        f2f2f2: "#F2F2F2",
        fbfbfb: "#fbfbfb",
        f0f0f0: "#f0f0f0",
        "244cb4": "#244CB4",
        "1c0e0e": "#1C0E0E",
        "1c0e0eb3": "#1C0E0EB3",
        848484: "#848484",
        fcfdff: "#FCFDFF",
        "8ebe01": "#8EBE01",
        cecece: "#CECECE",
        e1e1e1: "#E1E1E1",
        d6d6d6: "#D6D6D6",
        f8f8f8: "#F8F8F8",
        38383899: "#38383899",
        "244cb44d": "#244CB44D",
        959595: "#959595",
        "244cb480": "#244CB480",
      },
      fontFamily: {
        author: ["Author", "Arial", "Helvetica", "Tahoma", "Verdana", "Trebuchet MS", "Geneva", "sans-serif"],
        "author-italic": ["Author-Italic", "Arial", "Helvetica", "Tahoma", "Verdana", "Trebuchet MS", "Geneva", "sans-serif"],
        general: ["GeneralSans", "Arial", "Helvetica", "Tahoma", "Verdana", "Trebuchet MS", "Geneva", "sans-serif"],
        "general-medium": ["GeneralSans-Medium", "Arial", "Helvetica", "Tahoma", "Verdana", "Trebuchet MS", "Geneva", "sans-serif"],
        "general-semibold": ["GeneralSans-SemiBold", "Arial", "Helvetica", "Tahoma", "Verdana", "Trebuchet MS", "Geneva", "sans-serif"],
        "general-italic": ["GeneralSans-Italic", "Arial", "Helvetica", "Tahoma", "Verdana", "Trebuchet MS", "Geneva", "sans-serif"],
      },
      maxWidth: {
        "page-width": "1600px",
      },
      fontSize: {
        "size-10": "0.625rem",
        "size-18": "1.125rem",
        "size-14": "0.875rem",
        "size-24": "1.5rem",
      },
      content: {
        after: "",
      },
      backgroundSize: {
        "dotted-custom": "30px 1px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
