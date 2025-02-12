import React from "react";
import Select from "react-select";

const MultiSelect = ({ options, value, onChange }) => {
  const handleChange = (selectedOptions) => {
    onChange(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const formattedOptions = options.map((option) => ({
    value: option.id,
    label: option.label,
  }));

  const formattedValue = value.map((val) =>
    formattedOptions.find((option) => option.value === val)
  );

  return (
    <Select
      isMulti
      options={formattedOptions}
      value={formattedValue}
      onChange={handleChange}
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: "#4d1461",
          boxShadow: "none",
          borderRadius: "12px",
          "&:hover": {
            borderColor: "#4d1461",
          },
        }),
        multiValue: (provided) => ({
          ...provided,
          backgroundColor: "#4d1461",
          borderRadius: "4px",
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          color: "white",
        }),
        multiValueRemove: (provided) => ({
          ...provided,
          color: "white",
          ":hover": {
            backgroundColor: "#4d1461",
            color: "white",
          },
        }),
        placeholder: (provided) => ({
          ...provided,
          color: "#4d1461", // Change placeholder color
          fontSize: "14px", // Change placeholder font size
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? "#f0e6f6" : "white", // Change hover background color
          color: state.isFocused ? "#4d1461" : "black", // Change hover text color
        }),
      }}
    />
  );
};

export { MultiSelect };
