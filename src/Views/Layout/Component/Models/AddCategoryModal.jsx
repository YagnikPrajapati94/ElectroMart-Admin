import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { speak } from "../../utils/speak";

const baseURL = import.meta.env.VITE_API_URL;

const AddCategoryModal = ({ fetchCategories }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("adminToken");
  const closeBtnRef = useRef();

  const getBrands = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/getBrands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(res.data?.brands || []);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${baseURL}/api/addCategory`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Category added successfully");
      speak("Category added successfully");
      reset();
      fetchCategories?.();
      closeBtnRef.current.click();
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => reset();

  return (
    <div className="modal fade" id="categoryModal" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light">
          <div className="modal-header">
            <h5 className="modal-title">Add Category</h5>
            <button
              type="button"
              className="btn-close btn-close-white shadow-none"
              data-bs-dismiss="modal"
              onClick={handleClose}
              ref={closeBtnRef}
            ></button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="d-grid gap-3"
            >
              {/* Brand Selection */}
              <div>
                <label className="form-label">Select Brand</label>
                <select
                  {...register("brand", { required: "Brand is required" })}
                  className={`form-select ${
                    errors.brandId ? "is-invalid" : ""
                  }`}
                >
                  <option value="">-- Select Brand --</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
                {errors.brandId && (
                  <div className="invalid-feedback">
                    {errors.brandId.message}
                  </div>
                )}
              </div>

              {/* Category Input */}
              <div>
                <label className="form-label">Category</label>
                <input
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`form-control ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  placeholder="e.g., Laptop"
                />
                {errors.category && (
                  <div className="invalid-feedback">
                    {errors.category.message}
                  </div>
                )}
              </div>

              {/* Subcategory Input */}
              <div>
                <label className="form-label">Subcategory</label>
                <input
                  {...register("subcategory", {
                    required: "Subcategory is required",
                  })}
                  className={`form-control ${
                    errors.subcategory ? "is-invalid" : ""
                  }`}
                  placeholder="e.g., Gaming"
                />
                {errors.subcategory && (
                  <div className="invalid-feedback">
                    {errors.subcategory.message}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-success w-100 shadow-none"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  "Add Category"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
