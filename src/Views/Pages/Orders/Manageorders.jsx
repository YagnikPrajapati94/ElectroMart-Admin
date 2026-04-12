import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../AdminLayout";
import Skeleton from "react-loading-skeleton";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import OrderService from "../../Services/OrderService";
import { toast } from "react-toastify";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "#fef9c3",
    color: "#854d0e",
    dot: "#eab308",
  },
  confirmed: {
    label: "Confirmed",
    bg: "#dbeafe",
    color: "#1e40af",
    dot: "#3b82f6",
  },
  processing: {
    label: "Processing",
    bg: "#ede9fe",
    color: "#5b21b6",
    dot: "#7c3aed",
  },
  shipped: {
    label: "Shipped",
    bg: "#e0f2fe",
    color: "#075985",
    dot: "#0ea5e9",
  },
  delivered: {
    label: "Delivered",
    bg: "#dcfce7",
    color: "#166534",
    dot: "#22c55e",
  },
  cancelled: {
    label: "Cancelled",
    bg: "#fee2e2",
    color: "#991b1b",
    dot: "#ef4444",
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className="d-inline-flex align-items-center gap-1"
      style={{
        background: cfg.bg,
        color: cfg.color,
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: "0.75rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color }) => (
  <div className="col-lg-3 col-md-6 mb-3">
    <div
      className="p-3 rounded-3 d-flex align-items-center gap-3"
      style={{
        background: "var(--background, #fff)",
        border: "0.5px solid var(--border, #e5e7eb)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <i className={`bi ${icon}`} style={{ color, fontSize: "1.2rem" }} />
      </div>
      <div>
        <div
          className="TitleText fw-bold"
          style={{ fontSize: "1.3rem", lineHeight: 1 }}
        >
          {value}
        </div>
        <div className="SubtitleText" style={{ fontSize: "0.78rem" }}>
          {label}
        </div>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalRevenue: 0,
    statusCounts: {},
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getAllOrders();
      if (res.data.success) {
        setOrders(res.data.orders);
        setStats({
          total: res.data.total,
          totalRevenue: res.data.totalRevenue,
          statusCounts: res.data.statusCounts,
        });
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── Status update ─────────────────────────────────────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await OrderService.updateOrderStatus(orderId, newStatus);
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o,
          ),
        );
        toast.success(`Order marked as ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Filter + paginate ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return orders.filter((o) => {
      const matchSearch =
        !q ||
        o.userId?.firstName?.toLowerCase().includes(q) ||
        o.userId?.lastName?.toLowerCase().includes(q) ||
        o.userId?.email?.toLowerCase().includes(q) ||
        o.productId?.title?.toLowerCase().includes(q) ||
        o.orderId?.toLowerCase().includes(q) ||
        o.paymentId?.toLowerCase().includes(q);

      const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
      const matchPayment = paymentFilter
        ? o.paymentStatus === paymentFilter
        : true;

      return matchSearch && matchStatus && matchPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const resetPage = () => setCurrentPage(1);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="row mb-4 px-2 align-items-center">
          <BreadCrumb parent={"Orders"} child={"List"} />
          <div className="col-12 text-center p-0">
            <h3 className="fw-semibold TitleText m-0">Orders Management</h3>
            <small className="SubtitleText">
              Track, filter, and update the status of all customer orders.
            </small>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="row mb-4">
          <StatCard
            label="Total Orders"
            value={stats.total}
            icon="bi-bag-check"
            color="#7366ff"
          />
          <StatCard
            label="Revenue Collected"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon="bi-currency-rupee"
            color="#22c55e"
          />
          <StatCard
            label="Delivered"
            value={stats.statusCounts?.delivered || 0}
            icon="bi-check2-circle"
            color="#0ea5e9"
          />
          <StatCard
            label="Pending"
            value={stats.statusCounts?.pending || 0}
            icon="bi-hourglass-split"
            color="#f59e0b"
          />
        </div>

        {/* ── Filters ── */}
        <div className="row mb-4 align-items-end">
          <div className="col-lg-5 col-md-12 mb-2 mb-lg-0">
            <label className="form-label">
              <small>Search</small>
            </label>
            <div className="input-group shadow-sm rounded-3 overflow-hidden">
              <span className="input-group-text searchIcon bg-white border-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="search"
                className="form-control searchBar border-0 py-2 bg-white"
                placeholder="Search by customer, product, order ID…"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  resetPage();
                }}
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-2 mb-lg-0">
            <label className="form-label">
              <small>Order Status</small>
            </label>
            <select
              className="form-select filterSelect"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                resetPage();
              }}
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                <option key={val} value={val}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-3 col-md-6 mb-2 mb-lg-0">
            <label className="form-label">
              <small>Payment Status</small>
            </label>
            <select
              className="form-select filterSelect"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                resetPage();
              }}
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="col-lg-1 col-md-6 d-flex align-items-end">
            <button
              className="btn btn-sm w-100 py-2"
              style={{
                border: "0.5px solid var(--border)",
                borderRadius: 8,
                fontSize: "0.82rem",
                color: "var(--secondaryText)",
              }}
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setPaymentFilter("");
                resetPage();
              }}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="row">
          <div className="col-12">
            <div className="table-responsive rounded-3 shadow-sm">
              <table className="brands-table table table-hover align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr className="align-middle text-uppercase small text-secondary">
                    <th>#</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                    <th>Date</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(8)].map((_, i) => (
                      <tr key={i}>
                        {[20, 140, 160, 40, 80, 80, 100, 80, 120].map(
                          (w, j) => (
                            <td key={j}>
                              <Skeleton height={20} width={w} />
                            </td>
                          ),
                        )}
                      </tr>
                    ))
                  ) : paginated.length > 0 ? (
                    paginated.map((order, index) => (
                      <tr key={order._id}>
                        <td
                          className="SubtitleText"
                          style={{ fontSize: "0.82rem" }}
                        >
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        {/* Customer */}
                        <td>
                          <div
                            className="TitleText"
                            style={{ fontSize: "0.88rem", fontWeight: 600 }}
                          >
                            {order.userId?.firstName} {order.userId?.lastName}
                          </div>
                          <div
                            className="SubtitleText"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {order.userId?.email}
                          </div>
                        </td>

                        {/* Product */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {order.productId?.images?.[0] && (
                              <img
                                src={order.productId.images[0]}
                                alt=""
                                style={{
                                  width: 36,
                                  height: 36,
                                  objectFit: "contain",
                                  borderRadius: 6,
                                  border: "0.5px solid var(--border)",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <span
                              className="TitleText"
                              style={{
                                fontSize: "0.85rem",
                                maxWidth: 180,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "inline-block",
                              }}
                            >
                              {order.productId?.title || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Qty */}
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: "var(--border, #f3f4f6)",
                              color: "var(--primaryText)",
                              borderRadius: 6,
                              padding: "3px 8px",
                              fontSize: "0.78rem",
                            }}
                          >
                            ×{order.quantity}
                          </span>
                        </td>

                        {/* Amount */}
                        <td>
                          <span
                            className="TitleText fw-bold"
                            style={{ fontSize: "0.9rem" }}
                          >
                            ₹{order.totalAmount?.toLocaleString()}
                          </span>
                        </td>

                        {/* Payment status */}
                        <td>
                          <span
                            style={{
                              background:
                                order.paymentStatus === "paid"
                                  ? "#dcfce7"
                                  : order.paymentStatus === "failed"
                                    ? "#fee2e2"
                                    : "#fef9c3",
                              color:
                                order.paymentStatus === "paid"
                                  ? "#166534"
                                  : order.paymentStatus === "failed"
                                    ? "#991b1b"
                                    : "#854d0e",
                              borderRadius: 20,
                              padding: "3px 10px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {order.paymentStatus || "—"}
                          </span>
                        </td>

                        {/* Order status */}
                        <td>
                          <StatusBadge status={order.orderStatus} />
                        </td>

                        {/* Date */}
                        <td>
                          <span
                            className="SubtitleText"
                            style={{ fontSize: "0.78rem" }}
                          >
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </td>

                        {/* Status dropdown */}
                        <td>
                          <select
                            className="form-select form-select-sm shadow-none"
                            value={order.orderStatus}
                            disabled={
                              updatingId === order._id ||
                              order.orderStatus === "delivered" ||
                              order.orderStatus === "cancelled"
                            }
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            style={{
                              fontSize: "0.8rem",
                              borderRadius: 8,
                              border: "0.5px solid var(--border)",
                              minWidth: 130,
                              cursor:
                                order.orderStatus === "delivered" ||
                                order.orderStatus === "cancelled"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                              <option key={val} value={val}>
                                {cfg.label}
                              </option>
                            ))}
                          </select>
                          {updatingId === order._id && (
                            <span
                              className="spinner-border spinner-border-sm ms-2"
                              style={{ color: "#7366ff" }}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-5">
                        <i className="bi bi-bag-x fs-2 SubtitleText d-block mb-2" />
                        <span className="SubtitleText">No orders found</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center py-3 px-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="SubtitleText small">
                  Page {currentPage} of {totalPages} &nbsp;·&nbsp;{" "}
                  {filtered.length} orders
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
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

export default ManageOrders;
