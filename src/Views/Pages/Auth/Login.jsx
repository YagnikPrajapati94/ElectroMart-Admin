import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

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
                        <svg

                            // className='border'
                            style={{ width: '100%', maxWidth: '250px' }}
                            // width="350"
                            // height="80"
                            viewBox="0 0 250 80"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-label="ElectroMart logo"
                        >
                            {/* Icon group: scaled up and centered vertically */}
                            <g transform="translate(20, 20) scale(1.5)">
                                <path
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                    d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                                />
                            </g>

                            {/* Text group: shifted closer to icon */}
                            <g transform="translate(70, 30)">
                                <text
                                    x="0"
                                    y="0"
                                    fontFamily="Poppins, sans-serif"
                                    fontSize="24"
                                    fill="#0D6EFD"
                                    fontWeight="600"
                                    dominantBaseline="middle"
                                    textAnchor="start"
                                >
                                    Electro
                                </text>
                                <text
                                    x="90"
                                    y="0"
                                    fontFamily="Poppins, sans-serif"
                                    fontSize="24"
                                    fill="#FF6F00"
                                    fontWeight="700"
                                    dominantBaseline="middle"
                                    textAnchor="start"
                                >
                                    Mart
                                </text>
                                <text
                                    x="0"
                                    y="25"
                                    fontFamily="Poppins, sans-serif"
                                    fontSize="13"
                                    fill="gray"
                                    dominantBaseline="middle"
                                    textAnchor="start"
                                >
                                    Online Shopping
                                </text>
                            </g>
                        </svg>
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
