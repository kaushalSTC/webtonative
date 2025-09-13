import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

const defaultDigits = 4;
const defaultClassName = "w-7 h-7 text-center text-slate-900 placeholder:text-slate-400 text-sm rounded-xs font-medium focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

const SplitNumberInput = ({ digits = defaultDigits, className = defaultClassName, getValue, clearInput }) => {
  const [number, setNumber] = useState(new Array(digits).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (clearInput) {
      setNumber(new Array(digits).fill("")); // Clear input fields
      if (getValue) getValue(""); // Notify parent
      inputRefs.current[0]?.focus(); // Refocus on the first input
    }
  }, [clearInput, digits, getValue]);

  // Add this new paste handler function
  const handlePaste = (e) => {
    e.preventDefault();
    // Remove non-digits
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    // Only process if we have exactly digits
      const digits = pastedData.split("");
      setNumber(digits);
      if (getValue) getValue(digits.join(""));
      // Focus the last input
      const lastInput = inputRefs.current[inputRefs.current.length - 1];
      if (lastInput) lastInput?.focus();
  };

  const handleNumberInput = (index, value) => {
    // Ensure only a single digit (0-9) or an empty string is entered
    if (!/^\d?$/.test(value)) return;

    setNumber((prev) => {
      const newNumber = [...prev];
      newNumber[index] = value; // Overwrite existing value

      if (getValue) getValue(newNumber.join("")); // Pass updated value

      return newNumber;
    });

    // Move focus to next input if a digit is entered
    if (value !== "" && index < digits - 1) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }
  };

  const handleKeyDown = (index, e) => {
    // Prevent entering non-digit characters
    const invalidKeys = ['+', '-', 'e', 'E', '.'];
    if (invalidKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (e.key === "Backspace" && !number[index] && index > 0) {
      // Move to previous input if not at the first input
      inputRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "Tab" &&
      (index === 0 || index === inputRefs.current[inputRefs.current.length - 1])
    ) {
      e.preventDefault(); // Prevent focusing on the next input
      const parent = inputRefs.current[index]?.parentElement;
      const sibling = parent?.parentElement.nextElementSibling;
      if (sibling) {
        const focusableElement = sibling.querySelector(
          'input, button, [tabindex]:not([tabindex="-1"])'
        );
        focusableElement?.focus();
      }
    }

    if (e.key === "Enter") {
      e.preventDefault(); // Prevent submitting the form
      const parent = inputRefs.current[index]?.parentElement;
      const sibling = parent?.parentElement.nextElementSibling;
      if (sibling) {
        const focusableElement = sibling.querySelector(
          'input, button, [tabindex]:not([tabindex="-1"])'
        );
        focusableElement?.focus();
      }
    }
  };

  // Add an input handler to prevent non-numeric characters
  const handleInput = (e) => {
    // Replace any non-digit character with empty string
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  useEffect(() => {
    if (inputRefs.current.length === digits) {
      inputRefs.current[0].focus();
    }
  }, [inputRefs.current.length, digits]);

  const handleFocus = (index) => {
    const allEmpty = inputRefs.current.every((ref) => ref && ref.value === "");

    if (allEmpty && index !== 0) {
      // Redirect focus to the first input
      inputRefs.current[0]?.focus();
    }
  };


  return (
    <>
      {number.map((digit, index) => (
        <input
          // initial={{ scale: 0 }}
          // animate={{ scale: 1 }}
          // transition={{ delay: index * 0.1 }}
          key={index}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          ref={(el) => (inputRefs.current[index] = el)}
          name={`splitNumber-${index}`}
          maxLength="1"
          value={digit || ""}
          onChange={(e) => handleNumberInput(index, e.target.value)}
          onFocus={() => handleFocus(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onInput={handleInput}
          onPaste={handlePaste}
          className={className}
          autoComplete="off"
          // contentEditable="true"
        />
      ))}
    </>
  );
};

SplitNumberInput.propTypes = {
  digits: PropTypes.number,
  className: PropTypes.string,
  getValue: PropTypes.func,
  clearInput: PropTypes.bool,
};

export default SplitNumberInput;