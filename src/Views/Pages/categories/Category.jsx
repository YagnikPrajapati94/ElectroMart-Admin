import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';
import AddCategoryModal from '../../Layout/Component/Models/AddCategoryModal';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const Category = () => {
    const baseURL = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem('adminToken');

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editData, setEditData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;




    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/api/getCategories`);
            setCategories(res.data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);



    const handleEdit = (cat) => {
        setEditData(cat);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${baseURL}/api/deleteCategory/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (error) {
            console.log(error);
        }
    };
    const filteredCategories = categories.filter(cat => {
        const search = searchTerm.toLowerCase();
        const brand = cat.brand?.brandName?.toLowerCase() || '';
        const category = cat.category?.toLowerCase() || '';
        const subcategory = cat.subcategory?.toLowerCase() || '';
        const createdDate = new Date(cat.createdAt).toLocaleDateString().toLowerCase();

        return (
            brand.includes(search) ||
            category.includes(search) ||
            subcategory.includes(search) ||
            createdDate.includes(search)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);




    return (
        <AdminLayout>
            <div className="container-fluid p-4">
                <div className="row  mb-3 align-items-center">
                    <div className="col-md-6">
                        <h3 className="fw-semibold text-dark m-0">All Categories</h3>
                        <small className="text-muted">
                            View, search, and manage all brand names, product categories, subcategories, and creation dates in one place.
                        </small>
                    </div>

                    <div className="col-md-6 text-md-end mt-3 mt-md-0">
                        <button onClick={() => setEditData(null)} data-bs-toggle="modal" data-bs-target="#categoryModal" className="btn btn-primary px-4 py-2 shadow-sm">
                            <i className="bi bi-plus-circle me-2"></i>Add Category
                        </button>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4 ms-auto">
                        <input
                            type="search"
                            className="form-control shadow-sm"
                            placeholder="Search by category, subcategory or brand ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive rounded-4 border shadow-sm">
                    <table className="table table-hover align-middle mb-0 text-nowrap">
                        <thead className="table-light">
                            <tr className="align-middle text-uppercase small text-secondary">
                                <th style={{ minWidth: '50px' }}>#</th>
                                <th style={{ minWidth: '200px' }}>Brand</th>
                                <th style={{ minWidth: '200px' }}>Category</th>
                                <th style={{ minWidth: '200px' }}>Subcategory</th>
                                <th style={{ minWidth: '160px' }}>Created At</th>
                                <th className="text-end" style={{ minWidth: '120px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, index) => (
                                    <tr key={index}>
                                        <td><Skeleton height={20} width={20} /></td>
                                        <td><Skeleton height={20} width={100} /></td>
                                        <td><Skeleton height={20} width={100} /></td>
                                        <td><Skeleton height={20} width={100} /></td>
                                        <td><Skeleton height={20} width={100} /></td>
                                        <td className="text-end">
                                            <Skeleton height={30} width={30} inline className="me-2" />
                                            <Skeleton height={30} width={30} inline />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredCategories.length > 0 ? (
                                currentItems.map((cat, index) => (

                                    <tr key={cat._id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{cat.brand?.brandName || "N/A"}</td>
                                        <td className="fw-semibold">{cat.category}</td>
                                        <td>{cat.subcategory}</td>
                                        <td>
                                            <span className="badge text-bg-light rounded-pill px-3 py-2">
                                                {new Date(cat.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button
                                                data-bs-toggle="modal"
                                                data-bs-target="#categoryModal"
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(cat)}
                                            >
                                                <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(cat._id)}
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        <i className="bi bi-info-circle me-2"></i> No categories found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                </div>

                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center py-3 px-2">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-muted small">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
            <AddCategoryModal
                fetchCategories={fetchCategories}
                editData={editData}
            />
        </AdminLayout>
    );
};

export default Category;
