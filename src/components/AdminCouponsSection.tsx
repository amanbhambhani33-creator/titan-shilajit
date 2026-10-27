import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, Percent, IndianRupee, ShieldCheck } from 'lucide-react';
import { CouponRecord } from '../types';

interface AdminCouponsSectionProps {
  onToast: (msg: string) => void;
}

export const AdminCouponsSection: React.FC<AdminCouponsSectionProps> = ({ onToast }) => {
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(999);
  const [maxDiscount, setMaxDiscount] = useState<number>(500);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.coupons)) {
          setCoupons(data.coupons);
        }
      }
    } catch (err: any) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please provide a coupon code.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue) || 0,
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: discountType === 'percentage' ? (Number(maxDiscount) || 0) : undefined,
        usageLimit: Number(usageLimit) || 100,
        description: description.trim() || undefined,
        isActive,
      };

      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onToast(`Coupon "${payload.code}" created successfully!`);
        setIsCreating(false);
        setCode('');
        setDescription('');
        setDiscountValue(10);
        setMinOrderValue(999);
        await fetchCoupons();
      } else {
        setError(data.error || 'Failed to create coupon.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error creating coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onToast(`Coupon "${couponCode}" deleted.`);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        onToast('Failed to delete coupon.');
      }
    } catch {
      onToast('Error deleting coupon.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xs border border-[#10110F]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#B88A32]" />
            <h3 className="font-serif text-2xl font-bold text-[#10110F]">
              Coupons &amp; Discounts Manager
            </h3>
          </div>
          <p className="text-xs text-[#66704B] mt-1">
            Create custom coupon codes, set percentage or flat rupee discounts, and monitor real-time coupon usage count.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCoupons}
            disabled={loading}
            className="px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold uppercase tracking-wider hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#D4B66A] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'Close Form' : 'Create New Coupon'}</span>
          </button>
        </div>
      </div>

      {/* Create Coupon Drawer / Form */}
      {isCreating && (
        <div className="bg-[#FAF7F0] p-6 rounded-xs border-2 border-[#183D27]/30 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#10110F]/10 pb-3">
            <h4 className="font-serif text-lg font-bold text-[#183D27] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#B88A32]" />
              <span>Create Coupon Code</span>
            </h4>
            <span className="text-[11px] text-[#66704B] font-mono">
              Auto-converted to uppercase
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TITAN15, SPECIAL50"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono font-bold tracking-widest bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Discount Type
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs font-semibold bg-white"
                >
                  <option value="percentage">Percentage (%) Discount</option>
                  <option value="flat">Flat Rupee (₹) Discount</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Discount Value {discountType === 'percentage' ? '(%)' : '(₹)'} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold bg-white pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#66704B]">
                    {discountType === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  placeholder="0 for no minimum"
                  className="w-full px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                />
              </div>

              {discountType === 'percentage' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    placeholder="Leave 0 for uncapped"
                    className="w-full px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Max Total Uses (Limit)
                </label>
                <input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                Description / Internal Note
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Special festive promo for loyal customers"
                className="w-full px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#10110F]/10">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#10110F]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded-xs text-[#183D27] focus:ring-[#183D27]"
                />
                <span>Active immediately for checkout</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold uppercase hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4B66A]" />
                  <span>{submitting ? 'Creating...' : 'Create Coupon'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List & Usage Tracker */}
      <div className="bg-white rounded-xs border border-[#10110F]/10 shadow-xs overflow-hidden">
        <div className="p-5 bg-[#FAF7F0] border-b border-[#10110F]/10 flex items-center justify-between">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#10110F]">
              Live Coupons &amp; Usage Tracker ({coupons.length})
            </h4>
            <p className="text-xs text-[#66704B]">
              Real-time record of active coupons and redemption count across all customer orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-xs uppercase">
              Prepaid ₹50 Off Active Globally
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#66704B] flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#B88A32]" />
            <span>Loading coupons...</span>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#66704B] space-y-2">
            <Tag className="w-8 h-8 mx-auto text-[#B88A32]/40" />
            <p className="font-bold text-[#10110F]">No custom coupons created yet.</p>
            <p>Click "Create New Coupon" to configure promotional discounts for checkout.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#183D27] text-[#D4B66A] uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Coupon Code</th>
                  <th className="p-3.5">Discount Offer</th>
                  <th className="p-3.5">Min Order</th>
                  <th className="p-3.5">Times Used</th>
                  <th className="p-3.5">Usage Limit</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#10110F]/5">
                {coupons.map((coupon) => {
                  const used = coupon.usedCount || 0;
                  const limit = coupon.usageLimit || 100;
                  const isMaxedOut = used >= limit;

                  return (
                    <tr key={coupon.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-[#183D27]/10 text-[#183D27] px-2.5 py-1 rounded-xs border border-[#183D27]/20">
                            {coupon.code}
                          </span>
                          {coupon.description && (
                            <span className="text-[10px] text-[#66704B] hidden sm:inline">
                              ({coupon.description})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-[#10110F]">
                        {coupon.discountType === 'percentage' ? (
                          <span className="flex items-center gap-1 text-emerald-800">
                            <Percent className="w-3.5 h-3.5" />
                            <span>{coupon.discountValue}% OFF</span>
                            {coupon.maxDiscount ? (
                              <span className="text-[10px] font-normal text-stone-500">(Up to ₹{coupon.maxDiscount})</span>
                            ) : null}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-800">
                            <IndianRupee className="w-3.5 h-3.5" />
                            <span>₹{coupon.discountValue} FLAT OFF</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-[#10110F]">
                        {coupon.minOrderValue ? `₹${coupon.minOrderValue.toLocaleString('en-IN')}` : 'No Minimum'}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            {used} {used === 1 ? 'time' : 'times'} used
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-[#66704B] font-mono">
                        {limit} orders max
                      </td>
                      <td className="p-3.5">
                        {isMaxedOut ? (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs bg-red-100 text-red-800">
                            Limit Reached
                          </span>
                        ) : coupon.isActive ? (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs bg-stone-200 text-stone-700">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                          className="p-1.5 rounded-xs text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Prepaid Automatic ₹50 Off Highlight Card */}
      <div className="p-5 rounded-xs bg-[#183D27]/10 border border-[#183D27]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#183D27] shrink-0 mt-0.5" />
          <div>
            <h5 className="font-serif font-bold text-sm text-[#183D27]">
              Automatic ₹50 Extra Discount on All Prepaid Orders
            </h5>
            <p className="text-xs text-[#66704B] mt-0.5">
              Permanently configured: when customer selects Online Payment (UPI / Card / Netbanking), ₹50 is automatically deducted after any first-order discount or coupon code.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase px-3 py-1 bg-[#183D27] text-[#D4B66A] rounded-xs shrink-0 font-mono">
          ✓ Active in Checkout
        </span>
      </div>
    </div>
  );
};
