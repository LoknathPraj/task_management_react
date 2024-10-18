import React, { useState } from "react";

import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header/index";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark bg-[#f1f5f9] font-verdana">
      <div className={`flex h-screen overflow-hidden `}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl py-4  ">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
