import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import Logo from "../../Layout/Component/logo";

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
                toast.success("Login successful. Welcome Admin!");
                reset();
                navigate("/admin/dashboard");
            } else {
                toast.error("Access denied. You are not an admin.");
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="container-fluid bg-light" style={{ height: "100vh" }}>
            <div className="row h-100">

                {/* Left Side (Image + Welcome) */}
                <div
                    className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-center bg-white "
                    data-aos="fade"
                >
                    <div className=" mx-auto">
                        <Logo />
                    </div>
                    <h2 data-aos="slide-up" data-delay="100" className="fw-bold mb-3">Welcome to ElectroMart Admin Portal</h2>
                    <p data-aos="slide-up" data-delay="200" className="text-muted" style={{ maxWidth: "400px" }}>
                        Manage your store, view reports, handle users and keep things running smoothly — all from one dashboard.
                    </p>
                    <small data-aos="slide-up" data-delay="300" className="text-muted mt-4">© 2025 ElectroMart. Admin Access Only.</small>
                </div>

                {/* Right Side - Login */}
                <div
                    className="col-lg-6 p-0 align-content-center bg-light"

                >
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="rounded-5 bg-light mx-auto p-md-5 p-3"
                        data-aos="zoom-in"
                        data-aos-duration="2000"
                    >
                        {/* Heading */}
                        <div className="text-center mb-4">
                            <i className="bi bi-shield-lock-fill fs-1 text-primary mb-2"></i>
                            <h2 className="fw-bold text-dark">Admin Panel Login</h2>
                            <p className="text-muted fs-6">Access for authorized admin users only</p>
                        </div>

                        {/* Email */}
                        <div className="form-floating mb-4 position-relative">
                            <input
                                type="email"
                                id="adminEmail"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                placeholder="admin@example.com"
                                {...register("email", { required: "Email is required" })}
                            />
                            <label htmlFor="adminEmail">Email Address</label>
                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                        </div>

                        {/* Password */}
                        <div className="form-floating mb-4 position-relative">
                            <input
                                type="password"
                                id="adminPassword"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                placeholder="••••••••"
                                {...register("password", { required: "Password is required" })}
                            />
                            <label htmlFor="adminPassword">Password</label>
                            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                        </div>

                        {/* Button */}
                        <div className="d-grid mb-2">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <>
                                        <i className="bi bi-box-arrow-in-right me-2"></i> Login
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-muted mt-3 fs-6">
                            Need help? <a href="mailto:support@electromart.com">Contact Support</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>


    );
}
