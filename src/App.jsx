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
import ManageCatSub from "./Views/Pages/categories/ManageCatSub.jsx";
import PublicRoute from "./Views/PublicRoute.jsx";
import AddBrand from "./Views/Pages/brands/AddBrand.jsx";
import ManageCategory from "./Views/Pages/categories/ManageCategory.jsx";
import AddSubCategory from "./Views/Pages/subcategories/AddSubCategory.jsx";
import ManageSubCategory from "./Views/Pages/subcategories/ManageSubCategory.jsx";
import ManageUser from "./Views/Pages/User/ManageUser.jsx";
import AddAttribute from "./Views/Pages/attributes/AddAttribute.jsx";
import ManageProduct from "./Views/Pages/products/ManageProduct.jsx";
import AddDeal from "./Views/Pages/dealBanner/AddDeal.jsx";
import ManageDeal from "./Views/Pages/dealBanner/ManageDeal.jsx";
import AddLaunch from "./Views/Pages/launchBanner/AddLaunch.jsx";
import ManageLaunch from "./Views/Pages/launchBanner/ManageLaunch.jsx";
import ManageOrders from "./Views/Pages/Orders/Manageorders.jsx";
import ManagePayments from "./Views/Pages/Payments/Managepayments.jsx";

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
          <Route
            path="/admin/products/add"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products/add/:editId"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products/Manage"
            element={
              <PrivateRoute>
                <ManageProduct />
              </PrivateRoute>
            }
          />

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
          <Route
            path="/admin/categories/addCategory"
            element={
              <PrivateRoute>
                <AddCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories/addCategory/:editId"
            element={
              <PrivateRoute>
                <AddCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories/manage"
            element={
              <PrivateRoute>
                <ManageCategory />
              </PrivateRoute>
            }
          />

          {/* subcategories routes */}
          <Route
            path="/admin/subcategories/addSubCategory"
            element={
              <PrivateRoute>
                <AddSubCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/subcategories/addSubCategory/:editId"
            element={
              <PrivateRoute>
                <AddSubCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/subcategories/manage"
            element={
              <PrivateRoute>
                <ManageSubCategory />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/users/manage"
            element={
              <PrivateRoute>
                <ManageUser />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/attributes/add"
            element={
              <PrivateRoute>
                <AddAttribute />
              </PrivateRoute>
            }
          />

          {/* Promotions Section-------------------------------------------- */}
          <Route
            path="/admin/deal/add"
            element={
              <PrivateRoute>
                <AddDeal />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/deal/add/:editId"
            element={
              <PrivateRoute>
                <AddDeal />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/deal/manage"
            element={
              <PrivateRoute>
                <ManageDeal />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/launch/add"
            element={
              <PrivateRoute>
                <AddLaunch />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/launch/add/:editId"
            element={
              <PrivateRoute>
                <AddLaunch />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/launch/manage"
            element={
              <PrivateRoute>
                <ManageLaunch />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/orders/manage"
            element={
              <PrivateRoute>
                <ManageOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/payments/manage"
            element={
              <PrivateRoute>
                <ManagePayments />
              </PrivateRoute>
            }
          />

          {/* <Route
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
