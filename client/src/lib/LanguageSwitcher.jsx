import React, { useState } from "react";
import { useTranslation } from "react-google-multi-lang";

const flagIcons = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  ar: "🇸🇦",
};

export const LanguageSwitcher = () => {
  const { setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "ar", label: "Arabic" },
  ];

  return (
    <div className="z-50 p-2 relative inline-block text-left">
      <button
        className="p-2 bg-white flex items-center gap-2 rounded-xl hover:bg-gray-300 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* <span
          role="img"
          aria-label={
            languages.find((lang) => lang.code === selectedLang)?.label
          }
        >
          {flagIcons[selectedLang]}
        </span> */}
        <span>
          {languages.find((lang) => lang.code === selectedLang)?.label}
        </span>
      </button>
      {isOpen && (
        <div className="absolute mt-2 bg-white shadow-soft2 rounded-xl w-40 border border-gray-200 z-10">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-100 transition"
              onClick={() => {
                setLanguage(lang.code);
                setSelectedLang(lang.code);
                setIsOpen(false);
              }}
            >
              {/* <span aria-label={lang.label}>
                {flagIcons[lang.code]}
              </span> */}
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
