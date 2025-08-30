import React from "react";
import { Oval } from "react-loader-spinner";

type LoaderProps = {
  size?: number;
  color?: string;
  text?: string;
  showBackground?: boolean;
};

const Loader: React.FC<LoaderProps> = ({ 
  size = 60, 
  color = "#3B82F6", 
  text = "Loading...",
  showBackground = true 
}) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      showBackground ? 'bg-black/20 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center space-y-4 min-w-[200px]">
        <Oval
          visible={true}
          height={size}
          width={size}
          strokeWidth={4}
          color={color}
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        {text && (
          <p className="text-gray-600 font-medium text-sm">{text}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;
