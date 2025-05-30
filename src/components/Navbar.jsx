import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMenu, FiX, FiLogOut, FiBriefcase, FiUser, FiSettings, FiShoppingCart, FiPackage, FiUsers
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { logoutVendor } from '../features/vendors/vendorSlice';
import { logout as logoutAdmin } from '../features/admin/adminSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth || {});
  const vendorState = useSelector((state) => state.vendorAuth || state.vendor || {});
  const adminState = useSelector((state) => state.adminAuth || {});

  const { isAuthenticated, user } = authState;
  const { isAuthenticated: isVendorAuthenticated, vendor } = vendorState;
  const { isAuthenticated: isAdminAuthenticated, admin } = adminState;

  const isUserLoggedIn = isAuthenticated || isVendorAuthenticated || isAdminAuthenticated;
  const currentUser = user || vendor || admin;

  const getUserRole = () => {
    if (!currentUser) return 'user';
    if (
      currentUser.role === 'admin' || currentUser.userType === 'admin' ||
      currentUser.type === 'admin' || isAdminAuthenticated
    ) return 'admin';
    if (
      currentUser.role === 'vendor' || currentUser.userType === 'vendor' ||
      currentUser.type === 'vendor' || isVendorAuthenticated
    ) return 'vendor';
    return 'user';
  };

  const getDisplayName = () => {
    if (!currentUser) return 'User';
    const isAdmin = getUserRole() === 'admin';
    const isVendor = getUserRole() === 'vendor';
    if (isAdmin)
      return (currentUser.name || currentUser.username || currentUser.firstName || currentUser.email?.split('@')[0] || 'Admin').substring(0, 10);
    if (isVendor)
      return (currentUser.businessName || currentUser.name || currentUser.username || 'Vendor').substring(0, 10);
    return (currentUser.name || currentUser.username || currentUser.firstName || 'User').substring(0, 10);
  };

  const handleLogout = () => {
    if (isAdminAuthenticated) {
      dispatch(logoutAdmin());
    } else if (isVendorAuthenticated) {
      dispatch(logoutVendor());
    } else {
      dispatch(logout());
    }
    setProfileDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userRole = getUserRole();

  const renderUserDropdown = () => (
    <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded z-50">
      <li>
        <span className="block px-4 py-2 text-sm font-semibold text-white bg-[#09365d]">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </span>
      </li>
      <li>
        <Link to={`/${userRole}/dashboard`} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
          <FiUser size={16} /> Dashboard
        </Link>
      </li>
      <li>
        <Link to={`/${userRole}/profile`} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
          <FiSettings size={16} /> My Profile
        </Link>
      </li>
      {userRole === 'user' && (
        <>
          <li>
            <Link to="/user/cart" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiShoppingCart size={16} /> Cart
            </Link>
          </li>
          <li>
            <Link to="/user/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiPackage size={16} /> My Orders
            </Link>
          </li>
          <li>
            <Link to="/user/bookings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiPackage size={16} /> My Bookings
            </Link>
          </li>
        </>
      )}
      {userRole === 'vendor' && (
        <>
          <li>
            <Link to="/vendor/services" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiBriefcase size={16} /> My Services
            </Link>
          </li>
          <li>
            <Link to="/vendor/bookings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiPackage size={16} /> Bookings
            </Link>
          </li>
          <li>
            <Link to="/vendor/analytics" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiSettings size={16} /> Analytics
            </Link>
          </li>
        </>
      )}
      {userRole === 'admin' && (
        <>
          <li>
            <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiUsers size={16} /> Manage Users
            </Link>
          </li>
          <li>
            <Link to="/admin/vendors" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiBriefcase size={16} /> Manage Vendors
            </Link>
          </li>
          <li>
            <Link to="/admin/bookings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiPackage size={16} /> All Bookings
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 no-underline">
              <FiSettings size={16} /> System Settings
            </Link>
          </li>
        </>
      )}
      <li><hr className="my-1" /></li>
      <li>
        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center gap-2">
          <FiLogOut size={16} /> Logout
        </button>
      </li>
    </ul>
  );

  return (
    <header className="bg-white px-4 py-3 shadow-sm w-full">
      <div className="mx-auto flex justify-between items-center w-full">
        <Link to="/" className="flex items-center" style={{ textDecoration: 'none' }}>
          <h3 className="text-xl font-bold text-gray-800">
            <span className="text-black">My</span>
            <span className="text-[#0F4C81]">BestVenue</span>
          </h3>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-gray-700 focus:outline-none">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <nav className="lg:flex items-center space-x-6 ml-auto hidden">
          <Link to="/wedding-vendor" className="text-black hover:text-[#0F4C81]" style={{ textDecoration: 'none' }}>Vendors</Link>
          <Link to="/Wedding_Venues" className="text-black" style={{ textDecoration: 'none' }}>Venues</Link>
          <Link to="/planning-tools" className="text-black" style={{ textDecoration: 'none' }}>Planning Tools</Link>
          <Link to="/IdeaBlog" className="text-black" style={{ textDecoration: 'none' }}>Ideas & Blogs</Link>
          <Link to="/corporate" className="flex items-center gap-1 text-black" style={{ textDecoration: 'none' }}>
            <FiBriefcase /> Corporate
          </Link>
          {!isUserLoggedIn ? (
            <>
              <Link to="/user/login" className="flex items-center gap-1 text-black hover:text-[#0F4C81]" style={{ textDecoration: 'none' }}>Login</Link>
              <Link to="/user/signup" className="px-3 py-2 bg-[#09365d] text-white rounded hover:bg-[#0f4c81]" style={{ textDecoration: 'none' }}>Sign Up</Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="px-4 py-2 text-white rounded hover:bg-[#0f4c81] flex items-center gap-2 bg-[#09365d]"
              >
                <FiUser size={16} />{getDisplayName()}
              </button>
              {profileDropdown && renderUserDropdown()}
            </div>
          )}
        </nav>
      </div>
      {isOpen && (
        <div className="lg:hidden mt-2 space-y-2 px-4">
          <Link to="/wedding-vendor" className="block text-gray-700 hover:text-violet-700 no-underline">Vendors</Link>
          <Link to="/Wedding_Venues" className="block text-gray-700 hover:text-violet-700 no-underline">Venues</Link>
          <Link to="/planning-tools" className="block text-gray-700 hover:text-violet-700 no-underline">Planning Tools</Link>
          <Link to="/IdeaBlog" className="block text-gray-700 hover:text-violet-700 no-underline">Ideas & Blogs</Link>
          <Link to="/corporate" className="flex items-center gap-1 text-gray-700 hover:text-violet-700 no-underline">
            <FiBriefcase /> Corporate
          </Link>
          <hr />
          {!isUserLoggedIn ? (
            <div className="space-y-2">
              <Link to="/user/login" className="block w-full text-center border border-violet-900 py-2 rounded hover:bg-violet-900 hover:text-white no-underline">Login</Link>
              <Link to="/user/signup" className="block w-full text-center bg-[#0f4c81] text-white py-2 rounded hover:bg-violet-800 no-underline">Sign Up</Link>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-2 rounded text-white text-center bg-[#09365d]">
                {getDisplayName()} ({userRole})
              </div>
              <Link to={`/${userRole}/dashboard`} className="block text-gray-700 hover:text-violet-700 no-underline">Dashboard</Link>
              <Link to={`/${userRole}/profile`} className="block text-gray-700 hover:text-violet-700 no-underline">Profile</Link>
              <button onClick={handleLogout} className="w-full text-left text-red-600 hover:text-red-800">Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
