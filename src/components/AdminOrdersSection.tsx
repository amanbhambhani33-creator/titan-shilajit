import React, { useState, useEffect } from 'react';
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
  Send,
  Play,
  Key,
  Sliders,
  AlertCircle,
  Info,
  Save,
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

  // Delhivery B2C Gateway Console State
  const [isDelhiveryConsoleOpen, setIsDelhiveryConsoleOpen] = useState(true);
  const [activeDelhiveryTab, setActiveDelhiveryTab] = useState<'pincode' | 'shipment' | 'credentials'>('pincode');

  // Pincode Tester State (spec: GET /c/api/pin-codes/json/?filter_codes=194103)
  const [testPin, setTestPin] = useState('194103');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinResult, setPinResult] = useState<any>(null);
  const [copiedPinCurl, setCopiedPinCurl] = useState(false);

  // Shipment Creation CMU Tester State (spec: POST /api/cmu/create.json)
  const [shipmentForm, setShipmentForm] = useState({
    name: 'Consignee name',
    add: 'Huda Market, Haryana',
    pin: '110042',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    phone: '9999999999',
    order: 'Test Order 01',
    payment_mode: 'Prepaid' as 'Prepaid' | 'COD',
    pickup_location: 'Titan Delhi Central Fulfillment Hub',
    shipping_mode: 'Surface' as 'Surface' | 'Express',
    total_amount: 1499,
  });
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [shipmentResult, setShipmentResult] = useState<any>(null);
  const [copiedShipmentCurl, setCopiedShipmentCurl] = useState(false);

  // Delhivery Settings State
  const [delhiverySettings, setDelhiverySettings] = useState({
    token: '6SQOQUTNWO35ZPD8HM8WUM5H0QDVLSRB',
    baseUrl: 'https://staging-express.delhivery.com',
    pickupLocation: 'warehouse_name',
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [tokenTestResult, setTokenTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [isRegisteringWarehouse, setIsRegisteringWarehouse] = useState(false);
  const [warehouseRegResult, setWarehouseRegResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load existing Delhivery config on mount
  useEffect(() => {
    fetch('/api/delhivery/config')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success) {
          setDelhiverySettings((prev) => ({
            ...prev,
            token: d.token || prev.token,
            baseUrl: d.baseUrl || prev.baseUrl,
            pickupLocation: d.pickupLocation || prev.pickupLocation,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleTestPincode = async (pincodeToTest: string) => {
    const clean = pincodeToTest.replace(/\D/g, '').trim();
    if (clean.length !== 6) {
      onToast('Please enter a valid 6-digit PIN code to check.');
      return;
    }
    setPinLoading(true);
    setPinResult(null);
    try {
      const res = await fetch(`/api/delhivery/serviceability?pincode=${clean}`);
      const data = await res.json();
      setPinResult(data);
      if (data.serviceable) {
        onToast(`PIN ${clean} is serviceable via ${data.provider || 'Delhivery'}`);
      } else {
        onToast(`Notice: PIN ${clean} serviceability returned unverified.`);
      }
    } catch (err: any) {
      onToast('Failed to check pincode serviceability.');
    } finally {
      setPinLoading(false);
    }
  };

  const handleCreateTestShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setShipmentLoading(true);
    setShipmentResult(null);
    try {
      const res = await fetch('/api/delhivery/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: shipmentForm.order || `DELH-${Date.now().toString().slice(-6)}`,
          consignee: {
            name: shipmentForm.name,
            phone: shipmentForm.phone,
            address: shipmentForm.add,
            city: shipmentForm.city,
            state: shipmentForm.state,
            pincode: shipmentForm.pin,
          },
          items: [
            {
              name: 'Titan Pure Himalayan Shilajit 20g',
              quantity: 1,
              price: shipmentForm.total_amount,
            },
          ],
          totalAmount: shipmentForm.total_amount,
          paymentMode: shipmentForm.payment_mode,
          pickupLocationName: shipmentForm.pickup_location,
          shippingMode: shipmentForm.shipping_mode,
        }),
      });
      const data = await res.json();
      setShipmentResult(data);
      if (data.success) {
        onToast(`Delhivery Shipment Manifested! AWB: ${data.waybill}`);
      } else {
        onToast(`Shipment returned: ${data.error || 'Check error details'}`);
      }
    } catch (err: any) {
      onToast('Error dispatching test shipment.');
    } finally {
      setShipmentLoading(false);
    }
  };

  const handleTestToken = async () => {
    setIsTestingToken(true);
    setTokenTestResult(null);
    try {
      const res = await fetch('/api/delhivery/test-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: delhiverySettings.token }),
      });
      const data = await res.json();
      setTokenTestResult(data);
      if (data.valid) {
        onToast('Delhivery Token verified and active!');
      } else {
        onToast(`Delhivery authentication notice: ${data.message}`);
      }
    } catch (err: any) {
      setTokenTestResult({ valid: false, message: 'Failed to test token.' });
      onToast('Error contacting Delhivery token tester.');
    } finally {
      setIsTestingToken(false);
    }
  };

  const handleRegisterWarehouse = async () => {
    if (!delhiverySettings.pickupLocation) {
      onToast('Please enter a Pickup Warehouse Name first.');
      return;
    }
    setIsRegisteringWarehouse(true);
    setWarehouseRegResult(null);
    try {
      const res = await fetch('/api/delhivery/register-warehouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: delhiverySettings.pickupLocation,
          phone: '9958474229',
          city: 'New Delhi',
          pin: '110020',
          address: 'Plot 48, Okhla Industrial Area Phase III',
          country: 'India',
        }),
      });
      const data = await res.json();
      setWarehouseRegResult(data);
      if (data.success) {
        onToast(`Warehouse "${delhiverySettings.pickupLocation}" linked on Delhivery!`);
      } else {
        onToast(`Warehouse registration notice: ${data.message}`);
      }
    } catch (err: any) {
      setWarehouseRegResult({ success: false, message: 'Failed to reach Delhivery warehouse API.' });
      onToast('Error registering warehouse.');
    } finally {
      setIsRegisteringWarehouse(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/delhivery/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(delhiverySettings),
      });
      const d = await res.json();
      if (d.success) {
        onToast('Delhivery settings updated successfully in server runtime and Firestore!');
      }
    } catch (e) {
      onToast('Failed to update Delhivery settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const [syncingOrderNum, setSyncingOrderNum] = useState<string | null>(null);

  const handleSyncWithDelhivery = async (orderNumber: string) => {
    setSyncingOrderNum(orderNumber);
    try {
      const res = await fetch('/api/delhivery/sync-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber }),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`Dispatched to Delhivery! AWB: ${data.shipment?.waybill}`);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        onToast(`Delhivery notice: ${data.message || data.error || 'Check error details'}`);
      }
    } catch (err: any) {
      onToast('Error connecting to Delhivery sync service.');
    } finally {
      setSyncingOrderNum(null);
    }
  };

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

      {/* ========================================================================= */}
      {/* DELHIVERY B2C LOGISTICS GATEWAY CONSOLE (PINCODE SERVICEABILITY & CMU) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xs border border-[#10110F]/15 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#10110F]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-serif font-bold text-base text-[#10110F]">
                  Delhivery Express B2C Gateway Console
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-[#183D27]/10 text-[#183D27] text-[10px] font-black uppercase tracking-wider">
                  Live REST Integration
                </span>
              </div>
              <p className="text-xs text-[#66704B]">
                Direct testing for B2C Pincode Serviceability (GET) and Shipment Creation CMU (POST).
              </p>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F7F3E8] rounded-xs border border-[#10110F]/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveDelhiveryTab('pincode')}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                activeDelhiveryTab === 'pincode'
                  ? 'bg-[#183D27] text-[#D4B66A] shadow-xs'
                  : 'text-[#66704B] hover:text-[#10110F]'
              }`}
            >
              1. Pincode Serviceability
            </button>
            <button
              type="button"
              onClick={() => setActiveDelhiveryTab('shipment')}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                activeDelhiveryTab === 'shipment'
                  ? 'bg-[#183D27] text-[#D4B66A] shadow-xs'
                  : 'text-[#66704B] hover:text-[#10110F]'
              }`}
            >
              2. CMU Shipment Creation
            </button>
            <button
              type="button"
              onClick={() => setActiveDelhiveryTab('credentials')}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                activeDelhiveryTab === 'credentials'
                  ? 'bg-[#183D27] text-[#D4B66A] shadow-xs'
                  : 'text-[#66704B] hover:text-[#10110F]'
              }`}
            >
              3. API & Hub Config
            </button>
          </div>
        </div>

        {/* TAB 1: B2C PINCODE SERVICEABILITY */}
        {activeDelhiveryTab === 'pincode' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Indian Postal PIN Code to Query
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN (e.g. 194103, 110042)"
                    value={testPin}
                    onChange={(e) => setTestPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono font-bold focus:border-[#183D27] outline-none"
                  />
                  <button
                    type="button"
                    disabled={pinLoading}
                    onClick={() => handleTestPincode(testPin)}
                    className="px-5 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {pinLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-[#D4B66A]" />}
                    <span>{pinLoading ? 'Checking...' : 'Check Serviceability'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="sm:self-end">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#66704B] mb-1">
                  Preset Tested PIN Codes
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => { setTestPin('194103'); handleTestPincode('194103'); }}
                    className="px-2.5 py-1.5 rounded-xs bg-[#F7F3E8] hover:bg-[#183D27]/10 text-[#183D27] text-[11px] font-mono font-bold border border-[#183D27]/20 transition-colors cursor-pointer"
                  >
                    194103 (Kargil / Ladakh)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTestPin('110042'); handleTestPincode('110042'); }}
                    className="px-2.5 py-1.5 rounded-xs bg-[#F7F3E8] hover:bg-[#183D27]/10 text-[#183D27] text-[11px] font-mono font-bold border border-[#183D27]/20 transition-colors cursor-pointer"
                  >
                    110042 (Delhi / Samaypur)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTestPin('110020'); handleTestPincode('110020'); }}
                    className="px-2.5 py-1.5 rounded-xs bg-[#F7F3E8] hover:bg-[#183D27]/10 text-[#183D27] text-[11px] font-mono font-bold border border-[#183D27]/20 transition-colors cursor-pointer"
                  >
                    110020 (Okhla Hub)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTestPin('400001'); handleTestPincode('400001'); }}
                    className="px-2.5 py-1.5 rounded-xs bg-[#F7F3E8] hover:bg-[#183D27]/10 text-[#183D27] text-[11px] font-mono font-bold border border-[#183D27]/20 transition-colors cursor-pointer"
                  >
                    400001 (Mumbai)
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {pinResult && (
              <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#183D27]/20 space-y-3 text-xs animate-in fade-in">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#183D27]" />
                    <span className="font-bold text-[#10110F] text-sm">
                      PIN {pinResult.pincode}: {pinResult.city}, {pinResult.state}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#183D27] text-[#D4B66A] text-[10px] font-bold uppercase tracking-wider">
                    {pinResult.serviceable ? 'Serviceable' : 'Unverified'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-2.5 bg-white rounded-xs border border-[#10110F]/10">
                    <span className="text-[#66704B] block">Cash on Delivery (COD)</span>
                    <strong className={pinResult.codAvailable ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                      {pinResult.codAvailable ? '✓ Available' : '✗ Unavailable'}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xs border border-[#10110F]/10">
                    <span className="text-[#66704B] block">Prepaid Delivery</span>
                    <strong className={pinResult.prepaidAvailable ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                      {pinResult.prepaidAvailable ? '✓ Available' : '✗ Unavailable'}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xs border border-[#10110F]/10">
                    <span className="text-[#66704B] block">Estimated Transit Time</span>
                    <strong className="text-[#10110F] font-bold">
                      {pinResult.estimatedDeliveryDays || '2–4 Business Days'}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xs border border-[#10110F]/10">
                    <span className="text-[#66704B] block">Carrier Partner</span>
                    <strong className="text-[#183D27] font-bold">
                      {pinResult.provider || 'Delhivery B2C Express'}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-[#66704B] font-mono">
                  Hub Routing: {pinResult.hubName || 'Delhi Central Fulfillment Hub to Regional Sorting Center'} • Source: {pinResult.source}
                </div>
              </div>
            )}

            {/* Exact cURL Specification Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#10110F] uppercase tracking-wider">
                  Exact cURL Specification (Delhivery B2C Pincode Serviceability)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const c = `curl --request GET \\\n\t--url 'https://staging-express.delhivery.com/c/api/pin-codes/json/?filter_codes=${testPin}' \\\n\t--header 'Authorization: Token ${delhiverySettings.token}'`;
                    navigator.clipboard.writeText(c);
                    setCopiedPinCurl(true);
                    onToast('Pincode curl command copied!');
                    setTimeout(() => setCopiedPinCurl(false), 2000);
                  }}
                  className="text-[#183D27] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedPinCurl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPinCurl ? 'Copied' : 'Copy cURL'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xs bg-[#10110F] text-[#D4B66A] font-mono text-[11px] overflow-x-auto leading-relaxed">
{`curl --request GET \\
\t--url 'https://staging-express.delhivery.com/c/api/pin-codes/json/?filter_codes=${testPin}' \\
\t--header 'Authorization: Token ${delhiverySettings.token}'`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: CMU SHIPMENT CREATION */}
        {activeDelhiveryTab === 'shipment' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <form onSubmit={handleCreateTestShipment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    Consignee Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentForm.name}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentForm.phone}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    Order Reference ID
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentForm.order}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentForm.add}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, add: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    Destination PIN
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={shipmentForm.pin}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, pin: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentForm.city}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentForm.state}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={shipmentForm.payment_mode}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, payment_mode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white font-bold"
                  >
                    <option value="Prepaid">Prepaid</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    Shipping Mode
                  </label>
                  <select
                    value={shipmentForm.shipping_mode}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, shipping_mode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs bg-white font-bold"
                  >
                    <option value="Surface">Surface (Standard)</option>
                    <option value="Express">Express (Air Priority)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                    Pickup Warehouse
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentForm.pickup_location}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, pickup_location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs text-[#183D27] font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#66704B]">
                  Dimensions: 100 x 100 x 100 mm • Weight: 250g • HSN: 30049011 (Ayurvedic Resin)
                </span>
                <button
                  type="submit"
                  disabled={shipmentLoading}
                  className="px-6 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {shipmentLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-[#D4B66A]" />}
                  <span>{shipmentLoading ? 'Manifesting Shipment...' : 'Create & Manifest Shipment'}</span>
                </button>
              </div>
            </form>

            {/* Shipment Result Box */}
            {shipmentResult && (
              <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#183D27]/20 space-y-3 text-xs animate-in fade-in">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#183D27]" />
                    <span className="font-bold text-[#10110F] text-sm">
                      Delhivery Waybill AWB: {shipmentResult.waybill}
                    </span>
                  </div>
                  <a
                    href={shipmentResult.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-xs bg-[#183D27] text-[#D4B66A] text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-[#10110F] transition-colors"
                  >
                    <span>Track on Delhivery.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-2.5 bg-white rounded-xs border border-[#10110F]/10">
                    <span className="text-[#66704B] block">Carrier</span>
                    <strong className="text-[#183D27] font-bold">{shipmentResult.courier}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xs border border-[#10110F]/10">
                    <span className="text-[#66704B] block">Status</span>
                    <strong className="text-[#10110F] font-bold">{shipmentResult.status}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xs border border-[#10110F]/10">
                    <span className="text-[#66704B] block">Pickup Location</span>
                    <strong className="text-[#10110F] font-bold">{shipmentResult.pickupLocation}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xs border border-[#10110F]/10">
                    <span className="text-[#66704B] block">Manifest ID</span>
                    <strong className="text-mono font-bold">{shipmentResult.manifestId}</strong>
                  </div>
                </div>

                {shipmentResult.rawResponse && (
                  <details className="text-[10px]">
                    <summary className="cursor-pointer text-[#183D27] font-bold hover:underline">
                      View Raw Delhivery Gateway Response Payload
                    </summary>
                    <pre className="mt-2 p-2 bg-[#10110F] text-[#D4B66A] rounded-xs font-mono overflow-x-auto">
                      {JSON.stringify(shipmentResult.rawResponse, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Exact cURL Specification Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#10110F] uppercase tracking-wider">
                  Exact cURL Specification (Delhivery CMU Shipment Creation)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const c = `curl --request POST \\\n\t--url https://staging-express.delhivery.com/api/cmu/create.json \\\n\t--header 'Accept: application/json' \\\n\t--header 'Authorization: Token ${delhiverySettings.token}' \\\n\t--header 'Content-Type: application/json' \\\n\t--data 'format=json&data={\n  "shipments": [\n    {\n      "name": "${shipmentForm.name}",\n      "add": "${shipmentForm.add}",\n      "pin": "${shipmentForm.pin}",\n      "city": "${shipmentForm.city}",\n      "state": "${shipmentForm.state}",\n      "country": "India",\n      "phone": "${shipmentForm.phone}",\n      "order": "${shipmentForm.order}",\n      "payment_mode": "${shipmentForm.payment_mode}",\n      "products_desc": "Titan Pure Himalayan Shilajit 20g",\n      "hsn_code": "30049011",\n      "total_amount": "${shipmentForm.total_amount}",\n      "shipment_width": "100",\n      "shipment_height": "100",\n      "weight": "250",\n      "shipping_mode": "${shipmentForm.shipping_mode}"\n    }\n  ],\n  "pickup_location": {\n    "name": "${shipmentForm.pickup_location}"\n  }\n}'`;
                    navigator.clipboard.writeText(c);
                    setCopiedShipmentCurl(true);
                    onToast('Shipment creation curl command copied!');
                    setTimeout(() => setCopiedShipmentCurl(false), 2000);
                  }}
                  className="text-[#183D27] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedShipmentCurl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedShipmentCurl ? 'Copied' : 'Copy cURL'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xs bg-[#10110F] text-[#D4B66A] font-mono text-[11px] overflow-x-auto leading-relaxed">
{`curl --request POST \\
\t--url https://staging-express.delhivery.com/api/cmu/create.json \\
\t--header 'Accept: application/json' \\
\t--header 'Authorization: Token ${delhiverySettings.token}' \\
\t--header 'Content-Type: application/json' \\
\t--data 'format=json&data={
  "shipments": [
    {
      "name": "${shipmentForm.name}",
      "add": "${shipmentForm.add}",
      "pin": "${shipmentForm.pin}",
      "city": "${shipmentForm.city}",
      "state": "${shipmentForm.state}",
      "country": "India",
      "phone": "${shipmentForm.phone}",
      "order": "${shipmentForm.order}",
      "payment_mode": "${shipmentForm.payment_mode}",
      "return_pin": "110020",
      "return_city": "New Delhi",
      "products_desc": "Titan Pure Himalayan Shilajit Resin",
      "hsn_code": "30049011",
      "total_amount": "${shipmentForm.total_amount}",
      "quantity": "1",
      "shipment_width": "100",
      "shipment_height": "100",
      "weight": "250",
      "shipping_mode": "${shipmentForm.shipping_mode}"
    }
  ],
  "pickup_location": {
    "name": "${shipmentForm.pickup_location}"
  }
}'`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: CREDENTIALS & HUB CONFIG */}
        {activeDelhiveryTab === 'credentials' && (
          <form onSubmit={handleSaveSettings} className="space-y-4 animate-in fade-in duration-150">
            {/* Environment Presets */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-white rounded-xs border border-[#10110F]/10">
              <div>
                <span className="font-bold text-xs text-[#10110F] block">Select Delhivery Environment</span>
                <span className="text-[11px] text-[#66704B]">Choose between Live Delhivery Production and Staging Sandbox</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setDelhiverySettings({ ...delhiverySettings, baseUrl: 'https://track.delhivery.com' })}
                  className={`px-2.5 py-1.5 rounded-xs text-[11px] font-bold border transition-colors cursor-pointer ${
                    delhiverySettings.baseUrl === 'https://track.delhivery.com'
                      ? 'bg-[#183D27] text-[#F7F3E8] border-[#183D27]'
                      : 'bg-[#F7F3E8] text-[#10110F] border-[#10110F]/15 hover:bg-[#EEE8D7]'
                  }`}
                >
                  Delhivery One (track.delhivery.com)
                </button>
                <button
                  type="button"
                  onClick={() => setDelhiverySettings({ ...delhiverySettings, baseUrl: 'https://express.delhivery.com' })}
                  className={`px-2.5 py-1.5 rounded-xs text-[11px] font-bold border transition-colors cursor-pointer ${
                    delhiverySettings.baseUrl === 'https://express.delhivery.com'
                      ? 'bg-[#183D27] text-[#F7F3E8] border-[#183D27]'
                      : 'bg-[#F7F3E8] text-[#10110F] border-[#10110F]/15 hover:bg-[#EEE8D7]'
                  }`}
                >
                  Express API (express.delhivery.com)
                </button>
                <button
                  type="button"
                  onClick={() => setDelhiverySettings({ ...delhiverySettings, baseUrl: 'https://staging-express.delhivery.com' })}
                  className={`px-2.5 py-1.5 rounded-xs text-[11px] font-bold border transition-colors cursor-pointer ${
                    delhiverySettings.baseUrl === 'https://staging-express.delhivery.com'
                      ? 'bg-[#183D27] text-[#F7F3E8] border-[#183D27]'
                      : 'bg-[#F7F3E8] text-[#10110F] border-[#10110F]/15 hover:bg-[#EEE8D7]'
                  }`}
                >
                  Staging Sandbox
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase text-[#10110F]">
                    Delhivery API Token
                  </label>
                  <button
                    type="button"
                    onClick={handleTestToken}
                    disabled={isTestingToken}
                    className="text-[10px] text-[#183D27] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isTestingToken ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Play className="w-2.5 h-2.5" />}
                    <span>{isTestingToken ? 'Testing...' : 'Test Token'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={delhiverySettings.token}
                  onChange={(e) => {
                    setDelhiverySettings({ ...delhiverySettings, token: e.target.value });
                    setTokenTestResult(null);
                  }}
                  placeholder="e.g. your_active_token"
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono font-bold"
                />
                {tokenTestResult && (
                  <p className={`text-[10.5px] mt-1 font-medium ${tokenTestResult.valid ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {tokenTestResult.valid ? '✓ ' : '⚠ '}{tokenTestResult.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                  API Endpoint Base URL
                </label>
                <input
                  type="text"
                  required
                  value={delhiverySettings.baseUrl}
                  onChange={(e) => setDelhiverySettings({ ...delhiverySettings, baseUrl: e.target.value })}
                  placeholder="https://track.delhivery.com"
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase text-[#10110F]">
                    Registered Warehouse Name
                  </label>
                  <button
                    type="button"
                    onClick={handleRegisterWarehouse}
                    disabled={isRegisteringWarehouse}
                    className="text-[10px] text-[#183D27] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isRegisteringWarehouse ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Send className="w-2.5 h-2.5" />}
                    <span>{isRegisteringWarehouse ? 'Registering...' : 'Register on Delhivery'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={delhiverySettings.pickupLocation}
                  onChange={(e) => {
                    setDelhiverySettings({ ...delhiverySettings, pickupLocation: e.target.value });
                    setWarehouseRegResult(null);
                  }}
                  placeholder="e.g. warehouse_name"
                  className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold text-[#183D27]"
                />
                {warehouseRegResult && (
                  <p className={`text-[10.5px] mt-1 font-medium ${warehouseRegResult.success ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {warehouseRegResult.success ? '✓ ' : '⚠ '}{warehouseRegResult.message}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 space-y-2 text-xs text-[#66704B]">
              <div className="flex items-start gap-2 text-[#10110F]">
                <Info className="w-4 h-4 text-[#183D27] shrink-0 mt-0.5" />
                <span className="font-bold">Crucial Requirement for Delhivery Dashboard Visibility:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li>
                  <strong>Delhivery Token:</strong> Copy your token from <em>Delhivery One Dashboard &gt; Settings &gt; API Setup</em>.
                </li>
                <li>
                  <strong>Pickup Warehouse Name:</strong> Must exactly match the Warehouse Name registered under <em>Delhivery One &gt; Settings &gt; Warehouses/Pickup Locations</em> (e.g. <code>warehouse_name</code>). If it doesn&apos;t match, Delhivery rejects shipment creation with a warehouse query error.
                </li>
                <li>
                  <strong>Automatic Sync:</strong> Once saved here, all new Paid and Cash on Delivery (COD) orders immediately book on Delhivery and appear in your Delhivery dashboard.
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                {isSavingSettings ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#D4B66A]" />}
                <span>{isSavingSettings ? 'Saving Settings...' : 'Save Delhivery Settings'}</span>
              </button>
            </div>
          </form>
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
                          {order.deliveryDetails?.delhiverySynced ? (
                            <span className="px-2 py-0.5 rounded-xs text-[9.5px] font-black tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>ON DELHIVERY DASHBOARD (AWB: {order.deliveryDetails.trackingNumber})</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-xs text-[9.5px] font-black tracking-wider uppercase bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>DELHIVERY DISPATCH PENDING</span>
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
                      {/* Delhivery Pending Dispatch Notice & Quick Action */}
                      {!order.deliveryDetails?.delhiverySynced && (
                        <div className="p-3.5 rounded-xs bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <strong className="text-amber-900 block font-bold">
                              Saved in Firestore • Pending Delhivery Dashboard Manifestation
                            </strong>
                            <p className="text-amber-800 text-[11px]">
                              {order.deliveryDetails?.delhiveryError || 'Click below to push and create this shipment on your Delhivery One account.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={syncingOrderNum === order.orderNumber}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSyncWithDelhivery(order.orderNumber);
                            }}
                            className="px-4 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                          >
                            {syncingOrderNum === order.orderNumber ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5 text-[#D4B66A]" />
                            )}
                            <span>{syncingOrderNum === order.orderNumber ? 'Dispatching...' : 'Dispatch to Delhivery Now'}</span>
                          </button>
                        </div>
                      )}

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
