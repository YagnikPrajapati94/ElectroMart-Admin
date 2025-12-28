import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { useForm } from "react-hook-form";
import { speak } from "../../Layout/utils/speak";
import axios from "axios";
import { toast } from "react-toastify";
import BreadCrumb from "../../Layout/Component/BreadCrumb";

const AddCategory = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("adminToken");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [brandId, setBrandId] = useState('');
  const [loading, setLoading] = useState(false);

  const brandId = watch("brand");

  // Fetch Brand Function
  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/getBrands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.brands);
      const data = response.data.brands;
      setBrands(data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch Catergory by Brand

  const handleCategorySubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/addCategory`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      speak("Category added successfully");
      toast.success("Category added successfully");
      reset();
      // fetchCategories?.();

      // closeBtnRef.current.click();
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-4  ">
        <div className="row mb-5 px-2  justify-content-center">
          <BreadCrumb parent={"Categories"} child={"Add Category"} />
          <div className="col-lg-12 p-0  rounded-2 ">
            <form
              className="form-control rounded-2   p-4 pb-0"
              onSubmit={handleSubmit(handleCategorySubmit)}
            >
              <h4 className="text-start TitleText fw-semibold">Add Category</h4>
              <p className="SubtitleText small mb-4">
                Create a new product category for a selected brand. Each brand
                can have its own unique set of categories such as Mobile,
                Laptop, or Television. This helps organize products better and
                improves customer navigation.
              </p>
              <div className="divider">
                <hr className="w-100" />
              </div>

              {/* Select Brand */}
              <div className="mb-3">
                <label className="form-label fw-medium">Select Brand</label>
                <select
                  disabled={loading}
                  className={`form-select ${errors.brand ? "is-invalid" : ""}`}
                  {...register("brand", { required: "Brand is required" })}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
                {errors.brand && (
                  <div className="invalid-feedback">{errors.brand.message}</div>
                )}
              </div>

              {/* Category Name */}
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label fw-medium">
                  Category Name
                </label>
                <input
                  disabled={loading}
                  type="text"
                  {...register("category", {
                    required: "Category Name is required",
                  })}
                  className={`form-control ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. Smartphones, Laptops"
                  id="categoryName"
                />
                {errors.category && (
                  <div className="invalid-feedback">
                    {errors.category.message}
                  </div>
                )}
              </div>

              {/* Helpful note before button */}
              <div className="alert alert-info small py-2 mb-3">
                <i className="bi bi-lightbulb-fill me-1 text-warning"></i>
                Tip: Choose the correct brand before adding a category. Once
                created, it will be listed under that brand.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn login-btn border-0 form-control text-light px-5 py-2 shadow-none"
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Add Category"
                )}
              </button>

              {/* Footer help text */}
              <p className="SubtitleText text-center mt-3 small">
                Need help?{" "}
                <a href="/admin/help" className="text-decoration-none">
                  View the category guide
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddCategory;
