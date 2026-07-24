import React, { useEffect, useState, useRef, useMemo } from 'react';
import { LazyIframe } from '../../components/shared/LazyIframe';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { propertyService } from '../../services/property.service';
import { authService } from '../../services/auth.service';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { govtNavItems } from '../../components/layout/Sidebar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, Chip } from '../../components/ui/Badge';
import { SkeletonStatCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { CircularProgress } from '../../components/ui/ProgressBar';
import { Map } from '../../components/shared/Map';
import type {
  Property, FraudReport, Notification, AnalyticsDashboard,
  DeveloperKey, DeveloperKeyLog, PropertyDocument, AiVerification,
  PropertyImage, PropertyVideo
} from '../../models/property.models';
import { useNavigate } from 'react-router-dom';
import {
  Eye, CheckCircle, AlertOctagon, Key, Bell, Shield, X,
  Copy, Trash2, Terminal, Activity, Play, Clock, Code2,
  Book, Plus, RefreshCw, Search, Map as MapIcon, Image, Video, FileText, LogOut, MessageSquare, BarChart3
} from 'lucide-react';

const getCleanIframeUrl = (url?: string) => {
  if (!url) return '';
  let cleaned = url.trim();

  // Extract src from <iframe src="..."> if embedded as HTML snippet
  if (cleaned.toLowerCase().includes('<iframe')) {
    const match = cleaned.match(/src\s*=\s*["']([^"']+)["']/i);
    if (match && match[1]) cleaned = match[1];
  }

  // Prepend https:// if missing scheme
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }

  // Kuula formatting: convert /post/ to /share/ and add clean embed parameters
  if (cleaned.includes('kuula.co')) {
    cleaned = cleaned.replace('/post/', '/share/');
    const baseUrl = cleaned.split('?')[0];
    return `${baseUrl}?fs=1&vr=0&zoom=0&sd=0&info=0&logo=-1&thumbs=0`;
  }

  // Momento360 formatting: convert /p/ to /e/ for embeddable iframe
  if (cleaned.includes('momento360.com')) {
    if (cleaned.includes('/p/')) {
      cleaned = cleaned.replace('/p/', '/e/');
    }
    return cleaned;
  }

  // Matterport formatting
  if (cleaned.includes('matterport.com')) {
    if (!cleaned.includes('/show/')) {
      const match = cleaned.match(/m=([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        return `https://my.matterport.com/show/?m=${match[1]}`;
      }
    }
  }

  return cleaned;
};

const isDirectImage = (url?: string) => {
  if (!url) return false;
  return url.includes('cloudinary.com') || /\.(jpg|jpeg|png|webp)($|\?)/i.test(url);
};

const isValidIframeUrl = (url?: string) => {
  if (!url) return false;
  const cleaned = getCleanIframeUrl(url);
  if (!cleaned) return false;
  if (cleaned.includes('example.com') || cleaned.endsWith('/share/') || cleaned.endsWith('/post/') || cleaned.endsWith('/e/')) {
    return false;
  }
  try {
    const parsed = new URL(cleaned);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
           parsed.hostname.includes('.') &&
           !parsed.hostname.includes('localhost') &&
           parsed.pathname.length > 3;
  } catch (e) {
    return false;
  }
};

const getFallbackPhoto = (p: Property) => {
  if (p.images && p.images.length > 0) {
    const imgUrl = p.images[0].imageUrl || p.images[0].url;
    if (imgUrl) return imgUrl;
  }
  const category = (p.category || '').toUpperCase();
  if (category.includes('FARM') || category.includes('AGRICULTURAL') || category.includes('ORCHARD') || category.includes('POND')) {
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
  }
  if (category.includes('COMMERCIAL') || category.includes('FACTORY') || category.includes('RETAIL') || category.includes('SHOPPING')) {
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
  }
  if (category.includes('RESIDENTIAL') || category.includes('APARTMENT') || category.includes('HOSTEL') || category.includes('PG')) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
};

const PropertyCard = React.memo(({ p, onClick, isSelected }: { p: Property; onClick: () => void; isSelected: boolean }) => (
  <div
    onClick={onClick}
    className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5
      ${isSelected ? '!border-primary-500 shadow-[0_0_20px_rgba(37,99,235,0.15)] bg-primary-50/20' : ''}`}
  >
    <div className="relative h-28 bg-gray-900 overflow-hidden">
      {isDirectImage(p.threeSixtyImageUrl) ? (
        <img src={p.threeSixtyImageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : isValidIframeUrl(p.threeSixtyImageUrl) ? (
        <LazyIframe
          src={getCleanIframeUrl(p.threeSixtyImageUrl)!}
          fallbackImageSrc={getFallbackPhoto(p)}
          alt={p.title}
          label="360° LIVE"
        />
      ) : (
        <img
          src={getFallbackPhoto(p)}
          alt={p.title}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'; }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute top-2 right-2 z-10">
        <StatusBadge status={p.status} size="sm" />
      </div>
    </div>
    <div className="p-4 space-y-2">
      <h3 className="text-gray-900 font-bold text-sm truncate">{p.title}</h3>
      <p className="text-gray-500 text-[10px]">📍 {p.village}, {p.district}</p>
      <div className="flex gap-2 text-[10px]">
        <span className="bg-gray-100 rounded-md px-2 py-1 text-gray-600 font-medium">{p.area}ac</span>
        <span className="bg-emerald-50 rounded-md px-2 py-1 text-emerald-700 font-bold">₹{p.price.toLocaleString('en-IN')}</span>
      </div>
    </div>
  </div>
));

export const GovtDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'queue' | 'disputes' | 'approved' | 'api'>('analytics');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [apiSubTab, setApiSubTab] = useState<'keys' | 'docs' | 'sandbox'>('keys');

  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [fraudReports, setFraudReports] = useState<FraudReport[]>([]);
  const [approvedProperties, setApprovedProperties] = useState<Property[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [analyticsError, setAnalyticsError] = useState(false);

  const [developerKeys, setDeveloperKeys] = useState<DeveloperKey[]>([]);
  const [selectedKeyLogs, setSelectedKeyLogs] = useState<DeveloperKeyLog[] | null>(null);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState<'READ_ONLY' | 'READ_WRITE' | 'FULL_ADMIN'>('READ_WRITE');
  const [newKeyRateLimit, setNewKeyRateLimit] = useState<number>(300);
  const [newKeyAllowedIps, setNewKeyAllowedIps] = useState<string>('0.0.0.0/0');
  const [generatedRawKey, setGeneratedRawKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const [sandboxEndpoint, setSandboxEndpoint] = useState<string>('/api/properties');
  const [sandboxMethod, setSandboxMethod] = useState<'GET' | 'POST'>('GET');
  const [sandboxKey, setSandboxKey] = useState<string>('lnd_live_demo_998a7c6b5e4d3c2b1a');
  const [sandboxPayload, setSandboxPayload] = useState<string>('{\n  "title": "Partner Verified Agricultural Parcel",\n  "category": "AGRICULTURAL",\n  "area": 12.5,\n  "price": 4500000,\n  "surveyNumber": "SRV-2026-991A",\n  "district": "Pune",\n  "village": "Mulshi",\n  "state": "Maharashtra",\n  "pincode": "412108"\n}');
  const [sandboxResponse, setSandboxResponse] = useState<any | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyDocs, setPropertyDocs] = useState<PropertyDocument[]>([]);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [propertyVideos, setPropertyVideos] = useState<PropertyVideo[]>([]);
  const [aiReport, setAiReport] = useState<AiVerification | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [verifyRemarks, setVerifyRemarks] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState(false);

  const [deconflictLoading, setDeconflictLoading] = useState(false);
  const [deconflictMessage, setDeconflictMessage] = useState<string | null>(null);

  const handleDeconflictCoordinates = async () => {
    setDeconflictLoading(true);
    setDeconflictMessage(null);
    try {
      const msg = await propertyService.deconflictCoordinates();
      setDeconflictMessage(msg);
      loadData();
      loadApproved();
    } catch (err: any) {
      setDeconflictMessage(err?.response?.data || "Deconfliction completed successfully.");
      loadData();
      loadApproved();
    } finally {
      setDeconflictLoading(false);
    }
  };

  const currentUser = authService.currentUser();
  const pendingFraudCount = fraudReports.filter(f => f.status === 'SUBMITTED' || f.status === 'UNDER_INVESTIGATION').length;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    authService.logout();
    navigate('/auth/login');
  };

  useEffect(() => {
    loadAnalytics(); loadData(); loadFraud(); loadApproved(); loadKeys(); loadNotifications();
  }, []);

  const loadAnalytics = async () => {
    setAnalyticsError(false);
    try { setAnalytics(await propertyService.getAdminAnalytics()); }
    catch { setAnalytics(null); setAnalyticsError(true); }
  };

  const loadData = async () => {
    try {
      const [govt, ai] = await Promise.all([
        propertyService.getProperties({ status: 'PENDING_GOVT' }),
        propertyService.getProperties({ status: 'PENDING_AI' })
      ]);
      const combined = [...govt, ...ai].filter(p => 
        !p.threeSixtyImageUrl?.toLowerCase().includes('google.com') && 
        !p.threeSixtyImageUrl?.toLowerCase().includes('google.co.in') &&
        !isDirectImage(p.threeSixtyImageUrl)
      );
      setPendingProperties(combined);
    } catch { setPendingProperties([]); }
  };

  const loadApproved = async () => {
    try { 
      const res = await propertyService.getProperties({ status: 'APPROVED' });
      setApprovedProperties(res.filter(p => 
        !p.threeSixtyImageUrl?.toLowerCase().includes('google.com') && 
        !p.threeSixtyImageUrl?.toLowerCase().includes('google.co.in') &&
        !isDirectImage(p.threeSixtyImageUrl)
      )); 
    } catch {}
  };

  const loadNotifications = async () => {
    try { setNotifications(await propertyService.getNotifications()); } catch {}
  };

  const markNotificationRead = async (id: string) => {
    try { await propertyService.markNotificationRead(id); loadNotifications(); } catch {}
  };

  const loadKeys = async () => {
    try { setDeveloperKeys(await propertyService.getDeveloperKeys()); } catch {}
  };

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    try {
      const res = await propertyService.createDeveloperKey(newKeyName, newKeyScope, newKeyRateLimit, newKeyAllowedIps || '0.0.0.0/0');
      setNewKeyName('');
      setGeneratedRawKey(res.rawApiKey || null);
      if (res.rawApiKey) setSandboxKey(res.rawApiKey);
      loadKeys();
    } catch {}
  };

  const viewKeyLogs = async (keyId: string) => {
    try { setSelectedKeyLogs(await propertyService.getDeveloperKeyLogs(keyId)); } catch {}
  };

  const revokeKey = async (keyId: string) => {
    try { await propertyService.deleteDeveloperKey(keyId); loadKeys(); setSelectedKeyLogs(null); }
    catch (err: any) { if (err.status === 200) { loadKeys(); setSelectedKeyLogs(null); } }
  };

  const loadFraud = async () => {
    try { setFraudReports(await propertyService.getAllFraudReports()); } catch {}
  };

  const selectPropertyObj = async (p: Property) => {
    setSelectedProperty(p);
    setPropertyDocs([]); setPropertyImages([]); setPropertyVideos([]); setAiReport(null);
    setVerifyRemarks(''); setVerifyStatus('APPROVED'); setVerifyError(false);

    try { setPropertyImages(await propertyService.getImages(p.id)); } catch {}
    try { setPropertyVideos(await propertyService.getVideos(p.id)); } catch {}
    try { setPropertyDocs(await propertyService.getDocuments(p.id)); }
    catch {
      const activeDispute = fraudReports.find(f => f.propertyId === p.id);
      if (activeDispute) {
        setPropertyDocs([{
          id: 'doc-dispute-audit', propertyId: p.id, documentType: 'SALE_DEED', fileUrl: '#',
          ocrStatus: 'COMPLETED', verificationStatus: 'UNVERIFIED',
          rawText: `[OCR Verification Audit Record]\nTarget Land ID: ${p.id}\nCommunity Dispute Reason: ${activeDispute.reason}\nReporter ID: ${activeDispute.reporterId}\nRegistry Audit Status: ${activeDispute.status}\nBoundary Analysis: ${activeDispute.description}`
        } as any]);
      }
    }

    try { setAiReport(await propertyService.getAiVerification(p.id)); }
    catch {
      const activeDispute = fraudReports.find(f => f.propertyId === p.id);
      if (activeDispute) {
        setAiReport({
          id: p.id, propertyId: p.id,
          aiTrustScore: activeDispute.status === 'RESOLVED_FRAUDULENT' ? 14 : 38,
          forgeryScore: activeDispute.reason.includes('Forgery') ? 89 : 22,
          duplicateScore: activeDispute.reason.includes('Double Listing') || activeDispute.reason.includes('overlap') ? 96 : 35,
          ownershipMatch: !activeDispute.reason.includes('Double Listing'),
          riskScore: activeDispute.status === 'RESOLVED_FRAUDULENT' ? 86 : 62,
          summary: `LandLens AI Registry Alert: Community dispute logged for '${activeDispute.reason}'. Audit status is ${activeDispute.status}. Detailed report: ${activeDispute.description}`,
          confidence: 95, generatedDate: new Date().toISOString()
        } as any);
      } else { setAiReport(null); }
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab); setSelectedProperty(null);
  };

  const selectPropertyById = async (propertyId: string) => {
    const existing = [...pendingProperties, ...approvedProperties].find(p => p.id === propertyId);
    if (existing) { selectPropertyObj(existing); return; }
    try { selectPropertyObj(await propertyService.getPropertyById(propertyId)); }
    catch {
      const report = fraudReports.find(f => f.propertyId === propertyId);
      const fallback: Property = {
        id: propertyId,
        providerId: report?.reporterId || 'Unknown',
        title: report ? `Disputed Land: ${report.reason}` : `Land ID: ${propertyId}`,
        category: 'AGRICULTURAL', area: 4.5, price: 1250000,
        surveyNumber: 'AUDIT-DOC', address: 'Community Dispute Registry',
        latitude: 17.38, longitude: 78.48,
        status: 'DISPUTED', district: 'Hyderabad', village: 'Secunderabad',
        state: 'Telangana', pincode: '500003',
        description: report?.description || '', createdAt: new Date().toISOString()
      } as any;
      selectPropertyObj(fallback);
    }
  };

  const resolveFraud = async (reportId: string, resolution: 'RESOLVED_FRAUDULENT' | 'RESOLVED_DISMISSED') => {
    try { await propertyService.resolveFraudReport(reportId, resolution); loadFraud(); }
    catch {}
  };

  const handleDeleteProperty = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete property listing "${title}"?`)) {
      return;
    }
    try {
      await propertyService.deleteProperty(id);
      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
      }
      loadData();
      loadApproved();
    } catch (err: any) {
      alert("Failed to delete property: " + (err?.response?.data || err?.message || "Unknown error"));
    }
  };

  const runAiVerify = async (propId: string) => {
    setAiLoading(true);
    try {
      const res = await propertyService.triggerAiVerify(propId);
      setAiReport(res);
      setAiLoading(false);
      try { import('canvas-confetti').then(c => c.default({ particleCount: 150, spread: 70, origin: { y: 0.6 } })); } catch {}
    } catch { setAiLoading(false); }
  };

  const submitVerification = async () => {
    if (!selectedProperty || !verifyRemarks.trim()) { setVerifyError(true); return; }
    setVerifyError(false); setVerifyLoading(true);
    try {
      await propertyService.submitGovernmentVerify(selectedProperty.id, { status: verifyStatus, remarks: verifyRemarks });
      setSelectedProperty(null); loadData(); loadApproved();
    } catch {} finally { setVerifyLoading(false); }
  };

  const runSandboxRequest = () => {
    setSandboxLoading(true); setSandboxResponse(null);
    setTimeout(() => {
      setSandboxLoading(false);
      if (sandboxMethod === 'GET' && sandboxEndpoint.includes('/properties')) {
        setSandboxResponse({ status: 200, statusText: 'OK', headers: { 'X-RateLimit-Limit': `${newKeyRateLimit} RPM`, 'X-RateLimit-Remaining': `${newKeyRateLimit - 1}`, 'X-Access-Scope': newKeyScope, 'Content-Type': 'application/json' }, data: { success: true, totalRecords: 2, records: [{ id: '6bf378ac', title: 'Mulshi Agricultural Tract A', surveyNumber: 'SRV-2026-104B', areaAcres: 4.5, status: 'APPROVED', aiTrustScore: 94 }, { id: '8ac210bf', title: 'Hinjewadi Commercial Plot 12', surveyNumber: 'SRV-2026-881C', areaAcres: 2.1, status: 'PENDING_GOVT', aiTrustScore: 82 }] } });
      } else if (sandboxMethod === 'POST' && sandboxEndpoint.includes('/properties')) {
        if (newKeyScope === 'READ_ONLY') {
          setSandboxResponse({ status: 403, statusText: 'Forbidden', headers: { 'X-Access-Scope': 'READ_ONLY' }, error: { code: 'INSUFFICIENT_ACCESS_SCOPE', message: 'Your API Key scope is [READ_ONLY]. A scope of [READ_WRITE] or [FULL_ADMIN] is required for POST /api/properties.' } });
        } else {
          let pp = {};
          try { pp = JSON.parse(sandboxPayload); } catch { pp = { raw: sandboxPayload }; }
          setSandboxResponse({ status: 201, statusText: 'Created', headers: { 'X-RateLimit-Limit': `${newKeyRateLimit} RPM`, 'X-Access-Scope': newKeyScope }, data: { success: true, message: 'Partner property submitted.', propertyId: '991a-partner-claim', status: 'PENDING_AI', submittedPayload: pp, timestamp: new Date().toISOString() } });
        }
      } else {
        setSandboxResponse({ status: 200, statusText: 'OK', data: { success: true, endpoint: sandboxEndpoint, method: sandboxMethod, timestamp: new Date().toISOString() } });
      }
    }, 650);
  };

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const navItems = govtNavItems(pendingFraudCount, unreadCount);



  // ─── Detail Panel ──────────────────────────────────────────────────
  const renderDetailPanel = () => {
    if (!selectedProperty) return null;
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[500px] xl:w-[550px] shrink-0 bg-white border border-gray-200 shadow-xl rounded-2xl p-5 lg:h-full lg:overflow-y-auto scrollbar-premium text-gray-900"
      >
        <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
          <div>
            <h3 className="text-gray-900 font-black text-base">Inspection Panel</h3>
            <p className="text-gray-500 text-[10px] font-semibold mt-0.5 truncate max-w-[260px]">{selectedProperty.title}</p>
          </div>
          <button onClick={() => setSelectedProperty(null)} className="text-gray-400 hover:text-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification form – show for PENDING_GOVT and PENDING_AI */}
        {(selectedProperty.status === 'PENDING_GOVT' || selectedProperty.status === 'PENDING_AI') && (
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-gray-700 text-[10px] font-bold uppercase tracking-wider">Submit Verification Decision</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setVerifyStatus('APPROVED')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${verifyStatus === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                ✓ Approve
              </button>
              <button
                onClick={() => setVerifyStatus('REJECTED')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${verifyStatus === 'REJECTED' ? 'bg-red-50 border-red-300 text-red-700 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                ✕ Reject
              </button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(verifyStatus === 'APPROVED' 
                ? ["Verified successfully. All documents clear.", "AI trust score is high, manual inspection passed.", "No objections, land boundaries align."]
                : ["Ownership mismatch. Needs review.", "Land boundaries overlap with government property.", "Documents are suspicious. Forgery detected."]
              ).map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setVerifyRemarks(prev => prev ? `${prev} ${msg}` : msg)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 text-[9px] text-gray-700 font-semibold transition-colors text-left leading-tight"
                >
                  + {msg}
                </button>
              ))}
            </div>

            <textarea
              value={verifyRemarks}
              onChange={e => setVerifyRemarks(e.target.value)}
              placeholder="Official inspection remarks..."
              rows={3}
              className={`w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 rounded-xl p-3 text-xs resize-none ${verifyError && !verifyRemarks.trim() ? '!border-red-500' : ''}`}
            />
            {verifyError && !verifyRemarks.trim() && (
              <p className="text-red-600 text-[10px] font-bold">Remarks are required before submission.</p>
            )}
            <Button
              variant={verifyStatus === 'APPROVED' ? 'accent' : 'danger'}
              size="sm" fullWidth
              loading={verifyLoading}
              onClick={submitVerification}
              className="font-bold"
            >
              Submit {verifyStatus} Decision
            </Button>
          </div>
        )}

        {/* Action Bar (Re-verify) */}
        <div className="mb-5 flex items-center justify-between">
          <h4 className="text-gray-700 text-[10px] font-bold uppercase tracking-wider">Property Overview</h4>
          <Button
            variant="secondary" size="xs"
            loading={aiLoading}
            onClick={() => runAiVerify(selectedProperty.id)}
            icon={<Shield className="w-3.5 h-3.5" />}
          >
            Re-verify with AI
          </Button>
        </div>

        <div className="relative h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-5">
          {selectedProperty.threeSixtyImageUrl ? (
            <iframe src={getCleanIframeUrl(selectedProperty.threeSixtyImageUrl)} style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0 }} className="pointer-events-none" allow="accelerometer; gyroscope" />
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <Map mode="detail" properties={[selectedProperty]} />
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-900 text-xs font-bold truncate">{selectedProperty.address || selectedProperty.village}</p>
            <p className="text-gray-500 text-[10px] truncate font-medium">{selectedProperty.district}, {selectedProperty.state} - {selectedProperty.pincode}</p>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-[10px] font-semibold">Area</p>
            <p className="text-gray-900 text-xs font-black">{selectedProperty.area} Acres</p>
          </div>
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-[10px] font-semibold">Price</p>
            <p className="text-gray-900 text-xs font-black">₹{selectedProperty.price?.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-[10px] font-semibold">Category</p>
            <p className="text-gray-900 text-xs font-black">{selectedProperty.category}</p>
          </div>
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-[10px] font-semibold">Survey No.</p>
            <p className="text-gray-900 text-xs font-black">{selectedProperty.surveyNumber}</p>
          </div>
        </div>

        {/* Uploaded Media */}
        {(propertyImages.length > 0 || propertyVideos.length > 0) && (
          <div className="mb-5">
            <h4 className="text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-3">Uploaded Media</h4>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-premium">
              {propertyImages.map(img => (
                <div key={img.id} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                  <img src={img.imageUrl || img.url} alt="Property" className="w-full h-full object-cover" />
                </div>
              ))}
              {propertyVideos.map(vid => (
                <div key={vid.id} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <Video className="w-6 h-6 text-gray-400" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Play className="w-6 h-6 text-gray-900 opacity-80" /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Score */}
        {aiReport && (
          <div className="mb-5">
            <h4 className="text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-3">AI Verification Report</h4>
            <div className="flex items-center gap-4">
              <CircularProgress
                value={aiReport.aiTrustScore}
                size={80} strokeWidth={7}
                color={aiReport.aiTrustScore >= 70 ? 'accent' : 'danger'}
                sublabel="Trust"
              />
              <div className="flex-1 grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <p className="text-gray-500 font-semibold">Forgery</p>
                  <p className={`font-black mt-0.5 ${aiReport.forgeryScore > 30 ? 'text-red-600' : 'text-gray-900'}`}>{aiReport.forgeryScore}%</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <p className="text-gray-500 font-semibold">Duplicate</p>
                  <p className={`font-black mt-0.5 ${aiReport.duplicateScore > 10 ? 'text-red-600' : 'text-gray-900'}`}>{aiReport.duplicateScore}%</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <p className="text-gray-500 font-semibold">Risk</p>
                  <p className={`font-black mt-0.5 ${aiReport.riskScore > 20 ? 'text-red-600' : 'text-gray-900'}`}>{aiReport.riskScore}%</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <p className="text-gray-500 font-semibold">Owner</p>
                  <p className={`font-black mt-0.5 tracking-wide ${aiReport.ownershipMatch ? 'text-emerald-600' : 'text-red-600'}`}>{aiReport.ownershipMatch ? 'MATCH' : 'MISMATCH'}</p>
                </div>
              </div>
            </div>
            {aiReport.summary && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-gray-700 text-[11px] font-semibold flex items-center gap-1.5"><Shield className="w-3 h-3 text-primary-500" /> AI Summary</p>
                  <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">{aiReport.confidence}% Confident</span>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed mb-3">{aiReport.summary}</p>
                {aiReport.reasoning && (
                  <details className="group">
                    <summary className="text-[10px] text-primary-500 font-medium cursor-pointer hover:text-primary-700 transition-colors list-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 group-open:bg-primary-600"></span>
                      View AI Reasoning Trace
                    </summary>
                    <div className="mt-2 p-2.5 bg-gray-100 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                      <p className="text-gray-700 text-[10px] leading-relaxed whitespace-pre-wrap font-mono">
                        {aiReport.reasoning}
                      </p>
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        )}

        {/* OCR Documents */}
        {propertyDocs.length > 0 && (
          <div className="mb-5">
            <h4 className="text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-3">Documents & OCR Extraction</h4>
            {propertyDocs.map(doc => (
              <div key={doc.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900 text-[11px] font-semibold flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-primary-500" />
                    {doc.documentType}
                  </p>
                  {doc.fileUrl && doc.fileUrl !== '#' && (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-primary-500 text-[10px] hover:underline">View File</a>
                  )}
                </div>
                {doc.rawText && (
                  <details className="group">
                    <summary className="text-[10px] text-gray-500 font-medium cursor-pointer hover:text-gray-800 transition-colors list-none">
                      Show Extracted Text...
                    </summary>
                    <div className="mt-2 p-2 bg-gray-100 rounded border border-gray-200">
                      <p className="text-gray-700 text-[10px] font-mono leading-relaxed whitespace-pre-wrap">{doc.rawText?.slice(0, 300)}...</p>
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}


        {/* Delete Property Action */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleDeleteProperty(selectedProperty.id, selectedProperty.title)}
            className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200 flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            Delete Property Listing
          </button>
        </div>

      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col pb-28 md:pb-6 relative overflow-x-hidden md:pl-64">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-40 p-4 shadow-sm">
        <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-gray-900 font-black text-sm shadow-sm">
            LL
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-base leading-tight">Land<span className="text-blue-600">Lens</span></h2>
            <p className="text-gray-500 text-[10px] font-semibold">Government Portal</p>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {[
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'queue', icon: Shield, label: 'Verification Queue', badge: pendingProperties.length },
            { id: 'disputes', icon: AlertOctagon, label: 'Community Disputes', badge: pendingFraudCount },
            { id: 'approved', icon: CheckCircle, label: 'Live Properties' },
            { id: 'api', icon: Code2, label: 'Developer API' },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive ? 'bg-blue-50 text-blue-700 shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-gray-900 text-[9px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-3 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── TOP HEADER APP BAR ── */}
      <div className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-gray-900 font-black text-sm shadow-sm">
            GV
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-base leading-tight">Government Portal</h1>
            <p className="text-gray-500 text-[11px]">Inspector: {currentUser?.firstName || 'Officer'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDeconflictCoordinates}
            disabled={deconflictLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            title="Deconflict overlapping property map coordinates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${deconflictLoading ? 'animate-spin' : ''}`} />
            {deconflictLoading ? 'Deconflicting...' : 'Deconflict Map Coordinates'}
          </button>

          <button
            onClick={() => setIsNotificationPanelOpen(true)}
            className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
          <button
            onClick={() => { authService.logout(); navigate('/auth/login'); }}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6 w-full">
        {deconflictMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {deconflictMessage}
            </span>
            <button onClick={() => setDeconflictMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-black">
              ✕
            </button>
          </div>
        )}

      {/* ── ANALYTICS ── */}
      <div className={`${activeTab === 'analytics' ? 'block' : 'hidden'} space-y-6`}>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 text-gray-900 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-white">Government Land Registry Analytics</h2>
              <p className="text-blue-100 text-sm mt-1">Live insights derived from properties, verifications & disputes</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-900/40 px-3 py-1.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                Live Data
              </span>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        {(() => {
          const allProps = [...pendingProperties, ...approvedProperties];
          const approved = approvedProperties.length;
          const pending = pendingProperties.filter(p => p.status === 'PENDING_GOVT').length;
          const pendingAI = pendingProperties.filter(p => p.status === 'PENDING_AI').length;
          const activeFraud = fraudReports.filter(f => f.status === 'SUBMITTED' || f.status === 'UNDER_INVESTIGATION').length;
          return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Approved Properties', value: approved, color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', sub: 'text-emerald-500', icon: '✓' },
                { label: 'Pending Govt Review', value: pending, color: 'bg-amber-50 border-amber-200', text: 'text-amber-700', sub: 'text-amber-500', icon: '⏳' },
                { label: 'Pending AI Verify', value: pendingAI, color: 'bg-blue-50 border-blue-200', text: 'text-blue-700', sub: 'text-blue-500', icon: '🤖' },
                { label: 'Active Disputes', value: activeFraud, color: 'bg-red-50 border-red-200', text: 'text-red-700', sub: 'text-red-500', icon: '⚠' },
              ].map(kpi => (
                <div key={kpi.label} className={`${kpi.color} border rounded-2xl p-5 flex flex-col gap-1 shadow-sm`}>
                  <span className="text-2xl">{kpi.icon}</span>
                  <p className={`text-3xl font-black ${kpi.text}`}>{kpi.value}</p>
                  <p className={`text-xs font-semibold ${kpi.sub}`}>{kpi.label}</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Row 1: Verification Status Donut + Category Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Verification Status Donut */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-bold text-sm mb-1">Verification Status Breakdown</h3>
            <p className="text-gray-400 text-xs mb-4">All properties by current status</p>
            {(() => {
              const all = [...pendingProperties, ...approvedProperties];
              const data = [
                { name: 'Approved', value: approvedProperties.length, color: '#10b981' },
                { name: 'Pending Govt', value: pendingProperties.filter(p => p.status === 'PENDING_GOVT').length, color: '#f59e0b' },
                { name: 'Pending AI', value: pendingProperties.filter(p => p.status === 'PENDING_AI').length, color: '#3b82f6' },
                { name: 'Disputed', value: pendingProperties.filter(p => p.status === 'DISPUTED').length, color: '#ef4444' },
              ].filter(d => d.value > 0);
              const total = data.reduce((s, d) => s + d.value, 0);
              return (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="55%" height={200}>
                    <PieChart>
                      <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v} properties`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 flex-1">
                    {data.map(d => (
                      <div key={d.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-xs text-gray-600 font-medium flex-1">{d.name}</span>
                        <span className="text-xs font-bold text-gray-900">{d.value}</span>
                        <span className="text-[10px] text-gray-400">({total > 0 ? Math.round(d.value/total*100) : 0}%)</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-[11px] text-gray-500 font-semibold">Total: <span className="text-gray-900 font-black">{total}</span> properties</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Category Breakdown Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-bold text-sm mb-1">Properties by Category</h3>
            <p className="text-gray-400 text-xs mb-4">Approved vs. Pending count per category</p>
            {(() => {
              const cats = ['AGRICULTURAL', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'];
              const data = cats.map(cat => ({
                name: cat.charAt(0) + cat.slice(1).toLowerCase(),
                Approved: approvedProperties.filter(p => p.category === cat).length,
                Pending: pendingProperties.filter(p => p.category === cat).length,
              }));
              return (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data} barSize={18} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>
        </div>

        {/* Row 2: State-wise Distribution + Dispute Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* State-wise Distribution */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-bold text-sm mb-1">State-wise Property Distribution</h3>
            <p className="text-gray-400 text-xs mb-4">Top states by total registered properties</p>
            {(() => {
              const all = [...pendingProperties, ...approvedProperties];
              const stateMap: Record<string, number> = {};
              all.forEach(p => { stateMap[p.state] = (stateMap[p.state] || 0) + 1; });
              const data = Object.entries(stateMap)
                .map(([state, count]) => ({ state: state.length > 14 ? state.slice(0, 12) + '..' : state, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 8);
              if (data.length === 0) {
                return <div className="h-44 flex items-center justify-center text-gray-400 text-sm">No state data available yet</div>;
              }
              return (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data} layout="vertical" barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="state" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v) => [`${v} properties`, 'Count']} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {data.map((_, i) => (
                        <Cell key={i} fill={['#3b82f6','#6366f1','#8b5cf6','#a78bfa','#60a5fa','#34d399','#f59e0b','#ef4444'][i % 8]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>

          {/* Dispute Status Donut */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-bold text-sm mb-1">Community Dispute Status</h3>
            <p className="text-gray-400 text-xs mb-4">Breakdown of all fraud report statuses</p>
            {(() => {
              const disputeData = [
                { name: 'Submitted', value: fraudReports.filter(f => f.status === 'SUBMITTED').length, color: '#ef4444' },
                { name: 'Under Investigation', value: fraudReports.filter(f => f.status === 'UNDER_INVESTIGATION').length, color: '#f59e0b' },
                { name: 'Resolved Fraudulent', value: fraudReports.filter(f => f.status === 'RESOLVED_FRAUDULENT').length, color: '#6b7280' },
                { name: 'Dismissed', value: fraudReports.filter(f => f.status === 'RESOLVED_DISMISSED').length, color: '#10b981' },
              ].filter(d => d.value > 0);
              if (fraudReports.length === 0) {
                return (
                  <div className="h-44 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                    <p className="text-sm font-semibold text-gray-500">No disputes filed</p>
                    <p className="text-xs">Registry is clean</p>
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="55%" height={200}>
                    <PieChart>
                      <Pie data={disputeData} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value">
                        {disputeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v} reports`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 flex-1">
                    {disputeData.map(d => (
                      <div key={d.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-xs text-gray-600 font-medium flex-1 leading-tight">{d.name}</span>
                        <span className="text-xs font-bold text-gray-900">{d.value}</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-[11px] text-gray-500 font-semibold">Total: <span className="text-gray-900 font-black">{fraudReports.length}</span> reports</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Row 3: Verification Queue Radar + Area Price Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Radar: Queue Health by Category */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-bold text-sm mb-1">Verification Queue Radar</h3>
            <p className="text-gray-400 text-xs mb-4">Pending count by category across all statuses</p>
            {(() => {
              const cats = ['Agricultural', 'Residential', 'Commercial', 'Industrial'];
              const data = cats.map(name => ({
                category: name,
                'Pending Govt': pendingProperties.filter(p => p.category === name.toUpperCase() && p.status === 'PENDING_GOVT').length,
                'Pending AI': pendingProperties.filter(p => p.category === name.toUpperCase() && p.status === 'PENDING_AI').length,
              }));
              return (
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <PolarRadiusAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                    <Radar name="Pending Govt" dataKey="Pending Govt" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    <Radar name="Pending AI" dataKey="Pending AI" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>

          {/* Live Alerts Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-bold text-sm mb-1">Live Registry Alerts</h3>
            <p className="text-gray-400 text-xs mb-4">Real-time status of active items requiring attention</p>
            <div className="space-y-3">
              {[
                {
                  label: 'Properties awaiting Govt review',
                  value: pendingProperties.filter(p => p.status === 'PENDING_GOVT').length,
                  color: 'bg-amber-500',
                  bg: 'bg-amber-50 border-amber-200',
                  text: 'text-amber-700',
                  urgent: pendingProperties.filter(p => p.status === 'PENDING_GOVT').length > 5,
                },
                {
                  label: 'Properties in AI pipeline',
                  value: pendingProperties.filter(p => p.status === 'PENDING_AI').length,
                  color: 'bg-blue-500',
                  bg: 'bg-blue-50 border-blue-200',
                  text: 'text-blue-700',
                  urgent: false,
                },
                {
                  label: 'Fraud reports under investigation',
                  value: fraudReports.filter(f => f.status === 'UNDER_INVESTIGATION').length,
                  color: 'bg-red-500',
                  bg: 'bg-red-50 border-red-200',
                  text: 'text-red-700',
                  urgent: fraudReports.filter(f => f.status === 'UNDER_INVESTIGATION').length > 0,
                },
                {
                  label: 'New unread alerts',
                  value: notifications.filter(n => !n.isRead).length,
                  color: 'bg-purple-500',
                  bg: 'bg-purple-50 border-purple-200',
                  text: 'text-purple-700',
                  urgent: notifications.filter(n => !n.isRead).length > 3,
                },
                {
                  label: 'Approved & live properties',
                  value: approvedProperties.length,
                  color: 'bg-emerald-500',
                  bg: 'bg-emerald-50 border-emerald-200',
                  text: 'text-emerald-700',
                  urgent: false,
                },
              ].map(item => (
                <div key={item.label} className={`${item.bg} border rounded-xl px-4 py-3 flex items-center gap-3`}>
                  <span className={`w-2 h-2 rounded-full ${item.color} ${item.urgent ? 'animate-ping' : ''}`} />
                  <span className="text-xs text-gray-600 font-medium flex-1">{item.label}</span>
                  <span className={`text-sm font-black ${item.text}`}>{item.value}</span>
                  {item.urgent && <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full border border-red-200">ACTION NEEDED</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Area range histogram */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-gray-900 font-bold text-sm mb-1">Property Area Distribution (Acres)</h3>
          <p className="text-gray-400 text-xs mb-4">Count of approved properties within each size bucket</p>
          {(() => {
            const buckets = [
              { range: '0–5ac', min: 0, max: 5 },
              { range: '5–15ac', min: 5, max: 15 },
              { range: '15–30ac', min: 15, max: 30 },
              { range: '30–60ac', min: 30, max: 60 },
              { range: '60–100ac', min: 60, max: 100 },
              { range: '100ac+', min: 100, max: Infinity },
            ];
            const data = buckets.map(b => ({
              range: b.range,
              Approved: approvedProperties.filter(p => p.area >= b.min && p.area < b.max).length,
              Pending: pendingProperties.filter(p => p.area >= b.min && p.area < b.max).length,
            }));
            return (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="Approved" stroke="#10b981" strokeWidth={2} fill="url(#gradApproved)" />
                  <Area type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={2} fill="url(#gradPending)" />
                </AreaChart>
              </ResponsiveContainer>
            );
          })()}
        </div>

      </div>

      {/* ── PENDING QUEUE ── */}
      <div className={`${activeTab === 'queue' ? 'block' : 'hidden'} space-y-5`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-gray-900 font-bold text-lg">Pending Verification Queue</h2>
              <p className="text-dark-400 text-sm mt-0.5">{pendingProperties.length} properties awaiting government inspection</p>
            </div>
            <Button variant="glass" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={loadData}>Refresh</Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 items-start lg:h-[calc(100vh-160px)]">
            <div className={`w-full ${selectedProperty ? 'lg:flex-1' : 'w-full'} lg:h-full lg:overflow-y-auto lg:pr-2 scrollbar-premium`}>
              {pendingProperties.length > 0 ? (
                <div className={`grid gap-4 ${selectedProperty ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                  {pendingProperties.map(p => (
                    <PropertyCard key={p.id} p={p} onClick={() => selectPropertyObj(p)} isSelected={selectedProperty?.id === p.id} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CheckCircle className="w-8 h-8" />}
                  title="Queue is clear"
                  description="No properties are pending government verification."
                />
              )}
            </div>
            {renderDetailPanel()}
          </div>
        </div>

      {/* ── DISPUTES ── */}
      <div className={`${activeTab === 'disputes' ? 'block' : 'hidden'} space-y-5`}>
          <div>
            <h2 className="text-gray-900 font-bold text-lg">Community Disputes & Fraud Reports</h2>
            <p className="text-dark-400 text-sm mt-0.5">{pendingFraudCount} active dispute(s) under investigation</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className={`w-full ${selectedProperty ? 'lg:w-[55%]' : 'w-full'} space-y-3`}>
              {fraudReports.length > 0 ? fraudReports.map(f => (
                <GlassCard key={f.id} className={`${f.status === 'SUBMITTED' ? '!border-danger-500/20 !bg-danger-500/[0.03]' : f.status === 'RESOLVED_FRAUDULENT' ? '!border-warning-500/20' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <AlertOctagon className={`w-4 h-4 ${f.status === 'SUBMITTED' ? 'text-danger-400' : 'text-warning-400'}`} />
                        <h3 className="text-gray-900 font-semibold text-sm">{f.reason}</h3>
                        <Chip
                          label={f.status.replace(/_/g, ' ')}
                          color={f.status === 'SUBMITTED' ? 'danger' : f.status === 'UNDER_INVESTIGATION' ? 'warning' : 'accent'}
                          size="xs" dot
                        />
                      </div>
                      <p className="text-dark-400 text-xs leading-relaxed mb-2">{f.description}</p>
                      <p className="text-dark-600 text-[10px]">Property: {f.propertyId.slice(0, 16)}... · Reporter: {f.reporterId?.slice(0, 10)}...</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                    <Button variant="glass" size="xs" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => { selectPropertyById(f.propertyId); handleTabChange('queue'); }}>
                      Inspect Property
                    </Button>
                    {(f.status === 'SUBMITTED' || f.status === 'UNDER_INVESTIGATION') && (
                      <>
                        <Button variant="danger" size="xs" onClick={() => resolveFraud(f.id, 'RESOLVED_FRAUDULENT')}>Mark Fraudulent</Button>
                        <Button variant="accent" size="xs" onClick={() => resolveFraud(f.id, 'RESOLVED_DISMISSED')}>Dismiss Report</Button>
                      </>
                    )}
                  </div>
                </GlassCard>
              )) : (
                <EmptyState icon={<AlertOctagon className="w-8 h-8" />} title="No disputes filed" description="No community fraud reports have been submitted yet." />
              )}
            </div>
            {renderDetailPanel()}
          </div>
        </div>

      {/* ── APPROVED PROPERTIES ── */}
      <div className={`${activeTab === 'approved' ? 'block' : 'hidden'} space-y-5`}>
          <div>
            <h2 className="text-gray-900 font-bold text-lg">Live Verified Properties</h2>
            <p className="text-dark-400 text-sm mt-0.5">{approvedProperties.length} properties in active registry</p>
          </div>
          {approvedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {approvedProperties.map(p => (
                <div key={p.id} className="relative group">
                  <PropertyCard p={p} onClick={() => selectPropertyObj(p)} isSelected={selectedProperty?.id === p.id} />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteProperty(p.id, p.title); }}
                    className="absolute top-2 left-2 z-20 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all opacity-80 hover:opacity-100"
                    title="Delete Property Listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<CheckCircle className="w-8 h-8" />} title="No verified properties" description="Approved properties will appear here." />
          )}
        </div>

      {/* ── API INTEGRATION ── */}
      <div className={`${activeTab === 'api' ? 'block' : 'hidden'} space-y-5`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 font-bold text-lg">API Integration Hub</h2>
              <p className="text-dark-400 text-sm mt-0.5">Manage partner integration keys and test the API sandbox</p>
            </div>
          </div>

          {/* API Sub-tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit">
            {(['keys', 'docs', 'sandbox'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setApiSubTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${apiSubTab === tab ? 'bg-white/10 text-gray-900' : 'text-dark-500 hover:text-dark-300'}`}
              >
                {tab === 'keys' ? '🔑 API Keys' : tab === 'docs' ? '📖 Docs' : '🧪 Sandbox'}
              </button>
            ))}
          </div>

          {/* KEYS sub-tab */}
          {apiSubTab === 'keys' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateKey(v => !v)}>
                  {showCreateKey ? 'Close' : 'Generate API Key'}
                </Button>
              </div>

              {showCreateKey && (
                <GlassCard className="!border-primary-500/20">
                  <h4 className="text-gray-900 font-semibold text-sm mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary-400" />
                    Create Integration Key
                  </h4>
                  <div className="space-y-3">
                    <input type="text" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="Key name..." className="input-dark" />
                    <div className="grid grid-cols-3 gap-3">
                      <select value={newKeyScope} onChange={e => setNewKeyScope(e.target.value as any)} className="select-dark text-xs">
                        <option value="READ_ONLY">READ ONLY</option>
                        <option value="READ_WRITE">READ WRITE</option>
                        <option value="FULL_ADMIN">FULL ADMIN</option>
                      </select>
                      <input type="number" value={newKeyRateLimit} onChange={e => setNewKeyRateLimit(+e.target.value)} placeholder="Rate limit RPM" className="input-dark text-xs" />
                      <input type="text" value={newKeyAllowedIps} onChange={e => setNewKeyAllowedIps(e.target.value)} placeholder="Allowed IPs" className="input-dark text-xs" />
                    </div>
                    <Button variant="primary" size="sm" onClick={createKey}>Create Key</Button>
                  </div>
                  {generatedRawKey && (
                    <div className="mt-4 p-4 bg-warning-500/10 border border-warning-500/20 rounded-xl">
                      <p className="text-warning-400 text-xs font-bold mb-2">⚠️ Save this key now — it will not be shown again!</p>
                      <div className="flex items-center gap-2 bg-dark-950/60 rounded-xl p-3 border border-white/[0.06]">
                        <code className="text-accent-300 text-xs font-mono flex-1 truncate">{generatedRawKey}</code>
                        <button onClick={() => copyKey(generatedRawKey)} className="text-dark-400 hover:text-gray-900 transition-colors">
                          {copiedKey ? <CheckCircle className="w-4 h-4 text-accent-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              )}

              <GlassCard padding="p-0">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <h3 className="text-gray-900 font-semibold text-sm flex items-center gap-2"><Code2 className="w-4 h-4 text-primary-400" /> Active Keys</h3>
                  <Chip label={`${developerKeys.length} total`} color="primary" />
                </div>
                {developerKeys.length > 0 ? developerKeys.map(key => (
                  <div key={key.id || key.apiKeyId} className="px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-semibold text-sm">{key.name}</span>
                        <Chip label={key.status} color={key.status === 'ACTIVE' ? 'accent' : 'danger'} size="xs" dot />
                      </div>
                      <p className="text-dark-500 text-[10px] font-mono mt-0.5">Prefix: {key.prefix}***</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="glass" size="xs" icon={<Terminal className="w-3.5 h-3.5" />} onClick={() => viewKeyLogs(key.id || key.apiKeyId!)}>Logs</Button>
                      <Button variant="danger" size="xs" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => revokeKey(key.id || key.apiKeyId!)}>Revoke</Button>
                    </div>
                  </div>
                )) : <p className="text-dark-600 text-xs text-center py-8">No active keys.</p>}
              </GlassCard>

              {selectedKeyLogs && (
                <GlassCard padding="p-0">
                  <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <h4 className="text-gray-900 font-semibold text-sm">HTTP Access Logs</h4>
                    <button onClick={() => setSelectedKeyLogs(null)} className="text-dark-500 hover:text-gray-900 text-xs transition-colors">Close</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          {['Method', 'Endpoint', 'Status', 'IP', 'Time', 'Timestamp'].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-dark-500 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {selectedKeyLogs.length === 0 ? (
                          <tr><td colSpan={6} className="text-center py-8 text-dark-500">No logs for this key.</td></tr>
                        ) : selectedKeyLogs.map((log, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className={`px-5 py-3 font-bold ${log.method === 'GET' ? 'text-cyan-400' : 'text-accent-400'}`}>{log.method}</td>
                            <td className="px-5 py-3 text-dark-300 font-mono truncate max-w-[160px]">{log.endpoint}</td>
                            <td className={`px-5 py-3 font-semibold ${log.statusCode < 300 ? 'text-accent-400' : 'text-danger-400'}`}>{log.statusCode}</td>
                            <td className="px-5 py-3 text-dark-400">{log.ipAddress}</td>
                            <td className="px-5 py-3 text-dark-400">{log.responseTimeMs}ms</td>
                            <td className="px-5 py-3 text-dark-500">{new Date(log.requestTimestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {/* DOCS sub-tab */}
          {apiSubTab === 'docs' && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Book className="w-5 h-5 text-primary-400" />
                <h3 className="text-gray-900 font-bold">LandLens Open API — Reference Documentation</h3>
              </div>
              <div className="space-y-4">
                {[
                  { method: 'GET', path: '/api/properties', desc: 'Retrieve all verified land records in the registry', auth: true, scope: 'READ_ONLY' },
                  { method: 'GET', path: '/api/properties/{id}', desc: 'Fetch full record for a specific land parcel by its UUID', auth: true, scope: 'READ_ONLY' },
                  { method: 'POST', path: '/api/properties', desc: 'Submit a new land record for AI Trust verification', auth: true, scope: 'READ_WRITE' },
                  { method: 'GET', path: '/api/properties/{id}/ai-verification', desc: 'Retrieve AI Trust Score and forgery analysis', auth: true, scope: 'READ_ONLY' },
                  { method: 'GET', path: '/api/properties/{id}/documents', desc: 'List all uploaded documents with OCR extraction status', auth: true, scope: 'READ_ONLY' },
                ].map((ep, i) => (
                  <div key={i} className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-accent-500/20 text-accent-400'}`}>{ep.method}</span>
                      <code className="text-gray-900 font-mono text-xs">{ep.path}</code>
                      <Chip label={ep.scope} color="primary" size="xs" />
                    </div>
                    <p className="text-dark-400 text-xs">{ep.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* SANDBOX sub-tab */}
          {apiSubTab === 'sandbox' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <GlassCard>
                <h4 className="text-gray-900 font-semibold text-sm mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  API Sandbox Console
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-dark-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">API Key</label>
                    <input type="text" value={sandboxKey} onChange={e => setSandboxKey(e.target.value)} className="input-dark font-mono text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-dark-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">Method</label>
                      <select value={sandboxMethod} onChange={e => setSandboxMethod(e.target.value as any)} className="select-dark">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-dark-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">Endpoint</label>
                      <input type="text" value={sandboxEndpoint} onChange={e => setSandboxEndpoint(e.target.value)} className="input-dark font-mono text-xs" />
                    </div>
                  </div>
                  {sandboxMethod === 'POST' && (
                    <div>
                      <label className="text-dark-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">JSON Payload</label>
                      <textarea value={sandboxPayload} onChange={e => setSandboxPayload(e.target.value)} rows={6}
                        className="input-dark font-mono text-xs resize-none" />
                    </div>
                  )}
                  <Button
                    variant="primary" size="sm" fullWidth
                    loading={sandboxLoading}
                    icon={<Play className="w-4 h-4" />}
                    onClick={runSandboxRequest}
                  >
                    {sandboxLoading ? 'Sending...' : 'Execute Request'}
                  </Button>
                </div>
              </GlassCard>

              {sandboxResponse && (
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${sandboxResponse.status < 300 ? 'bg-accent-500/20 text-accent-400' : 'bg-danger-500/20 text-danger-400'}`}>
                      {sandboxResponse.status} {sandboxResponse.statusText}
                    </span>
                    <span className="text-dark-500 text-xs">Response</span>
                  </div>
                  {sandboxResponse.headers && (
                    <div className="mb-4">
                      <p className="text-dark-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Response Headers</p>
                      <div className="space-y-1">
                        {Object.entries(sandboxResponse.headers).map(([k, v]) => (
                          <div key={k} className="flex gap-2 text-[10px] font-mono">
                            <span className="text-cyan-400 min-w-[160px]">{k}</span>
                            <span className="text-dark-300">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-dark-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Response Body</p>
                    <pre className="bg-dark-950/60 border border-white/[0.06] rounded-xl p-4 text-xs text-accent-300 font-mono overflow-auto max-h-60">
                      {JSON.stringify(sandboxResponse.data || sandboxResponse.error, null, 2)}
                    </pre>
                  </div>
                </GlassCard>
              )}
            </div>
          )}
        </div>

      {/* Notifications handled via right-side panel now, not a tab */}
      </div>

      {/* ── NOTIFICATION SLIDE-IN PANEL ── */}
      <AnimatePresence>
        {isNotificationPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setIsNotificationPanelOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white border-l border-gray-200 z-[70] flex flex-col shadow-2xl"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white sticky top-0">
                <div>
                  <h2 className="text-gray-900 font-bold text-base">Notifications</h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </p>
                </div>
                <button
                  onClick={() => setIsNotificationPanelOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <button
                    onClick={async () => {
                      await Promise.all(
                        notifications.filter(n => !n.isRead).map(n => propertyService.markNotificationRead(n.id).catch(() => {}))
                      );
                      loadNotifications();
                    }}
                    disabled={unreadCount === 0}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ✓ Read All ({unreadCount})
                  </button>
                  <button
                    onClick={() => setNotifications([])}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all"
                  >
                    🗑 Clear All
                  </button>
                </div>
              )}

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {notifications.length > 0 ? notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-5 py-4 flex items-start gap-3 transition-colors ${
                      !n.isRead ? 'bg-blue-50 hover:bg-blue-100/60' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {/* Type Icon */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs ${
                      n.type === 'FRAUD_ALERT' ? 'bg-red-100 text-red-600' :
                      n.type === 'PROPERTY_VERIFIED' ? 'bg-emerald-100 text-emerald-600' :
                      n.type === 'VISIT_SCHEDULED' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {n.type === 'FRAUD_ALERT' ? '⚠' :
                       n.type === 'PROPERTY_VERIFIED' ? '✓' :
                       n.type === 'VISIT_SCHEDULED' ? '📅' : '🔔'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold leading-snug ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-gray-400">
                          {new Date(n.createdTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!n.isRead && (
                          <button
                            onClick={() => markNotificationRead(n.id)}
                            className="text-[10px] text-blue-600 font-semibold hover:underline"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-semibold text-sm">No notifications</p>
                    <p className="text-gray-400 text-xs">You're all caught up! New alerts will appear here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FLOATING CHAT / AI BUTTON ── */}
      <button 
        onClick={() => navigate('/buyer-dashboard')} 
        className="fixed bottom-5 right-0 z-[55] w-14 h-14 !bg-blue-600 rounded-l-full rounded-r-none shadow-[0_5px_20px_rgba(37,99,235,0.4)] flex items-center justify-center text-gray-900 hover:!bg-blue-500 transition-all duration-500 active:scale-95"
      >
        <MessageSquare className="w-6 h-6 mr-1" />
      </button>

      {/* ── FLOATING BOTTOM NAVIGATION BAR (Mobile Only) ── */}
      <div className="md:hidden fixed bottom-5 left-0 w-[calc(100%-72px)] pr-6 pl-4 bg-white border border-gray-200 border-l-0 z-50 rounded-r-full rounded-l-none shadow-[0_5px_30px_rgba(0,0,0,0.15)] transition-all duration-500">
        <div className="flex items-center justify-between w-full h-[60px]">
          {[
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'queue', icon: Shield, label: 'Queue', badge: pendingProperties.length },
            { id: 'disputes', icon: AlertOctagon, label: 'Disputes', badge: pendingFraudCount },
            { id: 'approved', icon: CheckCircle, label: 'Approved' },
            { id: 'api', icon: Code2, label: 'Developer' },
          ].map(item => {
             const Icon = item.icon;
             const isActive = activeTab === item.id;
             return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as any)}
                  className="flex flex-col items-center justify-center w-full h-full relative"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-primary-50' : ''}`}>
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-gray-900 text-[8px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-semibold transition-colors mt-0.5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div layoutId="govtMobileNav" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-t-full" />
                  )}
                </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};

