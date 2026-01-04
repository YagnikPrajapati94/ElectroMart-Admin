import React from "react";
import AdminLayout from "../AdminLayout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { use } from "react";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import { speak } from "../../Layout/utils/speak";
import CategoryService from "../../Services/CategoryService";
import BrandService from "../../Services/BrandService";
import SubCategoryService from "../../Services/SubCategoryService";
import AttributeService from "../../Services/AttributeService";
import ProductService from "../../Services/ProductService";
import { useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [attributeFields, setAttributeFields] = useState([]);

  const [viewSubCategory, setViewSubCategory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [subcategory, setSubcategory] = useState([]);

  // const [subcategories, setSubcategories] = useState([]);
  // const [viewSubCategory, setViewSubCategory] = useState(false);
  const MAX_IMAGES = 4;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      images: Array(MAX_IMAGES).fill(null),
      quantity: 1,
    },
  });
  const navigation = useNavigate();
  const { editId } = useParams();
  // ➕ Increase Quantity
  const increaseQty = () => {
    const current = getValues("quantity");
    setValue("quantity", current + 1);
  };

  // ➖ Decrease Quantity
  const decreaseQty = () => {
    const current = getValues("quantity");
    if (current > 1) {
      setValue("quantity", current - 1);
    }
  };
  const [previews, setPreviews] = useState(Array(MAX_IMAGES).fill(null));
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // FileReader for Base64
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;

      // set base64 in react-hook-form
      setValue(`images.${index}`, base64String, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // preview (use base64 itself)
      const newPreviews = [...previews];
      newPreviews[index] = base64String;
      setPreviews(newPreviews);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);

    setValue(`images.${index}`, null);
  };

  const categoryId = watch("categoryId");

  const handleFetchBrands = async () => {
    try {
      const res = await BrandService.getBrandsDropdown();
      setBrands(res.data.brands);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleFetchBrands();
  }, []);
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

  const fetchSubCategories = async () => {
    try {
      const response = await SubCategoryService.getSubCategoryByCategoryId(
        categoryId
      );
      console.log(response, "subcategories");
      setSubcategory(response.data.subCategories);
      setViewSubCategory(true);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
      setViewSubCategory(false);
    }
  };
  useEffect(() => {
    if (categoryId) {
      fetchSubCategories();
    }
  }, [categoryId]);

  const fetchAttributesByCategory = async () => {
    try {
      const response = await AttributeService.getAttributeByCategory(
        categoryId
      );
      console.log(response, "attributes");
      setAttributeFields(response.data.attributes.attributes);
    } catch (error) {
      console.error("Failed to fetch attributes:", error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchAttributesByCategory();
    }
  }, [categoryId]);

  const handleProduct = async (data) => {
    setLoading(true);
    try {
      if (editId) {
        const res = await ProductService.updateProduct(editId, data);
        if (res.data.success) {
          toast.success(res.data.message);
          speak(res.data.message);
          reset();
          setPreviews(Array(MAX_IMAGES).fill(null));
          setAttributeFields([]);
          navigation("/admin/products/manage");
        }
      } else {
        const res = await ProductService.addProduct(data);
        if (res.data.success) {
          toast.success(res.data.message);
          speak(res.data.message);
          reset();
          setPreviews(Array(MAX_IMAGES).fill(null));
          setAttributeFields([]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductByid = async () => {
    setLoading(true);
    try {
      const res = await ProductService.getProductById(editId);
      if (res.data.success) {
        console.log(res.data);
        reset(res.data.product);
        setPreviews(res.data.product.images);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editId) {
      fetchProductByid();
    }
  }, [editId]);

  // const attributeFields = {
  //   ac: [
  //     {
  //       label: "Capacity (Ton)",
  //       name: "capacity",
  //       type: "select",
  //       options: ["1 Ton", "1.5 Ton", "2 Ton", "2.5 Ton"],
  //     },
  //     {
  //       label: "Star Rating",
  //       name: "starRating",
  //       type: "select",
  //       options: ["3 Star", "4 Star", "5 Star"],
  //     },
  //     {
  //       label: "Type",
  //       name: "type",
  //       type: "select",
  //       options: ["Split", "Window", "Portable"],
  //     },
  //     {
  //       label: "Inverter Technology",
  //       name: "inverter",
  //       type: "select",
  //       options: ["Yes", "No"],
  //     },
  //     { label: "Power Consumption (W)", name: "power", type: "number" },
  //     { label: "Noise Level (dB)", name: "noise", type: "number" },
  //     { label: "Cooling Capacity (W)", name: "cooling", type: "number" },
  //   ],
  //   tv: [
  //     {
  //       label: "Display Size (inches)",
  //       name: "displaySize",
  //       type: "select",
  //       options: ["32", "40", "43", "50", "55", "65"],
  //     },
  //     {
  //       label: "Display Type",
  //       name: "displayType",
  //       type: "select",
  //       options: ["LED", "OLED", "QLED"],
  //     },
  //     {
  //       label: "Resolution",
  //       name: "resolution",
  //       type: "select",
  //       options: ["HD", "Full HD", "4K", "8K"],
  //     },
  //     {
  //       label: "Smart TV",
  //       name: "smartTv",
  //       type: "select",
  //       options: ["Yes", "No"],
  //     },
  //     { label: "HDMI Ports", name: "hdmiPorts", type: "number" },
  //     { label: "USB Ports", name: "usbPorts", type: "number" },
  //   ],
  //   laptop: [
  //     {
  //       label: "Processor",
  //       name: "processor",
  //       type: "select",
  //       options: ["Intel i3", "Intel i5", "Intel i7", "Ryzen 5", "Ryzen 7"],
  //     },
  //     {
  //       label: "RAM (GB)",
  //       name: "ram",
  //       type: "select",
  //       options: ["4", "8", "16", "32"],
  //     },
  //     {
  //       label: "Storage Type",
  //       name: "storageType",
  //       type: "select",
  //       options: ["HDD", "SSD"],
  //     },
  //     {
  //       label: "Storage Capacity (GB)",
  //       name: "storageCapacity",
  //       type: "select",
  //       options: ["256", "512", "1024"],
  //     },
  //     {
  //       label: "Display Size (inches)",
  //       name: "screenSize",
  //       type: "select",
  //       options: ["13.3", "14", "15.6", "17.3"],
  //     },
  //     { label: "Graphics Card", name: "gpu", type: "text" },
  //     {
  //       label: "Operating System",
  //       name: "os",
  //       type: "select",
  //       options: ["Windows", "MacOS", "Linux"],
  //     },
  //   ],
  //   refrigerator: [
  //     {
  //       label: "Capacity (Liters)",
  //       name: "capacity",
  //       type: "select",
  //       options: ["190", "250", "300", "400", "500+"],
  //     },
  //     {
  //       label: "Star Rating",
  //       name: "starRating",
  //       type: "select",
  //       options: ["2 Star", "3 Star", "4 Star", "5 Star"],
  //     },
  //     {
  //       label: "Type",
  //       name: "type",
  //       type: "select",
  //       options: ["Single Door", "Double Door", "Side by Side", "Triple Door"],
  //     },
  //     {
  //       label: "Defrost Type",
  //       name: "defrostType",
  //       type: "select",
  //       options: ["Direct Cool", "Frost Free"],
  //     },
  //     { label: "Compressor Type", name: "compressor", type: "text" },
  //     {
  //       label: "Shelf Type",
  //       name: "shelfType",
  //       type: "select",
  //       options: ["Toughened Glass", "Wire"],
  //     },
  //   ],
  // };

  return (
    <AdminLayout>
      <div className="container-fluid px-4 py-2">
        <div className="row py-3 px-2 justify-content-center">
          <BreadCrumb parent={"Products"} child={"Add  Product"} />
          <div className="col-12 p-0">
            <form
              onSubmit={handleSubmit(handleProduct)}
              action=""
              className="form-control p-4 py-4 pb-2"
            >
              <div className="row mb-0  ">
                <div className="col-12 py-1 rounded-3 ">
                  <h4 className="fw-bold TitleText">Add New Product</h4>
                  <p className="SubtitleText small m-0">
                    Complete the form below to add a new product to your
                    inventory. Select the brand, category, and subcategory to
                    ensure accurate classification. Fill in product details to
                    help customers find and understand your items.
                  </p>
                </div>
              </div>
              <div className="divider">
                <hr className="w-100" />
              </div>

              <div className="row     rounded-3 mb-3">
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label mb-1">
                      Enter Product Title
                    </label>
                    <input
                      disabled={loading}
                      {...register("title", { required: true })}
                      type="text"
                      placeholder="Enter Product Title"
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label mb-1">
                      Enter Product Description
                    </label>
                    <textarea
                      disabled={loading}
                      name=""
                      id=""
                      cols="30"
                      rows="5"
                      {...register("description", { required: true })}
                      placeholder="Enter Product Description"
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                    ></textarea>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="mb-3">
                    <label className="form-label mb-1">
                      Select Product Brand
                    </label>
                    <select
                      disabled={loading}
                      {...register("brandId", { required: true })}
                      className={`form-select ${
                        errors.brandId ? "is-invalid" : ""
                      }`}
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="mb-3">
                    <label className="form-label mb-1">
                      Select Product Category
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
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="mb-3">
                    <label className="form-label mb-1">
                      Select Product SubCategory
                    </label>
                    <select
                      {...register("subCategoryId", { required: true })}
                      disabled={!viewSubCategory || loading}
                      className={`form-select ${
                        errors.subCategoryId ? "is-invalid" : ""
                      }`}
                    >
                      <option value="">Select SubCategory</option>
                      {subcategory.map((subcat, index) => (
                        <option key={index} value={subcat._id}>
                          {subcat.subCategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">MRP</label>
                  <input
                    disabled={loading}
                    type="number"
                    className={`form-control ${errors.mrp ? "is-invalid" : ""}`}
                    placeholder="Enter MRP"
                    {...register("mrp", {
                      required: "MRP is required",
                      min: { value: 1, message: "MRP must be greater than 0" },
                    })}
                  />
                </div>

                {/* Price */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Price</label>
                  <input
                    disabled={loading}
                    type="number"
                    className={`form-control ${
                      errors.price ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Selling Price"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 1,
                        message: "Price must be greater than 0",
                      },
                    })}
                  />
                </div>

                {/* Quantity */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Quantity</label>

                  <div className="input-group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={decreaseQty}
                    >
                      −
                    </button>

                    <input
                      disabled={loading}
                      type="number"
                      className="form-control text-center"
                      {...register("quantity", {
                        required: true,
                        min: 1,
                      })}
                      readOnly
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={increaseQty}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="divider">
                  <hr className="w-100" />
                </div>
                {/* Images Upload use only 5 images use array */}

                {Array.from({ length: MAX_IMAGES }).map((_, index) => (
                  <div className="col-md-3 col-6 mb-4" key={index}>
                    {/* Label */}
                    <label className="form-label fw-semibold mb-1 text-start mb-3 d-block">
                      Product Image {index + 1}
                    </label>

                    {/* Upload Box */}
                    <div
                      disabled={loading}
                      className={` rounded d-flex align-items-center justify-content-center position-relative upload-box`}
                      style={{
                        height: "300px",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      onClick={() =>
                        document.getElementById(`image-${index}`).click()
                      }
                    >
                      {previews[index] ? (
                        <img
                          src={previews[index]}
                          alt={`preview-${index}`}
                          className="w-100  h-100"
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <div className="text-center ">
                          <i className="bi bi-cloud-upload fs-4"></i>
                          <div className="small">Upload Image</div>
                        </div>
                      )}

                      {/* Remove Button */}
                      {previews[index] && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Hidden Input */}
                    <input
                      disabled={loading}
                      type="file"
                      accept="image/*"
                      id={`image-${index}`}
                      hidden
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </div>
                ))}

                <div className="divider">
                  <hr className="w-100" />
                </div>

                {attributeFields.length > 0 ? (
                  attributeFields.map((field, index) => {
                    return (
                      <div className="mb-3" key={index}>
                        <label className="form-label">{field.label}</label>
                        {field.type === "select" ? (
                          <select
                            disabled={loading}
                            {...register(`attributes.${field.label}`)}
                            className="form-select"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "checkbox" ? (
                          <div className="form-check">
                            <input
                              disabled={loading}
                              type="checkbox"
                              {...register(`attributes.${field.label}`)}
                              className="form-check-input"
                            />
                            <label className="form-check-label">Yes</label>
                          </div>
                        ) : (
                          <input
                            disabled={loading}
                            type={field.type}
                            {...register(`attributes.${field.label}`)}
                            className="form-control"
                            placeholder={`Enter ${field.label}`}
                          />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
              <button
                type="submit"
                className="form-control shadow-none btn login-btn text-light border-0"
              >
                {loading ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  `${editId ? "Update" : "Add"} Product`
                )}
              </button>
              {/* Footer help text */}
              <p className="SubtitleText text-center mt-3 mb-2 small">
                Need help?{" "}
                <a href="/admin/help" className="text-decoration-none">
                  View the Products guide
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

export default AddProduct;
