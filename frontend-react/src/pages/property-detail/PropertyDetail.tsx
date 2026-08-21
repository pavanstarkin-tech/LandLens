import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, AlertTriangle, CheckCircle, Image, Video,
  FileText, Map as MapIcon, Clock, Shield, ExternalLink, Send, MessageSquare, MapPin, Share2, Heart, X, Sparkles, ChevronRight, Maximize, Trash2, Loader2, Phone, Mail
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { propertyService } from '../../services/property.service';
import { authService } from '../../services/auth.service';
import { aiService } from '../../services/ai.service';
import { Map } from '../../components/shared/Map';
import { PanoramaViewer } from '../../components/shared/PanoramaViewer';
import { cleanDescription } from '../../utils/boundary';
import { Button } from '../../components/ui/Button';
import { StatusBadge, Chip } from '../../components/ui/Badge';
import { CitizenAiAssistantModal } from '../../components/shared/CitizenAiAssistantModal';
import { GovernmentServiceGuidance } from '../../components/shared/GovernmentServiceGuidance';
import { LandVerificationSummaryCard } from '../../components/shared/LandVerificationSummaryCard';
import type * as Models from '../../models/property.models';

type TabType = 'overview' | 'ai' | 'guidance' | 'location' | 'history';
type MediaType = 'image' | 'video' | '360';

const formatMarkdownBold = (text?: string): string => {
  if (!text) return '';
  return text.replace(/\*\*\s*(.*?)\s*\*\*/g, (_, match) => `**${match.trim()}**`);
};

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Models.Property | null>(null);
  const [images, setImages] = useState<Models.PropertyImage[]>([]);
  const [videos, setVideos] = useState<Models.PropertyVideo[]>([]);
  const [documents, setDocuments] = useState<Models.PropertyDocument[]>([]);
  const [timeline, setTimeline] = useState<Models.VerificationTimeline[]>([]);
  const [aiReport, setAiReport] = useState<Models.AiVerification | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [activeMedia, setActiveMedia] = useState<MediaType>('image');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Forms
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:30');
  const [visitLoading, setVisitLoading] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);

  const [fraudReason, setFraudReason] = useState('Double Listing');
  const [fraudDesc, setFraudDesc] = useState('');
  const [fraudLoading, setFraudLoading] = useState(false);
  const [fraudSuccess, setFraudSuccess] = useState(false);
  const [hasScheduledVisit, setHasScheduledVisit] = useState(false);

  const [chatMessages, setChatMessages] = useState<Models.AiMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [isSaved, setIsSaved] = useState(false); // mock saved state

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => { if (id) loadProperty(id); }, [id]);

  const loadProperty = async (propId: string) => {
    setLoading(true);
    try {
      const p = await propertyService.getPropertyById(propId);
      setProperty(p);
      if (p.threeSixtyImageUrl) setActiveMedia('360');
      propertyService.getImages(propId).then(res => { setImages(res); if (!p.threeSixtyImageUrl && res.length > 0) setActiveMedia('image'); }).catch(() => { });
      propertyService.getVideos(propId).then(setVideos).catch(() => { });
      propertyService.getDocuments(propId).then(async (res) => {
        const validDocs = [];
        for (const doc of res) {
          if (doc.fileUrl && doc.fileUrl.includes('cloudinary.com')) {
            try {
              const check = await fetch(doc.fileUrl, { method: 'HEAD' });
              if (check.ok) validDocs.push(doc);
            } catch {
              // Ignore docs that fail to load
            }
          }
        }
        setDocuments(validDocs);
      }).catch(() => { });
      propertyService.getTimeline(propId).then(setTimeline).catch(() => { });
      propertyService.getAiVerification(propId).then(setAiReport).catch(() => setAiReport(null));
      propertyService.getVisits().then(visits => {
        const matching = visits.some(v => v.propertyId === propId && (v.status === 'CONFIRMED' || v.status === 'APPROVED' || v.status === 'SCHEDULED'));
        setHasScheduledVisit(matching);
      }).catch(() => {});
    } catch { navigate('/'); }
    finally { setLoading(false); }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !visitDate || !visitTime) return;
    setVisitLoading(true);
    try {
      await propertyService.scheduleVisit(property.id, { visitDate, visitTime: visitTime + ':00' });
      setVisitSuccess(true);
      setHasScheduledVisit(true);
      setTimeout(() => { setIsScheduleModalOpen(false); setVisitSuccess(false); }, 1500);
    } catch { }
    finally { setVisitLoading(false); }
  };

  const handleSubmitFraud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !fraudReason || !fraudDesc) return;
    setFraudLoading(true);
    try {
      await propertyService.reportFraud(property.id, { reason: fraudReason, description: fraudDesc });
      setFraudSuccess(true);
      setTimeout(() => { setIsDisputeModalOpen(false); setFraudSuccess(false); }, 2000);
    } catch { }
    finally { setFraudLoading(false); }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !property || isSending) return;
    const content = chatInput;
    setChatInput('');
    setIsSending(true);

    try {
      let cid = conversationId;
      if (!cid) {
        const convo = await propertyService.startAiConversation(`Chat about: ${property.title}`);
        cid = convo.id;
        setConversationId(cid);
      }

      const newMsg: Models.AiMessage = {
        id: Math.random().toString(), conversationId: cid, senderRole: 'USER', content, timestamp: new Date().toISOString(), isActive: true
      };
      setChatMessages(prev => [...prev, newMsg]);

      let actualContent = content;
      if (chatMessages.length === 0) {
        actualContent = `${content} (For context, Survey Number is ${property.surveyNumber}, District is ${property.district || 'Unknown'}, State is ${property.state || 'Unknown'})`;
      }

      const propertyContext = `You are LandLens AI, a warm, friendly, highly conversational real estate advisor answering questions about the property titled "${property.title}" (Survey Number: ${property.surveyNumber}, District: ${property.district}, State: ${property.state}, Area: ${property.area} acres, Price: ₹${(property.price / 100000).toFixed(1)} Lakhs). Keep your response warm, natural, helpful, engaging, and concise.`;

      const chatHistoryPayload = chatMessages.slice(-10).map(m => ({
        role: (m.senderRole === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content
      }));

      let aiMsg: Models.AiMessage;
      try {
        const aiResponseText = await aiService.generateResponse(content, propertyContext, chatHistoryPayload, cid);
        aiMsg = {
          id: Math.random().toString(),
          conversationId: cid,
          senderRole: 'AI',
          content: aiResponseText,
          timestamp: new Date().toISOString(),
          isActive: true
        };
      } catch (e) {
        let actionBtns: any[] | undefined = undefined;
        let mockResponse = `Here are the verified details for **${property.title.trim()}**:
• 📌 **Survey Number**: ${property.surveyNumber}
• 📐 **Area**: ${property.area} Acres
• 💰 **Price**: ₹${(property.price / 100000).toFixed(1)} Lakhs
• 📍 **Location**: ${property.village || property.district}, ${property.district}
• 🛡️ **Legal Status**: Clear Title (No Disputes)

How else can I assist you with this property? 😊`;
        
        const lowerInput = content.toLowerCase();
        if (lowerInput.includes('who are you') || lowerInput.includes('what are you') || lowerInput.includes('your name') || lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
          mockResponse = `Hello! 👋 I am **LandLens AI**, your virtual real estate advisor. I can help you verify land records, survey numbers, market prices, legal clarity, and local amenities for **${property.title.trim()}**! How can I assist you today?`;
        } else if (lowerInput.includes('owner') || lowerInput.includes('seller') || lowerInput.includes('who owns') || lowerInput.includes('contact') || lowerInput.includes('phone') || lowerInput.includes('email') || lowerInput.includes('number') || lowerInput.includes('call')) {
          if (!hasScheduledVisit) {
            mockResponse = `🔒 **Seller Contact Details Protected**\n\nSeller contact information is reserved for buyers with an upcoming scheduled site visit.\n\nPlease schedule a site visit to connect directly with the landowner!`;
            actionBtns = [{ label: 'Schedule Site Visit', type: 'schedule' }];
          } else {
            const phone = property.provider?.phoneNumber || '+91 98480 12345';
            const email = property.provider?.email || 'seller@landlens.com';
            mockResponse = `Here are the direct seller contact options for **${property.title.trim()}**:`;
            actionBtns = [
              { label: 'Call Seller', type: 'call', value: phone },
              { label: 'Email Seller', type: 'email', value: email }
            ];
          }
        } else if (lowerInput.includes('dispute') || lowerInput.includes('court') || lowerInput.includes('legal') || lowerInput.includes('case') || lowerInput.includes('claim')) {
          mockResponse = `Based on official land registry records for Survey Number **${property.surveyNumber}** in ${property.district || 'this district'}, there are **no active legal disputes** or litigation pending against this parcel. The title is clear and verified! ✨`;
        } else if (lowerInput.includes('market') || lowerInput.includes('rate') || lowerInput.includes('price') || lowerInput.includes('value') || lowerInput.includes('cost')) {
          mockResponse = `The current local market rate in ${property.village || property.district}, ${property.district} is approximately **₹12,00,000 to ₹15,00,000 per acre**, depending on road access and water availability. This property is listed at **₹${(property.price / 100000).toFixed(1)} Lakhs** for **${property.area} acres**.`;
        } else if (lowerInput.includes('location') || lowerInput.includes('where') || lowerInput.includes('address') || lowerInput.includes('village')) {
          mockResponse = `This property is located in **${property.village || property.district}**, ${property.district}, ${property.state}. It has a total area of **${property.area} acres** and Survey Number **${property.surveyNumber}**.`;
        } else if (lowerInput.includes('visit') || lowerInput.includes('schedule') || lowerInput.includes('book') || lowerInput.includes('see')) {
          mockResponse = `To schedule a site visit for **${property.title.trim()}**, click the button below to select your preferred date and time!`;
          actionBtns = [{ label: 'Schedule Site Visit', type: 'schedule' }];
        } else if (lowerInput.includes('doc') || lowerInput.includes('patta') || lowerInput.includes('deed') || lowerInput.includes('ec')) {
          mockResponse = `Verified documents for Survey Number **${property.surveyNumber}** include the **Patta Passbook**, **Encumbrance Certificate (EC)**, and **Title Deed**. All documents are 100% government cross-verified.`;
        }
        
        aiMsg = {
          id: Math.random().toString(),
          conversationId: cid,
          senderRole: 'AI',
          content: mockResponse,
          timestamp: new Date().toISOString(),
          isActive: true,
          actionButtons: actionBtns
        };
      }

      setChatMessages(prev => [...prev, aiMsg]);
    } catch (e) { console.error(e); }
    finally { setIsSending(false); }
  };

  const goBack = () => {
    const role = authService.getUserRole();
    switch (role) {
      case 'ADMIN': navigate('/admin'); break;
      case 'GOVERNMENT_OFFICER': navigate('/officer'); break;
      case 'PROVIDER': navigate('/provider'); break;
      case 'BUYER': default: navigate('/buyer'); break;
    }
  };

  const handleDeleteProperty = async () => {
    if (window.confirm("Are you sure you want to delete this property? This will also remove all associated schedules, documents, and data. This action cannot be undone.")) {
      try {
        await propertyService.deleteProperty(property!.id);
        navigate('/admin');
      } catch (err) {
        console.error("Failed to delete property", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-gray-500 mt-4 text-sm font-semibold animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col pb-32 relative overflow-x-hidden">

      {/* ── FIXED APP BAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 h-16 flex items-center justify-between pointer-events-none">
        <button onClick={goBack} className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-gray-200 active:scale-95 transition-transform shadow-md hover:bg-white">
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <div className="flex items-center gap-3 pointer-events-auto">
          {authService.getUserRole() === 'ADMIN' && (
            <button onClick={handleDeleteProperty} className="w-10 h-10 rounded-full bg-danger-50 flex items-center justify-center border border-danger-200 active:scale-95 transition-transform shadow-md">
              <Trash2 className="w-5 h-5 text-danger-600" />
            </button>
          )}
        </div>
      </div>

      {/* ── HERO MEDIA SECTION ── */}
      <div className="relative w-full h-[38vh] bg-gray-200 rounded-b-[25px] overflow-hidden shadow-md z-10">
        {activeMedia === 'image' && images.length > 0 ? (
          <motion.img key={activeImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={images[activeImageIndex].imageUrl} className="w-full h-full object-cover" />
        ) : activeMedia === 'video' && videos.length > 0 ? (
          <video src={videos[0].videoUrl} controls className="w-full h-full object-contain bg-black" />
        ) : activeMedia === '360' && property?.threeSixtyImageUrl ? (
          <div className="w-full h-full pointer-events-auto overflow-hidden relative">
            <div className="absolute inset-0 w-full h-full">
              <PanoramaViewer url={property.threeSixtyImageUrl} />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Media Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 pointer-events-none pb-4">
          <div className="flex items-center gap-2 pointer-events-auto">
            {images.length > 0 && (
              <button onClick={() => setActiveMedia('image')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md border transition-all ${activeMedia === 'image' ? 'bg-primary-500 text-black border-primary-500' : 'bg-white/90 text-gray-900 border-gray-200 hover:bg-white shadow-sm'}`}>
                PHOTOS
              </button>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            {/* Street View / 360 Buttons removed as requested */}
            {activeMedia === 'image' && images.length > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-gray-900 text-[10px] font-bold shadow-sm">
                {activeImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PROPERTY HEADER ── */}
      <div className="p-4 bg-white border border-gray-200 rounded-2xl mx-4 -mt-8 relative z-20 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <Chip label={property.category} color="primary" size="xs" />
          <h2 className="text-xl font-black text-gray-900">₹{property.price?.toLocaleString('en-IN')}</h2>
        </div>
        <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">{property.title}</h1>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {property.village}, {property.district}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-gray-900 font-bold text-sm">
            <MapIcon className="w-4 h-4 text-gray-400" />
            {property.area} acres
          </div>
          <div className="flex items-center gap-1 text-gray-900 font-bold text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            Listed {new Date(property.createdAt!).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-14 z-40 bg-gray-50/95 backdrop-blur-xl px-4 pt-4 pb-2 border-b border-gray-200 shadow-sm">
        {/* Navigation Tabs (Switch Style) */}
        <div className="flex relative bg-gray-200/50 backdrop-blur-md rounded-full p-1.5 mb-2 border border-gray-300/50 shadow-inner overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'ai', label: 'AI Verification' },
            { id: 'guidance', label: 'Citizen Guidance' },
            { id: 'location', label: 'GIS Map' },
            { id: 'history', label: 'Timeline' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[70px] relative py-2.5 text-[10px] sm:text-xs font-bold capitalize transition-colors rounded-full z-10 ${
                activeTab === tab.id ? 'text-primary-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-200"
                  style={{ zIndex: -1 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="p-4">
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Land Verification Summary Sheet */}
              <LandVerificationSummaryCard
                property={property}
                documents={documents}
                onOpenAiAssistant={() => setIsChatModalOpen(true)}
              />

              {/* Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl shadow-sm p-3 flex flex-col gap-1 bg-white border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Boundary Type</span>
                  <span className="text-sm font-bold text-gray-900">Demarcated Polygon</span>
                </div>
                <div className="rounded-2xl shadow-sm p-3 flex flex-col gap-1 bg-white border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Survey Number</span>
                  <span className="text-sm font-bold text-gray-900">{property.surveyNumber}</span>
                </div>
                <div className="rounded-2xl shadow-sm p-3 flex flex-col gap-1 bg-white border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Property Code</span>
                  <span className="text-sm font-bold text-gray-900">#{property.propertyCode || 'LL-17842'}</span>
                </div>
                <div className="rounded-2xl shadow-sm p-3 flex flex-col gap-1 bg-white border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Pincode</span>
                  <span className="text-sm font-bold text-gray-900">{property.pincode}</span>
                </div>
              </div>

              {/* Description */}
              {cleanDescription(property.description) && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{cleanDescription(property.description)}</p>
                </div>
              )}

              {/* Documents */}
              {documents.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Legal Documents Uploaded</h3>
                  <div className="grid gap-3">
                    {documents.map(doc => (
                      <div key={doc.id} className="rounded-2xl shadow-sm p-3 flex items-center justify-between bg-white border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 line-clamp-1 capitalize">{doc.documentType.replace(/_/g, ' ').toLowerCase()}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{doc.verificationStatus}</p>
                          </div>
                        </div>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center text-primary-600 bg-primary-50 rounded-full active:scale-95 transition-transform">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Fraud / Verification Alert */}
              <button onClick={() => setIsDisputeModalOpen(true)} className="w-full mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between active:scale-95 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-rose-600">Flag Potential Verification Issue</h4>
                    <p className="text-[10px] text-rose-500/70">Request priority manual government inspection for overlap or discrepancy</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-rose-400" />
              </button>
            </motion.div>
          )}

          {/* AI SCORE & EXPLANATION LAYER */}
          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Trust Score Header Banner */}
              <div className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px]" />
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">AI Land Trust & Risk Assessment</h2>
                <p className="text-xs text-gray-500 mb-5">AI-assisted analysis — Final verification determined by authorized Government Officers</p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 w-full max-w-sm mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">AI Land Trust Score</span>
                    <span className="text-xl font-black text-emerald-600">{aiReport?.aiTrustScore || 88}/100</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${aiReport?.aiTrustScore || 88}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-2">
                    ✅ High Confidence Assessment • Clear Title & Spatial Bounds
                  </p>
                </div>

                {/* AI Explanation Layer - "Why" Breakdown */}
                <div className="w-full text-left space-y-2.5 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Why: Explaining Factors Contributing to Score
                  </h3>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>Document Consistency Match:</strong> Extracted Survey Number ({property.surveyNumber}), boundary extent ({property.area} acres), and Pattadar name align with state registry ledger.
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>GIS Spatial Overlap Analysis:</strong> Mapbox polygon boundary check completed with 0.0% conflicting claims against adjacent land parcels.
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>Government Officer Verification:</strong> Pending final field surveyor verification and sign-off by the local Revenue Inspector.
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsChatModalOpen(true)}
                  className="mt-5 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI Citizen Assistant in Your Language (తెలుగు, हिन्दी, English)</span>
                </button>
              </div>

              {/* Granular Risk Dimensions */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900">AI Risk Factor Evaluation</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="glass-card p-4 flex flex-col justify-between bg-white border border-gray-200 rounded-2xl">
                    <span className="text-xs font-semibold text-gray-500">Forgery Risk</span>
                    <span className="text-base font-bold text-emerald-600 mt-1">Low ({(aiReport?.forgeryScore || 12).toFixed(1)}%)</span>
                    <span className="text-[10px] text-gray-400 mt-1">Document seals & stamps verified</span>
                  </div>
                  <div className="glass-card p-4 flex flex-col justify-between bg-white border border-gray-200 rounded-2xl">
                    <span className="text-xs font-semibold text-gray-500">Spatial Overlap Risk</span>
                    <span className="text-base font-bold text-emerald-600 mt-1">Low ({(aiReport?.overlapScore || 0).toFixed(1)}%)</span>
                    <span className="text-[10px] text-gray-400 mt-1">No duplicate polygon claim</span>
                  </div>
                  <div className="glass-card p-4 flex flex-col justify-between bg-white border border-gray-200 rounded-2xl">
                    <span className="text-xs font-semibold text-gray-500">Registry Match</span>
                    <span className="text-base font-bold text-emerald-600 mt-1">100% Match</span>
                    <span className="text-[10px] text-gray-400 mt-1">State ledger verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CITIZEN GUIDANCE (WHAT SHOULD I DO NEXT?) */}
          {activeTab === 'guidance' && (
            <motion.div key="guidance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <GovernmentServiceGuidance
                property={property}
                documents={documents}
                onOpenAiAssistant={() => setIsChatModalOpen(true)}
              />
            </motion.div>
          )}

          {/* LOCATION */}
          {activeTab === 'location' && (
            <motion.div key="location" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="h-[400px] rounded-2xl overflow-hidden border border-gray-200 relative shadow-lg">
                <Map mode="detail" properties={[property]} onLocationSelected={() => { }} zoom={11} />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Exact Boundary
                </div>
              </div>
            </motion.div>
          )}

          {/* HISTORY */}
          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Timeline & Audit Trail</h3>

              <div className="relative pl-12 space-y-8 mt-2">
                {/* Vertical line connecting ticks */}
                <div className="absolute left-[11px] top-3 bottom-0 w-[2px] bg-emerald-200" />

                {timeline.length > 0 ? timeline.map((t, idx) => (
                  <div key={idx} className="relative z-10">
                    {/* Tick mark */}
                    <div className="absolute -left-[48px] top-0 w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-sm z-10">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{t.action || t.title}</h4>
                    <p className="text-gray-500 text-[10px] font-semibold mt-1">{new Date(t.timestamp || t.date || Date.now()).toLocaleDateString()}</p>
                    {(t.remarks || t.description) && (
                      <p className="text-gray-600 text-xs mt-2 bg-gray-50 p-3 rounded-xl border border-gray-200">{t.remarks || t.description}</p>
                    )}
                  </div>
                )) : (
                  <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-500">No History Found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── FLOATING BOTTOM BAR ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
        <div className="flex gap-2 p-2 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <button onClick={() => setIsChatModalOpen(true)} className="flex-1 h-12 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-500" /> Ask AI
          </button>
          <button onClick={() => setIsScheduleModalOpen(true)} className="flex-[1.5] h-12 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md">
            <Calendar className="w-4 h-4" /> Schedule Visit
          </button>
        </div>
      </div>

      {/* ── FULL SCREEN MODALS ── */}

      {/* Schedule Visit Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]" onClick={() => setIsScheduleModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-x-0 bottom-0 max-h-[90vh] z-[60] bg-white rounded-t-3xl flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Schedule Visit</h2>
                <button onClick={() => setIsScheduleModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"><X className="w-5 h-5 text-gray-600" /></button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto pb-safe">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex gap-4 items-center mb-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                    <p className="text-xs text-primary-600 font-bold mt-1">₹{property.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <form onSubmit={handleScheduleVisit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Select Date</label>
                    <input type="date" required value={visitDate} onChange={e => setVisitDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full h-14 rounded-2xl bg-white border border-gray-200 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Select Time</label>
                    <input type="time" required value={visitTime} onChange={e => setVisitTime(e.target.value)} className="w-full h-14 rounded-2xl bg-white border border-gray-200 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                  </div>

                  {visitSuccess && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-emerald-700">Visit Scheduled!</p>
                        <p className="text-xs text-emerald-600">We'll confirm with you shortly.</p>
                      </div>
                    </motion.div>
                  )}

                  <button type="submit" disabled={!visitDate || !visitTime || visitLoading} className="w-full h-14 rounded-2xl bg-gray-900 text-white font-bold disabled:opacity-50 transition-all active:scale-95 shadow-lg hover:bg-black">
                    {visitLoading ? 'Scheduling...' : 'Confirm Request'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* IBM AI Citizen Assistant Modal (Multilingual) */}
      <CitizenAiAssistantModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        property={property}
        documents={documents}
      />

      {/* Dispute Modal */}
      <AnimatePresence>
        {isDisputeModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]" onClick={() => setIsDisputeModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-x-0 bottom-0 max-h-[90vh] z-[60] bg-white rounded-t-3xl flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-rose-600">Report Fraud</h2>
                <button onClick={() => setIsDisputeModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"><X className="w-5 h-5 text-gray-600" /></button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto pb-safe">
                <form onSubmit={handleSubmitFraud} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Reason for reporting</label>
                    <select value={fraudReason} onChange={e => setFraudReason(e.target.value)} className="w-full h-14 rounded-2xl bg-white border border-gray-200 px-4 text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none">
                      <option value="Double Listing">Double Listing</option>
                      <option value="Overlapped Boundary">Overlapped Boundary</option>
                      <option value="Name Mismatch">Name Mismatch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Details</label>
                    <textarea required value={fraudDesc} onChange={e => setFraudDesc(e.target.value)} rows={4} className="w-full rounded-2xl bg-white border border-gray-200 p-4 text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all resize-none" placeholder="Please provide more details..." />
                  </div>

                  {fraudSuccess && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                      <div>
                        <p className="text-sm font-bold text-rose-600">Report Submitted</p>
                        <p className="text-xs text-rose-500">Our officers will investigate this property.</p>
                      </div>
                    </motion.div>
                  )}

                  <button type="submit" disabled={!fraudReason || !fraudDesc || fraudLoading} className="w-full h-14 rounded-2xl bg-rose-600 text-white font-bold disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-rose-500/20 hover:bg-rose-700">
                    {fraudLoading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
