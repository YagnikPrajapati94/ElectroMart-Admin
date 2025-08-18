import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import AddCategoryModal from "../../Layout/Component/Models/AddCategoryModal";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { useForm } from "react-hook-form";
import { speak } from "../../Layout/utils/speak";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import Nprogress from "nprogress";

const ManageCatSub = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("adminToken");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);
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
      // console.log(res);
      setCategories(res.data.result);
    } catch (error) {
      console.error("Failed to fetch categories:", error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);




  const handleUpdateCategory = async (brand, category, id) => {
    Nprogress.start();
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
      Nprogress.done();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      speak(error.response.data.message);
      Nprogress.done();
    }
  };

  const handleSubUpdate = async (id, subCategory) => {
    // setLoader(true);
    Nprogress.start();
    try {
      // console.log(categoryId, oldSub, newSub);
      // console.log("Subcategory data:", id, subCategory);
      const data = { subCategory };
      const res = await axios.put(
        `${baseURL}/api/updateSubCategory/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res);

      if (res.status === 200) {
        toast.success(res.data.message);
        speak("Subcategory updated successfully");
        fetchCategories?.();
        // Nprogress.done();
      } else {
        // console.error("❌ Update failed");
        toast.error(res.data.message);
      }
      Nprogress.done();
      // setLoader(false);



    } catch (err) {
      console.log("Error updating subcategory:", err);
      toast.error(err.response?.data?.message || err.message);
      speak(err.response?.data?.message || err.message);
      Nprogress.done();
    }
  };

  const handleDeleteCategory = async (id) => {
    Nprogress.start();
    try {
      speak("Are you sure you want to delete this category?");
      const confirmed = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (!confirmed) {
        speak("Category deletion cancelled");
        Nprogress.done();
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
      Nprogress.done();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      speak(err.response?.data?.message || err.message);
      console.error("Error deleting category:", err);
      Nprogress.done();
    }
  };

  const handleSubDelete = async (id) => {
    Nprogress.start();
    try {
      speak(
        `Are you sure you want to delete the subcategory ?`
      );
      const confirmed = window.confirm(
        `Are you sure you want to delete the subcategory ?`
      );
      if (!confirmed) {
        speak("Subcategory deletion cancelled");
        Nprogress.done();
        return;
      }
      const res = await axios.delete(
        `${baseURL}/api/deleteSubCategory/${id}`,
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
      Nprogress.done();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      speak(err.response?.data?.message || err.message);
      console.error("Error deleting subcategory:", err);
      Nprogress.done();
    }
  };

  // filtering brand, category, subcategory
  const filteredData = categories.filter((brand) =>
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );




  return (
    <AdminLayout >

      <div className="container-fluid p-4">
        <div className="row  mb-3 px-2 align-items-center">
          <BreadCrumb parent={"Categories"} child={"Manage"} />

        </div>
        <div className="row px-2">
          <div className="col-12 p-0 rounded-3 text-center mb-3 border-bottom pb-3">
            {/* Title */}
            <h3 className="fw-bold text-dark mb-2">
              All Categories & Subcategories
            </h3>
            {/* Description */}
            <small className="text-muted d-block mb-4">
              Quickly view, search, and manage all brand names, product categories, and subcategories
              in one convenient place.
            </small>

            {/* Search Box */}
            <div className="input-group shadow-sm rounded-3 overflow-hidden">
              <span className="input-group-text bg-white border-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="search"
                className="form-control py-2 border-0 bg-white "
                placeholder="Search by Brand...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>


          </div>
        </div>

        <div className="row px-2 ">
          {loading ? (
            <>
              {
                categories.map((cat, index) => {
                  return (
                    <div className="col-lg-12 my-1">
                      <Skeleton height={80} />
                    </div>
                  )
                })
              }
            </>
          ) : (
            <div className="">

              <div className="accordion row  " id="brandAccordion">
                {filteredData.map((cat, index) => (
                  <div key={index} className="col-12 p-0 py-1 ">

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
                        <div className="accordion-body p-3">
                          <div className="row g-4">

                            {
                              cat.categories.map((item, index) => (
                                <div
                                  key={index}
                                  className="col-12  col-md-6 col-lg-12"
                                >
                                  <div className=" rounded-2 p-3 border bg-light ">
                                    <div className=" d-flex align-items-center mb-3">
                                      <input
                                        type="text"
                                        defaultValue={item.category}
                                        className={`form-control rounded-start-3 rounded-end-0  border  fw-semibold `}
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
                                          handleDeleteCategory(item.categoryId)
                                        }
                                        className="btn btn-danger rounded-0"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>

                                    <div className="row">

                                      {item.subCategory.map((sub, i) => (
                                        <div
                                          key={i}
                                          className="col-lg-4  "
                                        >
                                          <div className="card   flex-row bg-success bg-opacity-10  align-items-center  ">
                                            <input
                                              key={i}
                                              defaultValue={sub.subCategory}

                                              className={`form-control bg-transparent    border-0  rounded-2 fw-semibold `}
                                              style={{
                                                // width: "fit-content",
                                                // minWidth: "110px",
                                                fontSize: "0.85rem",
                                              }}
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  handleSubUpdate(
                                                    sub._id,
                                                    e.target.value
                                                  );
                                                  e.preventDefault();
                                                }
                                              }}
                                            />
                                            <button
                                              onClick={() =>
                                                handleSubDelete(sub._id)
                                              }
                                              id="basic-addon1"
                                              className="btn-close mx-2  input-group-text"
                                            ></button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
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
        {/* Help Note */}
        <div className="mt-2 border-top text-muted small text-center">

          <div className="alert alert-info rounded-3  shadow-sm mt-4">
            <h6 className="fw-bold mb-2">Need Help?</h6>
            <p className="mb-2 small text-muted">
              You can edit categories by typing in the box and pressing <b>Enter</b>.
              Use the trash icon to delete. Subcategories can be edited in the same way.
            </p>
            <a href="/help" className="text-primary fw-semibold">Click here</a> to see a quick guide.
            {/* Example: YouTube help video */}

          </div>
        </div>
      </div>
      <AddCategoryModal fetchCategories={fetchCategories} editData={editData} />
    </AdminLayout>
  );
};

export default ManageCatSub;
