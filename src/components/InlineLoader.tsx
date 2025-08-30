import React from "react";
import { Oval } from "react-loader-spinner";

type InlineLoaderProps = {
  size?: number;
  color?: string;
  text?: string;
};

const InlineLoader: React.FC<InlineLoaderProps> = ({ 
  size = 20, 
  color = "#FFFFFF", 
  text 
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Oval
        visible={true}
        height={size}
        width={size}
        strokeWidth={3}
        color={color}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      {text && (
        <span className="text-sm font-medium">{text}</span>
      )}
    </div>
  );
};

export default InlineLoader;
