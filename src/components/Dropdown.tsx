import React, { useEffect, useState } from "react";
import Select from "react-select";
interface OptionType {
  value: string;
  label: string;
}
interface DropdownProps {
  submitRef?: boolean;
  defaultValue: OptionType | null;
  required?: boolean;
  message?: string;
  errorMessage?: string;
  errorDivCustomStyles?: string;
  options: OptionType[];
  handleChange: (e: OptionType | null) => void;
  defaultLabel?: string;
  multiple?: boolean;
  disabled?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  label: string | any;
  className?: string;
  requiredField?: boolean;
  name?: string;
  isClearable?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  submitRef,
  defaultValue,
  required,
  errorMessage,
  handleChange,
  defaultLabel,
  multiple,
  disabled,
  onMenuClose,
  onMenuOpen,
  isClearable,
  label,
  className,
  requiredField,
  errorDivCustomStyles,
  message,
  name,
}) => {
  // const [inputstyle, setInputstyle] = useState<string>(
  //   "border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600",
  // );
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (submitRef && isEmptyObject(defaultValue) && required) {
      setError(true);
    }
  }, [errorMessage, error, submitRef, options, defaultValue, required]);

  const onchangeinput = (e: any) => {
    handleChange(e);
    //setError(false);
  };

  function isEmptyObject(obj: OptionType | null): boolean {
    return obj === null || Object.keys(obj).length === 0;
  }

  const dropdownBlurred = () => {
    if (isEmptyObject(defaultValue)) {
      //setError(true);
    } else {
      setError(false);
    }
  };
  const customStyles = {
    placeholder: (provided: any) => ({
      ...provided,
      whiteSpace: "nowrap", // Prevents placeholder text from wrapping
      overflow: "hidden",
      textOverflow: "ellipsis", // Adds an ellipsis if the text is too long
    }),
    menu: (provided: any) => ({
      ...provided,
      maxHeight: "250px",
      overflowY: "auto",
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: "250px",
      overflowY: "auto",
    }),
  };
  return (
    <div className="relative mb-3 w-full group">
      <label className="text-[15px] flex flex-row">
        {label} {required ? <div className="text-red-500">*</div> : ""}
        {requiredField ? <div className="text-red-500">*</div> : ""}
      </label>
      {/* Added label */}
      <Select
        name={name}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        placeholder={
          <div className="select-placeholder-text">{` ${defaultLabel}`}</div>
        }
        isMulti={multiple}
        isDisabled={disabled}
        options={options}
        value={isEmptyObject(defaultValue) ? null : defaultValue}
        onChange={onchangeinput}
        onBlur={dropdownBlurred}
        required={required}
        styles={customStyles}
        className={className}
        isClearable={isClearable}
      />
      

      <div
        className={`text-xs flex h-[1em] transition-opacity duration-150 mt-1${
          errorMessage ? "text-[#FF0000]" : "text-[#4255ac]"
        } ${
          errorMessage || message ? "opacity-100" : "opacity-0"
        } ${errorDivCustomStyles}`}
      >
        {errorMessage || message}
      </div>
    </div>
  );
};

export default Dropdown;
