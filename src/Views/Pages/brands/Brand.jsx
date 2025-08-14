import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import AddBrandModel from "../../Layout/Component/Models/AddBrandModel";
import BrandDetailsModel from "../../Layout/Component/Models/BrandDetailsModel";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { speak } from "../../Layout/utils/speak";

const Brand = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("adminToken");

  const [brands, setBrands] = useState([]);
  const [editData, setEditData] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/getBrands`);
      setBrands(res.data.brands);
      // console.log(res.data.brands);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    setLoading(id);
    try {
      speak("Are you sure you want to delete this brand?");
      const confirmed = window.confirm(
        "Are you sure you want to delete this brand? ."
      );
      if (!confirmed) {
        speak("Brand deletion cancelled.");
        return;
      }
      await axios.delete(`${baseURL}/api/deleteBrand/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Brand deleted successfully");
      speak("Brand deleted successfully");
      fetchBrands();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
  };

  const handleView = (id) => {
    setBrandId(id);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h3 className="fw-semibold text-dark m-0">Brands List</h3>
            <small className="text-muted">
              Manage all brand logos and names here
            </small>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <button
              onClick={() => setEditData(null)}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              className="btn login-btn border-0 text-light px-4 py-2 shadow-sm"
            >
              <i className="bi bi-plus-circle me-2"></i>Add Brand
            </button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12 ms-auto">
            <input
              type="search"
              className="form-control shadow-sm rounded-3 py-3"
              placeholder="Search brand name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to first page
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="table-responsive rounded-3 border shadow-sm">
              <table className="table table-hover align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr className="align-middle text-uppercase small text-secondary">
                    <th>#</th>
                    <th>Brand Name</th>
                    <th>Logo</th>
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
                    currentItems.map((brand, index) => (
                      <tr key={brand._id} style={{ cursor: "pointer" }}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">{brand.brandName}</td>
                        <td>
                          <img
                            src={brand.brandLogo}
                            alt={brand.brandName}
                            className="shadow-sm border border-1 rounded bg-white"
                            style={{
                              width: "80px",
                              height: "40px",
                              objectFit: "contain",
                            }}
                          />
                        </td>
                        <td>
                          <span className="badge text-bg-light rounded-pill px-3 py-2">
                            {new Date(brand.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="text-end ">

                          <button
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={(e) => handleEdit(brand)}
                            className="btn text-primary p-0 mx-2 "
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(brand._id)}
                            className="btn text-danger p-0 mx-2 border-0 shadow-none"
                            disabled={loading == brand._id}
                          >
                            {loading == brand._id ? (
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
                      <td colSpan="5" className="text-center text-muted py-4">
                        <i className="bi bi-info-circle me-2"></i> No brands
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
                <span className="text-muted small">
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

        {/* Modals */}
        <AddBrandModel editData={editData} fetchBrands={fetchBrands} />
        <BrandDetailsModel brandId={brandId} />
      </div>
    </AdminLayout>
  );
};

export default Brand;
