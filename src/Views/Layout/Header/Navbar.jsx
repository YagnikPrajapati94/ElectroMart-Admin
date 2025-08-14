
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { speak } from "../../Layout/utils/speak";

const Navbar = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);

  // Logout function without Firebase
  const handleLogout = () => {
    sessionStorage.removeItem("adminToken"); // remove your JWT
    toast.info("Logout successful");
    speak("Logout successful");
    navigate("/login");
  };

  // Decode token to get expiration
  const getTokenExpiry = () => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // convert seconds to ms
    } catch (error) {
      console.error("Invalid token format", error);
      return null;
    }
  };

  useEffect(() => {
    const expiryTime = getTokenExpiry();
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        clearInterval(interval);
        toast.error("Session expired");
        speak("Session expired");
        sessionStorage.removeItem("adminToken");
        navigate("/login");
        // handleLogout();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <nav className="navbar  navbar-expand-lg border-bāottom border-secondary border-opacity-10  bg-white  ">
      <div className="container-fluid">
        <button
          className="navbar-toggler border-0 p-0 shadow-none"
          data-bs-target="#offcanvas"
          aria-controls="offcanvas"
          aria-label="Toggle navigation"
        >
          <i className="bi text-black bi-list fs-1"></i>
        </button>

        <div className="ms-auto me-3 my-2    login-btn rounded-3 text-light  ">
          <div className="d-flex align-items-center gap-2 px-3 py-1  ">
            <i className="bi bi-clock-history  fs-5"></i>
            <span className="fw-medium  small">
              {timeLeft ? `${formatTime(timeLeft)}` : "----"}
            </span>
          </div>
        </div>
        <button
          className="navbar-toggler border-0 p-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi text-black bi-three-dots-vertical fs-2"></i>
        </button>
        <div
          className="collapse navbar-collapse nav-menu mt-lg-0 rounded-3"
          id="navbarSupportedContent"
        >
          <ul className="nav d-flex nav-list justify-content-center ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link nav-content position-relative" href="#">
                <i className="bi bi-envelope-fill fs-5"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-content" href="#">
                <i className="bi bi-stack fs-5"></i>
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link nav-content d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle fs-5 me-2"></i>
                <span className="fw-medium">Hi, Admin</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow rounded-3   border-0 rounded-0 mt-3">
                <li>
                  <a
                    className="dropdown-item  d-flex align-items-center gap-2"
                    href="#"
                  >
                    <i className="bi bi-person-fill"></i>
                    My Profile
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item text-danger btn d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
