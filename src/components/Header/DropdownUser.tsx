import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";

const DropdownUser = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const userData = JSON.parse(localStorage.getItem("userDetails") || "{}");

  const context = useContext(AppContext);
  const appState: any = useContext(AppContext);
  
  if (!context) {
    throw new Error("YourComponent must be used within an AppProvider");
  }

  const { setUserDetails } = context;

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleLogout = () => {
    setUserDetails(null);
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 transition-colors"
      >
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
          <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
            dropdownOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-2 transition-all duration-200 ${
          dropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        {/* User Info */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            {appState?.userDetails?.user?.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {appState?.userDetails?.user?.email}
          </p>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <Link
            to="/user-profile"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            <FiUser className="w-4 h-4" />
            My Profile
          </Link>
          
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            <FiSettings className="w-4 h-4" />
            Settings
          </Link>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-100 pt-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropdownUser;
