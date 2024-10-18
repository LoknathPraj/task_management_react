import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
function Input(props: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props?.autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [props?.autoFocus]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const number = value.replace(/[^0-9]/g, "");
    const text = value.replace(/[^a-zA-Z]/g, "");
    if (props?.handleChange) {
      props.handleChange(e);
    }
    if (number.length >= 0 && props?.getInputNumber) {
      e.target.value = number;
      props.getInputNumber(e);
    }
    if (
      number.length >= 0 &&
      number.length <= 10 &&
      props?.getInputPhoneNumber
    ) {
      e.target.value = number.slice(0, 10);
      props?.getInputPhoneNumber(e);
    }
    if (text.length >= 0 && props?.getInputText) {
      e.target.value = text;
      props?.getInputText(e);
    }
  };

  return (
    <div className="mb-1">
      {props?.label ? (
        props?.customLabelDiv ? (
          <div className="flex flex-row justify-between text-[15px]">
            <div>
              {props?.label}
              {props?.requiredField && <span className="text-red-600">*</span>}
              {props?.required && <span className="text-red-600">*</span>}
            </div>
            <div>{props?.customLabelDiv}</div>
          </div>
        ) : (
          <div className="flex flex-row justify-between text-[15px]">
            <div>
              {props?.label}
              {props?.requiredField && <span className="text-red-600">*</span>}
              {props?.required && <span className="text-red-600">*</span>}
            </div>
            {/*  <div>
             {props?.isPasswordField ? (
                  <FontAwesomeIcon onClick={props?.toggleMode}
                  icon={props?.toggleStatus ? faEyeSlash : faEye}
                />  
                 //<button type="button" onClick={props?.toggleMode}>
                  //{props?.toggleStatus ? "Hide password" : "Show Password"}
                //</button>
              ) : (           
                 ""
              )}
            </div> */}
          </div>
        )
      ) : null}
      <div
        className={`${
          props?.isPasswordField
            ? `relative ${props?.passwordInputDivStyles}`
            : ""
        }`}
      >
        <input
          ref={inputRef}
          autoComplete={"off"}
          name={props?.name}
          placeholder={`${props?.placeholder || ""} `}
          value={props?.value || ""}
          required={props?.required}
          disabled={props?.disabled}
          style={{ color: props?.disabled ? "#A0A0A0" : "inherit" }}
          className={`w-full rounded border-[1px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary required-field  ${props?.className}`}
          onChange={props?.onChange || onChangeInput}
          type={props?.type}
          readOnly={props?.readOnly || false}
          onKeyDown={props?.onKeyDown}
          onFocus={props?.onFocus}
          onBlur={props?.onBlur}
          maxLength={props?.maxLength}
        />
        {props?.regeneratePasswordOption && !props?.regeneratePassword ? (
          <Tooltip title="Regenerate Password">
            <img
              onClick={props.onClickRegeneratePasswordIcon}
              className="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-primary"
              src="/images/reset-password.png"
              alt="resetPassword"
            />
          </Tooltip>
        ) : (
          props?.isPasswordField && (
            <Tooltip
              title={
                !props?.toggleEyeIconState ? "View Password" : "Hide Password"
              }
            >
              <FontAwesomeIcon
                onClick={props?.toggleEyeIcon}
                icon={props?.toggleEyeIconState ? faEyeSlash : faEye}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-primary"
              />
            </Tooltip>
          )
        )}
      </div>
      <div
        className={`text-xs mt-1 h-[1em] flex transition-opacity duration-150 relative ${
          props.error ? "text-[#FF0000]" : "text-[#4255ac]"
        } ${props?.error || props.message ? "opacity-100" : "opacity-0"} ${
          props.errorDivCustomStyles
        }`}
      >
        {props?.error || props?.message}
      </div>
    </div>
  );
}
export default Input;
