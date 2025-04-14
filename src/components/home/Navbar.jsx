import { useState } from "react";
import {
  FaHome,
  FaHeart,
  FaInfoCircle,
  FaPhone,
  FaGlobe,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaDonate,
  FaBell,
  FaHandHoldingUsd,
  FaChartLine,
  FaRocket,
  FaUsers,
} from "react-icons/fa";
import { IoMdMegaphone } from "react-icons/io";

import { Link } from "react-router-dom";
import ConnectWalletComponent from "../shared/ConnectWallet";
import LogoImage from "../../assets/about/logo.png"; // Import the logo

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const menuItems = [
    { label: "Home", link: "/", icon: FaHome },
    { label: "Campaigns", link: "/campaigns", icon: FaHeart },
    { label: "D.A.O", link: "/dao", icon: FaGlobe },
    { label: "About", link: "/about", icon: FaInfoCircle },
    { label: "Donation", link: "/donation", icon: FaDonate },
  ];

  // Sample notifications data with icons
  const notifications = [
    {
      id: 1,
      title: "New Campaign Started",
      message: "Help support the education fund for underprivileged children",
      time: "2 hours ago",
      read: false,
      icon: FaHandHoldingUsd,
      iconColor: "text-blue-500"
    },
    {
      id: 2,
      title: "Donation Received",
      message: "Your recent donation has been successfully processed",
      time: "5 hours ago",
      read: false,
      icon: FaHandHoldingUsd,
      iconColor: "text-green-500"
    },
    {
      id: 3,
      title: "Campaign Update",
      message: "The medical relief campaign has reached 75% of its goal",
      time: "1 day ago",
      read: true,
      icon: FaChartLine,
      iconColor: "text-purple-500"
    },
    {
      id: 4,
      title: "New Feature Available",
      message: "Check out our new donation tracking dashboard",
      time: "2 days ago",
      read: true,
      icon: FaRocket,
      iconColor: "text-orange-500"
    },
    {
      id: 5,
      title: "Community Milestone",
      message: "We've helped over 10,000 people this month!",
      time: "3 days ago",
      read: true,
      icon: FaUsers,
      iconColor: "text-pink-500"
    }
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Menu Button and Logo */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hidden sm:block text-gray-600 hover:bg-green-100 hover:text-green-700 transition-all duration-300 ease-in-out"
                aria-label="Toggle sidebar"
              >
                <FaBars className="w-6 h-6" />
              </button>
              <a href="/" className=" flex items-center space-x-2">
                <img
                  src={LogoImage}
                  alt="Relief Logo"
                  className="w-[70px] h-[80px] rounded-xl  transform  duration-300 object-cover"
                />
                <span className="text-2xl hidden sm:block font-extrabold text-gray-900 tracking-tight">
                  Relief
                </span>
              </a>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              {menuItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.subItems ? (
                    <div className="relative group">
                      <button
                        onClick={toggleDropdown}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
                      >
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.label}
                        <FaChevronDown
                          className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-green-100 overflow-hidden transform transition-all duration-300 ease-in-out ${
                          isDropdownOpen
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <a
                            key={subIndex}
                            href={subItem.href}
                            className="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                          >
                            <FaChevronRight className="w-4 h-4 mr-2" />
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.link}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right side - Connect Wallet Button and Notifications */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={toggleNotification}
                  className="p-2 rounded-lg text-gray-600 hover:bg-green-100 hover:text-green-700 transition-all duration-300 relative"
                  aria-label="Notifications"
                >
                  <FaBell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="fixed sm:absolute top-16 right-0 sm:right-4 w-full sm:w-96 bg-white rounded-xl shadow-xl border border-green-100 overflow-hidden transform transition-all duration-300 ease-in-out z-[60]">
                    <div className="p-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-white">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{notifications.filter(n => !n.read).length} unread</span>
                          <button 
                            onClick={() => setIsNotificationOpen(false)}
                            className="sm:hidden p-1 rounded-lg hover:bg-green-100"
                          >
                            <FaTimes className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-[calc(100vh-8rem)] sm:max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-green-50 hover:bg-green-50/50 transition-all duration-200 ${
                            !notification.read ? "bg-green-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 rounded-lg text-green-400 bg-opacity-10`}>
                              <IoMdMegaphone className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">{notification.time}</span>
                                {!notification.read && (
                                  <button className="text-xs text-green-600 hover:text-green-700 font-medium px-2 py-1 rounded-lg hover:bg-green-50">
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-green-100 bg-gradient-to-r from-white to-green-50">
                      <div className="flex items-center justify-between">
                        <a
                          href="/notifications"
                          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200 flex items-center"
                        >
                          View All Notifications
                          <FaChevronRight className="w-3 h-3 ml-1" />
                        </a>
                        <button className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-green-50">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block">
                <ConnectWalletComponent />
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg sm:hidden text-gray-600 hover:bg-green-100 hover:text-green-700 transition-all duration-300 ease-in-out"
                aria-label="Toggle sidebar"
              >
                <FaBars className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-500 ease-in-out"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-500 ease-in-out shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <img
                src={LogoImage}
                alt="Relief Logo"
                className="w-9 h-9 rounded-xl shadow-md object-cover"
              />
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Relief
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-green-100 hover:text-green-700 transition-all duration-300"
              aria-label="Close sidebar"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={toggleDropdown}
                      className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-green-100 hover:text-green-600 rounded-xl transition-all duration-300"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                      <FaChevronDown
                        className={`w-5 h-5 ml-auto transform transition-transform duration-300 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button> 
                    {/* Dropdown in Sidebar */}
                    <div
                      className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                        isDropdownOpen
                          ? "opacity-100 max-h-96"
                          : "opacity-0 max-h-0 overflow-hidden"
                      }`}
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.to}
                          className="flex items-center px-4 py-2 text-gray-500 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200"
                          onClick={toggleSidebar}
                        >
                          <FaChevronRight className="w-4 h-4 mr-3" />
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.link}
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-green-100 hover:text-green-600 rounded-xl transition-all duration-300"
                    onClick={toggleSidebar}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            {/* <div className="p-4">
              <button
                onClick={toggleNotification}
                className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-green-100 hover:text-green-600 rounded-xl transition-all duration-300"
              >
                <div className="relative">
                  <FaBell className="w-5 h-5 mr-3" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                Notifications
                <span className="ml-auto text-sm text-gray-500">
                  {notifications.filter(n => !n.read).length} unread
                </span>
              </button>
            </div> */}
          </div>

          {/* Sidebar Footer */}
          <div className="pt-6 mb-[60px] border-t border-green-100">
            <ConnectWalletComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
