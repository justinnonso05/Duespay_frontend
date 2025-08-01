import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { API_ENDPOINTS } from "../../../apiConfig";
import StatusMessage from "../../../appComponents/StatusMessage";

export default function BankInfoCard({ data, loading, onUpdated }) {
  // Extract the first result or null
  const bank = data?.results?.[0] || null;

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(bank || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Keep form in sync with latest bank info
  useEffect(() => setForm(bank || {}), [bank]);

  // Auto-clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    // Validate required fields
    if (!form.bank_name?.trim()) {
      setMessage({ type: 'error', text: 'Bank name is required.' });
      setSaving(false);
      return;
    }
    
    if (!form.account_name?.trim()) {
      setMessage({ type: 'error', text: 'Account name is required.' });
      setSaving(false);
      return;
    }
    
    if (!form.account_number?.trim()) {
      setMessage({ type: 'error', text: 'Account number is required.' });
      setSaving(false);
      return;
    }
    
    // Validate account number format (basic check)
    if (form.account_number.length < 8) {
      setMessage({ type: 'error', text: 'Account number must be at least 8 digits.' });
      setSaving(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    const method = bank && bank.id ? "PATCH" : "POST";
    const url = bank && bank.id
      ? API_ENDPOINTS.UPDATE_DETAIL_BANK_ACCOUNT(bank.id)
      : API_ENDPOINTS.GET_CREATE_BANK_ACCOUNT;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const updated = await res.json();
        setMessage({ type: 'success', text: 'Bank information updated successfully!' });
        setSaving(false);
        setEdit(false);
        // Wrap in results array to keep parent logic consistent
        onUpdated({ results: [updated] });
      } else {
        const error = await res.json();
        setMessage({ 
          type: 'error', 
          text: error.message || error.detail || 'Failed to update bank information.' 
        });
        setSaving(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred. Please try again.' });
      setSaving(false);
    }
  };

  if (loading && !bank) return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] animate-pulse" />
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] min-w-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400"><i className="fa fa-bank" /></span>
          Bank Information
        </h2>
        {!edit && (
          <button className="text-purple-400" onClick={() => setEdit(true)}>
            <Edit size={18} />
          </button>
        )}
      </div>
      {/* Show message regardless of edit state */}
      {message.text && (
        <StatusMessage type={message.type}>
          {message.text}
        </StatusMessage>
      )}
      {edit ? (
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Bank Name</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.bank_name || ""}
              onChange={e => setForm(f => ({ ...f, bank_name: e.target.value }))}
              placeholder="Enter bank name"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Account Name</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.account_name || ""}
              onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))}
              placeholder="Enter account holder name"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Account Number</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.account_number || ""}
              onChange={e => setForm(f => ({ ...f, account_number: e.target.value }))}
              placeholder="Enter account number"
              type="number"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded"
              onClick={() => {
                setEdit(false);
                setMessage({ type: '', text: '' });
              }}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="text-gray-400 text-sm">Bank Name:</span>
            <span className="ml-2 text-white">{bank?.bank_name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Account Name:</span>
            <span className="ml-2 text-white">{bank?.account_name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Account Number:</span>
            <span className="ml-2 text-white">{bank?.account_number ? `••••${bank.account_number.slice(-4)}` : "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
}