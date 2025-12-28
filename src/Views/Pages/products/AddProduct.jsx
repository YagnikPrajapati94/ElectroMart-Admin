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

const AddProduct = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("adminToken");
  const [brands, setBrands] = useState([]);

  const [categoryID, setCategoryID] = useState(null);
  const [viewCategory, setViewCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [viewSubCategory, setViewSubCategory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [subcategory, setSubcategory] = useState([]);

  // const [subcategories, setSubcategories] = useState([]);
  // const [viewSubCategory, setViewSubCategory] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const brandId = watch("brand");
  const categoryId = watch("category");

  const handleFetchBrands = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/getBrands`);
      // console.log(res.data.brands);
      setBrands(res.data.brands);
      // setViewCategory(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleFetchBrands();
  }, []);
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
      setViewCategory(true);
      toast.success("Categories Founded Successfully");
      speak("Categories Founded Successfully");
      // const data = response.data.result;
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
      setViewCategory(false);
    }
  };
  useEffect(() => {
    if (brandId) {
      fetchCategories();
    }
  }, [brandId]);

  const fetchSubCategories = async () => {
    try {
      // const data = {
      //     categoryId,
      //     brandId
      // };
      const response = await axios.get(
        `${baseURL}/api/getSubCategoriesByCategoryAndBrand/${categoryId}/${brandId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.subcategories);
      setSubcategory(response.data.subcategories);
      speak("Subcategories fetched successfully");
      setViewSubCategory(true);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
      setViewSubCategory(false);
    }
  };
  useEffect(() => {
    if (categoryId && brandId) {
      fetchSubCategories();
    }
  }, [categoryId, brandId]);

  const fetchCategoryById = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/getCategoryById/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.category);
      setSelectedCategory(response.data.category.category);
    } catch (error) {
      console.error("Failed to fetch category:", error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryById(categoryId);
    }
  }, [categoryId]);

  const handleProduct = async (data) => {
    try {
      console.log(data);
      toast.success("Product added successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const attributeFields = {
    ac: [
      {
        label: "Capacity (Ton)",
        name: "capacity",
        type: "select",
        options: ["1 Ton", "1.5 Ton", "2 Ton", "2.5 Ton"],
      },
      {
        label: "Star Rating",
        name: "starRating",
        type: "select",
        options: ["3 Star", "4 Star", "5 Star"],
      },
      {
        label: "Type",
        name: "type",
        type: "select",
        options: ["Split", "Window", "Portable"],
      },
      {
        label: "Inverter Technology",
        name: "inverter",
        type: "select",
        options: ["Yes", "No"],
      },
      { label: "Power Consumption (W)", name: "power", type: "number" },
      { label: "Noise Level (dB)", name: "noise", type: "number" },
      { label: "Cooling Capacity (W)", name: "cooling", type: "number" },
    ],
    tv: [
      {
        label: "Display Size (inches)",
        name: "displaySize",
        type: "select",
        options: ["32", "40", "43", "50", "55", "65"],
      },
      {
        label: "Display Type",
        name: "displayType",
        type: "select",
        options: ["LED", "OLED", "QLED"],
      },
      {
        label: "Resolution",
        name: "resolution",
        type: "select",
        options: ["HD", "Full HD", "4K", "8K"],
      },
      {
        label: "Smart TV",
        name: "smartTv",
        type: "select",
        options: ["Yes", "No"],
      },
      { label: "HDMI Ports", name: "hdmiPorts", type: "number" },
      { label: "USB Ports", name: "usbPorts", type: "number" },
    ],
    laptop: [
      {
        label: "Processor",
        name: "processor",
        type: "select",
        options: ["Intel i3", "Intel i5", "Intel i7", "Ryzen 5", "Ryzen 7"],
      },
      {
        label: "RAM (GB)",
        name: "ram",
        type: "select",
        options: ["4", "8", "16", "32"],
      },
      {
        label: "Storage Type",
        name: "storageType",
        type: "select",
        options: ["HDD", "SSD"],
      },
      {
        label: "Storage Capacity (GB)",
        name: "storageCapacity",
        type: "select",
        options: ["256", "512", "1024"],
      },
      {
        label: "Display Size (inches)",
        name: "screenSize",
        type: "select",
        options: ["13.3", "14", "15.6", "17.3"],
      },
      { label: "Graphics Card", name: "gpu", type: "text" },
      {
        label: "Operating System",
        name: "os",
        type: "select",
        options: ["Windows", "MacOS", "Linux"],
      },
    ],
    refrigerator: [
      {
        label: "Capacity (Liters)",
        name: "capacity",
        type: "select",
        options: ["190", "250", "300", "400", "500+"],
      },
      {
        label: "Star Rating",
        name: "starRating",
        type: "select",
        options: ["2 Star", "3 Star", "4 Star", "5 Star"],
      },
      {
        label: "Type",
        name: "type",
        type: "select",
        options: ["Single Door", "Double Door", "Side by Side", "Triple Door"],
      },
      {
        label: "Defrost Type",
        name: "defrostType",
        type: "select",
        options: ["Direct Cool", "Frost Free"],
      },
      { label: "Compressor Type", name: "compressor", type: "text" },
      {
        label: "Shelf Type",
        name: "shelfType",
        type: "select",
        options: ["Toughened Glass", "Wire"],
      },
    ],
  };

  const fields = selectedCategory
    ? attributeFields[selectedCategory.toLowerCase()]
    : [];

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
                      {...register("brand", { required: true })}
                      className={`form-select ${
                        errors.brand ? "is-invalid" : ""
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
                      disabled={!viewCategory}
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
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="mb-3">
                    <label className="form-label mb-1">
                      Select Product SubCategory
                    </label>
                    <select
                      {...register("subCategory", { required: true })}
                      disabled={!viewSubCategory}
                      className={`form-select ${
                        errors.subCategory ? "is-invalid" : ""
                      }`}
                    >
                      <option value="">Select SubCategory</option>
                      {subcategory.map((subcat, index) => (
                        <option key={index} value={subcat._id}>
                          {subcat.subCategory}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {fields.map((field, index) => {
                  return (
                    <div className="mb-3" key={index}>
                      <label className="form-label">{field.label}</label>
                      {field.type === "select" ? (
                        <select
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
                            type="checkbox"
                            {...register(`attributes.${field.label}`)}
                            className="form-check-input"
                          />
                          <label className="form-check-label">Yes</label>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          {...register(`attributes.${field.label}`)}
                          className="form-control"
                          placeholder={`Enter ${field.label}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="submit"
                className="form-control shadow-none btn login-btn text-light border-0"
              >
                Submit
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
