import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./App.css";
import "./Views/css/Swal.css";
import "./Views/css/skeleton.css";
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
import PublicRoute from "./Views/PublicRoute.jsx";
import AddBrand from "./Views/Pages/brands/AddBrand.jsx";

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
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Products routes  */}
          {/* <Route
            path="/admin/products/add"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          /> */}

          {/* brands routes  */}
          <Route
            path="/admin/brands/Manage"
            element={
              <PrivateRoute>
                <Brand />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/brands/add"
            element={
              <PrivateRoute>
                <AddBrand />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/brands/add/:editId"
            element={
              <PrivateRoute>
                <AddBrand />
              </PrivateRoute>
            }
          />

          {/* categories routes */}
          {/* <Route
            path="/admin/categories/addCategory"
            element={
              <PrivateRoute>
                <AddCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories/addSubCategory"
            element={
              <PrivateRoute>
                <AddSubCategory />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/categories/addAttribute"
            element={
              <PrivateRoute>
                <AddAttribute />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/categories/manage"
            element={
              <PrivateRoute>
                <ManageCatSub />
              </PrivateRoute>
            }
          /> */}

          <Route
            path="*"
            element={
              <PrivateRoute>
                <Unauthorized />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
