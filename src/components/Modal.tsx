import React from "react";

import { Oval } from "react-loader-spinner";

interface ModalProps {
  modalSize?: string;
  modalHeight?: string;
  modalHeader?: React.ReactNode | string;
  modalBody?: React.ReactNode;
  modalFooter?: React.ReactNode;
  customFooter?: boolean;
  isLoading?: boolean;
  onClickButton?: (type: any) => void;
  positiveButtonTitle?: string;
  negativeButtonTitle?: string;
  hideNegativeButton?: boolean;
  children?: React.ReactNode | string;
}

const Modal: React.FC<ModalProps> = ({
  modalSize = "",
  // modalSize = "max-w-lg",
  // modalHeight = "h-[300px] lg:h-[350px]",
  modalHeight = "min-h-[200px] lg:min-h-[200px] max-h-full lg:max-h-full",
  modalHeader,
  modalBody,
  modalFooter,
  customFooter = false,
  isLoading = false,
  onClickButton,
  positiveButtonTitle = "Submit",
  negativeButtonTitle = "Close",
  hideNegativeButton = false,
  children,
}) => {
  const footerSection = () => {
    return (
      <div className="flex justify-center gap-4">
        {isLoading && (
          <Oval
            height={35}
            width={35}
            strokeWidth={5}
            color={"#1f7fbb"}
            ariaLabel="loading"
          />
        )}
        <button
          onClick={() => onClickButton && onClickButton(positiveButtonTitle)}
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-700 text-white rounded ${
            isLoading ? "opacity-50" : "opacity-100"
          }`}
        >
          {positiveButtonTitle}
        </button>
        {!hideNegativeButton && (
          <button
            onClick={() => onClickButton && onClickButton("")}
            className="px-4 py-2 border-2 border-primary text-black rounded"
          >
            {negativeButtonTitle}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[1px]
       flex justify-center items-center z-[1000]"
      id="wrapper"
    >
      <div
        className={`bg-white w-full sm:w-[90%] md:w-[80%] lg:w-[60%] 
          xl:w-[50%] 2xl:w-[40%] lg:shadow-lg lg:transform-none fade-1
           relative rounded-md ${modalSize}`}
      >
        {modalHeader === "object" ? (
          <div
            className="bg-blue-700 text-white flex items-center 
          justify-center relative font-semibold text-lg 
          border-b border-gray-200 rounded-t-md p-3"
          >
            {modalHeader}
          </div>
        ) : (
          <div
            className="bg-blue-700 text-white flex 
          items-center justify-center relative font-semibold 
          text-lg border-b border-gray-200 rounded-t-md p-3"
          >
            <h2 className="text-lg font-bold">{modalHeader}</h2>
          </div>
        )}
        {children ? (
          <div className={`overflow-auto ${modalHeight}`}>{children}</div>
        ) : (
          <>
            <div className={`overflow-auto ${modalHeight}`}>
              <div className="p-4">{modalBody}</div>

              {customFooter && (
                <div
                  className="flex justify-end space-x-2
             border-t border-blue-gray-300 p-3"
                >
                  {onClickButton ? footerSection() : modalFooter}
                </div>
              )}
            </div>
            {!customFooter && modalFooter && (
              <div
                className="flex justify-end space-x-2
           border-t border-blue-gray-300 p-3"
              >
                {onClickButton ? footerSection() : modalFooter}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
