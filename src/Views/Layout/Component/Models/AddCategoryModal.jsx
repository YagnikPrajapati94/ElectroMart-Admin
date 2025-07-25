import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';

const baseURL = import.meta.env.VITE_API_URL;

const AddCategoryModal = ({ fetchCategories, editData }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = sessionStorage.getItem("adminToken");

    // Fetch brand list for dropdown
    const getBrands = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/getBrands`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBrands(res.data?.brands || []);
        } catch (error) {
            console.error("Failed to fetch brands", error);
        }
    };

    useEffect(() => {
        getBrands();
        if (editData) {
            setValue('category', editData.category);
            setValue('subcategory', editData.subcategory);
            setValue('brand', editData.brand);
        }
    }, [editData, setValue]);

    const handleFormSubmit = async (data) => {
        setLoading(true);
        try {
            if (editData) {
                await axios.put(`${baseURL}/api/updateCategory/${editData._id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Category updated successfully");
            } else {
                await axios.post(`${baseURL}/api/addCategory`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Category added successfully");
            }

            reset();
            fetchCategories?.();
            const modalEl = document.getElementById('categoryModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
        } catch (error) {
            toast.error("Failed to save category");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
    };

    return (
        <div className="modal fade" id="categoryModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-black text-light">
                    <div className="modal-header">
                        <h5 className="modal-title">{editData ? "Update" : "Add"} Category</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="d-grid gap-3">
                            {/* Category */}
                            <div>
                                <label className="form-label">Category</label>
                                <input
                                    {...register("category", { required: "Category is required" })}
                                    className={`form-control ${errors.category ? "is-invalid" : ""}`}
                                    placeholder="Enter category name"
                                />
                                {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
                            </div>

                            {/* Subcategory */}
                            <div>
                                <label className="form-label">Subcategory</label>
                                <input
                                    {...register("subcategory", { required: "Subcategory is required" })}
                                    className={`form-control ${errors.subcategory ? "is-invalid" : ""}`}
                                    placeholder="Enter subcategory name"
                                />
                                {errors.subcategory && <div className="invalid-feedback">{errors.subcategory.message}</div>}
                            </div>

                            {/* Brand Dropdown */}
                            <div>
                                <label className="form-label">Select Brand</label>
                                <select
                                    {...register("brand", { required: "Please select a brand" })}
                                    className={`form-select ${errors.brand ? "is-invalid" : ""}`}
                                >
                                    <option value="">-- Select a Brand --</option>
                                    {brands.map((brand) => (
                                        <option key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                                {errors.brand && <div className="invalid-feedback">{errors.brand.message}</div>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className={`btn ${editData ? "btn-warning" : "btn-primary"} w-100 shadow-none`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    `${editData ? "Update" : "Add"} Category`
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryModal;
