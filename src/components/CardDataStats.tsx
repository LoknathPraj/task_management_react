import React, { ReactNode } from "react";

// Define the types for the props
interface CardDataStatsProps {
  title: string;
  total: string | number;
  children: ReactNode;
}

export const CardDataStats: React.FC<CardDataStatsProps> = ({ title, total, children }) => {
  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white py-5 px-7 shadow-default dark:border-strokedark dark:bg-boxdark flex items-center">
        <div className="flex h-13 w-13 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {children}
        </div>
        <div className="ml-3">
          <span className="text-black dark:text-white">{title}</span>
          <span className="text-black dark:text-white">{total}</span>
        </div>
      </div>
    </div>
  );
};

interface CircularCardDataStatsProps {
  title: string;
  total: string | number;
  children: ReactNode;
}

export const CircularCardDataStats: React.FC<CircularCardDataStatsProps> = ({ title, total, children }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center justify-center rounded-full w-60 h-60 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {children}
        </div>
        <div className="mt-2">
          <span className="text-black dark:text-white font-semibold">
            {title}
          </span>
          <span className="text-black dark:text-white">{total}</span>
        </div>
      </div>
    </div>
  );
};
