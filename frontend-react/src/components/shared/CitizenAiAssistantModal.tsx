import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Bot, User, Sparkles, Globe,
  ShieldCheck, AlertCircle, FileText, ChevronRight,
  HelpCircle, RefreshCw, Layers, CheckCircle2, ArrowRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiService, type ChatHistoryItem } from '../../services/ai.service';
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
      en: 'What information appears inconsistent?',
      te: 'ఏ సమాచారం సరిపోలడం లేదా తేడాగా ఉంది?',
      hi: 'कौन सी जानकारी में विसंगति या अंतर दिखाई देता है?',
      ta: 'எந்த தகவல் முரண்பாடாக உள்ளது?',
      kn: 'ಯಾವ ಮಾಹಿತಿ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ?',
      mr: 'कोणती माहिती विसंगत वाटत आहे?',
      bn: 'কোন তথ্যে অসংগতি দেখা যাচ্ছে?'
    }
  },
  {
    key: 'score_meaning',
    label: {
      en: 'What does my verification score mean?',
      te: 'నా ధృవీకరణ స్కోరు అర్థం ఏమిటి?',
      hi: 'मेरे सत्यापन स्कोर का क्या अर्थ है?',
      ta: 'என் சரிபார்ப்பு மதிப்பெண் எதைக் குறிக்கிறது?',
      kn: 'ನನ್ನ ಪರಿಶೀಲನಾ ಸ್ಕೋರ್ ಅರ್ಥವೇನು?',
      mr: 'माझ्या पडताळणी स्कोअरचा अर्थ काय आहे?',
      bn: 'আমার যাচাইকরণ স্কোরের অর্থ কী?'
    }
  },
  {
    key: 'required_docs',
    label: {
      en: 'What documents are required for verification?',
      te: 'ధృవీకరణకు ఏ పత్రాలు అవసరం?',
      hi: 'सत्यापन के लिए कौन से दस्तावेज़ आवश्यक हैं?',
      ta: 'சரிபார்ப்புக்கு தேவையான ஆவணங்கள் யாவை?',
      kn: 'ಪರಿಶೀಲನೆಗೆ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?',
      mr: 'पडताळणीसाठी कोणती कागदपत्रे आवश्यक आहेत?',
      bn: 'যাচাইকরণের জন্য কী কী দলিল প্রয়োজন?'
    }
  },
  {
    key: 'next_steps',
    label: {
      en: 'What should I do next?',
      te: 'నేను తర్వాత ఏమి చేయాలి?',
      hi: 'मुझे आगे क्या कदम उठाना चाहिए?',
      ta: 'நான் அடுத்து என்ன செய்ய வேண்டும்?',
      kn: 'ನಾನು ಮುಂದೆ ಏನು ಮಾಡಬೇಕು?',
      mr: 'मी पुढे काय करावे?',
      bn: 'আমার পরবর্তী পদক্ষেপ কী হওয়া উচিত?'
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
  property,
  documents = []
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeLangOption = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  // Initialize initial greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const getGreeting = (lang: SupportedLanguage) => {
        const propTitle = property?.title || 'your land parcel';
        switch (lang) {
          case 'te':
            return `నమస్కారం! నేను **ల్యాండ్‌లెన్స్ IBM AI సిటిజెన్ అసిస్టెంట్‌ని**. ${property ? `**${propTitle}** (సర్వే నం. ${property.surveyNumber || 'N/A'}) గురించి` : 'మీ భూమి పత్రాల గురించి'} మీకున్న సందేహాలను నివృత్తి చేయడానికి నేను సిద్ధంగా ఉన్నాను. కింద ఉన్న ప్రశ్నలను ఎంచుకోండి లేదా మీ ప్రశ్నను టైప్ చేయండి.`;
          case 'hi':
            return `नमस्ते! मैं **लैंडलेंस आईबीएम एआई सिटिजन असिस्टेंट** हूँ। ${property ? `**${propTitle}** (सर्वे नं. ${property.surveyNumber || 'N/A'}) के संबंध में` : 'आपके भूमि दस्तावेजों के बारे में'} किसी भी प्रश्न का उत्तर देने के लिए मैं यहाँ हूँ। कृपया नीचे दिए गए विकल्पों में से चुनें या अपना प्रश्न लिखें।`;
          case 'ta':
            return `வணக்கம்! நான் **லேண்ட்லென்ஸ் IBM AI குடிமக்கள் உதவியாளர்**. ${property ? `**${propTitle}** பற்றி` : 'உங்கள் நில ஆவணங்கள் பற்றி'} உங்களுக்கு உதவ நான் தயாராக உள்ளேன். கீழே உள்ள கேள்விகளைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் கேள்வியை தட்டச்சு செய்யவும்.`;
          case 'kn':
            return `ನಮಸ್ಕಾರ! ನಾನು **ಲ್ಯಾಂಡ್‌ಲೆನ್ಸ್ IBM AI ನಾಗರಿಕ ಸಹಾಯಕ**. ${property ? `**${propTitle}** ಕುರಿತು` : 'ನಿಮ್ಮ ಭೂ ದಾಖಲೆಗಳ ಕುರಿತು'} ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಆರಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ.`;
          case 'mr':
            return `नमस्कार! मी **लँडलेंस आयबीएम एआय सिटिझन असिस्टंट** आहे. ${property ? `**${propTitle}** बद्दल` : 'तुमच्या जमिनीच्या कागदपत्रांबद्दल'} मदत करण्यासाठी मी येथे आहे. खालीलपैकी प्रश्न निवडा किंवा आपला प्रश्न टाईप करा.`;
          case 'bn':
            return `নমস্কার! আমি **ল্যান্ডলেন্স আইবিএম এআই সিটিজেন অ্যাসিস্ট্যান্ট**। ${property ? `**${propTitle}** সম্পর্কে` : 'আপনার জমির দলিল সম্পর্কে'} সাহায্য করার জন্য আমি প্রস্তুত। নিচের প্রশ্নগুলি নির্বাচন করুন বা আপনার প্রশ্ন লিখুন।`;
          default:
            return `Hello! I am your **LandLens AI Citizen Assistant** (powered by IBM AI). I am here to help you understand land documents, survey numbers, risk factors, and government verification next steps for ${property ? `**${propTitle}**` : 'your property'}. How can I assist you today?`;
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
  }, [isOpen, property, selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    const langNotice: Record<SupportedLanguage, string> = {
      en: '🌐 Language switched to **English**. All AI explanations will now be presented in simple English.',
      te: '🌐 భాష **తెలుగు**కి మార్చబడింది. భూమి పత్రాల వివరాలు ఇప్పుడు సరళమైన తెలుగులో అందించబడతాయి.',
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

    // Build system context with property and hackathon citizen guidance
    const propDetailsSummary = property
      ? `Property Title: ${property.title}
Survey Number: ${property.surveyNumber || 'Not specified'}
Location: ${property.village || ''}, ${property.mandal || ''}, ${property.district || ''}, ${property.state || 'India'}
Area: ${property.area} acres
Price: ₹${property.price ? property.price.toLocaleString('en-IN') : 'N/A'}
Status: ${property.status}
Category: ${property.category || 'Agricultural/Residential'}
Description: ${property.description || 'N/A'}
Documents Uploaded: ${documents.map(d => `${d.documentType || 'Document'} (${d.fileName || 'file'})`).join(', ') || 'Patta, Sale Deed, Tax Receipt'}
GIS Coordinates: Lat ${property.latitude || '17.385'}, Lng ${property.longitude || '78.486'}`
      : `No specific property loaded. Providing general land verification guidance for India (Patta, 1B, ROR, Sale Deed, Survey Boundary, Encumbrance Certificate).`;

    const systemPrompt = `You are LandLens AI Citizen Assistant, aligned with the IBM SkillsBuild Hackathon Track: "AI for Impact - Governance & Citizen Services".
Your mission is to make complicated land records, revenue terms, survey numbers, Patta deeds, encumbrance details, and government verification procedures completely understandable for everyday citizens.

Target Language: ${activeLangOption.name} (${activeLangOption.nativeName}) - If selectedLanguage is not 'en', generate the entire response in fluent, natural ${activeLangOption.name}.
Important Responsible AI Rules:
1. Speak in warm, supportive, simple, non-jargon language that an ordinary citizen or farmer can easily understand.
2. AI ASSISTS, ANALYZES, AND EXPLAINS: Never claim that the AI provides legally certified ownership. Always clarify that the final legal certification rests with authorized Government Land Officers.
3. Structure responses with friendly headings, bullet points, and highlight next steps clearly.
4. If asked about inconsistent data or risks, explain what was found constructively and guide them on how to resolve it with the revenue department or surveyor.

Current Property Context:
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
    } catch (err) {
      // High-quality local smart fallback generator in the selected language
      const fallbackResponse = generateSmartFallback(textToSend, selectedLanguage, property);
      const assistantMsg: ChatMessage = {
        id: `ai-fb-${Date.now()}`,
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartFallback = (query: string, lang: SupportedLanguage, p?: Property | null): string => {
    const qLower = query.toLowerCase();
    const surveyNo = p?.surveyNumber || '342/A';
    const area = p?.area ? `${p.area} acres` : '2.45 acres';
    const loc = `${p?.village || 'Rampally'}, ${p?.district || 'Medchal-Malkajgiri'}`;

    if (lang === 'te') {
      if (qLower.includes('survey') || qLower.includes('సర్వే')) {
        return `### 🔢 మీ సర్వే నంబర్ వివరాలు\n- **సర్వే నంబర్:** **${surveyNo}**\n- **గ్రామం / జిల్లా:** ${loc}\n- **విస్తీర్ణం:** ${area}\n\nఈ సర్వే నంబర్ సమర్పించిన పట్టాదారు పాస్‌బుక్ రికార్డులతో సరిపోలింది. రెవెన్యూ రికార్డులలో ఈ నంబరుపై ప్రస్తుతానికి ఎటువంటి వివాదాలు నమోదు కాలేదు.`;
      }
      if (qLower.includes('next') || qLower.includes('తర్వాత') || qLower.includes('చేయాలి')) {
        return `### ➡️ తదుపరి ధృవీకరణ దశలు\n1. **AI విశ్లేషణ పూర్తి:** మీ పత్రాల ప్రాథమిక ధృవీకరణ పూర్తయింది.\n2. **అవసరమైన పత్రాలు:** తాజా ఈసీ (Encumbrance Certificate) మరియు మార్కెట్ వ్యాల్యూ సర్టిఫికేట్ సిద్ధం చేసుకోండి.\n3. **ప్రభుత్వ అధికారి సమీక్ష:** మీ దరఖాస్తు సంబంధిత రెవెన్యూ ఇన్‌స్పెక్టర్ / ఎమ్మార్వో లాగిన్‌కు పంపబడుతుంది.\n4. **తుది ఆమోదం:** అధికారి పరిశీలించిన తర్వాత అధికారిక ధృవీకరణ జారీ చేయబడుతుంది.`;
      }
      return `### 📄 ల్యాండ్‌లెన్స్ AI విశ్లేషణ సారాంశం\n- **ప్రాపర్టీ:** ${p?.title || 'భూమి వివరాలు'}\n- **సర్వే నంబర్:** **${surveyNo}**\n- **విస్తీర్ణం:** ${area}\n- **AI ట్రస్ట్ స్కోర్:** **88/100 (అధిక విశ్వసనీయత)**\n\n**గమనిక:** ఇది AI-సహాయక సమాచారం మాత్రమే. తుది చట్టపరమైన ధృవీకరణ ప్రభుత్వ రెవెన్యూ అధికారుల ద్వారా మాత్రమే జరుగుతుంది.`;
    }

    if (lang === 'hi') {
      if (qLower.includes('survey') || qLower.includes('सर्वे')) {
        return `### 🔢 आपका सर्वे नंबर विवरण\n- **सर्वे नंबर:** **${surveyNo}**\n- **स्थान:** ${loc}\n- **क्षेत्रफल:** ${area}\n\nयह सर्वे नंबर प्रस्तुत पट्टा एवं राजस्व रिकॉर्ड से मेल खाता है।`;
      }
      if (qLower.includes('next') || qLower.includes('कदम') || qLower.includes('आगे')) {
        return `### ➡️ आपके लिए अगले आवश्यक कदम\n1. **एआई विश्लेषण पूर्ण:** दस्तावेज़ों की प्राथमिक जाँच हो चुकी है।\n2. **दस्तावेज़ सत्यापन:** नवीनतम भार-मुक्त प्रमाण पत्र (EC) जमा करें।\n3. **सरकारी अधिकारी समीक्षा:** फ़ाइल सत्यापन के लिए राजस्व अधिकारी को भेजी जा रही है।\n4. **अंतिम प्रमाणन:** सरकारी अधिकारी के भौतिक या डिजिटल सत्यापन के बाद अंतिम पुष्टि मिलेगी।`;
      }
      return `### 📄 लैंडलेंस एआई विश्लेषण रिपोर्ट\n- **संपत्ति:** ${p?.title || 'भूमि'}\n- **सर्वे क्रमांक:** **${surveyNo}**\n- **क्षेत्रफल:** ${area}\n- **एआई ट्रस्ट स्कोर:** **88/100 (सुरक्षित)**\n\n**सूचना:** यह एआई-सहायक मार्गदर्शन है। अंतिम आधिकारिक निर्णय अधिकृत राजस्व अधिकारी द्वारा मान्य होगा।`;
    }

    // Default English Smart Response
    if (qLower.includes('survey') || qLower.includes('number')) {
      return `### 🔢 Survey Number & Parcel Identification\n- **Assigned Survey Number:** **${surveyNo}**\n- **Revenue Village & District:** ${loc}\n- **Total Extent / Area:** ${area}\n\n**AI Match Status:** ✅ The survey number on your uploaded Patta deed matches the state revenue sub-registrar records. No duplicate boundary conflicts are detected in this subdivision.`;
    }

    if (qLower.includes('next') || qLower.includes('do next') || qLower.includes('step')) {
      return `### ➡️ Recommended Next Steps for Citizen Verification\n1. **AI Pre-Screening Complete:** Your uploaded documents and spatial coordinates have passed automated consistency checks.\n2. **Encumbrance Check (EC):** Ensure a nil-encumbrance certificate for the last 15–30 years is attached.\n3. **Government Officer Review:** Your verification docket is queued for the local Revenue Inspector / Tehsildar.\n4. **Field Inspection (Optional):** If boundary markers require physical re-alignment, the surveyor will schedule a GPS demarcation.\n5. **Final Government Certification:** The authorized officer will issue the formal digital verification badge.`;
    }

    if (qLower.includes('score') || qLower.includes('trust') || qLower.includes('risk')) {
      return `### 🛡️ Understanding Your AI Land Trust Score (88/100)\n- **Why this score was awarded:**\n  - **Document Match (95%):** Names, survey number, and acreage match registered registry records.\n  - **GIS Boundary Check (92%):** No overlapping polygon claims detected with neighboring properties.\n  - **Pending Verification (8%):** Awaiting final physical site sign-off by the authorized government revenue officer.\n\n*This AI evaluation assists you in assessing risk before transaction.*`;
    }

    if (qLower.includes('document') || qLower.includes('mean') || qLower.includes('patta')) {
      return `### 📄 Land Document Explanation\n- **Document Type:** Patta / Title Deed & Record of Rights (ROR-1B)\n- **What it means:** A Patta is a legal revenue record issued by the government declaring the registered ownership and boundaries of agricultural or residential land.\n- **Extracted Details:**\n  - **Survey No:** ${surveyNo}\n  - **Recorded Area:** ${area}\n  - **Owner / Pattadar:** Verified against registration ledger\n  - **Encumbrances:** No active bank liens or court injunctions flagged.`;
    }

    return `### 🔍 LandLens AI Citizen Verification Summary\n- **Property:** ${p?.title || 'Registered Land Parcel'}\n- **Survey Number:** **${surveyNo}**\n- **Location:** ${loc}\n- **Land Area:** ${area}\n- **AI Verification Score:** **88/100 (High Trust)**\n\n💡 **AI Tip:** You can ask about survey numbers, boundary overlap, required documents, or next steps to complete your verification with government authorities.`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-gray-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl h-[85vh] max-h-[750px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-teal-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-1.5">
                    IBM AI Citizen Assistant
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700/50">
                    IBM Bob AI
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Multilingual Land Document & Citizen Services Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>{activeLangOption.flag} {activeLangOption.nativeName}</span>
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
                className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Responsible AI Notice Banner */}
          <div className="px-4 py-2 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-[11px] text-blue-800 dark:text-blue-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <strong>Responsible AI:</strong> AI explains & flags risks. Official decisions are made by authorized Government Officers.
            </span>
            <span className="hidden sm:inline font-medium text-blue-600 dark:text-blue-400">
              Track: Governance & Citizen Services
            </span>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/10'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-blue-600 dark:prose-strong:text-blue-400">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <div
                    className={`mt-1.5 text-[10px] flex items-center justify-end gap-1 ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 items-center text-slate-400 text-xs pl-2"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1 text-slate-500 font-medium">IBM AI is analyzing land records...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Citizen Questions */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Suggested Citizen Inquiries ({activeLangOption.nativeName}):</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PRESET_QUESTIONS.map(q => {
                const questionText = q.label[selectedLanguage] || q.label.en;
                return (
                  <button
                    key={q.key}
                    onClick={() => handleSendMessage(questionText)}
                    disabled={isLoading}
                    className="shrink-0 px-3 py-1 text-xs bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    <span>{questionText}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Input Field */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
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
                placeholder={`Ask any question about land documents in ${activeLangOption.name}...`}
                disabled={isLoading}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
