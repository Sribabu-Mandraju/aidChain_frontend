"use client"

import { useState } from "react"
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
} from "react-icons/fa"
import { Link } from "react-router-dom"
import ConnectWalletComponent from '../shared/ConnectWallet'
import LogoImage from '../../assets/about/logo.png'; // Import the logo

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    if (isDropdownOpen) setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const menuItems = [
    { label: "Home", link: "/", icon: FaHome },
    { label: "Campaigns", link: "/campaigns", icon: FaHeart },
    { label: "D.A.O", link: "/dao", icon: FaGlobe },
    { label: "About", link: "/about", icon: FaInfoCircle },
    { label: "Donation", link: "/donation", icon: FaDonate },
  ]

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
                className="p-2 rounded-lg text-gray-600 hover:bg-green-100 hover:text-green-700 transition-all duration-300 ease-in-out"
                aria-label="Toggle sidebar"
              >
                <FaBars className="w-6 h-6" />
              </button>
              <a href="/" className="ml-4 flex items-center space-x-2">
                <img 
                  src={LogoImage} 
                  alt="Relief Logo" 
                  className="w-[60px] h-[60px] rounded-xl  transform  duration-300 object-cover"
                />
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Relief</span>
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
                          className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-green-100 overflow-hidden transform transition-all duration-300 ease-in-out ${
                          isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
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

            {/* Right side - Connect Wallet Button */}
            <div>
              <ConnectWalletComponent />
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
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Relief</span>
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
                        className={`w-5 h-5 ml-auto transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {/* Dropdown in Sidebar */}
                    <div
                      className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                        isDropdownOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
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
          </div>

          {/* Sidebar Footer */}
          <div className="pt-6 border-t border-green-100">
            <ConnectWalletComponent />
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar;