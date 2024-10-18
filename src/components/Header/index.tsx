import { Link, useLocation } from "react-router-dom";
import DropdownUser from "./DropdownUser";
/* import DarkModeSwitcher from "./DarkModeSwitcher"; */
import { IoReorderThreeOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [title, setTitle] = useState("");
  const location = useLocation();
  useEffect(() => {
    // document.title = title;
    setTitle(document.title?.split("|")?.[1]);
  }, [location, document.title]);

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between  px-4 py-2 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            {/* <!-- Hamburger Toggle BTN --> */}
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="z-99999 block rounded-sm border border-stroke bg-white  shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
            >
              <IoReorderThreeOutline className="w-8 h-8" />
            </button>

            <Link className="block flex-shrink-0 lg:hidden" to="/">
              <img src={"/images/amp.png"} alt="Logo" />
            </Link>
          </div>
          <div>
            <span className="lg:text-title-sm text-title-xsm font-semibold text-primary dark:text-white">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/*    <DarkModeSwitcher /> */}
            {/* <DropdownNotification /> */}
            {/* <DropdownMessage /> */}
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
