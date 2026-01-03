import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { useForm } from "react-hook-form";
import { speak } from "../../Layout/utils/speak";
import axios from "axios";
import { toast } from "react-toastify";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import CategoryService from "../../Services/CategoryService";
import SubCategoryService from "../../Services/SubCategoryService";
import { useNavigate, useParams } from "react-router-dom";

const AddSubCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { editId } = useParams();
  const navigation = useNavigate();

  // Fetch Catergory by Brand
  const fetchCategories = async () => {
    try {
      const result = await CategoryService.getCategoriesDropdown();
      setCategories(result.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubcategorySubmit = async (data) => {
    setLoading(true);
    try {
      if (editId) {
        const res = await SubCategoryService.updateSubCategory(editId, data);
        if (res.data.success) {
          speak("Subcategory updated successfully");
          toast.success("Subcategory updated successfully");
          reset();
          navigation("/admin/subcategories/manage");
        }
      } else {
        const result = await SubCategoryService.addSubCategory(data);
        if (result.data.success) {
          speak("Subcategory added successfully");
          toast.success("Subcategory added successfully");
          reset();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategoryById = async (editId) => {
    try {
      const result = await SubCategoryService.getSubCategoryById(editId);
      if (result.data.success) {
        const data = result.data.subCategory;
        setValue("categoryId", data.categoryId);
        setValue("subCategoryName", data.subCategoryName);
      }
    } catch (error) {
      console.error("Error fetching Category by ID:", error);
    }
  };

  useEffect(() => {
    if (editId) {
      fetchCategoryById(editId);
    }
  }, [editId]);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row justify-content-center px-2">
          <BreadCrumb parent={"Sub Categories"} child={"Add Subcategory"} />
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
                Add a subcategory under a selected category. Subcategories help
                organize products in detail, improving user navigation and
                search results.
              </p>
              <div className="divider">
                <hr className="w-100" />
              </div>

              {/* Select Category */}
              <div className="mb-3">
                <label htmlFor="categoryId" className="form-label fw-medium">
                  Select Category
                </label>
                <select
                  disabled={loading}
                  className={`form-select ${
                    errors.categoryId ? "is-invalid" : ""
                  }`}
                  id="categoryId"
                  {...register("categoryId", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <div className="invalid-feedback">
                    {errors.categoryId.message}
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
                  autoComplete="off"
                  maxLength={50}
                  {...register("subCategoryName", {
                    required: "Subcategory Name is required",
                    minLength: {
                      value: 2,
                      message: "Subcategory Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Subcategory Name must be at most 50 characters",
                    },
                  })}
                  type="text"
                  className={`form-control ${
                    errors.subCategoryName ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. Gaming Laptops, Smart TVs"
                  id="subcategoryName"
                />
                {errors.subCategoryName && (
                  <div className="invalid-feedback">
                    {errors.subCategoryName.message}
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
                  `${editId ? "Update" : "Add"} Subcategory`
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
