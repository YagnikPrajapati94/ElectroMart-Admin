import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
            <div className="offcanvas-header py-5  shadow-sm  bg-black    ">
                <Link to='/admin/dashboard' className="navbar-brand    ">
                    <svg

                        // className='border'
                        style={{ width: '100%', maxWidth: '250px' }}
                        // width="350"
                        // height="80"
                        viewBox="0 0 250 80"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="ElectroMart logo"
                    >
                        {/* Icon group: scaled up and centered vertically */}
                        <g transform="translate(3, 20) scale(1.5)">
                            <path
                                stroke="currentColor"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                            />
                        </g>

                        {/* Text group: shifted closer to icon */}
                        <g transform="translate(55, 30)">
                            <text
                                x="0"
                                y="0"
                                fontFamily="Poppins, sans-serif"
                                fontSize="24"
                                fill="#0D6EFD"
                                fontWeight="600"
                                dominantBaseline="middle"
                                textAnchor="start"
                            >
                                Electro
                            </text>
                            <text
                                x="90"
                                y="0"
                                fontFamily="Poppins, sans-serif"
                                fontSize="24"
                                fill="#FF6F00"
                                fontWeight="700"
                                dominantBaseline="middle"
                                textAnchor="start"
                            >
                                Mart
                            </text>
                            <text
                                x="0"
                                y="25"
                                fontFamily="Poppins, sans-serif"
                                fontSize="13"
                                fill="gray"
                                dominantBaseline="middle"
                                textAnchor="start"
                            >
                                Online Shopping
                            </text>
                        </g>
                    </svg>
                </Link>
                <button type="button" className="btn-close btn-close-white  shadow-none d-lg-none d-block" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body py-0    sidebar-scroll px-0">
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
