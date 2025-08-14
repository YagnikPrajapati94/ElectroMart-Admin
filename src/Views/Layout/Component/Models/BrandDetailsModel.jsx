import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BrandDetailsModel = ({ brandId }) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem('adminToken');

    const [brandInfo, setBrandInfo] = useState(null);
    const [categoryMap, setCategoryMap] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/api/getBrandDetails/${brandId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBrandInfo(res.data.brand);
            setCategoryMap(res.data.categoryMap);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (brandId) {
            fetchData();
        }
    }, [brandId]);

    return (
        <div className="modal fade" id="detailsmodel" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                            Brand Overview
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>

                    <div className="modal-body px-4">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status" />
                            </div>
                        ) : (
                            <>
                                {brandInfo && (
                                    <div className="text-center mb-4">
                                        <img
                                            src={brandInfo.brandLogo}
                                            alt="Brand Logo"
                                            style={{ width: "100px", height: "auto", objectFit: "contain" }}
                                            className="mb-3"
                                        />
                                        <h5 className="fw-bold text-primary">{brandInfo.brandName}</h5>
                                        <p className="text-muted small">
                                            This brand includes a variety of categories and subcategories related to electronics. Below is a structured view of all available categories under this brand along with their respective subcategories.
                                        </p>
                                    </div>
                                )}

                                {Object.keys(categoryMap).length === 0 ? (
                                    <p className="text-center text-muted">No category data found for this brand.</p>
                                ) : (
                                    <div className="accordion " id="categoryAccordion">
                                        {Object.entries(categoryMap).map(([category, subcategories], idx) => (
                                            <div className="accordion-item  mb-2" key={idx}>
                                                <h2 className="accordion-header" id={`heading-${idx}`}>
                                                    <button className="accordion-button shadow-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${idx}`}>
                                                        <strong className='text-uppercase'>{category}</strong>
                                                    </button>
                                                </h2>
                                                <div id={`collapse-${idx}`} className="accordion-collapse collapse" data-bs-parent="#categoryAccordion">
                                                    <div className="accordion-body">
                                                        <p className="text-muted mb-2">Available subcategories:</p>
                                                        <ul className="list-group text-uppercase list-group-flush">
                                                            {subcategories.map((sub, i) => (
                                                                <li key={i} className="list-group-item">{sub}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandDetailsModel;
