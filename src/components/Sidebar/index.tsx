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
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiBarChart, 
  FiFolder,
  FiPlusCircle,
  FiEye
} from "react-icons/fi";

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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium transition-all duration-200 ease-in-out ${
      isActive
        ? "bg-primary-100 text-primary-700 border-r-2 border-primary-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-hidden bg-white shadow-xl duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-6 border-b border-gray-200">
        <NavLink to="" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MdOutlineCancel className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto flex-1">
        <nav className="px-4 py-6">
          <div className="space-y-2">
            {/* Admin Navigation */}
            {userRole === 10001 && (
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Administration
                </h3>
                <NavLink to="/new-dashboard" className={navLinkClass}>
                  <RxDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/tasks" className={navLinkClass}>
                  <TaskIcon className="w-5 h-5" />
                  <span>Task Management</span>
                </NavLink>
                <NavLink to="/add-user" className={navLinkClass}>
                  <FiUsers className="w-5 h-5" />
                  <span>User Management</span>
                </NavLink>
                <NavLink to="/project" className={navLinkClass}>
                  <FiFolder className="w-5 h-5" />
                  <span>Projects</span>
                </NavLink>
                <NavLink to="/task-type" className={navLinkClass}>
                  <FiSettings className="w-5 h-5" />
                  <span>Task Types</span>
                </NavLink>
                <NavLink to="/worklog-dashboard" className={navLinkClass}>
                  <FiBarChart className="w-5 h-5" />
                  <span>Worklog Dashboard</span>
                </NavLink>
              </div>
            )}

            {/* User Navigation */}
            {userRole === 10000 && (
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Task Management
                </h3>
                <NavLink to="/add-task" className={navLinkClass}>
                  <FiPlusCircle className="w-5 h-5" />
                  <span>Add Task</span>
                </NavLink>
                <NavLink to="/view-tasks" className={navLinkClass}>
                  <FiEye className="w-5 h-5" />
                  <span>View Tasks</span>
                </NavLink>
                <NavLink to="/worklog-dashboard" className={navLinkClass}>
                  <FiBarChart className="w-5 h-5" />
                  <span>Worklog Dashboard</span>
                </NavLink>
              </div>
            )}

            {/* Super Admin Navigation */}
            {userRole === 10002 && (
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  System Admin
                </h3>
                <NavLink to="/add-admin" className={navLinkClass}>
                  <FiUsers className="w-5 h-5" />
                  <span>Admin Management</span>
                </NavLink>
                <NavLink to="/department" className={navLinkClass}>
                  <LanIcon className="w-5 h-5" />
                  <span>Departments</span>
                </NavLink>
                <NavLink to="/worklog-dashboard" className={navLinkClass}>
                  <FiBarChart className="w-5 h-5" />
                  <span>Worklog Dashboard</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 px-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {appState?.userDetails?.user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {appState?.userDetails?.user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {appState?.userDetails?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
