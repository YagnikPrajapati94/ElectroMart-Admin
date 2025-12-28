import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { speak } from "../../Layout/utils/speak";
import { Regex } from "../../Constants/Regex";
import { Errors } from "../../Constants/Errors";
import AuthSerivce from "../../Services/AuthService";
import { useAuth } from "../../Context/AuthContext";

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated, getMe } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Call your backend login API
      const response = await AuthSerivce.adminLogin(data);
      const result = response.data;
      console.log(result);
      if (result.success) {
        setIsAuthenticated(true);
        speak("Login successful");
        toast.success("Login successful");
        navigate("/admin/dashboard");
        getMe();
      }
    } catch (error) {
      speak(error.response.data.message);
      toast.error(error.response.data.message);
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid align-content-center login ">
      <div className="row justify-content-between">
        {/* Right Side - Login */}
        <div className="col-xl-4 col-lg-8 mx-auto p-0 align-content-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-5 mx-auto bg-transparent border-0 p-md-5 p-3"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            {/* Heading */}
            <div
              className="py-3  text-center  "
              data-aos="fade"
              data-aos-delay="200"
              data-aos-duration="600"
            >
              <img
                src="/logo/logo.png"
                className="img-fluid w-50"
                alt="ElectroMart Logo"
              />
            </div>

            <p
              className="SubtitleText text-center mb-3 fs-6"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="600"
            >
              Welcome back! Please enter your credentials to access the admin
              dashboard.
            </p>

            {/* Email */}
            <div
              className="form-floating mb-4 position-relative"
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-duration="600"
            >
              <input
                disabled={loading}
                type="email"
                id="adminEmail"
                autoComplete="off"
                placeholder=""
                {...register("email", {
                  required: Errors.required,
                  pattern: {
                    value: Regex.email,
                    message: Errors.invalidEmail,
                  },
                })}
                className={`form-control text-lowercase shadow-none  textFloatingInput ${
                  errors.email ? "is-invalid" : watch("email") ? "is-valid" : ""
                }`}
              />
              <label className="SubtitleText" htmlFor="adminEmail">
                Work Email Address
              </label>
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            {/* Password */}
            <div
              className="form-floating mb-4 position-relative"
              data-aos="fade-up"
              data-aos-delay="600"
              data-aos-duration="600"
            >
              <input
                disabled={loading}
                type="password"
                id="adminPassword"
                className={`form-control border shadow-none textFloatingInput ${
                  errors.password
                    ? "is-invalid "
                    : watch("password")
                    ? "is-valid"
                    : ""
                }`}
                placeholder=""
                {...register("password", {
                  required: Errors.required,
                  pattern: {
                    value: Regex.password,
                    message: Errors.invalidPassword,
                  },
                })}
              />
              <label htmlFor="adminPassword" className="SubtitleText">
                Secure Password
              </label>
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Button */}
            <div
              className="d-grid mb-2"
              data-aos="fade-up"
              data-aos-delay="700"
              data-aos-duration="600"
            >
              <button
                type="submit"
                className="btn shadow-none border-0 text-light  login-btn btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <p
              className="text-center SubtitleText mt-3 fs-6"
              data-aos="fade-up"
              data-aos-delay="800"
              data-aos-duration="600"
            >
              © 2025 ElectroMart. All rights reserved.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
