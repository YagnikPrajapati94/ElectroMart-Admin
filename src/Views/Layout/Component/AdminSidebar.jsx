import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './logo';

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        {
            label: "Dashboard",
            icon: "bi-house-door-fill",
            path: "/admin/dashboard",
        },
        {
            label: "Products",
            icon: "bi-box-seam",
            children: [
                { label: "Add Product", path: "/admin/products/add" },
                { label: "Manage Products", path: "/admin/products/manage" },
                { label: "Product Variants", path: "/admin/products/variants" },
                { label: "Product Attributes", path: "/admin/products/attributes" },
            ],
        },
        {
            label: "Categories",
            icon: "bi-tags-fill",
            path: "/admin/categories",
        }, {
            label: "Brands",
            icon: "bi-tags-fill",
            path: "/admin/brands"

        },
        {
            label: "Orders",
            icon: "bi-cart-check-fill",
            children: [
                { label: "All Orders", path: "/admin/orders" },
                { label: "Pending Orders", path: "/admin/orders/pending" },
                { label: "Completed Orders", path: "/admin/orders/completed" },
            ],
        },
        {
            label: "Users",
            icon: "bi-people-fill",
            path: "/admin/users",
        },
        {
            label: "Reviews",
            icon: "bi-chat-left-dots-fill",
            path: "/admin/reviews",
        },
        {
            label: "Payments",
            icon: "bi-credit-card-fill",
            path: "/admin/payments",
        },
        {
            label: "Stock/Inventory",
            icon: "bi-boxes",
            path: "/admin/inventory",
        },
        {
            label: "Shipping/Delivery",
            icon: "bi-truck",
            children: [
                { label: "Shipping Methods", path: "/admin/shipping/methods" },
                { label: "Track Deliveries", path: "/admin/shipping/tracking" },
            ],
        },
        {
            label: "Admin Settings",
            icon: "bi-gear-fill",
            children: [
                { label: "Add Admin", path: "/admin/settings/add-admin" },
                { label: "Change Password", path: "/admin/settings/change-password" },
                { label: "Activity Logs", path: "/admin/settings/logs" },
            ],
        },
    ];

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="offcanvas offcanvas-start border-0 " id="offcanvas" aria-labelledby="offcanvasLabel">
            <div className="offcanvas-header shadow-sm  bg-black    ">
                <Link to='/admin/dashboard' className="navbar-brand    ">
                    <Logo />
                </Link>
                <button type="button" className="btn-close btn-close-white  shadow-none d-lg-none d-block" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body py-0   sidebar-scroll px-0">
                <ul className="list-unstyled   gap-3 navbar-nav">
                    {menuItems.map((item, index) => (
                        <li key={index} className=''>
                            {item.children ? (
                                <>
                                    <a

                                        className={`d-flex px-4 child-color box-hover  justify-content-between align-items-center text-decoration-none px-2 py-2 ${item.children.some(child => isActive(child.path)) ? "active" : "non-active"}`}
                                        data-bs-toggle="collapse"
                                        href={`#submenu${index}`}
                                        role="button"
                                        aria-expanded={item.children.some(child => isActive(child.path)) ? "true" : "false"}
                                        aria-controls={`submenu${index}`}
                                    >
                                        <span className={item.children.some(child => isActive(child.path)) ? "" : "non-active"}>
                                            <i className={`bi ${item.icon} me-2`} style={{ color: item.children.some(child => isActive(child.path)) ? "rgb(104, 97, 206)" : undefined }}></i>
                                            {item.label}
                                        </span>
                                        <i className="bi bi-caret-down-fill small text-secondary"></i>
                                    </a>
                                    <ul className={`collapse  collapse-list ps-5 ${item.children.some(child => isActive(child.path)) ? "show" : ""}`} id={`submenu${index}`}>
                                        {item.children.map((sub, subIndex) => (
                                            <li key={subIndex}>
                                                <Link
                                                    to={sub.path}
                                                    className={`text-decoration-none   d-block py-1 px-2 rounded ${isActive(sub.path) ? "child-active" : "child-color"}`}
                                                >
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`d-flex box-hover  child-color px-4 align-items-center px-2 py-2 text-decoration-none rounded ${isActive(item.path) ? "active " : ""}`}
                                >
                                    <i className={`bi ${item.icon} me-2`} style={{ color: isActive(item.path) ? "rgb(104, 97, 206)" : undefined }}></i>
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;
