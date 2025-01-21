import { useState, useEffect } from "react";

const usePhoneValidation = (phone) => {
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const validatePhone = () => {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Updated regex for international phone validation
      if (phoneRegex.test(phone)) {
        setIsValid(true);
        setErrorMessage("");
      } else {
        setIsValid(false);
        setErrorMessage("Invalid phone number format.");
      }
    };

    validatePhone();
  }, [phone]);

  return { isValid, errorMessage };
};

export default usePhoneValidation;
