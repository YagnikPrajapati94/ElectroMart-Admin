import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../AdminLayout";
import Skeleton from "react-loading-skeleton";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import AdminOrderService from "../../Services/OrderService";
import { toast } from "react-toastify";

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

// ── Payment status badge ──────────────────────────────────────────────────────
const PaymentBadge = ({ status }) => {
  const map = {
    paid: { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    pending: { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
    failed: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  };
  const cfg = map[status] || map.pending;
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
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          display: "inline-block",
        }}
      />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
    </span>
  );
};

// ── Detail Drawer (offcanvas-style panel) ─────────────────────────────────────
const PaymentDrawer = ({ payment, onClose }) => {
  if (!payment) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1055,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
        }}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: 420,
          maxWidth: "95vw",
          background: "var(--background, #fff)",
          height: "100%",
          overflowY: "auto",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
          zIndex: 1,
          animation: "slideIn 0.22s ease",
        }}
      >
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Drawer header */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ borderBottom: "0.5px solid var(--border)" }}
        >
          <div>
            <h6 className="TitleText fw-bold mb-0" style={{ fontSize: "1rem" }}>
              Payment Details
            </h6>
            <div className="SubtitleText" style={{ fontSize: "0.75rem" }}>
              {payment.razorpayOrderId || "—"}
            </div>
          </div>
          <button
            className="btn p-0 shadow-none"
            onClick={onClose}
            style={{ color: "var(--secondaryText)" }}
          >
            <i className="bi bi-x-lg fs-5" />
          </button>
        </div>

        <div className="px-4 py-3">
          {/* Status */}
          <div className="mb-4">
            <PaymentBadge status={payment.paymentStatus} />
          </div>

          {/* Customer */}
          <div
            className="p-3 rounded-3 mb-3"
            style={{
              background: "var(--border, #f9fafb)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div
              className="SubtitleText mb-2"
              style={{
                fontSize: "0.73rem",
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              CUSTOMER
            </div>
            <div
              className="TitleText fw-semibold"
              style={{ fontSize: "0.92rem" }}
            >
              {payment.user?.firstName} {payment.user?.lastName}
            </div>
            <div className="SubtitleText" style={{ fontSize: "0.82rem" }}>
              {payment.user?.email}
            </div>
            <div className="SubtitleText" style={{ fontSize: "0.82rem" }}>
              {payment.user?.mobile}
            </div>
          </div>

          {/* Transaction IDs */}
          <div
            className="p-3 rounded-3 mb-3"
            style={{
              background: "var(--border, #f9fafb)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div
              className="SubtitleText mb-2"
              style={{
                fontSize: "0.73rem",
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              TRANSACTION
            </div>
            <div className="mb-1">
              <span className="SubtitleText" style={{ fontSize: "0.75rem" }}>
                Razorpay Order ID
              </span>
              <div
                className="TitleText"
                style={{
                  fontSize: "0.82rem",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {payment.razorpayOrderId || "—"}
              </div>
            </div>
            <div className="mt-2">
              <span className="SubtitleText" style={{ fontSize: "0.75rem" }}>
                Payment ID
              </span>
              <div
                className="TitleText"
                style={{
                  fontSize: "0.82rem",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {payment.paymentId || "—"}
              </div>
            </div>
          </div>

          {/* Items */}
          <div
            className="p-3 rounded-3 mb-3"
            style={{
              background: "var(--border, #f9fafb)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div
              className="SubtitleText mb-2"
              style={{
                fontSize: "0.73rem",
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              ITEMS ({payment.items?.length})
            </div>
            {payment.items?.map((item, i) => (
              <div
                key={i}
                className="d-flex align-items-center gap-3 py-2"
                style={{
                  borderTop: i > 0 ? "0.5px solid var(--border)" : "none",
                }}
              >
                {item.product?.images?.[0] && (
                  <img
                    src={item.product.images[0]}
                    alt=""
                    style={{
                      width: 44,
                      height: 44,
                      objectFit: "contain",
                      borderRadius: 8,
                      border: "0.5px solid var(--border)",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div className="flex-grow-1 min-w-0">
                  <div
                    className="TitleText"
                    style={{
                      fontSize: "0.85rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.product?.title || "Unknown Product"}
                  </div>
                  <div className="SubtitleText" style={{ fontSize: "0.75rem" }}>
                    Qty: {item.quantity} · ₹{item.subtotal?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="d-flex justify-content-between align-items-center p-3 rounded-3"
            style={{
              background: "#7366ff12",
              border: "0.5px solid #7366ff30",
            }}
          >
            <span className="TitleText fw-bold">Total Collected</span>
            <span
              className="TitleText fw-bold"
              style={{ fontSize: "1.1rem", color: "#7366ff" }}
            >
              ₹{payment.totalAmount?.toLocaleString()}
            </span>
          </div>

          {/* Date */}
          <div
            className="mt-3 SubtitleText text-center"
            style={{ fontSize: "0.78rem" }}
          >
            {new Date(payment.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalCollected: 0,
    statusCounts: {},
  });
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await AdminOrderService.getAllPayments();
      if (res.data.success) {
        setPayments(res.data.payments);
        setStats({
          total: res.data.total,
          totalCollected: res.data.totalCollected,
          statusCounts: res.data.statusCounts,
        });
      }
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return payments.filter((p) => {
      const matchSearch =
        !q ||
        p.user?.firstName?.toLowerCase().includes(q) ||
        p.user?.lastName?.toLowerCase().includes(q) ||
        p.user?.email?.toLowerCase().includes(q) ||
        p.razorpayOrderId?.toLowerCase().includes(q) ||
        p.paymentId?.toLowerCase().includes(q);

      const matchStatus = statusFilter
        ? p.paymentStatus === statusFilter
        : true;
      const matchMethod = methodFilter
        ? p.paymentMethod === methodFilter
        : true;

      return matchSearch && matchStatus && matchMethod;
    });
  }, [payments, searchTerm, statusFilter, methodFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const resetPage = () => setCurrentPage(1);

  return (
    <AdminLayout>
      {selectedPayment && (
        <PaymentDrawer
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      <div className="container-fluid p-4">
        {/* Header */}
        <div className="row mb-4 px-2 align-items-center">
          <BreadCrumb parent={"Payments"} child={"List"} />
          <div className="col-12 text-center p-0">
            <h3 className="fw-semibold TitleText m-0">Payments</h3>
            <small className="SubtitleText">
              Monitor all Razorpay payment sessions, statuses, and revenue.
            </small>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="row mb-4">
          <StatCard
            label="Total Transactions"
            value={stats.total}
            icon="bi-credit-card"
            color="#7366ff"
          />
          <StatCard
            label="Revenue Collected"
            value={`₹${stats.totalCollected.toLocaleString()}`}
            icon="bi-currency-rupee"
            color="#22c55e"
          />
          <StatCard
            label="Successful"
            value={stats.statusCounts?.paid || 0}
            icon="bi-patch-check"
            color="#0ea5e9"
          />
          <StatCard
            label="Failed / Pending"
            value={
              (stats.statusCounts?.failed || 0) +
              (stats.statusCounts?.pending || 0)
            }
            icon="bi-exclamation-circle"
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
                placeholder="Search by customer, payment ID, order ID…"
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
              <small>Status</small>
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-6 mb-2 mb-lg-0">
            <label className="form-label">
              <small>Method</small>
            </label>
            <select
              className="form-select filterSelect"
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                resetPage();
              }}
            >
              <option value="">All Methods</option>
              <option value="Razorpay">Razorpay</option>
              <option value="COD">COD</option>
            </select>
          </div>

          <div className="col-lg-1 d-flex align-items-end">
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
                setMethodFilter("");
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
                    <th>Razorpay Order ID</th>
                    <th>Payment ID</th>
                    <th>Method</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-end">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(8)].map((_, i) => (
                      <tr key={i}>
                        {[20, 140, 160, 140, 80, 40, 80, 80, 80, 50].map(
                          (w, j) => (
                            <td key={j}>
                              <Skeleton height={20} width={w} />
                            </td>
                          ),
                        )}
                      </tr>
                    ))
                  ) : paginated.length > 0 ? (
                    paginated.map((payment, index) => (
                      <tr key={payment._id}>
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
                            {payment.user?.firstName} {payment.user?.lastName}
                          </div>
                          <div
                            className="SubtitleText"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {payment.user?.email}
                          </div>
                        </td>

                        {/* Razorpay order ID */}
                        <td>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.78rem",
                              color: "var(--secondaryText)",
                            }}
                          >
                            {payment.razorpayOrderId
                              ? payment.razorpayOrderId.slice(0, 18) + "…"
                              : "—"}
                          </span>
                        </td>

                        {/* Payment ID */}
                        <td>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.78rem",
                              color: "var(--secondaryText)",
                            }}
                          >
                            {payment.paymentId
                              ? payment.paymentId.slice(0, 16) + "…"
                              : "—"}
                          </span>
                        </td>

                        {/* Method */}
                        <td>
                          <span
                            style={{
                              background: "#ede9fe",
                              color: "#5b21b6",
                              borderRadius: 6,
                              padding: "3px 8px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {payment.paymentMethod || "—"}
                          </span>
                        </td>

                        {/* Items count */}
                        <td>
                          <span
                            style={{
                              background: "var(--border, #f3f4f6)",
                              color: "var(--primaryText)",
                              borderRadius: 6,
                              padding: "3px 8px",
                              fontSize: "0.78rem",
                            }}
                          >
                            {payment.items?.length} item
                            {payment.items?.length !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Total */}
                        <td>
                          <span
                            className="TitleText fw-bold"
                            style={{ fontSize: "0.9rem" }}
                          >
                            ₹{payment.totalAmount?.toLocaleString()}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <PaymentBadge status={payment.paymentStatus} />
                        </td>

                        {/* Date */}
                        <td>
                          <span
                            className="SubtitleText"
                            style={{ fontSize: "0.78rem" }}
                          >
                            {new Date(payment.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </td>

                        {/* Details button */}
                        <td className="text-end">
                          <button
                            className="btn btn-sm shadow-none"
                            onClick={() => setSelectedPayment(payment)}
                            style={{
                              border: "0.5px solid #7366ff40",
                              color: "#7366ff",
                              borderRadius: 8,
                              fontSize: "0.78rem",
                              padding: "4px 12px",
                            }}
                          >
                            <i className="bi bi-eye me-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-5">
                        <i className="bi bi-credit-card fs-2 SubtitleText d-block mb-2" />
                        <span className="SubtitleText">No payments found</span>
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
                  {filtered.length} payments
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

export default ManagePayments;
