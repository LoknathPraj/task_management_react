import React from "react";

interface Option {
  label: string;
  value: string;
}

interface RadioButtonProps {
  label?: string;
  name: string;
  options: Option[];
  selectedValue: string | null;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  message?: string;
  errorDivCustomStyles?: string;
}

const Radio: React.FC<RadioButtonProps> = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  required,
  error,
  message,
  errorDivCustomStyles,
}) => {
  return (
    <div>
      <div className="mb-1">
        {label ? (
          <div className="w-full flex text-[15px] mb-1">
            {label}
            {required && <div className="text-red-600">*</div>}
          </div>
        ) : null}
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="px-2 text-gray-700 mr-4">{option.label}</span>
          </label>
        ))}
        <div
          className={`text-xs flex h-[1em] transition-opacity duration-150 ${
            error ? "text-[#FF0000]" : "text-[#4255ac]"
          } ${
            error || message ? "opacity-100" : "opacity-0"
          } ${errorDivCustomStyles}`}
        >
          {error || message}
        </div>
      </div>
    </div>
  );
};

export default Radio;
