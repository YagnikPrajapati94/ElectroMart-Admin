import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
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
import "react-loading-skeleton/dist/skeleton.css";
import Unauthorized from "./Views/Pages/Unauthorized.jsx";
import AddCategory from "./Views/Pages/categories/AddCategory.jsx";
import AddSubCategory from "./Views/Pages/categories/AddSubCategory.jsx";
import ManageCatSub from "./Views/Pages/categories/ManageCatSub.jsx";
import AddAttribute from "./Views/Pages/categories/AddAttribute.jsx";



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

          {/* Products routes  */}
          <Route
            path="/admin/products/add"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />

          {/* brands routes  */}
          <Route
            path="/admin/brands"
            element={
              <PrivateRoute>
                <Brand />
              </PrivateRoute>
            }
          />

          {/* categories routes */}
          <Route
            path="/admin/categories/addCategory"
            element={
              <PrivateRoute>
                <AddCategory />
              </PrivateRoute>
            }
          />
          <Route path="/admin/categories/addSubCategory" element={<PrivateRoute>
            <AddSubCategory />
          </PrivateRoute>} />

          <Route path="/admin/categories/addAttribute" element={<PrivateRoute><AddAttribute /></PrivateRoute>} />

          <Route
            path="/admin/categories/manage"
            element={
              <PrivateRoute>
                <ManageCatSub />
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
