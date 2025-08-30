import { Link, useLocation } from "react-router-dom";
import DropdownUser from "./DropdownUser";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useEffect, useState, useContext } from "react";
import { FiHome, FiChevronRight } from "react-icons/fi";
import { AppContext } from "../../context/AppContext";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const location = useLocation();
  const appState: any = useContext(AppContext);
  const userRole = appState?.userDetails?.user?.role;

  const formatPathToTitle = (pathname: string): string => {
    if (pathname === '/') return 'Dashboard';
    return pathname
      .replace(/^\//, '') 
      .split('-') 
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(' '); 
  };

  const title = formatPathToTitle(location.pathname);

  const getBreadcrumbs = (pathname: string) => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: Array<{ name: string; path: string; icon: any }> = [{ name: 'Home', path: '/', icon: FiHome }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ name, path: currentPath, icon: null });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/80">
      <div className="flex flex-grow items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IoReorderThreeOutline className="w-6 h-6 text-gray-600" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center space-x-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center">
                {index > 0 && (
                  <FiChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
                <Link
                  to={breadcrumb.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    index === breadcrumbs.length - 1
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {breadcrumb.icon && <breadcrumb.icon className="w-4 h-4" />}
                  <span>{breadcrumb.name}</span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Page Title for Mobile */}
          <div className="sm:hidden">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>

          {/* User Dropdown - Only show for admin users */}
          {userRole === 10001 || userRole === 10002 ? (
            <DropdownUser />
          ) : (
            /* Simple user info for regular users */
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {appState?.userDetails?.user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {appState?.userDetails?.user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {appState?.userDetails?.user?.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
