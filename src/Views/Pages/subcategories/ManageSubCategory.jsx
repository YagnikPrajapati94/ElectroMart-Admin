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
import SubCategoryService from "../../Services/SubCategoryService";

const ManageSubCategory = () => {
  const baseURL = import.meta.env.VITE_API_URL;

  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigation = useNavigate();

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const res = await SubCategoryService.getSubCategories();
      setSubCategories(res.data.subCategories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Delete the brand
          const result = await SubCategoryService.deleteSubCategory(id);
          if (result.data.success) {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            speak("Sub Category deleted successfully");
            fetchSubCategories();
          }
          console.log(result);
        } else {
          // User clicked "Cancel"
          Swal.fire("Cancelled", "Your Category is safe :)", "info");
          speak("Sub Category deletion cancelled");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigation(`/admin/subcategories/addSubCategory/${id}`);
  };

  const filteredBrands = subCategories.filter((sub) => {
    const term = searchTerm.toLowerCase();

    return (
      sub.subCategoryName?.toLowerCase().includes(term) ||
      sub.categoryId?.categoryName?.toLowerCase().includes(term)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row mb-4 px-2 align-items-center">
          <BreadCrumb parent={"Sub Categories"} child={"List"} />
          <div className="col-12 text-center p-0">
            <h3 className="fw-semibold TitleText m-0">
              Sub Category Directory
            </h3>
            <small className="SubtitleText">
              View, search, and manage all registered Sub Category names.
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
                    <th>Sub Category Name</th>
                    <th>Category Name</th>
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
                    currentItems.map((sub, index) => (
                      <tr key={sub._id} style={{ cursor: "pointer" }}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">{sub.subCategoryName}</td>
                        <td>
                          <span className="badge text-bg-primary rounded-2 px-3 py-2">
                            {sub.categoryId?.categoryName}
                          </span>
                        </td>
                        <td>
                          <span className="badge text-bg-light rounded-pill px-3 py-2">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="text-end ">
                          <button
                            onClick={(e) => handleEdit(sub._id)}
                            className="btn text-primary p-0 mx-2 "
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
                            className="btn text-danger p-0 mx-2 border-0 shadow-none"
                            disabled={loading == sub._id}
                          >
                            {loading == sub._id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <i className="bi bi-info-circle me-2"></i> No Category
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

export default ManageSubCategory;
