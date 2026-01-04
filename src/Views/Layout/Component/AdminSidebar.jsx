import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RxCaretDown } from "react-icons/rx";

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
      ],
    },
    {
      label: "Categories",
      icon: "bi-folder-fill",
      children: [
        { label: "Add Category", path: "/admin/categories/addCategory" },
        { label: "Manage Category", path: "/admin/categories/manage" },
      ],
    },
    {
      label: "Subcategories",
      icon: "bi-diagram-3-fill",
      children: [
        {
          label: "Add Subcategory",
          path: "/admin/subcategories/addSubCategory",
        },
        {
          label: "Manage Subcategory",
          path: "/admin/subcategories/manage",
        },
      ],
    },
    {
      label: "Brands",
      icon: "bi-award-fill",
      children: [
        { label: "Add Brand", path: "/admin/brands/add" },
        { label: "Manage Brands", path: "/admin/brands/manage" },
      ],
    },
    {
      label: "Attributes",
      icon: "bi-tags-fill",
      path: "/admin/attributes/add",
      // children: [
      //   { label: "Add Attribute", path: "/admin/attributes/add" },
      //   { label: "Manage Attributes", path: "/admin/attributes/manage" },
      // ],
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
      path: "/admin/users/manage",
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
    <div
      className="offcanvas border-0   offcanvas-start  "
      id="offcanvas"
      aria-labelledby="offcanvasLabel"
    >
      <div className="offcanvas-header border-end  border-bottom border-secondary border-opacity-10   py-3">
        <Link to="/admin/dashboard" className="navbar-brand   ">
          <img src="/logo/logo.png" className="img-fluid w-75  " alt="" />
        </Link>
        <button
          type="button"
          className=" TitleText btn p-0   shadow-none d-lg-none d-block"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="bi bi-x-lg fs-3"></i>
        </button>
      </div>
      <div className="offcanvas-body   px-0     sidebar-scroll ">
        <ul className="list-unstyled   gap-3 navbar-nav">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar-menu-item px-3">
              {item.children ? (
                <>
                  <a
                    className={`d-flex   box-hover  justify-content-between align-items-center text-decoration-none  px-3 py-2 ${
                      item.children.some((child) => isActive(child.path))
                        ? "active  "
                        : "non-active"
                    }`}
                    data-bs-toggle="collapse"
                    href={`#submenu${index}`}
                    role="button"
                    aria-expanded={
                      item.children.some((child) => isActive(child.path))
                        ? "true"
                        : "false"
                    }
                    aria-controls={`submenu${index}`}
                  >
                    <span
                      className={
                        item.children.some((child) => isActive(child.path))
                          ? ""
                          : "non-active"
                      }
                    >
                      <i className={`bi ${item.icon} me-2`}></i>
                      {item.label}
                    </span>
                    <RxCaretDown
                      size={20}
                      className={
                        item.children.some((child) => isActive(child.path))
                          ? ""
                          : "non-active"
                      }
                    />
                  </a>
                  <ul
                    className={`collapse SubtitleText    collapse-list ${
                      item.children.some((child) => isActive(child.path))
                        ? "show"
                        : ""
                    }`}
                    id={`submenu${index}`}
                  >
                    {item.children.map((sub, subIndex) => (
                      <li
                        key={subIndex}
                        className={`pt-3 ${
                          isActive(sub.path) ? "child-active" : ""
                        }`}
                      >
                        <Link
                          to={sub.path}
                          className={`text-decoration-none small box-hover-child     d-block  px-2 rounded ${
                            isActive(sub.path) ? "child-active" : "SubtitleText"
                          }`}
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
                  className={`d-flex box-hover   align-items-center px-3 py-2 text-decoration-none  ${
                    isActive(item.path) ? "active " : "non-active"
                  }`}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
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
