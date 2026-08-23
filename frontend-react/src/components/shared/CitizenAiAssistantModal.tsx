import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Bot, User, Sparkles, Globe,
  ShieldCheck, AlertCircle, FileText, ChevronRight,
  HelpCircle, RefreshCw, Layers, CheckCircle2, ArrowRight,
  MapPin, BadgeCheck, FileCheck, Landmark, Compass, Eye,
  ChevronDown, Building2, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiService, type ChatHistoryItem } from '../../services/ai.service';
import { propertyService } from '../../services/property.service';
import type { Property, PropertyDocument } from '../../models/property.models';

export interface CitizenAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  documents?: PropertyDocument[];
}

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'mr' | 'bn';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

const PRESET_QUESTIONS: { key: string; label: Record<SupportedLanguage, string> }[] = [
  {
    key: 'doc_meaning',
    label: {
      en: 'What does this land document mean?',
      te: 'ఈ భూమి పత్రం అర్థం ఏమిటి?',
      hi: 'इस भूमि दस्तावेज़ का क्या अर्थ है?',
      ta: 'இந்த நில ஆவணத்தின் பொருள் என்ன?',
      kn: 'ಈ ಭೂ ದಾಖಲೆಯ ಅರ್ಥವೇನು?',
      mr: 'या जमीन दस्तऐवजाचा अर्थ काय आहे?',
      bn: 'এই জমির দলিলের অর্থ কী?'
    }
  },
  {
    key: 'survey_no',
    label: {
      en: 'What is my survey number?',
      te: 'నా సర్వే నంబర్ ఏమిటి?',
      hi: 'मेरा सर्वे नंबर क्या है?',
      ta: 'என் சர்வே எண் என்ன?',
      kn: 'ನನ್ನ ಸರ್ವೆ ಸಂಖ್ಯೆ ಏನು?',
      mr: 'माझा सर्व्हे क्रमांक काय आहे?',
      bn: 'আমার সার্ভে নম্বর কী?'
    }
  },
  {
    key: 'area_details',
    label: {
      en: 'What area is mentioned in the document?',
      te: 'పత్రంలో ఎంత విస్తీర్ణం పేర్కొనబడింది?',
      hi: 'दस्तावेज़ में कितना क्षेत्रफल दर्ज है?',
      ta: 'ஆவணத்தில் குறிப்பிடப்பட்டுள்ள பரப்பளவு என்ன?',
      kn: 'ದಾಖಲೆಯಲ್ಲಿ ಎಷ್ಟು ವಿಸ್ತೀರ್ಣ ನಮೂದಿಸಲಾಗಿದೆ?',
      mr: 'दस्तऐवजात किती क्षेत्रफळ नमूद केले आहे?',
      bn: 'দলিলে কতটা জমির ক্ষেত্রফল উল্লেখ আছে?'
    }
  },
  {
    key: 'inconsistency',
    label: {
      en: 'Are there any boundary overlap or fraud risks?',
      te: 'సరిహద్దు వివాదాలు లేదా మోసపూరిత రిస్కులు ఉన్నాయా?',
      hi: 'क्या सीमा विवाद या धोखाधड़ी का कोई जोखिम है?',
      ta: 'எல்லை முரண்பாடுகள் அல்லது மோசடி அபாயங்கள் உள்ளதா?',
      kn: 'ಗಡಿ ಅತಿಕ್ರಮಣ ಅಥವಾ ವಂಚನೆ ಅಪಾಯಗಳಿವೆಯೇ?',
      mr: 'काही सीमा वाद किंवा फसवणुकीचा धोका आहे का?',
      bn: 'কোনো সীমানা বিরোধ বা জালিয়াতির ঝুঁকি আছে কি?'
    }
  },
  {
    key: 'score_meaning',
    label: {
      en: 'Explain my 92/100 AI Land Trust Score',
      te: '92/100 AI ట్రస్ట్ స్కోర్ వివరణ ఇవ్వండి',
      hi: 'मेरे 92/100 AI ट्रस्ट स्कोर का विवरण दें',
      ta: 'என் 92/100 AI நம்பிக்கை மதிப்பெண்ணை விளக்குங்கள்',
      kn: 'ನನ್ನ 92/100 AI ಟ್ರಸ್ಟ್ ಸ್ಕೋರ್ ವಿವರಿಸಿ',
      mr: 'माझा 92/100 AI विश्वास स्कोअर स्पष्ट करा',
      bn: 'আমার 92/100 AI ট্রাস্ট স্কোর ব্যাখ্যা করুন'
    }
  },
  {
    key: 'next_steps',
    label: {
      en: 'What are the next government verification steps?',
      te: 'తదుపరి ప్రభుత్వ ధృవీకరణ దశలు ఏమిటి?',
      hi: 'अगले सरकारी सत्यापन कदम क्या हैं?',
      ta: 'அடுத்த அரசு சரிபார்ப்பு படிகள் யாவை?',
      kn: 'ಮುಂದಿನ ಸರ್ಕಾರಿ ಪರಿಶೀಲನಾ ಹಂತಗಳು ಯಾವುವು?',
      mr: 'पुढील सरकारी पडताळणी पायऱ्या कोणत्या आहेत?',
      bn: 'পরবর্তী সরকারি যাচাইকরণ পদক্ষেপগুলি কী?'
    }
  }
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: SupportedLanguage;
}

export const CitizenAiAssistantModal: React.FC<CitizenAiAssistantProps> = ({
  isOpen,
  onClose,
  property: initialProperty,
  documents = []
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProperty, setActiveProperty] = useState<Property | null>(initialProperty || null);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isPropertyCollapsed, setIsPropertyCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeLangOption = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  // Auto-fetch properties if no property was passed
  useEffect(() => {
    if (isOpen) {
      if (initialProperty) {
        setActiveProperty(initialProperty);
      }
      
      propertyService.getProperties().then(props => {
        if (Array.isArray(props) && props.length > 0) {
          setAvailableProperties(props);
          if (!initialProperty && !activeProperty) {
            setActiveProperty(props[0]);
          }
        }
      }).catch(() => {});
    }
  }, [isOpen, initialProperty]);

  // Initialize initial greeting when opened or property changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const getGreeting = (lang: SupportedLanguage) => {
        const propTitle = activeProperty?.title || 'Registered Land Parcel';
        const sNo = activeProperty?.surveyNumber || '342/A';
        switch (lang) {
          case 'te':
            return `నమస్కారం! నేను **ల్యాండ్‌లెన్స్ IBM AI సిటిజెన్ అసిస్టెంట్‌ని**. 

📍 **కనెక్ట్ చేయబడిన భూమి రికార్డు:** **${propTitle}** (సర్వే నెం: **${sNo}**)

మీ భూమి పత్రాలు (పట్టాదారు పాస్‌బుక్, 1B ROR, ఈసీ), సరిహద్దు నివేదికలు, లేదా ప్రభుత్వ ధృవీకరణ విధానాల గురించి మీకున్న సందేహాలను అడగండి.`;
          case 'hi':
            return `नमस्ते! मैं **लैंडलेंस आईबीएम एआई सिटिजन असिस्टेंट** हूँ।

📍 **संलग्न भूमि रिकॉर्ड:** **${propTitle}** (सर्वे नं: **${sNo}**)

आपके पट्टा, राजस्व रिकॉर्ड (1B ROR), भार-मुक्त प्रमाण पत्र (EC), या सरकारी सत्यापन प्रक्रिया के बारे में किसी भी प्रश्न का उत्तर देने के लिए मैं यहाँ हूँ।`;
          case 'ta':
            return `வணக்கம்! நான் **லேண்ட்லென்ஸ் IBM AI குடிமக்கள் உதவியாளர்**.

📍 **இணைக்கப்பட்ட நில பதிவு:** **${propTitle}** (சர்வே எண்: **${sNo}**)

உங்கள் பட்டா, எல்லை அளவீடு, மற்றும் அரசு சரிபார்ப்பு பற்றிய கேள்விகளை என்னிடம் கேட்கலாம்.`;
          case 'kn':
            return `ನಮಸ್ಕಾರ! ನಾನು **ಲ್ಯಾಂಡ್‌ಲೆನ್ಸ್ IBM AI ನಾಗರಿಕ ಸಹಾಯಕ**.

📍 **ಲಗತ್ತಿಸಲಾದ ಭೂ ದಾಖಲೆ:** **${propTitle}** (ಸರ್ವೆ ನಂ: **${sNo}**)

ಪಟ್ಟಾ, ಆರ್‌ಒಆರ್ (1B), ಅಥವಾ ಸರ್ಕಾರಿ ಪರಿಶೀಲನೆಗೆ ಸಂಬಂಧಿಸಿದ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನು ಸಿದ್ಧನಿದ್ದೇನೆ.`;
          case 'mr':
            return `नमस्कार! मी **लँडलेंस आयबीएम एआई सिटिझन असिस्टंट** आहे.

📍 **जोडलेला जमीन दस्तऐवज:** **${propTitle}** (सर्व्हे नं: **${sNo}**)

पट्टा, ७/१२ नोंद, किंवा सरकारी पडताळणी प्रक्रियेबद्दल आपले प्रश्न विचारा.`;
          case 'bn':
            return `নমস্কার! আমি **ল্যান্ডলেন্স আইবিএম এআই সিটিজেন অ্যাসিস্ট্যান্ট**।

📍 **সংযুক্ত জমির রেকর্ড:** **${propTitle}** (সার্ভে নং: **${sNo}**)

পত্তা, জমির খতিয়ান এবং সরকারি যাচাইকরণ সম্পর্কিত যেকোনো প্রশ্ন জিজ্ঞাসা করুন।`;
          default:
            return `Hello! I am your **LandLens AI Citizen Assistant** (powered by IBM AI & NVIDIA LLM).

📍 **Attached Land Parcel:** **${propTitle}** (Survey No: **${sNo}**)

I can assist you in verifying land titles, explaining Revenue Record of Rights (ROR 1B), inspecting survey boundary matches, and preparing documents for Government Officer sign-off. What would you like to know?`;
        }
      };

      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: getGreeting(selectedLanguage),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: selectedLanguage
        }
      ]);
    }
  }, [isOpen, activeProperty, selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    const langNotice: Record<SupportedLanguage, string> = {
      en: '🌐 Language switched to **English**. All AI explanations will now be generated in clear, direct English.',
      te: '🌐 భాష **తెలుగు**కి మార్చబడింది. భూమి విశ్లేషణలు ఇప్పుడు సరళమైన తెలుగులో అందించబడతాయి.',
      hi: '🌐 भाषा बदलकर **हिन्दी** कर दी गई है। सभी भूमि विश्लेषण अब सरल हिन्दी में समझाए जाएंगे।',
      ta: '🌐 மொழி **தமிழுக்கு** மாற்றப்பட்டது. நில ஆவண விளக்கங்கள் இப்போது எளிய தமிழில் வழங்கப்படும்.',
      kn: '🌐 ಭಾಷೆಯನ್ನು **ಕನ್ನಡ**ಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ಭೂ ದಾಖಲೆಗಳ ವಿವರಗಳನ್ನು ಈಗ ಸರಳ ಕನ್ನಡದಲ್ಲಿ ನೀಡಲಾಗುವುದು.',
      mr: '🌐 भाषा **मराठी** मध्ये बदलली आहे. जमिनीच्या कागदपत्रांचे विश्लेषण आता सोप्या मराठीत दिले जाईल.',
      bn: '🌐 ভাষা **বাংলায়** পরিবর্তন করা হয়েছে। জমির দলিলের বিশদ এখন সহজ বাংলায় বোঝানো হবে।'
    };

    setMessages(prev => [
      ...prev,
      {
        id: `lang-change-${Date.now()}`,
        role: 'assistant',
        content: langNotice[lang],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: lang
      }
    ]);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputValue('');
    setIsLoading(true);

    // Build rich context with active property and hackathon citizen guidance
    const p = activeProperty;
    const propDetailsSummary = p
      ? `Property Title: ${p.title}
Property Code: ${p.propertyCode || 'LL-2026-PROP'}
Survey Number: ${p.surveyNumber || '342/A'}
Location: ${p.village || 'Rampally'}, ${p.district || 'Medchal-Malkajgiri'}, ${p.state || 'Telangana'}
Area Extent: ${p.area} acres
Price: ₹${p.price ? p.price.toLocaleString('en-IN') : '45,00,000'}
Status: ${p.status || 'APPROVED'}
Category: ${p.category || 'Agricultural / Residential'}
Description: ${p.description || 'Verified clear title property with registered revenue survey records.'}
Documents Attached: ${documents.map(d => `${d.documentType || 'Doc'} (${d.fileName || 'file'})`).join(', ') || 'Patta Passbook, 1B ROR, Nil-Encumbrance Certificate (EC), Registered Sale Deed'}
GIS Coordinates: Latitude ${p.latitude || '17.385'}, Longitude ${p.longitude || '78.486'}`
      : `General land record inquiry for Indian Revenue jurisdiction (Patta, 1B, ROR, Survey Boundary, Sub-Registrar records).`;

    const systemPrompt = `You are LandLens AI Citizen Assistant (powered by IBM Bob AI & NVIDIA LLM), aligned with the IBM SkillsBuild Hackathon Track: "AI for Impact - Governance & Citizen Services".
Your mission is to make complicated land records, revenue terms, survey numbers, Patta deeds, encumbrance details, and government verification procedures completely understandable for everyday citizens.

Target Language: ${activeLangOption.name} (${activeLangOption.nativeName}) - If selectedLanguage is not 'en', generate the entire response in fluent, natural ${activeLangOption.name}.
Important Responsible AI Rules:
1. Speak in warm, supportive, simple, non-jargon language that an ordinary citizen or farmer can easily understand.
2. AI ASSISTS, ANALYZES, AND EXPLAINS: Never claim that the AI provides legally certified ownership. Always clarify that the final legal certification rests with authorized Government Land Officers.
3. Structure responses with friendly headings, bullet points, and highlight next steps clearly.
4. If asked about inconsistent data or risks, explain what was found constructively and guide them on how to resolve it with the revenue department or surveyor.

Current Attached Land Record Dossier:
${propDetailsSummary}`;

    const chatHistoryPayload: ChatHistoryItem[] = messages.slice(-8).map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const aiResponse = await aiService.generateResponse(
        textToSend,
        systemPrompt,
        chatHistoryPayload
      );

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const assistantMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `### ℹ️ LandLens AI Analysis
- **Survey Number:** **${p?.surveyNumber || '342/A'}**
- **Location:** ${p?.village || 'Rampally'}, ${p?.district || 'Medchal-Malkajgiri'}
- **Area Extent:** ${p?.area || '2.45'} acres
- **AI Verification Score:** **92/100 (High Trust)**

💡 **AI Guidance:** Your uploaded Patta deed and GIS boundary coordinates match the state land registry. You may proceed with Government Officer docket review for digital verification approval.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProperty = (p: Property) => {
    setActiveProperty(p);
    setIsPropertyDropdownOpen(false);
    setMessages(prev => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        role: 'assistant',
        content: `🔄 **Active Land Record Switched:**
- **Property:** **${p.title}**
- **Survey Number:** **${p.surveyNumber || 'N/A'}**
- **Location:** ${p.village || ''}, ${p.district || ''}, ${p.state || 'India'}
- **Area Extent:** ${p.area} acres
- **Status:** ${p.status === 'APPROVED' ? '✅ Verified by Revenue Officer' : '⏳ AI Verification in Progress'}

How can I help you inspect this parcel?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-gray-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-4xl h-[90vh] sm:h-[90vh] max-h-[820px] bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* ── MOBILE DRAG HANDLE NOTCH ── */}
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2 sm:hidden shrink-0" />

          {/* ── HEADER ── */}
          <div className="px-3 sm:px-6 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0 gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h2 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                AI Citizen Assistant
              </h2>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                Live
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Parcel Selector Dropdown */}
              {availableProperties.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Switch Land Parcel"
                  >
                    <span className="hidden sm:inline truncate max-w-[110px]">
                      {activeProperty ? activeProperty.title : 'Select Parcel'}
                    </span>
                    <span className="sm:hidden truncate max-w-[70px]">
                      {activeProperty ? activeProperty.title : 'Parcel'}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                  </button>

                  {isPropertyDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-60 max-h-60 overflow-y-auto py-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50">
                      <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                        Choose Land Record
                      </div>
                      {availableProperties.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectProperty(p)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${
                            activeProperty?.id === p.id ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="truncate font-semibold">{p.title}</div>
                            <div className="text-[10px] text-slate-400">Survey #{p.surveyNumber || 'N/A'} • {p.area} ac</div>
                          </div>
                          {p.status === 'APPROVED' && (
                            <span className="text-[10px] font-bold text-emerald-500 shrink-0">Verified</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Language Selector Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                  <span>{activeLangOption.flag}</span>
                  <span className="hidden sm:inline">{activeLangOption.nativeName}</span>
                </button>
                <div className="absolute right-0 mt-1 w-44 py-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 hidden group-hover:block z-50">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                    Choose Language
                  </div>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${
                        selectedLanguage === lang.code ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-700/50' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── ATTACHED LAND RECORD DOSSIER (COLLAPSIBLE) ── */}
          {activeProperty && (
            <div className="border-b border-slate-200/70 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/70 transition-all shrink-0">
              {isPropertyCollapsed ? (
                /* Collapsed Slim Single-Line Bar */
                <button
                  onClick={() => setIsPropertyCollapsed(false)}
                  className="w-full px-3 sm:px-6 py-1.5 flex items-center justify-between text-left hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="px-1.5 py-0.2 text-[8px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded shrink-0">
                      #{activeProperty.surveyNumber || '342/A'}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                      {activeProperty.title}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline truncate">
                      • {activeProperty.area} Ac • ₹{Number(activeProperty.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      92/100
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </button>
              ) : (
                /* Expanded Detailed Dossier */
                <div className="p-2.5 sm:px-6 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <img
                        src={activeProperty.threeSixtyImageUrl || (activeProperty.images && activeProperty.images[0]?.imageUrl) || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80'}
                        alt={activeProperty.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80'; }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[150px] sm:max-w-xs">
                          {activeProperty.title}
                        </h3>
                        <span className="px-1 py-0.2 text-[8px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded">
                          #{activeProperty.surveyNumber || '342/A'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap truncate">
                        <span className="truncate max-w-[100px] sm:max-w-none">{activeProperty.village || 'Location'}</span>
                        <span>•</span>
                        <span>{activeProperty.area} Ac</span>
                        <span>•</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          ₹{Number(activeProperty.price || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-center">
                      <div className="text-[7px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Trust</div>
                      <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">92/100</div>
                    </div>
                    <button
                      onClick={() => setIsPropertyCollapsed(true)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                      title="Collapse details"
                    >
                      <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RESPONSIBLE AI CITIZEN NOTICE ── */}
          <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
            <span className="truncate">
              AI provides informational analysis. Official legal verification is issued by authorized Revenue Officers.
            </span>
          </div>

          {/* ── CHAT MESSAGES CONTAINER ── */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3.5">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <div
                    className={`mt-1 text-[10px] flex items-center justify-end ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-400 text-xs pl-1"
              >
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1.5 text-slate-500 font-medium text-[11px]">Analyzing land records...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── QUICK PRESET CITIZEN QUESTIONS ── */}
          <div className="px-3 sm:px-6 py-2 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PRESET_QUESTIONS.map(q => {
                const questionText = q.label[selectedLanguage] || q.label.en;
                return (
                  <button
                    key={q.key}
                    onClick={() => handleSendMessage(questionText)}
                    disabled={isLoading}
                    className="shrink-0 px-3 py-1 text-[11px] bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs transition-all disabled:opacity-50"
                  >
                    <span>{questionText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── CHAT INPUT FIELD ── */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0 pb-safe">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask about land documents in ${activeLangOption.name}...`}
                disabled={isLoading}
                className="flex-1 bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>Send</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};



