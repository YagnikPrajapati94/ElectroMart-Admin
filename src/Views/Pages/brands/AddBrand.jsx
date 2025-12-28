import AdminLayout from "../AdminLayout";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";
import { speak } from "../../Layout/utils/speak";
import BrandService from "../../Services/BrandService";
import { useNavigate, useParams } from "react-router-dom";

const AddBrand = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { editId } = useParams();
  const navigation = useNavigate();

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
      setValue("brandLogo", base64, { shouldValidate: true });
      setPreview(base64);
    }
  };

  const fetchBrandById = async (editId) => {
    try {
      const result = await BrandService.getBrandById(editId);
      if (result.data.success) {
        const data = result.data.brand;
        setValue("brandName", data.brandName);
        setValue("brandLogo", data.brandLogo);
        setPreview(data.brandLogo);
      }
    } catch (error) {
      console.error("Error fetching brand by ID:", error);
    }
  };

  useEffect(() => {
    if (editId) {
      fetchBrandById(editId);
    }
  }, [editId]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      if (editId) {
        console.log("Updated", data);
        const res = await BrandService.updateBrand(editId, data);
        if (res.data.success) {
          speak("Brand updated successfully");
          toast.success("Brand updated successfully");
          reset();
          setPreview(null);
          navigation("/admin/brands/manage");
        }
      } else {
        const res = await BrandService.addBrand(data);
        if (res.data.success) {
          speak("Brand added successfully");
          toast.success("Brand added successfully");
          reset();
          setPreview(null);
        }
      }
    } catch (error) {
      toast.error("Failed to add brand");
      console.error("Error while adding brand:", error.response);
    } finally {
      setLoading(false);
    }
  };

  const removePreview = () => {
    setPreview(null);
    reset();
  };
  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row px-2">
          <BreadCrumb parent={"Brands"} child={"Add Brand"} />
          <div className="col-12 p-0">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="form-control p-4 rounded-2 text-light d-grid "
            >
              <div className="">
                <h4 className="text-start TitleText fw-semibold">Add Brand</h4>
                <p className="SubtitleText small m-0">
                  Add a new brand to your store
                </p>
              </div>
              <div className="divider">
                <hr className="w-100" />
              </div>
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
                className={`btn shadow-none login-btn text-white mt-2 border-0 ${
                  loading ? "disabled" : ""
                } form-control`}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  `${editId ? "Update" : "Add"} Brand`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddBrand;
