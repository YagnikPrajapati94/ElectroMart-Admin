import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Views/Pages/AdminDashboard.jsx";
import Login from "./Views/Pages/Auth/Login.jsx";
import PrivateRoute from "./Views/PrivateRoute.jsx";
import { ToastContainer } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AddProduct from "./Views/Pages/products/AddProduct.jsx";
import Brand from "./Views/Pages/brands/Brand.jsx";
import Category from "./Views/Pages/categories/Category.jsx";
import "react-loading-skeleton/dist/skeleton.css";
import Unauthorized from "./Views/Pages/Unauthorized.jsx";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/* <Route path='/admin/products/add' element={<PrivateRoute><AddProduct /></PrivateRoute>} /> */}
          <Route
            path="/admin/brands"
            element={
              <PrivateRoute>
                <Brand />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <PrivateRoute>
                <Category />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
