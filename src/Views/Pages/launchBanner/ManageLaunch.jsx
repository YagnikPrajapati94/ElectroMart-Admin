import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { speak } from "../../Layout/utils/speak";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import Swal from "sweetalert2";
import BrandService from "../../Services/BrandService";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../Services/CategoryService";
import promotionsService from "../../Services/promotionsService";

const ManageLaunch = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigation = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await promotionsService.getLaunches();
      setCategories(res.data.launches);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const swalResult = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });

      if (!swalResult.isConfirmed) {
        Swal.fire("Cancelled", "Your launch banner is safe :)", "info");
        speak("Launch banner deletion cancelled");
        return;
      }

      // ✅ API call
      const response = await promotionsService.deleteLaunch(id);

      if (response.data.success) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        speak("Launch banner deleted successfully");
        fetchCategories(); // refetch
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigation(`/admin/launch/add/${id}`);
  };

  const handleToggle = async (id) => {
    setLoading(true);
    try {
      const response = await promotionsService.updateLaunchStatus(id);
      console.log(response);
      if (response.data.success) {
        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = categories.filter((category) =>
    category.productId.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row mb-4 px-2 align-items-center">
          <BreadCrumb parent={"Launch Banner"} child={"List"} />
          <div className="col-12 text-center p-0">
            <h3 className="fw-semibold TitleText m-0">
              Launch Banner Directory
            </h3>
            <small className="SubtitleText">
              View, search, and manage all Added Latest Launch Banner here.
            </small>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12 ms-auto">
            <div className="input-group shadow-sm rounded-3 overflow-hidden">
              <span className="input-group-text searchIcon bg-white border-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="search"
                className="form-control searchBar border-0 py-2 bg-white"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to first page
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="table-responsive rounded-3 shadow-sm">
              <table className="brands-table table table-hover align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr className="align-middle text-uppercase small text-secondary">
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading == true ? (
                    [...Array(5)].map((_, index) => (
                      <tr key={index}>
                        <td>
                          <Skeleton height={20} width={20} />
                        </td>
                        <td>
                          <Skeleton height={20} width={150} />
                        </td>
                        <td>
                          <Skeleton height={40} width={80} />
                        </td>
                        <td>
                          <Skeleton height={20} width={120} />
                        </td>
                        <td>
                          <Skeleton height={20} width={120} />
                        </td>
                        <td className="text-end">
                          <Skeleton
                            height={30}
                            width={30}
                            inline
                            className="me-2"
                          />
                          <Skeleton height={30} width={30} inline />
                        </td>
                      </tr>
                    ))
                  ) : currentItems.length > 0 ? (
                    currentItems.map((category, index) => (
                      <tr key={category._id} style={{ cursor: "pointer" }}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">
                          {category.productId.title}
                        </td>
                        <td>
                          <img
                            src={category.image}
                            alt={category.image}
                            className="shadow-sm rounded "
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "contain",
                            }}
                          />
                        </td>
                        <td>
                          {category.isActive ? (
                            <span className="badge text-bg-success rounded-pill px-3 py-2">
                              Active
                            </span>
                          ) : (
                            <span className="badge text-bg-danger rounded-pill px-3 py-2">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="badge text-bg-light rounded-pill px-3 py-2">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="text-end  ">
                          <button
                            onClick={(e) => handleEdit(category._id)}
                            className="btn text-primary p-0 mx-2 "
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="btn text-danger p-0 mx-2  shadow-none"
                            disabled={loading == category._id}
                          >
                            {loading == category._id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                          </button>
                          <button className="btn p-0 border-0 bg-transparent shadow-none z-3 ms-2">
                            <div className="form-check form-switch m-0">
                              <input
                                disabled={loading}
                                className="form-check-input  custom-switch"
                                type="checkbox"
                                role="switch"
                                checked={category.isActive}
                                onChange={() => handleToggle(category._id)}
                              />
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <i className="bi bi-info-circle me-2"></i> No results
                        found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Buttons */}
            {!loading && totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center py-3 px-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="SubtitleText small">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageLaunch;
