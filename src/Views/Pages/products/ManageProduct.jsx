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
import ProductService from "../../Services/ProductService";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigation = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await ProductService.getAllProductsTableData();
      console.log(res);
      setProducts(res.data.products);

      // setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
        Swal.fire("Cancelled", "Your Product is safe :)", "info");
        speak("Product deletion cancelled");
        return;
      }

      // ✅ API call
      const response = await ProductService.deleteProduct(id);

      if (response.data.success) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        speak("Product deleted successfully");
        fetchProducts(); // refetch
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
    navigation(`/admin/products/add/${id}`);
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      String(product.price).toLowerCase().includes(term) ||
      String(product.mrp).toLowerCase().includes(term) ||
      String(product.quantity).toLowerCase().includes(term) ||
      product.brandName.toLowerCase().includes(term) ||
      product.categoryName.toLowerCase().includes(term) ||
      product.subCategoryName.toLowerCase().includes(term)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row mb-4 px-2 align-items-center">
          <BreadCrumb parent={"Products"} child={"List"} />
          <div className="col-12 text-center p-0">
            <h3 className="fw-semibold TitleText m-0">Product Directory</h3>
            <small className="SubtitleText">
              List of all the products in the store
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
                    <th>Title</th>
                    <th>Description</th>
                    <th>MRP</th>
                    <th>price</th>
                    <th>Quantity</th>
                    <th>brand</th>
                    <th>category</th>
                    <th>subCategory</th>
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
                          <Skeleton height={20} width={150} />
                        </td>
                        <td>
                          <Skeleton height={20} width={100} />
                        </td>
                        <td>
                          <Skeleton height={20} width={100} />
                        </td>
                        <td>
                          <Skeleton height={20} width={80} />
                        </td>
                        <td>
                          <Skeleton height={20} width={100} />
                        </td>
                        <td>
                          <Skeleton height={20} width={100} />
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
                    currentItems.map((prd, index) => (
                      <tr key={prd._id} style={{ cursor: "pointer" }}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">{prd.title}</td>
                        <td className="text-wrap">{prd.description}</td>
                        <td>
                          <span className="badge bg-danger">
                            ₹{prd.mrp.toLocaleString()}{" "}
                            {/* adds comma for thousands */}
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-success">
                            ₹{prd.price.toLocaleString()}
                          </span>
                        </td>

                        <td className="text-center">
                          <span
                            className={`badge ${
                              prd.quantity === 0
                                ? "bg-secondary"
                                : prd.quantity <= 5
                                ? "bg-warning text-dark"
                                : "bg-primary"
                            }`}
                          >
                            {prd.quantity}
                          </span>
                        </td>

                        <td>{prd.brandName}</td>
                        <td>{prd.categoryName}</td>
                        <td>{prd.subCategoryName}</td>
                        <td className="text-end ">
                          <button
                            onClick={(e) => handleEdit(prd._id)}
                            className="btn text-primary p-0 mx-2 "
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(prd._id)}
                            className="btn text-danger p-0 mx-2 border-0 shadow-none"
                            disabled={loading == prd._id}
                          >
                            {loading == prd._id ? (
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
                      <td colSpan="10" className="text-center py-4">
                        <i className="bi bi-info-circle me-2"></i> No Product
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

export default ManageProduct;
