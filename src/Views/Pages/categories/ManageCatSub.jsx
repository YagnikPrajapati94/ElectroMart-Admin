import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import AddCategoryModal from "../../Layout/Component/Models/AddCategoryModal";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { useForm } from "react-hook-form";
import { speak } from "../../Layout/utils/speak";

const ManageCatSub = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("adminToken");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editData, setEditData] = useState(null);
  const [openAccordionId, setOpenAccordionId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/getAllCategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setCategories(res.data.result);
    } catch (error) {
      console.error("Failed to fetch categories:", error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  // const filteredCategories = categories.filter((cat) => {
  //   const brandMatch = cat.brandName
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());

  //   const categoryMatch = cat.categoryMap.some((item) =>
  //     item.category.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  //   const subcategoryMatch = cat.categoryMap.some((item) =>
  //     item.subcategories.some((sub) =>
  //       sub.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   );

  //   return brandMatch || categoryMatch || subcategoryMatch;
  // });

  const handleUpdateCategory = async (brand, category, id) => {
    try {
      // const category = data
      const data = { brand, category };
      // console.log("Category data:", data, id);

      const res = await axios.put(
        `${baseURL}/api/updateCategory/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data, id);
      toast.success("Category updated successfully");
      speak("Category updated successfully");
      fetchCategories?.();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
    }
  };

  const handleSubUpdate = async (id, oldSub, newSub) => {
    try {
      // console.log(categoryId, oldSub, newSub);

      const res = await axios.put(
        `${baseURL}/api/updateSubcategory/${id}`,
        {
          oldSubcategory: oldSub,
          newSubcategory: newSub,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      if (res.status === 200) {
        toast.success(res.data.message);
        speak("Subcategory updated successfully");
        fetchCategories?.();
      } else {
        // console.error("❌ Update failed");
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      speak("Are you sure you want to delete this category?");
      const confirmed = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (!confirmed) {
        speak("Category deletion cancelled");
        return;
      }
      const res = await axios.delete(`${baseURL}/api/deleteCategory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        speak("Category deleted successfully");
        fetchCategories?.();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleSubDelete = async (id, subcategory) => {
    try {
      speak(
        `Are you sure you want to delete the subcategory "${subcategory}"?`
      );
      const confirmed = window.confirm(
        `Are you sure you want to delete the subcategory "${subcategory}"?`
      );
      if (!confirmed) {
        speak("Subcategory deletion cancelled");
        return;
      }
      const res = await axios.delete(
        `${baseURL}/api/deleteSubcategory/${id}/${subcategory}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        speak("Subcategory deleted successfully");
        fetchCategories?.();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row  mb-3 align-items-center">
          <div className="col-md-6">
            <h3 className="fw-semibold text-dark m-0">All Categories</h3>
            <small className="text-muted">
              View, search, and manage all brand names, product categories,
              subcategories, and creation dates in one place.
            </small>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-12  ms-auto mb-3">
            <input
              type="search"
              className="form-control py-2 rounded-3 shadow-sm"
              placeholder="Search by category, subcategory or brand ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          {loading ? (
            <>
              <div className="col-lg-6  my-1">
                <Skeleton count={6} height={80} />
              </div>

              <div className="col-lg-6  my-1">
                <Skeleton count={6} height={80} />
              </div>
            </>
          ) : (
            <div className="">
              <div className="accordion row" id="brandAccordion">
                {categories.map((cat, index) => (
                  <div key={index} className="col-lg-6">
                    <div className="accordion-item mb-3 border-0 shadow-sm rounded-3 overflow-hidden">
                      <h2 className="accordion-header" id={`heading-${index}`}>
                        <button
                          className={`accordion-button  shadow-none collapsed d-flex justify-content-between  px-4 py-3`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-${index}`}

                          aria-expanded="false"
                          aria-controls={`collapse-${index}`}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={cat.brandLogo}
                              alt="Brand"
                              className="img-thumbnail bg-white border rounded-3"
                              style={{
                                width: "60px",
                                height: "40px",
                                objectFit: "contain",
                              }}
                            />
                            <h5 className="mb-0 fw-semibold text-dark">
                              {cat.brandName}
                            </h5>
                          </div>
                        </button>
                      </h2>
                      <div
                        id={`collapse-${index}`}
                        className={`accordion-collapse collapse `}
                        aria-labelledby={`heading-${index}`}
                        data-bs-parent="#brandAccordion"
                      >
                        <div className="accordion-body p-3 bg-white">
                          <div className="row g-4">

                            {
                              cat.categories.map((item, index) => (
                                <div
                                  key={index}
                                  className="col-12  col-md-6 col-lg-12"
                                >
                                  <div className="border rounded-4 p-3 h-100 shadow-sm bg-light">
                                    <div className=" d-flex align-items-center mb-3">
                                      <input
                                        type="text"
                                        defaultValue={item.category}
                                        className={`form-control rounded-start-3 rounded-end-0  border bg-transparent fw-semibold  ${errors[`newCategory-${item._id}`]
                                          ? "is-invalid"
                                          : ""
                                          }`}
                                        placeholder="Category Name"
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleUpdateCategory(
                                              cat.brandId,
                                              e.target.value,
                                              item.categoryId
                                            );
                                            e.preventDefault();
                                          }
                                        }}


                                      />
                                      <button
                                        onClick={() =>
                                          handleDeleteCategory(item._id)
                                        }
                                        className="btn btn-danger rounded-0"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>

                                    {/* <div className="">
                                      {item.subCategories.map((sub, i) => (
                                        <div
                                          key={i}
                                          className="d-flex align-items-center my-2 gap-2 "
                                        >
                                          <input
                                            aria-describedby="basic-addon1"
                                            key={i}
                                            defaultValue={sub.subCategory}
                                            {...register(
                                              `sub-${item._id}-${i}`,
                                              { required: true }
                                            )}
                                            className={`form-control  bg-success bg-opacity-25 rounded-5 fw-semibold ${errors[`sub-${item._id}-${i}`]
                                              ? "is-invalid"
                                              : ""
                                              }`}
                                            style={{
                                              // width: "fit-content",
                                              // minWidth: "110px",
                                              fontSize: "0.85rem",
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                handleSubmit((formData) => {
                                                  handleSubUpdate(
                                                    item._id,
                                                    sub,
                                                    formData[
                                                    `sub-${item._id}-${i}`
                                                    ]
                                                  );
                                                })();
                                                e.preventDefault();
                                              }
                                            }}
                                          />
                                          <button
                                            onClick={() =>
                                              handleSubDelete(item._id, sub)
                                            }
                                            id="basic-addon1"
                                            className="btn-close input-group-text"
                                          ></button>
                                        </div>
                                      ))}
                                    </div> */}
                                  </div>
                                </div>
                              ))
                            }

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <AddCategoryModal fetchCategories={fetchCategories} editData={editData} />
    </AdminLayout>
  );
};

export default ManageCatSub;
