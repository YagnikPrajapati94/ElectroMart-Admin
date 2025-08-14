import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";
import { speak } from "../../utils/speak";

const baseURL = import.meta.env.VITE_API_URL;

const AddBrandModel = ({ fetchBrands, editData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("adminToken");

  const closeBtnRef = useRef();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  useEffect(() => {
    if (editData) {
      setValue("brandName", editData.brandName);
      setPreview(editData.brandLogo);
    }
  }, [editData, setValue]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setValue("brandLogo", base64, { shouldValidate: true });
      setPreview(base64);
    }
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      if (editData) {
        const res = await axios.put(
          `${baseURL}/api/updateBrand/${editData._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        speak("Brand updated successfully");
        toast.success("Brand updated successfully");
        reset();
        setPreview(null);
        fetchBrands?.();
      } else {
        const res = await axios.post(`${baseURL}/api/addBrand`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        speak("Brand added successfully");
        toast.success("Brand added successfully");
        reset();
        setPreview(null);
        fetchBrands?.(); // Call parent function
      }
      // bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal')).hide();
    } catch (error) {
      toast.error("Failed to add brand");
      console.error("Error while adding brand:", error);
    } finally {
      setLoading(false);
      closeBtnRef.current.click(); // This will close the modal
    }
  };

  const removePreview = () => {
    setPreview(null);
    reset();
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-black text-light">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {editData ? "Update" : "Add"} Brand
            </h1>
            <button
              ref={closeBtnRef}
              onClick={() => removePreview()}
              type="button"
              className="btn-close btn-close-white shadow-none"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body rounded-3 ">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="form-control bg-transparent text-light border-0 d-grid gap-2"
            >
              {/* Brand Name */}
              <div className="mb-3">
                <label className="form-label">Brand Name</label>
                <input
                  {...register("brandName", {
                    required: "Brand name is required",
                  })}
                  type="text"
                  className={`form-control ${
                    errors.brandName ? "is-invalid" : ""
                  }`}
                  placeholder="Enter brand name"
                />
                {errors.brandName && (
                  <div className="invalid-feedback">
                    {errors.brandName.message}
                  </div>
                )}
              </div>

              {/* Brand Logo Input */}
              <div className="mb-3">
                <label className="form-label">Brand Logo</label>
                <input
                  type="file"
                  className={`form-control ${
                    errors.brandLogo ? "is-invalid" : ""
                  }`}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.brandLogo && (
                  <div className="invalid-feedback">Logo is required</div>
                )}
                <input
                  type="hidden"
                  {...register("brandLogo", { required: true })}
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="text-center bg-light rounded-3 mb-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded shadow img-fluid"
                    style={{ height: "80px", objectFit: "contain" }}
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn shadow-none ${
                  editData ? "btn-warning" : "btn-primary"
                } ${loading ? "disabled" : ""} form-control`}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  `${editData ? "Update" : "Add"}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBrandModel;
