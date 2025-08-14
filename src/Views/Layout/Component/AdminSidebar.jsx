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
        { label: "Product Variants", path: "/admin/products/variants" },
        { label: "Product Attributes", path: "/admin/products/attributes" },
      ],
    },
    {
      label: "Categories",
      icon: "bi-tags-fill",
      children: [
        { label: "Add Category", path: "/admin/categories/addCategory" },
        { label: "Add Subcategory", path: "/admin/categories/addSubCategory" },
        {
          label: "Manage Categories & Subcategories",
          path: "/admin/categories/manage",
        },
      ],
    },
    {
      label: "Brands",
      icon: "bi-tags-fill",
      path: "/admin/brands",
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
          className="btn-close pe-4   shadow-none d-lg-none d-block"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div className="offcanvas-body   px-0     sidebar-scroll ">
        <ul className="list-unstyled   gap-3 navbar-nav">
          {menuItems.map((item, index) => (
            <li key={index} className="">
              {item.children ? (
                <>
                  <a
                    className={`d-flex px-4 child-color box-hover  justify-content-between align-items-center text-decoration-none px-2 py-1 ${
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
                    {/* <i
                      className={`bi bi-caret-down-fill small ${
                        item.children.some((child) => isActive(child.path))
                          ? ""
                          : "non-active"
                      }} `}
                    ></i> */}
                  </a>
                  <ul
                    className={`collapse   collapse-list ps-5 ${
                      item.children.some((child) => isActive(child.path))
                        ? "show"
                        : ""
                    }`}
                    id={`submenu${index}`}
                  >
                    {item.children.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={sub.path}
                          className={`text-decoration-none small   d-block py-2 px-2 rounded ${
                            isActive(sub.path)
                              ? "child-active"
                              : "text-secondary"
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
                  className={`d-flex box-hover   px-4 align-items-center px-2 py-1 text-decoration-none rounded ${
                    isActive(item.path) ? "active " : "non-active"
                  }`}
                >
                  <i
                    className={`bi ${item.icon} me-2`}
                    // style={{
                    //   color: isActive(item.path)
                    //     ? "rgb(104, 97, 206)"
                    //     : undefined,
                    // }}
                  ></i>
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
