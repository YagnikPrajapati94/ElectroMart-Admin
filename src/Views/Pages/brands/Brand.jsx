import React from 'react';
import AdminLayout from '../AdminLayout';
import AddBrandModel from '../../Layout/Component/Models/AddBrandModel';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import BrandDetailsModel from '../../Layout/Component/Models/BrandDetailsModel';

const Brand = () => {
    const baseURL = import.meta.env.VITE_API_URL;
    const [brands, setBrands] = useState([]);
    const [editData, setEditData] = useState(null);
    const [brandId, setBrandId] = useState(null);
    const token = sessionStorage.getItem('adminToken');
    const [searchTerm, setSearchTerm] = useState('');



    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/getBrands`);
            // console.log(res);
            setBrands(res.data.brands);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBrands()
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${baseURL}/api/deleteBrand/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Brand deleted successfully");
            fetchBrands()
            // setBrands(brands.filter((brand) => brand._id !== id));
        } catch (error) {
            console.log(error);
        }
    };
    const handleEdit = (data) => {
        setEditData(data);
    };
    const filteredBrands = brands.filter((brand) =>
        brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleView = (id) => {
        setBrandId(id);
    };

    return (
        <AdminLayout>
            <div className="container-fluid p-4">

                {/* Header Section */}
                <div className="row mb-4 align-items-center">
                    <div className="col-md-6">
                        <h3 className="fw-semibold text-dark m-0">Brands List</h3>
                        <small className="text-muted">Manage all brand logos and names here</small>
                    </div>
                    <div className="col-md-6 text-md-end mt-3 mt-md-0">
                        <button onClick={() => setEditData(null)} data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-primary px-4 py-2 shadow-sm">
                            <i className="bi bi-plus-circle me-2"></i>Add Brand
                        </button>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4 ms-auto">
                        <input
                            type="search"
                            className="form-control shadow-sm"
                            placeholder="Search brand name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive rounded-4 border shadow-sm">
                            <table className="table table-hover align-middle mb-0 text-nowrap">
                                <thead className="table-light">
                                    <tr className="align-middle text-uppercase small text-secondary">
                                        <th style={{ minWidth: '50px' }}>#</th>
                                        <th style={{ minWidth: '200px' }}>Brand Name</th>
                                        <th style={{ minWidth: '120px' }}>Logo</th>
                                        <th style={{ minWidth: '160px' }}>Created At</th>
                                        <th className="text-end" style={{ minWidth: '120px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {filteredBrands.length > 0 ? (
                                        filteredBrands.map((brand, index) => (
                                            <tr onClick={() => handleView(brand._id)} data-bs-toggle="modal" data-bs-target="#detailsmodel" className='' key={brand._id} style={{ cursor: "pointer" }}>
                                                <td>{index + 1}</td>
                                                <td className="fw-semibold">{brand.brandName}</td>
                                                <td>
                                                    <img
                                                        src={brand.brandLogo}
                                                        alt={`${brand.brandName} Logo`}
                                                        className="shadow-sm border border-1 rounded bg-white"
                                                        style={{ width: '80px', height: '40px', objectFit: 'contain' }}
                                                    />
                                                </td>
                                                <td>
                                                    <span className="badge text-bg-light rounded-pill px-3 py-2">
                                                        {new Date(brand.createdAt).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#exampleModal"
                                                        onClick={() => handleEdit(brand)}
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(brand._id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                <i className="bi bi-info-circle me-2"></i> No brands found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>


                <AddBrandModel editData={editData} fetchBrands={fetchBrands} />
                <BrandDetailsModel brandId={brandId} />


            </div>
        </AdminLayout>
    );
};

export default Brand;
