import { useEffect, useState } from "react";
import { Plus, Filter, Upload } from "lucide-react";
import PaymentItemCard from "./components/PaymentItemCards";
import PaymentItemSkeleton from "./components/PaymentItemSkeleton";
import MainLayout from "../../layouts/mainLayout";
import { API_ENDPOINTS } from "../../apiConfig";
import StatusMessage from "../../appComponents/StatusMessage";
import PaymentItemForm from "./components/PaymentItemForm";
import { usePageTitle } from "../../hooks/usePageTitle";
import { fetchWithTimeout, handleFetchError } from "../../utils/fetchUtils";
import ConfirmationModal from "../../appComponents/ConfirmationModal";

export default function PaymentItems() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // "true", "false", or ""
  const [type, setType] = useState(""); // "compulsory", "optional", or ""
  const [paymentItems, setPaymentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  usePageTitle("Payment Items - DuesPay");
  
  // Fetch payment items with filters
  const fetchPaymentItems = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (type) params.append("type", type);

      const res = await fetchWithTimeout(`${API_ENDPOINTS.PAYMENT_ITEMS}?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }, 30000); // 30 seconds timeout

      if (!res.ok) throw new Error("Failed to fetch payment items");
      const data = await res.json();
      // Always use data.results if present, else fallback
      setPaymentItems(Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
      setPaymentItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentItems();
    // eslint-disable-next-line
  }, [search, status, type]);

  // Success/error message auto-clear
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Add Payment Item
  const handleAddPaymentItem = async (form, setFormError) => {
    setFormLoading(true);
    setFormError("");
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetchWithTimeout(API_ENDPOINTS.PAYMENT_ITEMS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }, 30000); // 30 seconds timeout

      if (!res.ok) {
        const err = await res.json();
        setFormError(err.detail || "Failed to create payment item");
        return;
      }
      setShowForm(false);
      setSuccess("Payment item created successfully!");
      fetchPaymentItems();
    } catch (err) {
      const { message } = handleFetchError(err);
      setFormError(message);
    } finally {
      setFormLoading(false);
    }
  };

  // Edit Payment Item
  const handleEditPaymentItem = async (form, setFormError) => {
    setFormLoading(true);
    setFormError("");
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetchWithTimeout(`${API_ENDPOINTS.PAYMENT_ITEMS}${editItem.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }, 30000); // 30 seconds timeout

      if (!res.ok) {
        const err = await res.json();
        setFormError(err.detail || "Failed to update payment item");
        return;
      }
      setEditItem(null);
      setShowForm(false);
      setSuccess("Payment item updated successfully!");
      fetchPaymentItems();
    } catch (err) {
      const { message } = handleFetchError(err);
      setFormError(message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Payment Item
  const handleDeletePaymentItem = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetchWithTimeout(`${API_ENDPOINTS.PAYMENT_ITEMS}${itemToDelete.id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }, 30000); // 30 seconds timeout

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Failed to delete payment item");
        return;
      }
      
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccess("Payment item deleted successfully!");
      fetchPaymentItems();
    } catch (err) {
      const { message } = handleFetchError(err);
      setError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
    setSuccess("");
    setError("");
  };

  return (
    <MainLayout>
      <div className="sm:p-8 mt-20 bg-transparent min-h-screen">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Payment Items</h1>
            <p className="text-gray-400 text-sm">Manage your organization&apos;s payment options</p>
          </div>
          <button
            className="mt-3 sm:mt-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-2xl transition"
            onClick={() => {
              setShowForm(true);
              setEditItem(null);
              setSuccess("");
              setError("");
            }}
          >
            <Plus className="w-5 h-5" /> Add Payment Item
          </button>
        </div>

        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {success && <StatusMessage type="success">{success}</StatusMessage>}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Search payment items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded w-64 focus:outline-none"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded"
          >
            <option value="">All Types</option>
            <option value="compulsory">Compulsory</option>
            <option value="optional">Optional</option>
          </select>
          {/* <button className="flex items-center gap-2 bg-[#23263A] text-white px-4 py-2 rounded">
            <Upload className="w-4 h-4" /> Export
          </button> */}
        </div>

        <div className="flex items-center gap-2 mb-2">
          {/* <input type="checkbox" id="selectAll" className="accent-purple-600" /> */}
          {/* <label htmlFor="selectAll" className="text-gray-300 text-sm">Select All</label> */}
          <span className="ml-auto text-gray-400 text-xs">{paymentItems.length} items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => <PaymentItemSkeleton key={idx} />)
            : paymentItems.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12">
                  {typeof paymentItems === "object" && paymentItems.message
                    ? paymentItems.message
                    : "No payment items found."}
                </div>
              ) : (
                paymentItems.map((item, idx) => (
                  <PaymentItemCard
                    key={item.id || idx}
                    {...item}
                    onEdit={() => {
                      setEditItem(item);
                      setShowForm(true);
                      setSuccess("");
                      setError("");
                    }}
                    onDelete={() => handleDeleteClick(item)}
                  />
                ))
              )
          }
        </div>
        
        {(showForm || editItem) && (
          <PaymentItemForm
            initial={editItem}
            onClose={() => {
              setShowForm(false);
              setEditItem(null);
            }}
            onSubmit={editItem ? handleEditPaymentItem : handleAddPaymentItem}
            loading={formLoading}
            success={success}
            error={error}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
          onConfirm={handleDeletePaymentItem}
          loading={deleteLoading}
          title="Delete Payment Item"
          message={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          type="danger"
        />
      </div>
    </MainLayout>
  );
}