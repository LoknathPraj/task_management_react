import React, { useContext, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import TaskIcon from "@mui/icons-material/Task";
import { MdOutlineCancel } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import GroupIcon from "@mui/icons-material/Group";
import { AppContext } from "../../context/AppContext";
import LanIcon from "@mui/icons-material/Lan";
import TerminalIcon from "@mui/icons-material/Terminal";
import { MdRemoveRedEye } from "react-icons/md";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const appState: any = useContext(AppContext);
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const sidebarExpanded =
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true";

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const userRole = appState?.userDetails?.user?.role;

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 flex h-screen w-58 flex-col overflow-y-hidden overflow-auto bg-[#0e1a2c] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-3.5 lg:py-3.5">
        <NavLink to="">
          <img
            src={"/timesheet.png"}
            alt="Logo"
            className="w-[180px]  p-0 lg:align-middle mx-auto"
          />
        </NavLink>
        <div
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden "
        >
          <MdOutlineCancel className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="no-scrollbar mt-[-20px] flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-0 py-0 px-4 lg:mt-5 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {userRole == 10001 ? (
                <ul>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <RxDashboard className="w-5 h-5 " />
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/tasks"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <TaskIcon className="w-5 h-5 " />
                      Tasks
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/add-user"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <GroupIcon className="w-5 h-5 " />
                      Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/project"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <TerminalIcon className="w-5 h-5 " />
                      Projects
                    </NavLink>
                  </li>
                </ul>
              ) : (
                ""
              )}

              {userRole === 10000 ? (
                <ul>
                  {/* <li>
                    <NavLink
                      to="/dashboard"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <RxDashboard className="w-5 h-5 " />
                      Dashboard
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink
                      to="/add-task"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <TaskIcon className="w-5 h-5 " />
                      Add Task
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/view-tasks"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <MdRemoveRedEye className="w-5 h-5 " />
                      View Tasks
                    </NavLink>
                  </li>
                </ul>
              ) : (
                ""
              )}
              {userRole === 10002 ? (
                <ul>
                  {/* <li>
                    <NavLink
                      to="/dashboard"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <RxDashboard className="w-5 h-5 " />
                      Dashboard
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink
                      to="/add-admin"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <TaskIcon className="w-5 h-5 " />
                      Admins
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/department"
                      className="group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                    >
                      <LanIcon className="w-5 h-5 " />
                      Departments
                    </NavLink>
                  </li>
                </ul>
              ) : (
                " "
              )}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
