import React, { useState } from 'react';
import {
  Package,
  Truck,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Banknote,
  CreditCard,
  Printer,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  RefreshCw,
  Copy,
  Terminal,
  Check,
  Code2,
} from 'lucide-react';
import { OrderRecord } from '../types';

interface AdminOrdersSectionProps {
  orders: OrderRecord[];
  onToast: (msg: string) => void;
}

export const AdminOrdersSection: React.FC<AdminOrdersSectionProps> = ({ orders, onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'cod'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isMcpOpen, setIsMcpOpen] = useState(false);
  const [copiedMcp, setCopiedMcp] = useState(false);
  const [quickAwb, setQuickAwb] = useState('');

  const mcpConfigJson = JSON.stringify(
    {
      mcpServers: {
        'delhivery-one': {
          command: 'uvx',
          args: ['d1-mcp-mint@latest'],
          env: {
            D1_CLIENT_ID: 'ucp-service-cli',
            D1_CLIENT_SECRET: '6SQOQUTNWO35ZPD8HM8WUM5H0QDVLSRB',
            D1_AUTH_URL: 'https://ucp-auth.delhivery.com/facelessvoid',
            D1_REALM: 'ucp-VP8CLTGCB018',
            D1_CLIENT_CMS: 'cms::client::8eeb921b-bbde-11f1-8d4f-02ffcaa300af',
            D1_MCP_URL: 'https://mcp-client.delhivery.com/mcp',
          },
        },
      },
    },
    null,
    2
  );

  const handleCopyMcp = () => {
    navigator.clipboard.writeText(mcpConfigJson);
    setCopiedMcp(true);
    onToast('Delhivery MCP configuration copied to clipboard!');
    setTimeout(() => setCopiedMcp(false), 2000);
  };

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quickAwb.trim();
    if (!clean) return;
    window.open(`https://www.delhivery.com/track/package/${clean}`, '_blank');
  };

  // Filter and search
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filterMode === 'all'
        ? true
        : filterMode === 'online'
        ? o.paymentMethod === 'online' || o.paymentStatus === 'PAID'
        : o.paymentMethod === 'cash_on_delivery' || o.paymentStatus === 'COD_PENDING_DELIVERY';

    const cleanSearch = searchTerm.toLowerCase().trim();
    if (!cleanSearch) return matchesFilter;

    const matchesSearch =
      o.orderNumber.toLowerCase().includes(cleanSearch) ||
      o.customerName.toLowerCase().includes(cleanSearch) ||
      o.customerPhone.includes(cleanSearch) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(cleanSearch)) ||
      (o.deliveryDetails?.trackingNumber && o.deliveryDetails.trackingNumber.toLowerCase().includes(cleanSearch)) ||
      (o.razorpayDetails?.paymentId && o.razorpayDetails.paymentId.toLowerCase().includes(cleanSearch));

    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const onlineOrders = orders.filter((o) => o.paymentMethod === 'online' || o.paymentStatus === 'PAID');
  const codOrders = orders.filter((o) => o.paymentMethod === 'cash_on_delivery' || o.paymentStatus === 'COD_PENDING_DELIVERY');

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xs border border-[#10110F]/10 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#66704B] block mb-1">
            Total Orders
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#10110F]">
            {orders.length}
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xs border border-[#10110F]/10 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#66704B] block mb-1">
            Total Revenue
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#183D27]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xs border border-[#10110F]/10 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#183D27] block mb-1">
            Razorpay Online (Paid)
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#183D27]">
            {onlineOrders.length}
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xs border border-[#10110F]/10 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
            Cash on Delivery (COD)
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-900">
            {codOrders.length}
          </span>
        </div>
      </div>

      {/* Delhivery One MCP Server & Coding Agents Card */}
      <div className="bg-white rounded-xs border border-[#183D27]/30 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-[#10110F]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-serif font-bold text-base text-[#10110F]">
                  Delhivery One MCP Server & AI Coding Agents
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
                  Pre-configured for Cursor & Kiro
                </span>
              </div>
              <p className="text-xs text-[#66704B]">
                Check rates, track shipments, manage pickups, and check wallet balance directly from your IDE agent.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleCopyMcp}
              className="px-3.5 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedMcp ? <Check className="w-3.5 h-3.5 text-[#D4B66A]" /> : <Copy className="w-3.5 h-3.5 text-[#D4B66A]" />}
              <span>{copiedMcp ? 'Copied Config!' : 'Copy mcp.json'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMcpOpen(!isMcpOpen)}
              className="px-3.5 py-2 rounded-xs border border-[#10110F]/20 hover:bg-[#F7F3E8] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-[#183D27]" />
              <span>{isMcpOpen ? 'Hide Details' : 'View Config'}</span>
            </button>
          </div>
        </div>

        {/* Quick AWB Lookup Form */}
        <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="flex-1 relative">
            <Truck className="w-4 h-4 text-[#183D27] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Paste any Delhivery AWB / Waybill to track live (e.g. 900707268997)..."
              value={quickAwb}
              onChange={(e) => setQuickAwb(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono focus:border-[#183D27] outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
          >
            <span>Track AWB</span>
            <ExternalLink className="w-3 h-3 text-[#D4B66A]" />
          </button>
        </form>

        {/* Expanded MCP Guide & Instructions */}
        {isMcpOpen && (
          <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 space-y-3 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#10110F] uppercase tracking-wider text-[11px]">
                Pre-Filled Workspace Configuration (`/mcp.json` & `/.cursor/mcp.json`)
              </span>
              <button
                type="button"
                onClick={handleCopyMcp}
                className="text-[11px] text-[#183D27] hover:underline font-bold inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy JSON</span>
              </button>
            </div>

            <pre className="p-3 rounded-xs bg-[#10110F] text-[#D4B66A] font-mono text-[11px] overflow-x-auto selection:bg-[#183D27] selection:text-white">
              {mcpConfigJson}
            </pre>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
              <div className="p-3 bg-white rounded-xs border border-[#10110F]/10 space-y-1">
                <strong className="text-[#183D27] block uppercase font-bold">Supported MCP Clients</strong>
                <p className="text-[#66704B]">
                  • <strong>Cursor:</strong> Placed in project root under <code>.cursor/mcp.json</code>. Restart Cursor to see Delhivery One under Features &gt; MCP.
                  <br />
                  • <strong>Kiro:</strong> Placed in project root under <code>mcp.json</code>.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xs border border-[#10110F]/10 space-y-1">
                <strong className="text-[#183D27] block uppercase font-bold">Questions you can ask your AI Agent</strong>
                <ul className="text-[#66704B] list-disc list-inside space-y-0.5">
                  <li>"Show my recent shipments"</li>
                  <li>"What's my Delhivery wallet balance?"</li>
                  <li>"Check shipping rate from Delhi to Mumbai PIN 400001"</li>
                  <li>"List my open support tickets"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#10110F]/10 pb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#183D27] uppercase">
              LIVE COMMERCE & LOGISTICS
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#10110F]">
              Orders, Razorpay Payments & Delhivery Tracking
            </h3>
            <p className="text-xs text-[#66704B]">
              Real-time synchronization with Firestore and Delhivery One shipping partner.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Synced</span>
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#66704B] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Order #, Customer, Phone, or Delhivery AWB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:border-[#183D27] outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: `All (${orders.length})` },
              { id: 'online', label: `Razorpay Online (${onlineOrders.length})` },
              { id: 'cod', label: `Cash on Delivery (${codOrders.length})` },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterMode(btn.id as any)}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                  filterMode === btn.id
                    ? 'bg-[#183D27] text-[#F7F3E8]'
                    : 'bg-[#F7F3E8] hover:bg-[#EEE8D7] text-[#10110F] border border-[#10110F]/10'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table / Cards */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-[#66704B] space-y-2">
            <Package className="w-10 h-10 mx-auto text-[#B88A32] opacity-60" />
            <h4 className="font-serif text-lg font-bold text-[#10110F]">No orders found</h4>
            <p className="text-xs">
              {searchTerm ? 'No orders match your search query.' : 'New orders placed through the website will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isPaid = order.paymentMethod === 'online' || order.paymentStatus === 'PAID';
              const trackingNumber = order.deliveryDetails?.trackingNumber;
              const trackingUrl = order.deliveryDetails?.trackingUrl || (trackingNumber ? `https://www.delhivery.com/track/package/${trackingNumber}` : undefined);

              return (
                <div
                  key={order.id}
                  className="rounded-xs border border-[#10110F]/15 bg-white overflow-hidden shadow-xs hover:border-[#183D27]/40 transition-all"
                >
                  {/* Order Card Header */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-[#F7F3E8]/40 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {isPaid ? <CreditCard className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-[#10110F]">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-xs text-[10px] font-black tracking-wider uppercase ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isPaid ? 'PAID VIA RAZORPAY' : 'CASH ON DELIVERY'}
                          </span>
                          {order.invoiceNumber && (
                            <span className="text-[10px] font-mono text-[#66704B] bg-[#F7F3E8] px-1.5 py-0.5 rounded-xs">
                              {order.invoiceNumber}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#66704B] mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span className="font-bold text-[#10110F]">{order.customerName}</span>
                          <span>•</span>
                          <span>{order.customerPhone}</span>
                          <span>•</span>
                          <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-4 self-end md:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-[#66704B] block uppercase">Total Amount</span>
                        <span className="font-serif text-lg font-bold text-[#183D27]">
                          ₹{order.total}
                        </span>
                      </div>

                      <div className="p-1 rounded-xs hover:bg-black/5 text-[#10110F]">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 bg-[#F7F3E8]/60 border-t border-[#10110F]/10 space-y-4 animate-in fade-in duration-200">
                      {/* Delhivery Tracking Strip */}
                      {trackingNumber && (
                        <div className="p-3.5 rounded-xs bg-white border border-[#183D27]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <Truck className="w-5 h-5 text-[#183D27] shrink-0" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#10110F]">
                                  Delhivery One Tracking AWB:
                                </span>
                                <span className="font-mono font-bold text-sm text-[#183D27]">
                                  {trackingNumber}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#66704B]">
                                Status: {order.deliveryDetails?.status || 'Manifested & Priority Dispatch'} • Origin: {order.deliveryDetails?.pickupLocation || 'Delhi Hub'}
                              </span>
                            </div>
                          </div>

                          {trackingUrl && (
                            <a
                              href={trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0"
                            >
                              <span>Track Package</span>
                              <ExternalLink className="w-3 h-3 text-[#D4B66A]" />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Shipping Address */}
                        <div className="p-4 rounded-xs bg-white border border-[#10110F]/10 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#66704B] block">
                            Customer & Delivery Address
                          </span>
                          <p className="font-bold text-[#10110F]">{order.customerName}</p>
                          <p className="text-[#66704B]">{order.shippingAddress || 'Address on file'}</p>
                          <p className="text-[#10110F] pt-1">
                            Phone: <strong>{order.customerPhone}</strong>
                            {order.customerEmail && ` • Email: ${order.customerEmail}`}
                          </p>
                        </div>

                        {/* Payment Verification Info */}
                        <div className="p-4 rounded-xs bg-white border border-[#10110F]/10 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#66704B] block">
                            Payment & Transaction Details
                          </span>
                          <div className="flex justify-between">
                            <span className="text-[#66704B]">Payment Gateway:</span>
                            <strong className="text-[#10110F]">
                              {isPaid ? 'Razorpay Standard Checkout' : 'Cash on Delivery (Doorstep)'}
                            </strong>
                          </div>
                          {order.razorpayDetails?.paymentId && (
                            <div className="flex justify-between">
                              <span className="text-[#66704B]">Razorpay Payment ID:</span>
                              <strong className="font-mono text-[#183D27]">{order.razorpayDetails.paymentId}</strong>
                            </div>
                          )}
                          {order.razorpayDetails?.orderId && (
                            <div className="flex justify-between">
                              <span className="text-[#66704B]">Razorpay Order ID:</span>
                              <strong className="font-mono text-[#10110F]">{order.razorpayDetails.orderId}</strong>
                            </div>
                          )}
                          {order.couponCode && (
                            <div className="flex justify-between">
                              <span className="text-[#66704B]">Coupon Used:</span>
                              <strong className="text-emerald-800">{order.couponCode} (-₹{order.discount})</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items Purchased List */}
                      <div className="p-4 rounded-xs bg-white border border-[#10110F]/10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#66704B] block mb-2">
                          Ordered Items
                        </span>
                        <div className="divide-y divide-[#10110F]/10">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-[#10110F]">{it.productName}</span>
                                {it.packName && <span className="text-[#66704B] ml-2">({it.packName})</span>}
                              </div>
                              <div className="text-right">
                                <span className="text-[#66704B]">Qty {it.quantity} x ₹{it.price} = </span>
                                <strong className="text-[#10110F]">₹{it.price * it.quantity}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
