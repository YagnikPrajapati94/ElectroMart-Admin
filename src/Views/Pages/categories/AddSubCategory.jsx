import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { useForm } from "react-hook-form";
import { speak } from "../../Layout/utils/speak";
import axios from "axios";
import { toast } from "react-toastify";
import BreadCrumb from "../../Layout/Component/BreadCrumb";

const AddSubCategory = () => {
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
  const [viewCategories, setViewCategories] = useState(false);

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
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/getCategoriesByBrand/${brandId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(response);

      console.log(response.data.categories);
      setViewCategories(true);
      toast.success("Categories Founded Successfully");
      speak("Categories Founded Successfully");
      // const data = response.data.result;
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
      setViewCategories(false);
    }
  };
  useEffect(() => {
    if (brandId) {
      fetchCategories();
    }
  }, [brandId]);

  const handleSubcategorySubmit = async (data) => {
    setLoading(true);
    try {
      console.log("Subcategory data:", data);

      const response = await axios.post(`${baseURL}/api/addSubCategory`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      speak("Subcategory added successfully");
      toast.success("Subcategory added successfully");
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row justify-content-center px-2">
          <BreadCrumb parent={"Categories"} child={"Add Subcategory"} />
          <div className="col-lg-12  p-0">
            <form
              onSubmit={handleSubmit(handleSubcategorySubmit)}
              className="form-control p-4 pb-0 rounded-2 "
            >
              {/* Heading */}
              <h4 className="text-start TitleText fw-semibold">
                Add Subcategory
              </h4>
              <p className="SubtitleText text-start small mb-4">
                Add a subcategory under a selected category and brand.
                Subcategories help organize products in detail, improving user
                navigation and search results.
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

              {/* Select Category */}
              <div className="mb-3">
                <label htmlFor="categoryId" className="form-label fw-medium">
                  Select Category
                </label>
                <select
                  disabled={!viewCategories || loading}
                  className={`form-select ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  id="categoryId"
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="invalid-feedback">
                    {errors.category.message}
                  </div>
                )}
              </div>

              {/* Subcategory Name */}
              <div className="mb-3">
                <label
                  htmlFor="subcategoryName"
                  className="form-label fw-medium"
                >
                  Subcategory Name
                </label>
                <input
                  disabled={loading}
                  {...register("subCategory", {
                    required: "Subcategory Name is required",
                  })}
                  type="text"
                  className={`form-control ${
                    errors.subCategory ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. Gaming Laptops, Smart TVs"
                  id="subcategoryName"
                />
                {errors.subCategory && (
                  <div className="invalid-feedback">
                    {errors.subCategory.message}
                  </div>
                )}
              </div>

              {/* Helpful Tip */}
              <div className="alert alert-info small py-2 mb-3">
                <i className="bi bi-lightbulb-fill me-1 text-warning"></i>
                Tip: Make sure to select the correct brand and category before
                adding the subcategory. This ensures proper product grouping.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn login-btn text-light border-0 w-100 shadow-none"
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Add Subcategory"
                )}
              </button>

              {/* Footer Help Link */}
              <p className="SubtitleText text-center mt-3 small">
                Need assistance?{" "}
                <a href="/admin/help" className="text-decoration-none">
                  View subcategory guide
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

export default AddSubCategory;
