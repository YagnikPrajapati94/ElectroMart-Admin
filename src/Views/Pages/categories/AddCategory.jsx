import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { useForm } from "react-hook-form";
import { speak } from "../../Layout/utils/speak";
import axios from "axios";
import { toast } from "react-toastify";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import { useRef } from "react";
import CategoryService from "../../Services/CategoryService";
import { useNavigate, useParams } from "react-router-dom";

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
  } = useForm({
    mode: "onChange",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const { editId } = useParams();
  const navigation = useNavigate();

  // Fetch Catergory by Brand

  const handleCategorySubmit = async (data) => {
    setLoading(true);
    try {
      if (editId) {
        const res = await CategoryService.updateCategory(editId, data);
        if (res.data.success) {
          speak("Category updated successfully");
          toast.success("Category updated successfully");
          reset();
          setPreview(null);
          navigation("/admin/categories/manage");
        }
      } else {
        const result = await CategoryService.addCategory(data);
        console.log(result);
        if (result.data.success) {
          speak("Category added successfully");
          toast.success("Category added successfully");
          reset();
          setPreview(null);
        }
      }
    } catch (error) {
      console.log(error);

      setLoading(false);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setValue("categoryImage", base64, { shouldValidate: true });
      setPreview(base64);
    }
  };
  const fetchCategoryById = async (editId) => {
    try {
      const result = await CategoryService.getCategoryById(editId);
      if (result.data.success) {
        console.log(result);
        const data = result.data.category;
        setValue("categoryName", data.categoryName);
        setValue("categoryImage", data.categoryImage);
        setPreview(data.categoryImage);
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

              {/* Category Name */}
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label fw-medium">
                  Category Name
                </label>
                <input
                  disabled={loading}
                  maxLength={50}
                  type="text"
                  {...register("categoryName", {
                    required: "Category Name is required",
                    minLength: {
                      value: 2,
                      message: "Category Name must be at least 3 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Category Name must be at most 50 characters",
                    },
                  })}
                  className={`form-control ${
                    errors.categoryName ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. Smartphones, Laptops"
                  id="categoryName"
                />
                {errors.categoryName && (
                  <div className="invalid-feedback">
                    {errors.categoryName.message}
                  </div>
                )}
              </div>

              {/* categoryImage  Input */}
              <div className="mb-3">
                <label className="form-label">Category Image</label>
                <input
                  type="file"
                  ref={fileRef}
                  className={`form-control ${
                    errors.categoryImage ? "is-invalid" : ""
                  }`}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.categoryImage && (
                  <div className="invalid-feedback">Image is required</div>
                )}
                <input
                  type="hidden"
                  {...register("categoryImage", { required: true })}
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="preview-wrapper d-flex align-items-center gap-3 mb-3">
                  <div className="preview-image">
                    <img
                      src={preview}
                      alt="Category preview"
                      className="img-fluid rounded"
                    />
                  </div>

                  <div className="preview-actions">
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0 d-flex align-items-center gap-2"
                      onClick={() => {
                        setValue("categoryImage", "");
                        setPreview(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                    >
                      <i className="bi bi-x-circle"></i>
                      <span className="fw-semibold">Remove</span>
                    </button>
                  </div>
                </div>
              )}

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
                  `${editId ? "Update" : "Add"} Category`
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
