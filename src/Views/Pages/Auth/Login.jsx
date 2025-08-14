import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { speak } from "../../Layout/utils/speak";

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Call your backend login API
      const response = await axios.post(`${apiUrl}/api/login`, data);

      // if (!response.ok) {
      //     const err = await response.json();
      //     throw new Error(err.message || "Login failed");
      // }

      // console.log(response);
      const result = response.data;

      // Example response: { token: "...jwt...", user: { role: "admin", email: "..."} }

      // Save token to sessionStorage
      sessionStorage.setItem("adminToken", result.token);

      // Check role from response
      if (result.data.role === "admin") {
        speak("Login successful");
        toast.success("Login successful");

        reset();
        navigate("/admin/dashboard");
      } else {
        toast.error("Access denied. You are not an admin.");
        speak("Access denied. You are not an admin.");
      }
    } catch (error) {
      speak("Login failed. Please try again.");
      toast.error("Login failed. Please try again.");

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
            className="rounded-5 mx-auto p-md-5 p-3"
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
              className="text-muted text-center mb-3 fs-6"
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
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="admin@example.com"
                {...register("email", { required: "Email is required" })}
              />
              <label htmlFor="adminEmail">Work Email Address</label>
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
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              <label htmlFor="adminPassword">Secure Password</label>
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
              className="text-center text-muted mt-3 fs-6"
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
