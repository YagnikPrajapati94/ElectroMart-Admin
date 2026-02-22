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
import ProductService from "../../Services/ProductService";
import promotionsService from "../../Services/promotionsService";

const AddLaunch = () => {
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
  const [products, setProducts] = useState([]);
  const fileRef = useRef(null);
  const { editId } = useParams();
  const navigation = useNavigate();

  // Fetch Catergory by Brand

  const handleCategorySubmit = async (data) => {
    setLoading(true);
    try {
      if (editId) {
        const res = await promotionsService.updateLaunch(editId, data);
        if (res.data.success) {
          speak("Launch banner updated successfully");
          toast.success("Launch banner updated successfully");
          reset();
          setPreview(null);
          navigation("/admin/launch/manage");
        }
      } else {
        const result = await promotionsService.addLaunch(data);
        if (result.data.success) {
          speak("Launch banner added successfully");
          toast.success("Launch banner added successfully");
          reset();
          setPreview(null);
        }
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await ProductService.getProductsDropdown();
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      setValue("image", base64, { shouldValidate: true });
      setPreview(base64);
    }
  };
  const fetchCategoryById = async (editId) => {
    try {
      const result = await promotionsService.getLaunchById(editId);
      if (result.data.success) {
        const data = result.data.launch;
        setValue("productId", data.productId);
        setValue("image", data.image);
        setPreview(data.image);
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
          <BreadCrumb parent={"Promotions"} child={"Add Deal"} />
          <div className="col-lg-12 p-0  rounded-2 ">
            <form
              className="form-control rounded-2   p-4 pb-0"
              onSubmit={handleSubmit(handleCategorySubmit)}
            >
              <h4 className="text-start TitleText fw-semibold">
                Add Launch Banner
              </h4>
              <p className="SubtitleText small mb-4">
                Add new Launch Banner to your store and promote your products to
                a larger audience at the same time by adding a launch banner.
              </p>
              <div className="divider">
                <hr className="w-100" />
              </div>
              {/* Select Category */}
              <div className="mb-3">
                <label htmlFor="productId" className="form-label fw-medium">
                  Select Product
                </label>
                <select
                  disabled={loading}
                  className={`form-select ${
                    errors.productId ? "is-invalid" : ""
                  }`}
                  id="categoryId"
                  {...register("productId", {
                    required: "Product is required",
                  })}
                >
                  <option value="">Select Product</option>
                  {products.map((prd) => (
                    <option key={prd._id} value={prd._id}>
                      {prd.title}
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <div className="invalid-feedback">
                    {errors.productId.message}
                  </div>
                )}
              </div>

              {/* image  Input */}
              <div className="mb-3">
                <label className="form-label">Deal Image</label>
                <input
                  type="file"
                  ref={fileRef}
                  className={`form-control ${errors.image ? "is-invalid" : ""}`}
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <input
                  type="hidden"
                  {...register("image", { required: true })}
                />
                {errors.image && (
                  <div className="invalid-feedback">Image is required</div>
                )}
              </div>

              {/* Preview */}
              {preview && (
                <div className="preview-wrapper d-flex align-items-center gap-3 mb-3">
                  <div className="preview-image">
                    <img
                      src={preview}
                      alt="Image preview"
                      className="img-fluid rounded"
                    />
                  </div>

                  <div className="preview-actions">
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0 d-flex align-items-center gap-2"
                      onClick={() => {
                        setValue("image", "");
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
                Tip: Use a clear product image and an attractive discount to
                increase deal visibility.
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
                  `${editId ? "Update" : "Add"} Launch Banner`
                )}
              </button>

              {/* Footer help text */}
              <p className="SubtitleText text-center mt-3 small">
                Need help?{" "}
                <a href="/admin/help" className="text-decoration-none">
                  View the help guide
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

export default AddLaunch;
