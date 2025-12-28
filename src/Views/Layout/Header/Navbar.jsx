import React, { useEffect, useState } from "react";
import { href, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { speak } from "../../Layout/utils/speak";
import AuthSerivce from "../../Services/AuthService";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const shortcutItems = [
    {
      href: "/admin/brands",
      title: "Brands",
      icon: "bi bi-tags-fill",
      subTitle: "Manage brands",
    },
    {
      href: "/admin/products/manage",
      title: "Products",
      icon: "bi bi-box-seam",
      subTitle: "Manage products",
    },
    {
      href: "/admin/categories/manage",
      title: "Categories",
      icon: "bi bi-tags-fill",
      subTitle: "Manage categories",
    },
    {
      href: "/admin/orders",
      title: "Orders",
      icon: "bi bi-bag-check-fill",
      subTitle: "Manage orders",
    },
    {
      href: "/admin/users",
      title: "Users",
      icon: "bi bi-people-fill",
      subTitle: "Manage users",
    },
    {
      href: "/admin/reviews",
      title: "Reviews",
      icon: "bi bi-star-fill",
      subTitle: "Manage reviews",
    },
  ];

  // Logout function without Firebase
  const handleLogout = async () => {
    try {
      const response = await AuthSerivce.logout();
      console.log(response);
      if (response.data.success) {
        setIsAuthenticated(false);
        navigate("/login");
        speak("Logged out successfully");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="navbar  navbar-expand-lg  ">
      <div className="container-fluid">
        <button
          className="navbar-toggler z-3 btn border-0 p-0 shadow-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvas"
          aria-controls="offcanvas"
          aria-label="Toggle navigation"
        >
          <i className="bi TitleText bi-list fs-1"></i>
        </button>

        {/* <button
          className="navbar-toggler border-0 p-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi TitleText bi-three-dots-vertical fs-2"></i>
        </button> */}
        <ul className="nav d-flex gap-4 nav-list justify-content-center ms-auto align-items-center">
          <li className="nav-item dropdown">
            <a
              className="nav-link nav-content  p-0"
              href="#"
              onClick={() => toggleTheme()}
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {isDarkMode ? (
                <i className="bi bi-moon-stars fs-5"></i>
              ) : (
                <i className="bi bi-sun fs-5"></i>
              )}
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link nav-content  p-0"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-grid fs-5"></i>
            </a>
            <ul className="dropdown-menu overflow-hidden  shortcut-dropdown dropdown-menu-end ms-auto shadow rounded-1 py-0   border-0 rounded-0 mt-4">
              <li className="dropdown-header  TitleText py-3">Shortcuts</li>
              <li className="nav-link pt-0 pb-0 px-2 ">
                <div className="row ">
                  {shortcutItems.map((item, index) => (
                    <div className="col-6  px-0" key={index}>
                      <Link
                        to={item.href}
                        className="dropdown-item d-grid shortcut-item p-3  border-0 text-center align-items-center gap-2"
                      >
                        <i className={`${item.icon} mx-auto`}></i>
                        <div className="">
                          <p className="m-0 ">{item.title}</p>
                          <p className="m-0 small">{item.subTitle}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link nav-content  p-0"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="/profile/profile.png"
                className="img-fluid avatar rounded-circle"
                alt=""
              />
            </a>
            <ul className="dropdown-menu  overflow-hidden py-0 profile-dropdown dropdown-menu-end shadow rounded-1  border-0 rounded-0 mt-3">
              <li className="dropdown-header  py-3 d-flex align-items-center gap-2">
                <img
                  src="/profile/profile.png"
                  className="img-fluid avatar  rounded-circle"
                  alt=""
                />
                <div className="">
                  {user && (
                    <h6 className="fw-bold TitleText mb-0">
                      {user.firstName} {user.lastName}
                    </h6>
                  )}

                  <p className="fw-light SubtitleText mb-0 mt-1 ">Admin</p>
                </div>
              </li>
              <li className="nav-link px-0 py-0">
                <a
                  className="dropdown-item profile-item py-2 SubtitleText  d-flex align-items-center gap-2"
                  href="#"
                >
                  <i className="bi bi-person-fill"></i>
                  My Profile
                </a>
              </li>
              <li className="nav-link px-0 py-0">
                <button
                  onClick={handleLogout}
                  className="dropdown-item profile-item py-2 text-danger btn d-flex align-items-center gap-2"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
        {/* <div
          className="collapse navbar-collapse nav-menu mt-lg-0 rounded-3"
          id="navbarSupportedContent"
        >
         
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
