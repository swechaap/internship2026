import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Check, AlertCircle, Sparkles, Send, FileText, BarChart2, MessageSquare, 
  Bell, Heart, Plus, Award, LogOut, CheckCircle2, X, Star, ArrowRight, BookOpen, 
  Volume2, ShieldCheck, HelpCircle, RefreshCw, SendHorizontal, LayoutGrid, CheckSquare, Dumbbell, Menu
} from 'lucide-react';
import { 
  UserProfile, Scheme, SchemeCategory, ChatMessage, SchemeFeedback, 
  SchemeNotification, EnrollmentRoadmap, VerificationResult
} from './types';
import { TRANSLATIONS, getLocalizedSchemes, translateMatchReason, translateActionTip } from './translations';

const translateNotification = (n: SchemeNotification, lang: 'English' | 'Hindi' | 'Telugu') => {
  if (lang === 'Hindi') {
    if (n.title && (n.title.includes('e-KYC') || n.title.includes('e-kyc'))) {
      return {
        ...n,
        title: 'पीएम-किसान ई-केवाईसी की अंतिम तिथि बढ़ाई गई',
        message: 'किसान भाई ध्यान दें! आपका पीएम-किसान आधार ई-केवाईसी पूरा करने की अंतिम तिथि 31 जुलाई, 2026 तक बढ़ा दी गई है। अपनी अगली किस्त सुरक्षित करने के लिए ओटीपी के माध्यम से पूरा करें।',
        type: 'समय सीमा'
      };
    }
    if (n.title && n.title.includes('Yasasvi')) {
      return {
        ...n,
        title: 'नई योजना शुरू की गई: पीएम यशस्वी',
        message: 'ओबीसी/ईबीसी छात्र श्रेणियों के लिए एक नई छात्रवृत्ति योजना शुरू की गई है। राष्ट्रीय छात्रवृत्ति पोर्टल पर पंजीकरण खुला है।',
        type: 'नई योजना'
      };
    }
    if (n.title && n.title.includes('Deadline')) {
      return {
        ...n,
        title: 'आगामी पीएम-किसान नामांकन अंतिम तिथि',
        message: 'सभी नामांकित उत्पादकों से अनुरोध है कि वे आगामी महीने के अंत की समीक्षा से पहले अपने भूमि पंजीकरण विवरण एकत्र करें।',
        type: 'समय सीमा'
      };
    }
  } else if (lang === 'Telugu') {
    if (n.title && (n.title.includes('e-KYC') || n.title.includes('e-kyc'))) {
      return {
        ...n,
        title: 'పీఎం-కిసాన్ ఇ-కేవైసీ గడువు పొడిగించబడింది',
        message: 'రైతులకు గమనిక! తప్పనిసరి పిఎం-కిసాన్ ఆధార్ ఇ-కెవైసి పూర్తి చేయడానికి చివరి తేదీ జూలై 31, 2026 వరకు పొడిగించబడింది. మీ తదుపరి విడతను సురక్షితంగా పొందడానికి OTP ద్వారా పూర్తి చేయండి.',
        type: 'గడువు తేదీ'
      };
    }
    if (n.title && n.title.includes('Yasasvi')) {
      return {
        ...n,
        title: 'కొత్త పథకం ప్రారంభించబడింది: పీఎం యశస్వి',
        message: 'OBC / EBC విద్యార్థి వర్గాల కోసం కొత్త స్కాలర్‌షిప్ పథకం ప్రవేశపెట్టబడింది. నేషనల్ స్కాలర్‌షిప్ పోర్టల్‌లో రిజిస్ట్రేషన్లు ప్రారంభమయ్యాయి.',
        type: 'కొత్త పథకం'
      };
    }
    if (n.title && n.title.includes('Deadline')) {
      return {
        ...n,
        title: 'రాబోయే పీఎం-కిసాన్ నమోదు గడువు తేదీ',
        message: 'నమోదైన ఆహార ఉత్పత్తిదారులు అందరూ రాబోయే నెలాఖరు సమీక్షకు ముందే తమ భూమి రిజిస్ట్రేషన్ వివరాలను సమర్పించాల్సిందిగా కోరడమైనది.',
        type: 'గడువు తేదీ'
      };
    }
  }
  return n;
};

// Supported interface tabs
type ActiveTab = 'dashboard' | 'navigator' | 'verifier' | 'chatbot' | 'feedback' | 'admin' | 'profile';

export default function App() {
  // Authentication & Profile States
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(null);
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({
    name: "",
    email: "",
    age: "",
    gender: '',
    state: "",
    district: "",
    annualIncome:"",
    category: "OBC",
    education: "Graduate",
    occupation: "Farmer",
    isPhysicallyChallenged: false,
    isMinority: false,
    isWidowOrSingleMother: false
  });
  
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'authenticated'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Primary Platform States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'All'>('All');
  const [roadmaps, setRoadmaps] = useState<EnrollmentRoadmap[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<EnrollmentRoadmap | null>(null);
  
  // Dynamic AI Recommendations from Gemini with cache / loading tracking
  const [aiRecs, setAiRecs] = useState<Record<string, { matchScore: number, recommendationReason: string, actionTip: string }>>({});
  const [loadingAiRecs, setLoadingAiRecs] = useState(false);

  // Document verification states
  const [selectedVerifySchemeId, setSelectedVerifySchemeId] = useState<string>('');
  const [verifyDocName, setVerifyDocName] = useState<string>('');
  const [verifyTextContent, setVerifyTextContent] = useState<string>('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Multilingual chat bot states
  const [currentLanguage, setCurrentLanguage] = useState<'English' | 'Hindi' | 'Telugu'>('English');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [voicedMessageId, setVoicedMessageId] = useState<string | null>(null);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);

  // Feedback, notifications & Admin states
  const [feedbacks, setFeedbacks] = useState<SchemeFeedback[]>([]);
  const [newFeedback, setNewFeedback] = useState({
    schemeId: '',
    rating: 5,
    issueType: 'General Feedback' as any,
    comment: ''
  });
  const [notifications, setNotifications] = useState<SchemeNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<SchemeNotification | null>(null);
  const [readNotifications, setReadNotifications] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [simulateAlertForm, setSimulateAlertForm] = useState({
    title: 'Upcoming PM-KISAN Enrollment Deadline',
    message: 'All enrolled food producers are requested to seed their land registration details before the upcoming end-of-month review.',
    type: 'SMS' as 'SMS' | 'WhatsApp' | 'Deadline',
    sentTo: 'Registered Farmers'
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Offline physical checklist state
  const [offlineDocsStates, setOfflineDocsStates] = useState<Record<string, { enabled: boolean; step1: boolean; step2: boolean; step3: boolean; step4: boolean; step5: boolean }>>({});

  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['English']?.[key] || key;
  };

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Initial Fetching
  useEffect(() => {
    fetchSchemes();
    fetchNotifications();
    fetchFeedbacks();
    fetchAdminAnalytics();
    
    // Auto-login or register our default custom citizen Ravi Kumar first so the application loads instantly
    handleDemoSetup();
  }, []);

  // Fetch match details whenever user or language changes
  useEffect(() => {
    if (sessionUser) {
      fetchSchemes(sessionUser.email);
      fetchRoadmaps(sessionUser.id);
      fetchAiRecommendations(sessionUser);
    }
  }, [sessionUser, currentLanguage]);

  const handleDemoSetup = async () => {
    try {
      // Seed Ravi Kumar into the in-memory database on mount as a background process,
      // but do NOT trigger sessionUser of the frontend, keeping the login page visible first!
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileForm,
          password: 'password123'
        })
      });
    } catch (e) {
      console.warn("Could not setup background demo citizen seed.", e);
    }
  };

  const fetchSchemes = async (email?: string) => {
    try {
      const url = email ? `/api/schemes?email=${encodeURIComponent(email)}` : '/api/schemes';
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSchemes(data);
        if (data.length > 0 && !selectedScheme) {
          setSelectedScheme(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAdminMetrics(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoadmaps = async (userId: string) => {
    try {
      const res = await fetch(`/api/enrollment?userId=${userId}`);
      const data = await res.json();
      setRoadmaps(data);
      if (data.length > 0) {
        setActiveRoadmap(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAiRecommendations = async (user: UserProfile) => {
    setLoadingAiRecs(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, language: currentLanguage })
      });
      const data = await res.json();
      if (data.success && data.recommendations) {
        const mapped: Record<string, any> = {};
        data.recommendations.forEach((item: any) => {
          mapped[item.schemeId || ''] = item;
        });
        setAiRecs(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiRecs(false);
    }
  };

  // Localized task translation dictionary helper
  const getLocalizedTask = (task: { id: string; title: string; description: string }, lang: 'English' | 'Hindi' | 'Telugu') => {
    if (lang === 'English') return task;
    
    const translations: Record<string, Record<string, { title: string; description: string }>> = {
      'Hindi': {
        'task-1': {
          title: "प्रोफ़ाइल सीडिंग पूरी करें",
          description: "सुनिश्चित करें कि प्रोफ़ाइल पर सभी आयु, व्यवसाय और आय विन्यास अद्यतित हैं।"
        },
        'task-2': {
          title: "बुनियादी दस्तावेज़ ऑफ़लाइन/एआई सत्यापित करें",
          description: "प्रारंभिक मूल्यांकन के लिए एआई सत्यापन टर्मिनल में अनिवार्य दस्तावेज़ (आधार, आय प्रमाण पत्र) अपलोड करें।"
        },
        'task-3': {
          title: "सरकारी पोर्टल पर आवेदन जमा करें",
          description: "सत्यापित दस्तावेजों का उपयोग करके नामित नोडल सरकारी वेबसाइट पर ऑनलाइन आवेदन पत्र भरें और जमा करें।"
        },
        'task-4': {
          title: "राज्य अनुमोदन और डीबीटी रिलीज को ट्रैक करें",
          description: "स्थानीय ब्लॉक पावती आईडी जमा करें और सीधे बैंक डीबीटी क्रेडिट प्रगति की निगरानी करें।"
        }
      },
      'Telugu': {
        'task-1': {
          title: "ప్రొఫైల్ సీడింగ్ పూర్తి చేయండి",
          description: "ప్రొఫైల్‌లోని అన్ని వయస్సు, వృత్తి మరియు ఆదాయ కాన్గ్రిగేషన్‌లు తాజాగా ఉన్నాయని నిర్ధారించుకోండి."
        },
        'task-2': {
          title: "ప్రాథమిక పత్రాలను ఆఫ్‌లైన్/AI ద్వారా ధృవీకరించండి",
          description: "ప్రాథమిక మూల్యాంకనం కోసం AI ధృవీకరణ టెర్మినల్‌లో తప్పనిసరి పత్రాలను (ఆధార్, ఆదాయ ధృవీకరణ పత్రం) అప్‌లోడ్ చేయండి."
        },
        'task-3': {
          title: "ప్రభుత్వ పోర్టల్‌లో దరఖాస్తును సమర్పించండి",
          description: "ధృవీకరించబడిన పత్రాలను ఉపయోగించి నిర్దేశిత నోడల్ ప్రభుత్వ వెబ్‌సైట్‌లో ఆన్‌లైన్ దరఖాస్తు ఫారమ్‌ను పూరించి సమర్పించండి."
        },
        'task-4': {
          title: "రాష్ట్ర ఆమోదం మరియు DBT విడుదలను ట్రాక్ చేయండి",
          description: "స్థానిక బ్లాక్ అక్నాలెడ్జ్‌మెంట్ ఐడిని సమర్పించి, నేరుగా బ్యాంక్ డిబిటి క్రెడిట్ పురోగతిని పర్యవేక్షించండి."
        }
      }
    };

    const matched = translations[lang]?.[task.id];
    if (matched) {
      return matched;
    }
    return task;
  };

  // Email and Password pattern checkers
  const isValidEmail = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const getPasswordStrength = (pass: string) => {
    return {
      length: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasLower: /[a-z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
  };

  const handleGoogleSelect = async (email: string, name: string) => {
    setIsGoogleChooserOpen(false);
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          age: email.includes('sanjana') ? 24 : 34,
          gender: email.includes('sanjana') ? 'Female' : 'Male',
          state: "Telangana",
          district: "Hyderabad",
          annualIncome: email.includes('sanjana') ? 350000 : 180000,
          category: email.includes('sanjana') ? 'General' : 'OBC',
          education: email.includes('sanjana') ? 'Graduate' : 'Graduate',
          occupation: email.includes('sanjana') ? 'Self-employed' : 'Farmer',
          password: 'GoogleVerifiedPassword123!'
        })
      });
      const data = await res.json();
      
      if (!data.success && data.error && data.error.includes("already exists")) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: 'GoogleVerifiedPassword123!' })
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
          setSessionUser(loginData.user);
          setProfileForm(loginData.user);
          setAuthMode('authenticated');
          setSuccessMessage(
            currentLanguage === 'English' ? `Welcome back, ${name}! Signed in via Google.` :
            currentLanguage === 'Hindi' ? `वापसी पर स्वागत है, ${name}! गूगल के माध्यम से साइन इन किया गया।` :
            `మళ్ళీ స్వాగతం, ${name}! గూగుల్ ద్వారా విజయవంతంగా లాగిన్ అయ్యారు.`
          );
        } else {
          setErrorMessage("Failed to login with Google credentials.");
        }
      } else if (data.success) {
        setSessionUser(data.user);
        setProfileForm(data.user);
        setAuthMode('authenticated');
        setSuccessMessage(
          currentLanguage === 'English' ? `Account created! Welcome, ${name}! Signed in via Google.` :
          currentLanguage === 'Hindi' ? `खाता बनाया गया! स्वागत है, ${name}! गूगल के माध्यम से साइन इन किया गया।` :
          `ఖాతా సృష్టించబడింది! స్వాగతం, ${name}! గూగుల్ ద్వారా విజయవంతంగా లాగిన్ అయ్యారు.`
        );
      } else {
        setErrorMessage(data.error || "Failed to sign in with Google.");
      }
    } catch (e) {
      setErrorMessage("Network error during Google authentication.");
    }
  };

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!isValidEmail(loginEmail)) {
      setErrorMessage(t('invalidGmailError'));
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSessionUser(data.user);
        setProfileForm(data.user);
        setAuthMode('authenticated');
        setSuccessMessage(
          currentLanguage === 'English' ? "Successfully logged back in!" :
          currentLanguage === 'Hindi' ? "सफलतापूर्वक लॉग इन किया गया!" :
          "విజయవంతంగా లాగిన్ అయ్యారు!"
        );
      } else {
        setErrorMessage(data.error || "Invalid username or password");
      }
    } catch (err) {
      setErrorMessage("Network error connecting to verification system.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!profileForm.email || !isValidEmail(profileForm.email)) {
      setErrorMessage(t('invalidGmailError'));
      return;
    }

    const strength = getPasswordStrength(signupPassword);
    if (!strength.length || !strength.hasUpper || !strength.hasLower || !strength.hasNumber || !strength.hasSpecial) {
      setErrorMessage(t('invalidPasswordPatternError'));
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileForm,
          password: signupPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setSessionUser(data.user);
        setAuthMode('authenticated');
        setSuccessMessage(
          currentLanguage === 'English' ? "Citizen account initialized successfully!" :
          currentLanguage === 'Hindi' ? "नागरिक खाता सफलतापूर्वक प्रारंभ किया गया!" :
          "పౌరుడి ఖాతా విజయవంతంగా ప్రారంభించబడింది!"
        );
      } else {
        setErrorMessage(data.error || "Could not register details.");
      }
    } catch (err) {
      setErrorMessage("Network error.");
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;
    setSuccessMessage('');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sessionUser,
          ...profileForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setSessionUser(data.user);
        setSuccessMessage("Socio-demographic profile updated. Recalculating AI eligibility...");
        fetchSchemes(data.user.email);
        fetchAiRecommendations(data.user);
        fetchAdminAnalytics();
      }
    } catch (err) {
      setErrorMessage("Failed to update profile statistics.");
    }
  };

  // Enrollment operations
  const initiateEnrollment = async (schemeId: string, name: string) => {
    if (!sessionUser) {
      setErrorMessage("Please login or update your demographic profile to enroll.");
      return;
    }
    try {
      const res = await fetch('/api/enrollment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId,
          userId: sessionUser.id,
          schemeName: name
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchRoadmaps(sessionUser.id);
        setSuccessMessage(`Initiated step-by-step roadmap for ${name}`);
        setActiveTab('dashboard'); // Redirect to dashboard to track it
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (schemeId: string, taskId: string, currentStatus: string) => {
    if (!sessionUser) return;
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : currentStatus === 'Pending' ? 'In Progress' : 'Completed';
    try {
      const res = await fetch('/api/enrollment/update-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: sessionUser.id,
          schemeId,
          taskId,
          status: nextStatus
        })
      });
      if (res.ok) {
        fetchRoadmaps(sessionUser.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Document Verification AI
  const handleVerifyDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyDocName || (!verifyTextContent && !selectedVerifySchemeId)) {
      setErrorMessage("Please select a valid document class and submit information.");
      return;
    }
    setVerificationLoading(true);
    setVerificationResult(null);
    try {
      const activeObj = schemes.find(s => s.id === selectedVerifySchemeId);
      const res = await fetch('/api/ai/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: verifyDocName,
          documentText: verifyTextContent,
          mockDetails: activeObj ? `Citizen verification request for scheme "${activeObj.name}". Expected: ${activeObj.requiredDocuments.join(', ')}` : "Indian identity system"
        })
      });
      const data = await res.json();
      if (data.success) {
        setVerificationResult({
          docName: verifyDocName,
          ...data.result
        });

        // If enrolled in this scheme, update the roadmap status
        if (sessionUser && selectedVerifySchemeId) {
          await fetch('/api/enrollment/verify-doc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: sessionUser.id,
              schemeId: selectedVerifySchemeId,
              docName: verifyDocName,
              success: data.result.success,
              notes: data.result.notes,
              readinessScore: data.result.readinessScore
            })
          });
          fetchRoadmaps(sessionUser.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerificationLoading(false);
    }
  };

  const selectMockTemplateForDoc = (doc: string) => {
    setVerifyDocName(doc);
    if (doc === 'Aadhaar Card') {
      setVerifyTextContent("UNIQUE IDENTIFICATION AUTHORITY OF INDIA\nGOVT OF INDIA\nNAME: Ravi Kumar\nDOB: 12/04/1992\nGENDER: Male\nAADHAAR NO: 4578 9012 3456\nADDRESS: H.No 5-4-101, Chikkadpally, Hyderabad, Telangana - 500020");
    } else if (doc.includes('Income')) {
      setVerifyTextContent("GOVERNMENT OF TELANGANA\nDEPARTMENT OF REVENUE\nINCOME CERTIFICATE\nCertificate No: IC-2026-908234\nCertified that Family Income of Ravi Kumar of Hyderabad district is Rs. 1,80,000 (One Lakh Eighty Thousand Only)\nValid until: 31/03/2027\nDigital Signature Valid: YES");
    } else if (doc.includes('Caste')) {
      setVerifyTextContent("OFFICE OF THE TAHSILDAR\nCOMMUNITY, NATIVITY AND DATE OF BIRTH CERTIFICATE\nThis is to certify that Ravi Kumar belongs to OBC class group category of state list.\nCaste: Yadav (Bc-D Group)\nIssued on: 14/02/2024");
    } else if (doc.includes('Land')) {
      setVerifyTextContent("RECORD OF RIGHTS (PATTADAR PASSBOOK)\nState of Telangana - Agricultural Land holding\nSurvey Number: 45/A\nExtent: 1.5 Acres\nOwner Name: Ravi Kumar");
    } else {
      setVerifyTextContent(`OFFICIAL CREDENTIAL\nApplicant Name: Ravi Kumar\nDeclaration: Verified and approved by local Gram Panchayat Social Welfare officer.\nDocument Identifier: PR-773-${Date.now().toString().slice(-4)}`);
    }
  };

  const handleMarkSubmittedOffline = async (schemeId: string, docName: string) => {
    if (!sessionUser) return;
    try {
      const receiptCode = `OFL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const res = await fetch('/api/enrollment/verify-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: sessionUser.id,
          schemeId,
          docName,
          success: true,
          notes: `Submitted offline (Manual Verification Acknowledged. Receipt Code: ${receiptCode})`,
          readinessScore: 100
        })
      });
      if (res.ok) {
        setSuccessMessage(`Document "${docName}" successfully registered as offline submission! Receipt: ${receiptCode}`);
        fetchRoadmaps(sessionUser.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Multilingual Chatbot Agent
  const handleChatSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const activeText = overrideText || chatInput;
    if (!activeText.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      text: activeText,
      language: currentLanguage
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          userProfile: sessionUser,
          currentLanguage: currentLanguage
        })
      });
      const data = await response.json();
      if (data.success) {
        const botMsg: ChatMessage = {
          id: `chat-${Date.now() + 1}`,
          sender: 'bot',
          text: data.text,
          language: data.language,
          voice: data.voice
        };
        setChatMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleVoiceSimulate = (msgId: string, text: string) => {
    // Simulated Speech synthesis browser-safe
    if (voicedMessageId === msgId) {
      setVoicedMessageId(null);
      window.speechSynthesis.cancel();
      return;
    }
    
    setVoicedMessageId(msgId);
    const audioSynth = new SpeechSynthesisUtterance(text);
    // Attempt appropriate locale voices
    if (currentLanguage === 'Hindi') {
      audioSynth.lang = 'hi-IN';
    } else if (currentLanguage === 'Telugu') {
      audioSynth.lang = 'te-IN';
    } else {
      audioSynth.lang = 'en-IN';
    }
    
    audioSynth.onend = () => {
      setVoicedMessageId(null);
    };
    audioSynth.onerror = () => {
      setVoicedMessageId(null);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(audioSynth);
  };

  // Feedback Submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.comment.trim()) return;
    try {
      const activeObj = schemes.find(s => s.id === newFeedback.schemeId) || selectedScheme;
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: activeObj?.id,
          schemeName: activeObj?.name,
          userName: sessionUser?.name || 'Citizen User',
          rating: newFeedback.rating,
          issueType: newFeedback.issueType,
          comment: newFeedback.comment
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewFeedback({ schemeId: '', rating: 5, issueType: 'General Feedback', comment: '' });
        fetchFeedbacks();
        fetchAdminAnalytics();
        setSuccessMessage("Thank you! Feedback logged securely for service improvement reports.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Broadcast Alert Simulated by admin or officer (Smart notifications)
  const handleBroadCastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: simulateAlertForm.title,
          message: simulateAlertForm.message,
          type: simulateAlertForm.type,
          sentTo: simulateAlertForm.sentTo
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchNotifications();
        setSuccessMessage(`Successfully broadcasted simulated ${simulateAlertForm.type} alert notification!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Localized schemes list depending on selected language
  const localizedSchemesList = getLocalizedSchemes(schemes, currentLanguage);

  // Localized currently-selected scheme detail object
  const localizedSelectedScheme = selectedScheme 
    ? localizedSchemesList.find(s => s.id === selectedScheme.id) || selectedScheme 
    : null;

  // Filter schemes based on category and dynamically sort them by matchScore (either from AI recommendations or from fallback score)
  const filteredSchemes = (selectedCategory === 'All' 
    ? localizedSchemesList 
    : localizedSchemesList.filter(s => s.category === selectedCategory)
  ).map(scheme => {
    const aiMatch = aiRecs[scheme.id];
    const score = aiMatch ? aiMatch.matchScore : (scheme.matchScore || 0);
    return { ...scheme, displayScore: score };
  }).sort((a, b) => b.displayScore - a.displayScore);

  // Quick categories metadata list
  const categoryMetas = [
    { title: 'Education', icon: '🎓', color: 'bg-blue-50 text-blue-700 border-blue-100', cat: 'Education' as const },
    { title: 'Agriculture', icon: '🚜', color: 'bg-green-50 text-green-700 border-green-100', cat: 'Agriculture' as const },
    { title: 'Women Welfare', icon: '🚺', color: 'bg-pink-50 text-pink-700 border-pink-100', cat: 'Women Welfare' as const },
    { title: 'Employment', icon: '💼', color: 'bg-yellow-50 text-yellow-700 border-yellow-10 border-yellow-200', cat: 'Employment' as const },
    { title: 'Health', icon: '⚕️', color: 'bg-red-50 text-red-700 border-red-10 border-red-100', cat: 'Health' as const },
    { title: 'Social Welfare', icon: '🤝', color: 'bg-purple-50 text-purple-700 border-purple-100', cat: 'Social Welfare' as const },
  ];

  if (!sessionUser || authMode !== 'authenticated') {
    return (
      <div id="auth-root-container" className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient glowing radial light effects in background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Floating Language Selector */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <span className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-widest flex items-center gap-1">
            🌐 Interface:
          </span>
          <button 
            type="button"
            onClick={() => {
              setCurrentLanguage('English');
              setSuccessMessage("Interface configured to English support.");
              setErrorMessage("");
            }}
            className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
              currentLanguage === 'English' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button 
            type="button"
            onClick={() => {
              setCurrentLanguage('Hindi');
              setSuccessMessage("इंटरफ़ेस को हिंदी सहायता में बदला गया।");
              setErrorMessage("");
            }}
            className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
              currentLanguage === 'Hindi' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HI
          </button>
          <button 
            type="button"
            onClick={() => {
              setCurrentLanguage('Telugu');
              setSuccessMessage("ఇంటర్ఫేస్ తెలుగు సహాయానికి మార్చబడింది.");
              setErrorMessage("");
            }}
            className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
              currentLanguage === 'Telugu' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TE
          </button>
        </div>

        {/* Central Auth Container */}
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col gap-6">
          
          {/* Logo details */}
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/40 mb-3">
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-indigo-600 rounded-[1px]" />
              </div>
            </div>
            <h2 className="text-white font-black text-xl tracking-tight">
              {t('logoTitle')}
            </h2>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
              {t('logoSubtitle')}
            </p>
          </div>

          {/* Form Mode Tabs Selector */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button 
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔐 {t('signInTab')}
            </button>
            <button 
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📝 {t('signUpTab')}
            </button>
          </div>

          {/* Alerts displaying system warning or successes */}
          {errorMessage && (
            <div className="bg-red-950/30 border border-red-900/55 p-3 rounded-xl flex items-center gap-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-950/30 border border-emerald-950/50 p-3 rounded-xl flex items-center gap-3 text-emerald-200 text-xs">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* SIGN IN VIEW */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  {t('loginEmailLabel')}
                </label>
                <input 
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. ravi.kumar@gmail.com"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-650 rounded-xl text-xs text-white focus:outline-none transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  {t('loginPasswordLabel')}
                </label>
                <input 
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-650 rounded-xl text-xs text-white focus:outline-none transition-all font-medium"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-950/30"
              >
                🚀 {t('loginBtn')}
              </button>

              <div className="flex items-center justify-between my-3">
                <div className="border-b border-slate-800 flex-grow" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-3">{t('orDivider')}</span>
                <div className="border-b border-slate-800 flex-grow" />
              </div>

              <button 
                type="button"
                onClick={() => setIsGoogleChooserOpen(true)}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-200/50 shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-.125 2.76-1.5 3.7l2.45 1.9c1.43-1.32 2.2-3.25 2.2-5.43z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.9l-2.45-1.9c-1.1.75-2.52 1.2-5.48 1.2-4.22 0-7.8-2.85-9.08-6.68H.45v2.02C2.42 20.3 6.94 24 12 24z" />
                  <path fill="#FBBC05" d="M2.92 13.72a7.15 7.15 0 010-4.55V7.15H.45a11.95 11.95 0 000 9.7l2.47-1.13z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.95 1.2 15.24 0 12 0 6.94 0 2.42 3.7.45 8.13l2.47 1.13c1.27-3.83 4.85-6.5 9.08-6.5z" />
                </svg>
                <span>{t('googleSignIn')}</span>
              </button>
            </form>
          )}

          {/* SIGN UP VIEW - Complete Onboarding Profile setup */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar-dark">
              
              {/* Form introduction */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-450 text-slate-400 leading-relaxed font-sans">
                Configure custom demographics options below. Yojana Saathi compares this configuration with active welfare rules dynamically to establish target matching index metrics.
              </div>

              {/* Primary Credentials */}
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Citizen Name</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Email Address</label>
                  <input 
                    type="email"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Choose Password</label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    {currentLanguage === 'English' ? 'Gender' : currentLanguage === 'Hindi' ? 'लिंग' : 'లింగం'}
                  </label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value as any }))}
                  >
                    <option value="Male" className="bg-slate-900">{currentLanguage === 'English' ? 'Male' : currentLanguage === 'Hindi' ? 'पुरुष' : 'పురుషులు'}</option>
                    <option value="Female" className="bg-slate-900">{currentLanguage === 'English' ? 'Female' : currentLanguage === 'Hindi' ? 'महिला' : 'మహిళలు'}</option>
                    <option value="Transgender" className="bg-slate-900">{currentLanguage === 'English' ? 'Transgender' : currentLanguage === 'Hindi' ? 'ट्रांसजेंडर' : 'ట్రాన్స్‌జెండర్'}</option>
                    <option value="Other" className="bg-slate-900">{currentLanguage === 'English' ? 'Other' : currentLanguage === 'Hindi' ? 'अन्य' : 'ఇతర'}</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 mt-1">
                  <p className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">
                    🔑 {currentLanguage === 'English' ? 'Password Pattern Progress' : currentLanguage === 'Hindi' ? 'पासवर्ड क्रेडेंशियल आवश्यकता' : 'పాస్‌వర్డ్ నమూనా అవసరాలు'}
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] text-slate-400 leading-none">
                    <div className="flex items-center gap-1.5">
                      <span className={getPasswordStrength(signupPassword).length ? "text-emerald-500 font-extrabold text-[10px]" : "text-slate-600 font-bold"}>
                        {getPasswordStrength(signupPassword).length ? "✓" : "○"}
                      </span>
                      <span className={getPasswordStrength(signupPassword).length ? "text-slate-200 font-medium" : "text-slate-500"}>
                        {currentLanguage === 'English' ? 'Min 8 characters' : currentLanguage === 'Hindi' ? 'न्यूनतम 8 वर्ण' : 'కనీసం 8 అక్షరాలు'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={getPasswordStrength(signupPassword).hasUpper ? "text-emerald-500 font-extrabold text-[10px]" : "text-slate-600 font-bold"}>
                        {getPasswordStrength(signupPassword).hasUpper ? "✓" : "○"}
                      </span>
                      <span className={getPasswordStrength(signupPassword).hasUpper ? "text-slate-200 font-medium" : "text-slate-500"}>
                        {currentLanguage === 'English' ? '1 Uppercase letter' : currentLanguage === 'Hindi' ? '1 बड़ा अक्षर' : '1 పెద్ద అక్షరం'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={getPasswordStrength(signupPassword).hasLower ? "text-emerald-500 font-extrabold text-[10px]" : "text-slate-600 font-bold"}>
                        {getPasswordStrength(signupPassword).hasLower ? "✓" : "○"}
                      </span>
                      <span className={getPasswordStrength(signupPassword).hasLower ? "text-slate-200 font-medium" : "text-slate-500"}>
                        {currentLanguage === 'English' ? '1 Lowercase letter' : currentLanguage === 'Hindi' ? '1 छोटा अक्षर' : '1 చిన్న అక్షరం'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={getPasswordStrength(signupPassword).hasNumber ? "text-emerald-500 font-extrabold text-[10px]" : "text-slate-600 font-bold"}>
                        {getPasswordStrength(signupPassword).hasNumber ? "✓" : "○"}
                      </span>
                      <span className={getPasswordStrength(signupPassword).hasNumber ? "text-slate-200 font-medium" : "text-slate-500"}>
                        {currentLanguage === 'English' ? '1 Number (0-9)' : currentLanguage === 'Hindi' ? '1 संख्या (0-9)' : '1 సంఖ్య (0-9)'}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5">
                      <span className={getPasswordStrength(signupPassword).hasSpecial ? "text-emerald-500 font-extrabold text-[10px]" : "text-slate-600 font-bold"}>
                        {getPasswordStrength(signupPassword).hasSpecial ? "✓" : "○"}
                      </span>
                      <span className={getPasswordStrength(signupPassword).hasSpecial ? "text-slate-200 font-medium" : "text-slate-500"}>
                        {currentLanguage === 'English' ? '1 Special character (!@#$%^&*...)' : currentLanguage === 'Hindi' ? '1 विशेष वर्ण (!@#$%^&*...)' : '1 ప్రత్యేక పాత్ర (!@#$%^&*...)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demographics Parameters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{t('citizenAge')}</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.age}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                    min={1}
                    max={120}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{t('categoryCaste')}</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.category}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <option value="General" className="bg-slate-900">{currentLanguage === 'English' ? 'General' : currentLanguage === 'Hindi' ? 'सामान्य' : 'సాధారణం'}</option>
                    <option value="OBC" className="bg-slate-900">{currentLanguage === 'English' ? 'OBC (Other Backwards)' : currentLanguage === 'Hindi' ? 'ओबीसी (अन्य पिछड़ा वर्ग)' : 'OBC (ఇతర వెనుకబడిన తరగతులు)'}</option>
                    <option value="SC" className="bg-slate-900">{currentLanguage === 'English' ? 'SC (Scheduled Caste)' : currentLanguage === 'Hindi' ? 'एससी (अनुसूचित जाति)' : 'SC (షెడ్యూల్డ్ కులాలు)'}</option>
                    <option value="ST" className="bg-slate-900">{currentLanguage === 'English' ? 'ST (Scheduled Tribe)' : currentLanguage === 'Hindi' ? 'एसटी (अनुसूचित जनजाति)' : 'ST (షెడ్యూల్డ్ తెగలు)'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{t('annualFamilyIncome')}</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.annualIncome}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, annualIncome: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              {/* Sub Jurisdiction States and Area */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{currentLanguage === 'English' ? 'Jurisdiction State' : currentLanguage === 'Hindi' ? 'अधिकार क्षेत्र राज्य' : 'రాష్ట్రం'}</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value.replace(/[0-9]/g, '') }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{currentLanguage === 'English' ? 'District Area' : currentLanguage === 'Hindi' ? 'जिला क्षेत्र' : 'జిల్లా'}</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.district}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, district: e.target.value.replace(/[0-9]/g, '') }))}
                    required
                  />
                </div>
              </div>

              {/* Education and Occupation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{t('educationLevel')}</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.education}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, education: e.target.value as any }))}
                  >
                    <option value="Illiterate" className="bg-slate-900">{currentLanguage === 'English' ? 'Illiterate' : currentLanguage === 'Hindi' ? 'अनपढ़' : 'అక్షరాస్యత లేనివారు'}</option>
                    <option value="Primary" className="bg-slate-900">{currentLanguage === 'English' ? 'Primary (till class 5)' : currentLanguage === 'Hindi' ? 'प्राथमिक (कक्षा 5 तक)' : 'ప్రాథమిక విద్యా (5వ తరగతి వరకు)'}</option>
                    <option value="High School" className="bg-slate-900">{currentLanguage === 'English' ? 'High School (till class 10)' : currentLanguage === 'Hindi' ? 'हाई स्कूल (कक्षा 10 तक)' : 'హైస్కూల్ (10వ తరగతి వరకు)'}</option>
                    <option value="Graduate" className="bg-slate-900">{currentLanguage === 'English' ? 'Graduate (Degree)' : currentLanguage === 'Hindi' ? 'स्नातक (डिग्री)' : 'డిగ్రీ (గ్రాడ్యుయేట్)'}</option>
                    <option value="Post Graduate" className="bg-slate-900">{currentLanguage === 'English' ? 'Post Graduate' : currentLanguage === 'Hindi' ? 'स्नातकोत्तर' : 'పోస్ట్ గ్రాడ్యుయేట్'}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{t('occupationProfession')}</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600"
                    value={profileForm.occupation}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, occupation: e.target.value as any }))}
                  >
                    <option value="Farmer" className="bg-slate-900">{currentLanguage === 'English' ? 'Farmer / Agriculturalist' : currentLanguage === 'Hindi' ? 'किसान / कृषि' : 'రైతు / వ్యవసాయ రంగం'}</option>
                    <option value="Student" className="bg-slate-900">{currentLanguage === 'English' ? 'Student' : currentLanguage === 'Hindi' ? 'छात्र' : 'విద్యార్థి'}</option>
                    <option value="Unemployed" className="bg-slate-900">{currentLanguage === 'English' ? 'Unemployed' : currentLanguage === 'Hindi' ? 'बेरोजगार' : 'ఉద్యోగం లేనివారు'}</option>
                    <option value="Salaried" className="bg-slate-900">{currentLanguage === 'English' ? 'Salaried (Govt/Private Sector)' : currentLanguage === 'Hindi' ? 'वेतनभोगी (सरकारी/निजी क्षेत्र)' : 'веతన ఉద్యోగి (ప్రభుత్వ/ప్రైవేట్ రంగం)'}</option>
                    <option value="Self-employed" className="bg-slate-900">{currentLanguage === 'English' ? 'Self-employed Business owner' : currentLanguage === 'Hindi' ? 'स्व-नियोजित व्यवसाय स्वामी' : 'స్వయం ఉపాధి / వ్యాపార యజమాని'}</option>
                    <option value="Artisan" className="bg-slate-900">{currentLanguage === 'English' ? 'Local Artisan / Handicrafts' : currentLanguage === 'Hindi' ? 'स्थानीय कारीगर / हस्तशिल्प' : 'స్థానిక కళాకారులు / హస్తకళలు'}</option>
                  </select>
                </div>
              </div>

              {/* Yes/No priority checkmarks */}
              <div className="space-y-2 bg-slate-950 p-3 border border-slate-800 rounded-xl">
                <p className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider mb-1.5 font-sans">
                  {currentLanguage === 'English' ? 'Priority Socio-Demographics statuses' : currentLanguage === 'Hindi' ? 'प्राथमिकता सामाजिक-जनसांख्यिकीय स्थितियां' : 'సామాజిక-జనగణన ప్రాధాన్యతలు'}
                </p>
                
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={profileForm.isPhysicallyChallenged}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, isPhysicallyChallenged: e.target.checked }))}
                    className="rounded border-slate-800 text-indigo-600 bg-slate-950 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>{t('physicallyChallengedLabel')}</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={profileForm.isMinority}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, isMinority: e.target.checked }))}
                    className="rounded border-slate-800 text-indigo-600 bg-slate-950 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>{t('minorityStatusLabel')}</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={profileForm.isWidowOrSingleMother}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, isWidowOrSingleMother: e.target.checked }))}
                    className="rounded border-slate-800 text-indigo-600 bg-slate-950 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>{t('widowSingleMotherLabel')}</span>
                </label>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                >
                  📝 {t('signupBtn')}
                </button>

                <div className="flex items-center justify-between my-3">
                  <div className="border-b border-slate-800 flex-grow" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-3">{t('orDivider')}</span>
                  <div className="border-b border-slate-800 flex-grow" />
                </div>

                <button 
                  type="button"
                  onClick={() => setIsGoogleChooserOpen(true)}
                  className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-200/50 shadow-sm"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-.125 2.76-1.5 3.7l2.45 1.9c1.43-1.32 2.2-3.25 2.2-5.43z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.9l-2.45-1.9c-1.1.75-2.52 1.2-5.48 1.2-4.22 0-7.8-2.85-9.08-6.68H.45v2.02C2.42 20.3 6.94 24 12 24z" />
                    <path fill="#FBBC05" d="M2.92 13.72a7.15 7.15 0 010-4.55V7.15H.45a11.95 11.95 0 000 9.7l2.47-1.13z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.95 1.2 15.24 0 12 0 6.94 0 2.42 3.7.45 8.13l2.47 1.13c1.27-3.83 4.85-6.5 9.08-6.5z" />
                  </svg>
                  <span>{t('googleSignIn')}</span>
                </button>
              </div>

            </form>
          )}

          {/* GOOGLE ACCOUNT CHOOSER OVERLAY */}
          {isGoogleChooserOpen && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-[32px] p-6 sm:p-8 flex flex-col justify-between z-30 animate-fade-in text-sans">
              <div className="space-y-4">
                {/* Header with Google Logo */}
                <div className="text-center pb-2 border-b border-slate-800">
                  <div className="flex justify-center mb-2">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-.125 2.76-1.5 3.7l2.45 1.9c1.43-1.32 2.2-3.25 2.2-5.43z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.9l-2.45-1.9c-1.1.75-2.52 1.2-5.48 1.2-4.22 0-7.8-2.85-9.08-6.68H.45v2.02C2.42 20.3 6.94 24 12 24z" />
                      <path fill="#FBBC05" d="M2.92 13.72a7.15 7.15 0 010-4.55V7.15H.45a11.95 11.95 0 000 9.7l2.47-1.13z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.95 1.2 15.24 0 12 0 6.94 0 2.42 3.7.45 8.13l2.47 1.13c1.27-3.83 4.85-6.5 9.08-6.5z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-black text-white tracking-tight">
                    Google
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    {t('chooseAccountTitle')}
                  </p>
                </div>

                {/* Account List - Replaced with clean custom inputs as requested */}
                <div className="space-y-3.5 pt-1">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      {currentLanguage === 'English' ? 'Email Address' : currentLanguage === 'Hindi' ? 'ईमेल पता' : 'ఈమెయిల్ చిరునామా'}
                    </label>
                    <input 
                      id="custom-google-email"
                      type="email"
                      placeholder="e.g. name@yahoo.com or name@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-600 focus:outline-none rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      {currentLanguage === 'English' ? 'Full Name' : currentLanguage === 'Hindi' ? 'पूरा नाम' : 'పూర్తి పేరు'}
                    </label>
                    <input 
                      id="custom-google-name"
                      type="text"
                      placeholder="e.g. Sanjana Nalluri"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-600 focus:outline-none rounded-xl text-xs text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const emailEl = document.getElementById('custom-google-email') as HTMLInputElement;
                      const nameEl = document.getElementById('custom-google-name') as HTMLInputElement;
                      const emailVal = emailEl ? emailEl.value.trim() : '';
                      let nameVal = nameEl ? nameEl.value.trim() : '';

                      if (!emailVal || !isValidEmail(emailVal)) {
                        setErrorMessage(t('invalidGmailError'));
                        return;
                      }

                      if (!nameVal) {
                        const namePart = emailVal.split('@')[0].replace('.', ' ');
                        nameVal = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                      }

                      handleGoogleSelect(emailVal, nameVal);
                    }}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all cursor-pointer shadow-md"
                  >
                    {currentLanguage === 'English' ? 'Verify & Sign In' : currentLanguage === 'Hindi' ? 'सत्यापित करें और साइन इन करें' : 'ధృవీకరించి లాగిన్ చేయండి'}
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => {
                    setIsGoogleChooserOpen(false);
                    setErrorMessage('');
                  }}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-800 cursor-pointer text-center"
                >
                  {currentLanguage === 'English' ? '← Back to standard login' : currentLanguage === 'Hindi' ? '← वापस जाएं' : '← వెనుకకు వెళ్ళు'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden cursor-pointer backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION - Responsive Drawer Setup */}
      <aside 
        id="sidebar-nav" 
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-slate-900 flex flex-col shrink-0 text-slate-300 transform transition-transform duration-300 ease-in-out lg:transform-none lg:transition-none lg:flex ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
                <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-[1px]" />
                </div>
              </div>
              <div>
                <span className="text-white font-black text-base tracking-tight block">{t('logoTitle')}</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest -mt-1 block">{t('logoSubtitle')}</span>
              </div>
            </div>

            {/* Quick stats on active user */}
            {sessionUser && (
              <div className="bg-slate-800/60 rounded-2xl p-4 mb-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                    {sessionUser.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{sessionUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{sessionUser.occupation} • {sessionUser.category}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                  <span>{currentLanguage === 'English' ? 'Income' : currentLanguage === 'Hindi' ? 'वार्षिक आय' : 'వార్షిక ఆదాయం'}: <b className="text-white">₹{sessionUser.annualIncome.toLocaleString('en-IN')}</b></span>
                  <span>{currentLanguage === 'English' ? 'Age' : currentLanguage === 'Hindi' ? 'आयु' : 'వయస్సు'}: <b className="text-white">{sessionUser.age} {currentLanguage === 'English' ? 'y/o' : currentLanguage === 'Hindi' ? 'वर्ष' : 'సంవత్సరాలు'}</b></span>
                </div>
              </div>
            )}

            {/* Navigation Menus */}
            <h4 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{t('mainNav')}</h4>
            <nav className="space-y-1">
              <button 
                id="nav-dash"
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{t('navDash')}</span>
              </button>

              <button 
                id="nav-navigator"
                onClick={() => {
                  setActiveTab('navigator');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'navigator' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('navNavigator')}</span>
              </button>

              <button 
                id="nav-verifier"
                onClick={() => {
                  setActiveTab('verifier');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'verifier' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('navVerifier')}</span>
              </button>

              <button 
                id="nav-chatbot"
                onClick={() => {
                  setActiveTab('chatbot');
                  setIsSidebarOpen(false);
                  // Seed initial message if chat is empty
                  if (chatMessages.length === 0) {
                    setChatMessages([
                      { id: '1', sender: 'bot', text: t('chatBotGreet'), language: currentLanguage }
                    ]);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'chatbot' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('navChatbot')}</span>
              </button>

              <button 
                id="nav-feedback"
                onClick={() => {
                  setActiveTab('feedback');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'feedback' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>{t('navFeedback')}</span>
              </button>

              <button 
                id="nav-admin"
                onClick={() => {
                  setActiveTab('admin');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'admin' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>{t('navAdmin')}</span>
              </button>
            </nav>

            {/* Custom controls / Profile edit */}
            <h4 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-6 mb-2">{t('socioStatus')}</h4>
            <div className="space-y-1">
              <button 
                onClick={() => {
                  setActiveTab('profile');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('navConfigureProfile')}</span>
              </button>
            </div>
          </div>

          {/* Bottom logout / current info */}
          <div className="border-t border-slate-800 pt-4 mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400">{t('gatewayActive')}</span>
              </div>
            </div>
            
            {sessionUser ? (
              <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl">
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-400 truncate">{t('loggedInAs')}:</p>
                  <p className="text-[11px] text-white font-bold truncate">{sessionUser.email}</p>
                </div>
                <button 
                  onClick={() => {
                    setSessionUser(null);
                    setAuthMode('login');
                    setActiveTab('profile');
                  }} 
                  title="Logout"
                  className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setActiveTab('profile');
                }}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all text-center block"
              >
                Connect account
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
         {/* TOP HEADER */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Hamburger menu button for mobile screens */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 lg:hidden focus:outline-none transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{activeTab === 'dashboard' && t('headerDash')}</span>
              <span>{activeTab === 'navigator' && t('headerNavigator')}</span>
              <span>{activeTab === 'verifier' && t('headerVerifier')}</span>
              <span>{activeTab === 'chatbot' && t('headerChatbot')}</span>
              <span>{activeTab === 'feedback' && t('headerFeedback')}</span>
              <span>{activeTab === 'admin' && t('headerAdmin')}</span>
              <span>{activeTab === 'profile' && t('headerProfile')}</span>
            </h1>
            <div className="hidden md:flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                {t('dbtReady')}
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                {t('activeYear')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Multi-language Selector widget */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => {
                  setCurrentLanguage('English');
                  setSuccessMessage("Interface configured to English support.");
                }}
                className={`px-2 py-1 text-[10px] sm:text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentLanguage === 'English' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => {
                  setCurrentLanguage('Hindi');
                  setSuccessMessage("इंटरफ़ेस को हिंदी सहायता में बदला गया।");
                }}
                className={`px-2 py-1 text-[10px] sm:text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentLanguage === 'Hindi' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HI
              </button>
              <button 
                onClick={() => {
                  setCurrentLanguage('Telugu');
                  setSuccessMessage("ఇంటర్ఫేస్ తెలుగు సహాయానికి మార్చబడింది.");
                }}
                className={`px-2 py-1 text-[10px] sm:text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentLanguage === 'Telugu' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                TE
              </button>
            </div>

            <div className="w-px h-6 bg-slate-200" />

            {/* Smart Alerts Count with Mini-popup toggler */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Toggle notifications dropdown"
              >
                <span className="text-sm">🔔</span>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white border-2 border-white rounded-full flex items-center justify-center text-[9px] font-extrabold">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Notifications Clickable Dropdown Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b">
                    <h5 className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{currentLanguage === 'English' ? 'Real-time Broadcasts' : currentLanguage === 'Hindi' ? 'वास्तविक समय प्रसारण' : 'నిజ-సమయ ప్రసారాలు'}</span>
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">2026 Live Updates</span>
                  </div>
                  <div className="space-y-3.5 max-h-64 overflow-y-auto custom-scrollbar">
                    {notifications.map((n) => {
                      const localizedN = translateNotification(n, currentLanguage);
                      const isRead = readNotifications[n.id];
                      return (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            setReadNotifications(prev => ({ ...prev, [n.id]: true }));
                            setSelectedNotification(n);
                            setIsNotifOpen(false);
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left select-none ${
                            isRead 
                              ? 'bg-slate-50/70 border-slate-100 text-slate-500 opacity-75 hover:bg-slate-100/95' 
                              : 'bg-indigo-50/50 border-indigo-100/50 text-slate-800 hover:bg-indigo-50/85 hover:border-indigo-200'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className={`font-bold block ${isRead ? 'text-slate-500 font-semibold' : 'text-slate-950 font-black'}`}>{localizedN.title}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              {isRead && <span className="text-[10px] text-emerald-600 font-extrabold" title="Read">✓</span>}
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${
                                localizedN.type === 'Deadline' || localizedN.type === 'समय सीमा' || localizedN.type === 'గడువు తేదీ' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
                              }`}>{localizedN.type}</span>
                            </div>
                          </div>
                          <p className={`text-[11px] leading-relaxed mb-1 ${isRead ? 'text-slate-400' : 'text-slate-605'}`}>{localizedN.message}</p>
                          {localizedN.deadline && (
                            <p className="text-[10px] text-red-650 font-extrabold">⚠️ {currentLanguage === 'English' ? 'Limit Date' : currentLanguage === 'Hindi' ? 'सीमा तिथि' : 'చివరి తేదీ'}: {localizedN.deadline}</p>
                          )}
                          <span className="text-[9px] text-slate-400 block pt-1">{new Date(localizedN.sentAt).toLocaleTimeString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MESSAGES SYSTEM ALERT DISPLAY */}
        {(successMessage || errorMessage) && (
          <div className="px-8 pt-4">
            {successMessage && (
              <div className="p-3.5 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-2xl flex items-center justify-between text-xs font-bold animate-fade-in">
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                  <span>{successMessage}</span>
                </span>
                <button onClick={() => setSuccessMessage('')} className="text-indigo-400 hover:text-indigo-900 cursor-pointer text-lg">×</button>
              </div>
            )}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-100 text-red-800 rounded-2xl flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2.5">
                  <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </span>
                <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-950 cursor-pointer text-lg">×</button>
              </div>
            )}
          </div>
        )}

        {/* MAIN BODY SCENE CONTEXT */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* VIEW: DASHBOARD HUD (Bento Grid Theme) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* DIRECT ALERTS & BROADCAST BULLETINS FOR CITIZEN USERS */}
              {notifications.length > 0 && (
                <div id="direct-user-announcements" className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 shadow-sm text-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b border-amber-200/50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                        📢
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
                          {currentLanguage === 'English' ? 'Official Welfare Bulletins & Deadlines' : currentLanguage === 'Hindi' ? 'आधिकारिक कल्याण बुलेटिन और समय सीमा' : 'అధికారిక సంక్షేమ బులెటిన్లు & గడువు తేదీలు'}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-bold tracking-wide">
                          {currentLanguage === 'English' ? 'REAL-TIME ANNOUNCEMENTS' : currentLanguage === 'Hindi' ? 'वास्तविक समय घोषणाएं' : 'నిజ-సమయ ప్రకటనలు'}
                        </span>
                      </div>
                    </div>
                     <span className="text-[9px] shrink-0 font-black px-2.5 py-1 bg-amber-600 text-white rounded-lg uppercase tracking-wider block sm:inline-block w-max">
                      {currentLanguage === 'English' ? `⚡ ${notifications.length} Active Notice${notifications.length > 1 ? 's' : ''}` :
                       currentLanguage === 'Hindi' ? `⚡ ${notifications.length} सक्रिय सूचना${notifications.length > 1 ? 'एँ' : ''}` :
                       `⚡ ${notifications.length} క్రియాశీల నోటీసులు`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notifications.map((n) => {
                      const localizedN = translateNotification(n, currentLanguage);
                      const isRead = readNotifications[n.id];
                      return (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            setReadNotifications(prev => ({ ...prev, [n.id]: true }));
                            setSelectedNotification(n);
                          }}
                          className={`p-4 rounded-2xl shadow-sm text-xs relative flex flex-col justify-between transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                            isRead 
                              ? 'bg-slate-50/80 border border-slate-200 text-slate-500 opacity-80' 
                              : 'bg-white border border-amber-300 hover:border-amber-400 hover:shadow-md'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className={`font-black block text-xs tracking-tight leading-snug ${isRead ? 'text-slate-600 font-semibold' : 'text-slate-950 font-black'}`}>
                                {localizedN.title}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isRead && <span className="text-[11px] text-emerald-600 font-black" title="Read status">✓</span>}
                                <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider whitespace-nowrap ${
                                  localizedN.type === 'Deadline' || localizedN.type === 'समय सीमा' || localizedN.type === 'గడువు తేదీ' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
                                }`}>{localizedN.type}</span>
                              </div>
                            </div>
                            <p className={`text-[11px] leading-relaxed mb-3 ${isRead ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>{localizedN.message}</p>
                          </div>
                          {localizedN.deadline && (
                            <p className={`text-[10px] font-extrabold flex items-center gap-1.5 mb-2 p-1.5 rounded-xl border w-max leading-none ${
                              isRead ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-red-50 text-red-650 border-red-100/50'
                            }`}>
                              <span>⚠️ {currentLanguage === 'English' ? 'Limit' : currentLanguage === 'Hindi' ? 'सीमा' : 'గడువు'}:</span>
                              <span className="font-mono bg-white px-1 py-0.5 rounded border">{localizedN.deadline}</span>
                            </p>
                          )}
                          <div className="text-[9px] text-slate-400 font-mono mt-1 pt-2 border-t border-slate-100 flex justify-between items-center">
                            <span>{currentLanguage === 'English' ? 'Yojana Saathi Net' : currentLanguage === 'Hindi' ? 'योजना साथी नेट' : 'యోజన సాథి నెట్'}</span>
                            <span>{new Date(localizedN.sentAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BENTO GRID ROW 1 - Stats Overview Banner Cards */}
              <div className="grid grid-cols-12 gap-5">
                
                {/* Dashboard Intro Hero Card */}
                <div className="col-span-12 md:col-span-5 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 font-bold text-9xl pointer-events-none select-none">AI</div>
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-500/30 text-indigo-200 text-[10px] font-bold rounded-full uppercase tracking-wider block w-max mb-3">
                      {currentLanguage === 'English' ? 'Citizen Hub Entry' : currentLanguage === 'Hindi' ? 'नागरिक हब प्रविष्टि' : 'సిటిజన్ హబ్ ప్రవేశం'}
                    </span>
                    <h2 className="text-2xl font-black mb-2 leading-tight">{t('welcomeTitle')}</h2>
                    <p className="text-xs text-indigo-200 leading-relaxed max-w-sm mb-4">
                      {t('welcomeDesc')}
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setActiveTab('navigator')}
                      className="px-5 py-2.5 bg-white text-indigo-950 hover:bg-slate-100 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{t('exploreSchemesBtn')} ({schemes.length})</span>
                      <ArrowRight className="w-4 h-4 text-indigo-900" />
                    </button>
                  </div>
                </div>

                {/* AI Document Verification Score Card */}
                <div className="col-span-12 md:col-span-4 bg-emerald-600 text-white rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center relative">
                  <div className="w-20 h-20 border-4 border-emerald-400 border-t-white rounded-full flex items-center justify-center text-2xl font-black mb-3">
                    85%
                  </div>
                  <h4 className="font-black text-sm mb-1 uppercase tracking-wider">{t('docScoreTitle')}</h4>
                  <p className="text-[11px] text-emerald-100 opacity-90 px-3 max-w-xs focus:outline-none">
                    {t('docScoreDesc')}
                  </p>
                  <button 
                    onClick={() => setActiveTab('verifier')}
                    className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-[11px] font-bold border border-emerald-400 cursor-pointer"
                  >
                    {t('launchVerifierBtn')}
                  </button>
                </div>

                {/* Mini Admin Insights Stats Box */}
                <div className="col-span-12 md:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{t('liveStats')}</h3>
                    <p className="text-xl font-black text-slate-900">{t('districtRank')}</p>
                  </div>
                  <div className="my-3 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-indigo-600">#04</span>
                    <span className="text-[11px] text-green-600 font-bold">{t('improvedStat')}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {t('rankDesc')}
                  </p>
                </div>
              </div>

              {/* BENTO GRID ROW 2 - Core App Area */}
              <div className="grid grid-cols-12 gap-5">
                
                {/* AI Recommendation Engine Card */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-sm">
                  <div className="flex justify-between items-start mb-5 pb-4 border-b">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-sans">{t('matchEngineTitle')}</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('personalRecsTitle')}</h3>
                    </div>
                    <div className="text-right">
                      {loadingAiRecs ? (
                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{t('evaluatingText')}</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-black text-indigo-600">92%</p>
                          <p className="text-[9px] font-bold text-slate-400 tracking-wide">{t('avgAccuracy')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schemes with Match Score badges and reasons */}
                  <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                    {filteredSchemes.map((scheme) => {
                      const aiMatch = aiRecs[scheme.id];
                      const score = aiMatch ? aiMatch.matchScore : (scheme.matchScore || 0);
                      const reasons = aiMatch ? [aiMatch.recommendationReason] : (scheme.matchReasons || []);
                      const tip = aiMatch?.actionTip;

                      return (
                        <div 
                          key={scheme.id} 
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('button')) return;
                            setSelectedScheme(scheme);
                            setActiveTab('navigator');
                          }}
                          className={`p-4 border rounded-2xl flex flex-col justify-between transition-all cursor-pointer ${
                            score >= 80 
                              ? 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50' 
                              : 'bg-white border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-3 mb-2.5">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl pt-0.5">
                                {scheme.category === 'Education' && '🎓'}
                                {scheme.category === 'Agriculture' && '🚜'}
                                {scheme.category === 'Women Welfare' && '🚺'}
                                {scheme.category === 'Employment' && '💼'}
                                {scheme.category === 'Health' && '⚕️'}
                                {scheme.category === 'Housing' && '🏠'}
                                {scheme.category === 'Social Welfare' && '🤝'}
                              </span>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-900">{scheme.name}</h4>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                                  {t('categoryLabel')}: {t(scheme.category)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${
                                score >= 80 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {score}% {t('matchBadge')}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 pl-9 space-y-1">
                            <p className="leading-relaxed mb-2">{scheme.description}</p>
                            
                            {/* Validation Reasons */}
                            <div className="bg-white/70 p-2.5 border border-slate-100 rounded-xl space-y-1">
                              <span className="text-[10px] font-bold text-indigo-950 block">{t('aiValLogs')}</span>
                              {reasons.map((reason, index) => (
                                <p key={index} className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 leading-relaxed">
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>{translateMatchReason(reason, currentLanguage)}</span>
                                </p>
                              ))}
                              {tip && (
                                <p className="text-[10px] text-indigo-600 font-extrabold mt-1">
                                  💡 {t('aiNextAction')} {translateActionTip(tip, currentLanguage)}
                                </p>
                              )}
                            </div>

                            {/* Actions buttons */}
                            <div className="flex gap-2 pt-2.5">
                              <button 
                                onClick={() => initiateEnrollment(scheme.id, scheme.name)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-sm"
                              >
                                {t('initiateRoadmapBtn')}
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedScheme(scheme);
                                  setActiveTab('navigator');
                                }}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold cursor-pointer"
                              >
                                {t('reviewDetailsBtn')}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Categories Quick Access & Current Progress Card */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                       <LayoutGrid className="w-4 h-4 text-slate-400" />
                      <span>{t('schemeCatsTitle')}</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {categoryMetas.map((catMeta) => (
                        <div 
                          key={catMeta.title} 
                          onClick={() => {
                            setSelectedCategory(catMeta.cat);
                            setActiveTab('navigator');
                          }}
                          className={`p-3.5 border rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.02] transition-all ${catMeta.color}`}
                        >
                          <span className="text-2xl mb-1.5">{catMeta.icon}</span>
                          <span className="text-[11px] font-black leading-snug">{catMeta.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Roadmaps Trackers */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 block">
                      {t('enrollProgressTitle')}
                    </h4>
                    
                    {roadmaps.length > 0 ? (
                      <div className="space-y-4 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                        {roadmaps.slice(0, 5).map((rm) => (
                          <div key={rm.id} className="p-3 bg-slate-900 text-white rounded-2xl">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-extrabold truncate w-[70%]">
                                {localizedSchemesList.find(s => s.id === rm.schemeId)?.name || rm.schemeName}
                              </span>
                              <span className="text-[10px] bg-indigo-500 px-1.5 py-0.5 rounded font-black">{rm.progress}%</span>
                            </div>
                            
                            <div className="h-1.5 bg-slate-800 rounded-full mb-2">
                              <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${rm.progress}%` }} />
                            </div>
                            
                            {/* Next pending task */}
                            {(() => {
                              const nextTask = rm.tasks.find(t => t.status !== 'Completed');
                              if (nextTask) {
                                const localizedTask = getLocalizedTask(nextTask, currentLanguage);
                                return (
                                  <p className="text-[9px] text-slate-300 font-semibold truncate">
                                    {currentLanguage === 'English' ? 'Next' : currentLanguage === 'Hindi' ? 'अगला' : 'తరువాత'}: {localizedTask.title}
                                  </p>
                                );
                              }
                              return (
                                <p className="text-[9px] text-emerald-400 font-extrabold">
                                  {currentLanguage === 'English' ? '✓ Fully Ready! Ready to receive DBT credits.' : currentLanguage === 'Hindi' ? '✓ पूरी तरह से तैयार! डीबीटी क्रेडिट प्राप्त करने के लिए तैयार।' : '✓ పూర్తిగా సిద్ధంగా ఉంది! DBT క్రెడిట్‌లను స్వీకరించడానికి సిద్ధంగా ఉంది.'}
                                </p>
                              );
                            })()}

                            {/* View steps */}
                            <button 
                              onClick={() => {
                                setActiveRoadmap(rm);
                                setActiveTab('dashboard'); // Keeps on dashboard, scrolling down to tracking area
                              }}
                              className="text-[9px] text-indigo-300 font-extrabold hover:underline mt-1 pt-1.5 border-t border-slate-800 block w-full text-left cursor-pointer"
                            >
                              {t('expandRoadmapChecklist')}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">{t('noEnrollmentsYet')}</p>
                        <button 
                          onClick={() => setActiveTab('navigator')}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          {t('selectSchemeToEnroll')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ROADMAP ROADMAP SECTION IN DASHBOARD */}
              {activeRoadmap && (
                <div id="active-roadmap-section" className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
                  <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest block mb-1">
                        MODULE 11: ROADMAP CHECKLIST
                      </span>
                      <h3 className="text-xl font-black text-white">
                        {currentLanguage === 'English' ? 'Enrollment Roadmap' : currentLanguage === 'Hindi' ? 'नामांकन रोडमैप' : 'నమోదు రోడ్‌మ్యాప్'}: {localizedSchemesList.find(s => s.id === activeRoadmap.schemeId)?.name || activeRoadmap.schemeName}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-indigo-400">{activeRoadmap.progress}%</p>
                      <p className="text-[9px] text-slate-400 font-bold">Overall Progress Percentage</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    {/* Step-by-Step interactive guide */}
                    <div className="col-span-12 md:col-span-7 space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Interactive tasks checklist</h4>
                      {activeRoadmap.tasks.map((task, index) => (
                        <div 
                          key={task.id} 
                          onClick={() => handleToggleTask(activeRoadmap.schemeId, task.id, task.status)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                            task.status === 'Completed' 
                              ? 'bg-indigo-800/20 border-indigo-500/50 text-white' 
                              : task.status === 'In Progress' 
                              ? 'bg-slate-800 border-yellow-500/50 text-white'
                              : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-5 h-5 bg-slate-700 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            {(() => {
                              const localizedTask = getLocalizedTask(task, currentLanguage);
                              return (
                                <div>
                                  <p className="text-xs font-extrabold text-white">{localizedTask.title}</p>
                                  <p className="text-[10px] text-slate-400 leading-normal">{localizedTask.description}</p>
                                </div>
                              );
                            })()}
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            task.status === 'Completed' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Associated documents uploaded checklist */}
                    <div className="col-span-12 md:col-span-5 bg-slate-800/40 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">{t('requiredDocsChecklist')}</h4>
                        <div className="space-y-3">
                          {activeRoadmap.uploadedDocuments.map((doc, i) => {
                            const docKey = `${activeRoadmap.schemeId}-${doc.docName}`;
                            const offlineState = offlineDocsStates[docKey] || {
                              enabled: false,
                              step1: false,
                              step2: false,
                              step3: false,
                              step4: false,
                              step5: false
                            };
                            
                            return (
                              <div key={i} className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/50 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="truncate pr-2 font-black text-slate-200">{doc.docName}</span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {doc.verified ? (
                                      <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider">
                                        ✓ Verified
                                      </span>
                                    ) : (
                                      <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                                        Pending Action
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {doc.verified && doc.notes && (
                                  <p className="text-[10px] text-emerald-300 italic bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/30">
                                    {doc.notes}
                                  </p>
                                )}

                                {/* If not verified, offer both AI check and Offline Submissions options */}
                                {!doc.verified && (
                                  <div className="pt-1.5 space-y-2">
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => {
                                          setSelectedVerifySchemeId(activeRoadmap.schemeId);
                                          selectMockTemplateForDoc(doc.docName);
                                          setActiveTab('verifier');
                                        }}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center"
                                      >
                                        🚀 {t('verifyByAIBtn')}
                                      </button>
                                      
                                      <button 
                                        onClick={() => {
                                          setOfflineDocsStates(prev => ({
                                            ...prev,
                                            [docKey]: {
                                              ...offlineState,
                                              enabled: !offlineState.enabled
                                            }
                                          }));
                                        }}
                                        className={`flex-1 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center border ${
                                          offlineState.enabled 
                                            ? 'bg-amber-600 border-amber-500 text-white hover:bg-amber-500' 
                                            : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                                        }`}
                                      >
                                        📂 {offlineState.enabled ? t('digitalVerificationRestore') : t('enableOfflineSubToggle')}
                                      </button>
                                    </div>

                                    {/* Physical submission requirement checklist */}
                                    {offlineState.enabled && (
                                      <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-600/30 space-y-2.5 transition-all">
                                        <p className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wide">
                                          📋 {t('offlineChecklistHeader')}
                                        </p>
                                        
                                        <div className="space-y-2">
                                          {/* Step 1 */}
                                          <label className="flex items-start gap-2 cursor-pointer select-none">
                                            <input 
                                              type="checkbox" 
                                              checked={offlineState.step1} 
                                              onChange={() => setOfflineDocsStates(prev => ({
                                                ...prev,
                                                [docKey]: { ...offlineState, step1: !offlineState.step1 }
                                              }))}
                                              className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                                            />
                                            <span className="text-[10px] text-slate-300 leading-normal font-medium">{t('offlineStep1')}</span>
                                          </label>

                                          {/* Step 2 */}
                                          <label className="flex items-start gap-2 cursor-pointer select-none">
                                            <input 
                                              type="checkbox" 
                                              checked={offlineState.step2} 
                                              onChange={() => setOfflineDocsStates(prev => ({
                                                ...prev,
                                                [docKey]: { ...offlineState, step2: !offlineState.step2 }
                                              }))}
                                              className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                                            />
                                            <span className="text-[10px] text-slate-300 leading-normal font-medium">{t('offlineStep2')}</span>
                                          </label>

                                          {/* Step 3 */}
                                          <label className="flex items-start gap-2 cursor-pointer select-none">
                                            <input 
                                              type="checkbox" 
                                              checked={offlineState.step3} 
                                              onChange={() => setOfflineDocsStates(prev => ({
                                                ...prev,
                                                [docKey]: { ...offlineState, step3: !offlineState.step3 }
                                              }))}
                                              className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                                            />
                                            <span className="text-[10px] text-slate-300 leading-normal font-medium">{t('offlineStep3')}</span>
                                          </label>

                                          {/* Step 4 */}
                                          <label className="flex items-start gap-2 cursor-pointer select-none">
                                            <input 
                                              type="checkbox" 
                                              checked={offlineState.step4} 
                                              onChange={() => setOfflineDocsStates(prev => ({
                                                ...prev,
                                                [docKey]: { ...offlineState, step4: !offlineState.step4 }
                                              }))}
                                              className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                                            />
                                            <span className="text-[10px] text-slate-300 leading-normal font-medium">{t('offlineStep4')}</span>
                                          </label>

                                          {/* Step 5 */}
                                          <label className="flex items-start gap-2 cursor-pointer select-none">
                                            <input 
                                              type="checkbox" 
                                              checked={offlineState.step5} 
                                              onChange={() => setOfflineDocsStates(prev => ({
                                                ...prev,
                                                [docKey]: { ...offlineState, step5: !offlineState.step5 }
                                              }))}
                                              className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                                            />
                                            <span className="text-[10px] text-slate-300 leading-normal font-medium">{t('offlineStep5')}</span>
                                          </label>
                                        </div>

                                        <button 
                                          disabled={!(offlineState.step1 && offlineState.step2 && offlineState.step3 && offlineState.step4 && offlineState.step5)}
                                          onClick={() => handleMarkSubmittedOffline(activeRoadmap.schemeId, doc.docName)}
                                          className={`w-full py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center text-white ${
                                            (offlineState.step1 && offlineState.step2 && offlineState.step3 && offlineState.step4 && offlineState.step5)
                                              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30'
                                              : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                                          }`}
                                        >
                                          📝 {t('markAsSubmittedOfflineBtn')}
                                        </button>
                                        
                                        {!(offlineState.step1 && offlineState.step2 && offlineState.step3 && offlineState.step4 && offlineState.step5) && (
                                          <p className="text-[9px] text-amber-500/80 text-center leading-normal">
                                            ⚠️ Complete all checklist items to register physical file submission.
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-800/80">
                        <p className="text-[10px] text-slate-400 leading-normal">
                          💡 <b>Pro-Tip:</b> {t('proTipText')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLOATING ACTION BUTTON FOR CHATBOT */}
              <div className="fixed bottom-6 right-6 z-40 group">
                <button
                  onClick={() => setActiveTab('chatbot')}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full p-4 md:px-5 md:py-3.5 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-indigo-500/30"
                  aria-label="Open Welfare AI Chatbot"
                  id="dashboard-chatbot-fab"
                >
                  <MessageSquare className="w-5 h-5 animate-bounce" />
                  <span className="hidden md:inline font-bold text-xs tracking-tight">
                    {currentLanguage === 'English' ? 'Varta AI Chatbot' : currentLanguage === 'Hindi' ? 'वार्ता एआई चैटबॉट' : 'వార్తా ఏఐ చాట్‌బాట్'}
                  </span>
                </button>
                <div className="absolute right-0 bottom-full mb-2.5 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold shadow pointer-events-none">
                  {currentLanguage === 'English' ? 'Chat with AI Assistant' : currentLanguage === 'Hindi' ? 'एआई सहायक के साथ चैट करें' : 'AI సహాయకుడితో చాట్ చేయండి'}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SCHEMES NAVIGATOR */}
          {activeTab === 'navigator' && (
            <div className="space-y-6">
              
              {/* Filter controls */}
              <div className="flex flex-wrap gap-2.5 p-1 bg-white border border-slate-200 rounded-2xl w-max">
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4.5 py-2 hover:bg-slate-50 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    selectedCategory === 'All' ? 'bg-slate-900 text-white hover:bg-slate-900' : 'text-slate-600'
                  }`}
                >
                  {t('clearFilter')}
                </button>
                {categoryMetas.map((catMeta) => (
                  <button 
                    key={catMeta.title}
                    onClick={() => setSelectedCategory(catMeta.cat)}
                    className={`px-4.5 py-2 hover:bg-slate-50 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      selectedCategory === catMeta.cat ? 'bg-indigo-600 text-white hover:bg-indigo-600 font-extrabold' : 'text-slate-600'
                    }`}
                  >
                    {catMeta.icon} {t(catMeta.cat)}
                  </button>
                ))}
              </div>

              {/* Main schemes grid and details block split */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* Schemes list container */}
                <div className="col-span-12 md:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Available Schemes List ({filteredSchemes.length})</h3>
                  {filteredSchemes.map((scheme) => (
                    <div 
                      key={scheme.id}
                      onClick={() => setSelectedScheme(scheme)}
                      className={`p-4 border rounded-3xl cursor-pointer hover:border-indigo-400 transition-all ${
                        selectedScheme?.id === scheme.id 
                          ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-100' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h4 className="font-extrabold text-sm text-slate-950 leading-snug">{scheme.name}</h4>
                        <span className="text-xl">
                          {scheme.category === 'Education' && '🎓'}
                          {scheme.category === 'Agriculture' && '🚜'}
                          {scheme.category === 'Women Welfare' && '🚺'}
                          {scheme.category === 'Employment' && '💼'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 mb-2">{scheme.description}</p>
                      
                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100">
                        <span className="text-indigo-600 font-bold">{t(scheme.category)} {t('Category')}</span>
                        <span className="text-slate-400">{t('faqsLabel')}: {scheme.faqs.length} {currentLanguage === 'Hindi' ? 'सूचीबद्ध' : currentLanguage === 'Telugu' ? 'జాబితా చేయబడింది' : 'listed'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Scheme detailed display card */}
                <div className="col-span-12 md:col-span-7">
                  {localizedSelectedScheme ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                      
                      {/* Title block */}
                      <div className="flex justify-between items-start pb-4 border-b">
                        <div>
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase">
                            {t(localizedSelectedScheme.category)} {t('Scheme')}
                          </span>
                          <h2 className="text-xl font-black text-slate-950 mt-1">{localizedSelectedScheme.name}</h2>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{localizedSelectedScheme.description}</p>
                        </div>
                        <span className="text-4xl">
                          {localizedSelectedScheme.category === 'Education' && '🎓'}
                          {localizedSelectedScheme.category === 'Agriculture' && '🚜'}
                          {localizedSelectedScheme.category === 'Women Welfare' && '🚺'}
                          {localizedSelectedScheme.category === 'Employment' && '💼'}
                          {localizedSelectedScheme.category === 'Health' && '⚕️'}
                          {localizedSelectedScheme.category === 'Housing' && '🏠'}
                          {localizedSelectedScheme.category === 'Social Welfare' && '🤝'}
                        </span>
                      </div>

                      {/* Benefits & Details */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">{t('keyBenefitsLabel')}</h4>
                        <ul className="space-y-2">
                          {localizedSelectedScheme.benefits.map((benefit, i) => (
                            <li key={i} className="text-xs text-slate-800 flex items-start gap-2.5">
                              <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                              <span className="font-medium">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Eligibility block */}
                      <div className="bg-slate-50 rounded-2xl p-4 border text-xs">
                        <h4 className="font-extrabold text-slate-950 flex items-center gap-2 mb-1.5">
                          <AlertCircle className="w-4.5 h-4.5 text-indigo-600" />
                          <span>{t('viewEligibilityDetails')}</span>
                        </h4>
                        <p className="text-slate-600 font-medium leading-relaxed mb-3">{localizedSelectedScheme.eligibilityDescription}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-200">
                          <div>{t('minAgeReq')}: <b className="text-slate-900">{localizedSelectedScheme.minAge || (currentLanguage === 'English' ? 'Any' : currentLanguage === 'Hindi' ? 'कोई भी' : 'ఏదైనా')} {currentLanguage === 'English' ? 'y/o' : currentLanguage === 'Hindi' ? 'वर्ष' : 'సంవత్సరాలు'}</b></div>
                          <div>{t('incomeLimitLabel')}: <b className="text-slate-900">{localizedSelectedScheme.maxIncome ? `₹${localizedSelectedScheme.maxIncome.toLocaleString('en-IN')}` : (currentLanguage === 'English' ? 'No limit' : currentLanguage === 'Hindi' ? 'कोई सीमा नहीं' : 'పరిమితి లేదు')}</b></div>
                          <div>{currentLanguage === 'English' ? 'Allowed Castes' : currentLanguage === 'Hindi' ? 'अनुमत जातियां' : 'అనుమతించబడిన సామాజిక వర్గాలు'}: <b className="text-slate-900">{localizedSelectedScheme.allowedCategories?.join(', ') || t('unrestrictedCategory')}</b></div>
                          <div>{currentLanguage === 'English' ? 'Allowed Genders' : currentLanguage === 'Hindi' ? 'अनुमत लिंग' : 'అనుమతించబడిన లింగాలు'}: <b className="text-slate-900">{localizedSelectedScheme.allowedGenders?.map(g => g === 'Male' ? (currentLanguage === 'English' ? 'Male' : currentLanguage === 'Hindi' ? 'पुरुष' : 'పురుషులు') : g === 'Female' ? (currentLanguage === 'English' ? 'Female' : currentLanguage === 'Hindi' ? 'महिला' : 'మహిళలు') : g).join(', ') || t('unrestrictedGender')}</b></div>
                        </div>
                      </div>

                      {/* Steps to apply */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">{t('applicationSteps')}</h4>
                        <div className="space-y-3">
                          {localizedSelectedScheme.applicationProcess.map((step, i) => (
                            <div key={i} className="flex gap-3 text-xs leading-normal">
                              <span className="w-5 h-5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-slate-700 font-medium">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Required Documents list */}
                      <div className="p-4 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
                        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">{t('requiredDocumentsLabel')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {localizedSelectedScheme.requiredDocuments.map((doc, i) => (
                            <span 
                              key={i} 
                              onClick={() => {
                                selectMockTemplateForDoc(doc);
                                setSelectedVerifySchemeId(localizedSelectedScheme.id);
                                setActiveTab('verifier');
                              }}
                              className="text-[10px] bg-slate-800 hover:bg-indigo-600 transition-colors text-slate-100 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                            >
                              📁 {doc}
                            </span>
                          ))}
                        </div>
                        <p className="text-[9px] text-slate-400 mt-2 block italic">Click any document type to select for AI pre-testing scanner.</p>
                      </div>

                      {/* Frequently Asked Questions */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">{t('faqsHeader')}</h4>
                        <div className="space-y-3">
                          {localizedSelectedScheme.faqs.map((faq, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                              <p className="font-extrabold text-slate-900 mb-1">Q: {faq.question}</p>
                              <p className="text-slate-600 leading-normal">A: {faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Enroll roadmap command */}
                      <div className="pt-4 border-t flex gap-3">
                        <button 
                          onClick={() => initiateEnrollment(localizedSelectedScheme.id, localizedSelectedScheme.name)}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-indigo-500 cursor-pointer"
                        >
                          🚀 {t('initiateRoadmapBtn')}
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400">
                      Please select an Indian welfare scheme from the listing column.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* VIEW: AI DOCUMENT VERIFIER */}
          {activeTab === 'verifier' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-12 gap-6">
                
                {/* Controller inputs form */}
                <div className="col-span-12 md:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <div className="mb-4">
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest block">MODULE 9: AI VERIFICATION SYSTEM</span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">Check Document Readiness for Schemes</h3>
                    <p className="text-xs text-slate-500 leading-normal mt-1.5">
                      Verify if your scanned card parameters match correct rules, detect potential typos, missing components, or mismatch values.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyDocument} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Scheme Target context</label>
                      <select 
                        value={selectedVerifySchemeId}
                        onChange={(e) => {
                          setSelectedVerifySchemeId(e.target.value);
                          // Auto select first document of that scheme
                          const target = localizedSchemesList.find(s => s.id === e.target.value);
                          if (target && target.requiredDocuments.length > 0) {
                            selectMockTemplateForDoc(target.requiredDocuments[0]);
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:outline-none"
                      >
                        <option value="">-- General Verification (No Scheme context) --</option>
                        {localizedSchemesList.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Document Class Type</label>
                      <select 
                        value={verifyDocName}
                        onChange={(e) => selectMockTemplateForDoc(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="">-- Select Document Category --</option>
                        <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                        <option value="Income Certificate (under 2.5 LPA)">Income Certificate</option>
                        <option value="Caste Certificate (OBC/EBC/DNT)">Caste Certificate (Caste OBC/SC/ST)</option>
                        <option value="Land Ownership Records (Khatauni/Patta)">Land Passbook / Khatauni Records</option>
                        <option value="Bank Account Passbook (Aadhar-seeded)">Bank Passbook Cover (Aadhar seeded)</option>
                      </select>
                    </div>

                    {/* Pre-fill mock suggestions templates buttons */}
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Try template presets (Demo OCR contents)</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button 
                          type="button"
                          onClick={() => selectMockTemplateForDoc("Aadhaar Card")}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-bold hover:bg-slate-200"
                        >
                          Aadhaar Sample
                        </button>
                        <button 
                          type="button"
                          onClick={() => selectMockTemplateForDoc("Income Certificate (under 2.5 LPA)")}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-bold hover:bg-slate-200"
                        >
                          Income Sample
                        </button>
                        <button 
                          type="button"
                          onClick={() => selectMockTemplateForDoc("Caste Certificate (OBC/EBC/DNT)")}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-bold hover:bg-slate-200"
                        >
                          Caste Sample
                        </button>
                        <button 
                          type="button"
                          onClick={() => selectMockTemplateForDoc("Land Ownership Records (Khatauni/Patta)")}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-bold hover:bg-slate-200"
                        >
                          Land Sample
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Scanned text OCR Data / Description content</label>
                      <textarea 
                        rows={6}
                        value={verifyTextContent}
                        onChange={(e) => setVerifyTextContent(e.target.value)}
                        placeholder="Paste document text extracts here. Ensure name values and income integers are legibly described for analysis."
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={verificationLoading}
                      className="w-full py-3 bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 rounded-xl text-xs font-black transition-all cursor-pointer shadow flex items-center justify-center gap-2"
                    >
                      {verificationLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>AI Scanning Content...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Run Document Analysis Checklist</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Return Result display panel wrapper */}
                <div className="col-span-12 md:col-span-6">
                  {verificationResult ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                      
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                            Tested: {verificationResult.docName}
                          </span>
                          <h4 className="font-black text-lg text-slate-950 mt-1">Verification Report</h4>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1.5 rounded-xl font-black text-xs ${
                            verificationResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                          }`}>
                            {verificationResult.success ? "✓ READY" : "⚠️ WARNING"}
                          </span>
                        </div>
                      </div>

                      {/* Score metrics bento tile */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900 text-white rounded-2xl text-center">
                          <p className="text-3xl font-black text-indigo-400">{verificationResult.readinessScore}%</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Readiness Score</p>
                        </div>
                        <div className="p-4 bg-slate-50 border rounded-2xl flex flex-col justify-center">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Status Check</p>
                          <p className="text-xs font-extrabold text-slate-900 mt-1">
                            {verificationResult.success ? "All vital indices matches." : "Mismatch/missing key indices."}
                          </p>
                        </div>
                      </div>

                      {/* Status Check Note text */}
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Verification Notes</h5>
                        <p className="bg-slate-50 p-4 border rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
                          {verificationResult.notes}
                        </p>
                      </div>

                      {/* Missing credentials list */}
                      {verificationResult.missingDocuments && verificationResult.missingDocuments.length > 0 && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                          <h5 className="text-[10px] font-bold text-red-900 uppercase tracking-widest mb-1.5">
                            Associated / Missing Documents Checklist Recommendations:
                          </h5>
                          <ul className="space-y-1.5">
                            {verificationResult.missingDocuments.map((m, i) => (
                              <li key={i} className="text-[11px] text-red-800 flex items-start gap-1.5 font-medium leading-relaxed">
                                <AlertCircle className="w-3.5 h-3.5 text-red-650 shrink-0 mt-0.5" />
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-slate-100 p-3 rounded-xl border text-[10px] text-slate-500 leading-normal">
                        ℹ️ <b>Security Disclaimer:</b> AI Verifications are pre-evaluative helpers to ease offline processing. Direct authority offices make all final validation calls.
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400 h-full flex flex-col items-center justify-center space-y-3">
                      <ShieldCheck className="w-12 h-12 text-slate-350" />
                      <p className="text-xs font-bold">Please complete and run the scanning form to display results.</p>
                      <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                        Our dynamic system processes credentials under the official Ministry specifications (e.g. Income tax limit checks).
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* VIEW: MULTILINGUAL CHATBOT */}
          {activeTab === 'chatbot' && (
            <div className="space-y-6">
              
              {/* Info panel */}
              <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl flex justify-between items-center shadow-md">
                <div>
                  <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block">VARTA HELPDESK</span>
                  <h3 className="text-lg font-black mt-0.5">Varta Multilingual AI Assistant</h3>
                  <p className="text-[11px] text-slate-300">
                    Get answers in English, Hindi, and Telugu. Fully personalized to your demographic status.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                
                {/* Chat window interface box */}
                <div className="col-span-12 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 p-5 flex flex-col h-[520px]">
                  
                  {/* Message History display overflow */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-3.5 mb-4 pr-1">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 max-w-[85%] ${
                          msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                          msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-900'
                        }`}>
                          {msg.sender === 'user' ? 'C' : '🤖'}
                        </div>

                        {/* Content text */}
                        <div className={`p-4 rounded-3xl text-xs leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-650 text-white rounded-tr-none bg-indigo-600' 
                            : 'bg-white text-slate-900 rounded-tl-none border shadow-sm'
                        }`}>
                          <p className="font-semibold whitespace-pre-wrap">{msg.text}</p>
                          
                          {/* Audio TTS toggle simulation */}
                          {msg.sender === 'bot' && (
                            <button 
                              onClick={() => handleVoiceSimulate(msg.id, msg.text)}
                              className={`mt-2.5 flex items-center gap-1.5 px-3 py-1 border rounded-lg text-[9px] font-extrabold cursor-pointer transition-all ${
                                voicedMessageId === msg.id 
                                  ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse' 
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{voicedMessageId === msg.id ? "Playing simulation voice..." : "Click to play simulated voice (TTS)"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                          🤖
                        </div>
                        <div className="p-3 bg-white border rounded-2xl rounded-tl-none border-slate-100 flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form line */}
                  <form onSubmit={handleChatSubmit} className="relative mt-auto">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={t('chatInputPlaceholder')}
                      className="w-full px-5 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 text-xs shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 pr-16"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black cursor-pointer hover:bg-indigo-600 transition-colors"
                    >
                      SEND
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: RATINGS AND FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-12 gap-6">
                
                {/* Form to submit feedback */}
                <div className="col-span-12 md:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <div className="mb-4">
                    <span className="text-[10px] text-pink-600 font-bold uppercase tracking-widest block">
                      {currentLanguage === 'English' ? 'MODULE 7: FEEDBACK' : currentLanguage === 'Hindi' ? 'मॉड्यूल 7: प्रतिक्रिया' : 'మాడ్యూల్ 7: ఫీడ్‌బ్యాక్'}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{t('logFeedbackHeader')}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-normal">
                      {currentLanguage === 'English' ? 'Share your experience on scheme application timelines or report any administrative issues.' :
                       currentLanguage === 'Hindi' ? 'योजना आवेदन समय-सीमा पर अपना अनुभव साझा करें या किसी प्रशासनिक मुद्दे की रिपोर्ट करें।' :
                       'పథకం దరఖాస్తు గడువుల గురించి మీ అనుభవాన్ని పంచుకోండి లేదా ఏదైనా పరిపాలనాపరమైన సమస్యలను నివేదించండి.'}
                    </p>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('selectWelfareScheme')}</label>
                      <select 
                        value={newFeedback.schemeId}
                        onChange={(e) => setNewFeedback(prev => ({ ...prev, schemeId: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100"
                        required
                      >
                        <option value="">
                          {currentLanguage === 'English' ? '-- Choose Scheme --' :
                           currentLanguage === 'Hindi' ? '-- योजना चुनें --' :
                           '-- పథకాన్ని ఎంచుకోండి --'}
                        </option>
                        {localizedSchemesList.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {currentLanguage === 'English' ? 'Rating Score' :
                         currentLanguage === 'Hindi' ? 'रेटिंग स्कोर' :
                         'రేటింగ్ స్కోరు'}
                      </label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map((stars) => (
                          <button 
                            key={stars}
                            type="button"
                            onClick={() => setNewFeedback(prev => ({ ...prev, rating: stars }))}
                            className={`w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer text-sm font-bold ${
                              newFeedback.rating >= stars 
                                ? 'bg-indigo-650 border-indigo-600 text-amber-500 bg-indigo-50 border-2' 
                                : 'text-slate-400'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('ratingCategory')}</label>
                      <select 
                        value={newFeedback.issueType}
                        onChange={(e) => setNewFeedback(prev => ({ ...prev, issueType: e.target.value as any }))}
                        className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="General Feedback">
                          {currentLanguage === 'English' ? 'General Feedback' :
                           currentLanguage === 'Hindi' ? 'सामान्य प्रतिक्रिया' :
                           'సాధారణ ఫీడ్‌బ్యాక్'}
                        </option>
                        <option value="Technical Issue">
                          {currentLanguage === 'English' ? 'Technical / Server Issue' :
                           currentLanguage === 'Hindi' ? 'तकनीकी / सर्वर समस्या' :
                           'సాంకేతిక / సర్వర్ సమస్య'}
                        </option>
                        <option value="Information Mismatch">
                          {currentLanguage === 'English' ? 'Information Mismatch' :
                           currentLanguage === 'Hindi' ? 'जानकारी बेमेल' :
                           'సమాచార అసమానత'}
                        </option>
                        <option value="Application Help Needed">
                          {currentLanguage === 'English' ? 'Direct Application Help Needed' :
                           currentLanguage === 'Hindi' ? 'प्रत्यक्ष आवेदन सहायता आवश्यक' :
                           'ప్రత్యక్ష దరఖాస్తు సహాయం అవసరం'}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {currentLanguage === 'English' ? 'Your Testimony / Comments' :
                         currentLanguage === 'Hindi' ? 'आपकी गवाही / टिप्पणियां' :
                         'మీ అభిప్రायాలు / వ్యాఖ్యలు'}
                      </label>
                      <textarea 
                        rows={4}
                        value={newFeedback.comment}
                        onChange={(e) => setNewFeedback(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder={t('feedbackCommentPlaceholder')}
                        className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow"
                    >
                      {t('submitFeedbackBtn')}
                    </button>
                  </form>
                </div>

                {/* Existing testimonies column */}
                <div className="col-span-12 md:col-span-7 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {currentLanguage === 'English' ? 'Recent Public Feedback Reports' : currentLanguage === 'Hindi' ? 'हालिया सार्वजनिक प्रतिक्रिया रिपोर्ट' : 'ఇటీవలి పౌర అభిప్రాయాలు & సమీక్షలు'} ({feedbacks.length})
                  </h3>
                  
                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto">
                    {feedbacks.map((fb) => (
                      <div key={fb.id} className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-extrabold text-xs text-slate-950 block">{fb.userName}</span>
                            <span className="text-[9px] text-slate-400 block">{new Date(fb.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`text-xs ${i < fb.rating ? 'text-amber-500' : 'text-slate-200'}`}>★</span>
                            ))}
                          </div>
                        </div>

                        {fb.schemeName && (
                          <span className="inline-block text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full mb-2">
                            {currentLanguage === 'English' ? 'Scheme' : currentLanguage === 'Hindi' ? 'योजना' : 'పథకం'}: {(fb.schemeId && localizedSchemesList.find(s => s.id === fb.schemeId)?.name) || fb.schemeName}
                          </span>
                        )}

                        <p className="text-slate-700 text-xs font-medium leading-relaxed mb-3">"{fb.comment}"</p>
                        
                        <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100">
                          <span className="text-slate-500">
                            {currentLanguage === 'English' ? 'Category:' : currentLanguage === 'Hindi' ? 'श्रेणी:' : 'వర్గం:'} <b className="text-slate-700">{fb.issueType}</b>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: ADMIN INSIGHTS PLATFORM */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              


              {/* Statistical Metrics Cards */}
              {adminMetrics ? (
                <div className="space-y-6">
                  
                  {/* BENTO STATISTICS ROW */}
                  <div className="grid grid-cols-12 gap-5">
                    
                    {/* Metrics 1 */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {currentLanguage === 'English' ? 'Total Active Beneficiaries' : currentLanguage === 'Hindi' ? 'कुल सक्रिय लाभार्थी' : 'మొత్తం యాక్టివ్ లబ్ధిదారులు'}
                      </p>
                      <p className="text-4xl font-black text-slate-900 mt-2">{adminMetrics.metrics.totalUsers}</p>
                      <p className="text-[10px] text-green-600 font-extrabold mt-1">
                        {currentLanguage === 'English' ? '✓ Live SECC-2011 synced' : currentLanguage === 'Hindi' ? '✓ लाइव SECC-2011 सिंक किया गया' : '✓ ప్రత్యక్ష SECC-2011 సమకాలీకరించబడింది'}
                      </p>
                    </div>

                    {/* Metrics 2 */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {currentLanguage === 'English' ? 'Hosted Welfare Schemes' : currentLanguage === 'Hindi' ? 'होस्ट की गई कल्याणकारी योजनाएं' : 'హోస్ట్ చేయబడిన సంక్షేమ పథకాలు'}
                      </p>
                      <p className="text-4xl font-black text-indigo-600 mt-2">{adminMetrics.metrics.totalSchemes}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">
                        {currentLanguage === 'English' ? '7 Central • 5 State level' : currentLanguage === 'Hindi' ? '7 केंद्रीय • 5 राज्य स्तर' : '7 కేంద్రం • 5 రాష్ట్ర స్థాయి'}
                      </p>
                    </div>

                    {/* Metrics 3 */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {currentLanguage === 'English' ? 'Average Platform Rating' : currentLanguage === 'Hindi' ? 'औसत प्लेटफ़ॉर्म रेटिंग' : 'సగటు ప్లాట్‌ఫారమ్ రేటింగ్'}
                      </p>
                      <p className="text-4xl font-black text-amber-500 mt-2">⭐ {adminMetrics.metrics.averageRating}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">
                        {currentLanguage === 'English' ? 'Based on citizen reviews' : currentLanguage === 'Hindi' ? 'नागरिक समीक्षाओं के आधार पर' : 'పౌరుల సమీక్షల ఆధారంగా'}
                      </p>
                    </div>

                    {/* Metrics 4 */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {currentLanguage === 'English' ? 'Support Tickets Solved' : currentLanguage === 'Hindi' ? 'सहायता टिकट हल किए गए' : 'పరిష్కరించబడిన సహాయ టిక్కెట్లు'}
                      </p>
                      <p className="text-4xl font-black text-emerald-600 mt-2">
                        {adminMetrics.metrics.resolvedIssues} / {adminMetrics.metrics.resolvedIssues + adminMetrics.metrics.pendingIssues}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">
                        {currentLanguage === 'English' ? 'Resolved automatically' : currentLanguage === 'Hindi' ? 'स्वचालित रूप से हल किया गया' : 'స్వయంచాలకంగా పరిష్కరించబడింది'}
                      </p>
                    </div>

                  </div>

                  {/* BENTO GRAPHICS DISPLAY */}
                  <div className="grid grid-cols-12 gap-5">
                    
                    {/* Scheme Enrollment counts */}
                    <div className="col-span-12 md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        {currentLanguage === 'English' ? 'Beneficiary Enrollment Counts by Scheme' : currentLanguage === 'Hindi' ? 'योजना के अनुसार लाभार्थी नामांकन संख्या' : 'పథకం వారీగా లబ్ధిదారుల నమోదు సంఖ్య'}
                      </h4>
                      
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {adminMetrics.schemeEnrollmentStats.map((stat: any, i: number) => {
                          // Calculate mock width ratio
                          const maxVal = 30;
                          const perc = Math.min(100, Math.round((stat.enrollments / maxVal) * 100));

                          return (
                            <div key={i} className="space-y-1 text-xs">
                              <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-slate-900 truncate pr-4">
                                  {(stat.schemeId && localizedSchemesList.find(s => s.id === stat.schemeId)?.name) || stat.name}
                                </span>
                                <span className="text-indigo-650 shrink-0 font-extrabold">{stat.enrollments}k registrations</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full">
                                <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${perc}%` }} />
                              </div>
                              <span className="text-[9px] text-slate-400 font-semibold">
                                {stat.category} {currentLanguage === 'English' ? 'Scheme Welfare' : currentLanguage === 'Hindi' ? 'योजना कल्याण' : 'పథక సంక్షేమం'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category Distribution details */}
                    <div className="col-span-12 md:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                          {currentLanguage === 'English' ? 'Registered District Adoption Statistics' : currentLanguage === 'Hindi' ? 'पंजीकृत जिला अंगीकरण सांख्यिकी' : 'నమోదిత జిల్లాల వినియోగ గణాంకాలు'}
                        </h4>
                        
                        <div className="space-y-3.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                          {adminMetrics.districtDistribution.map((dist: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs pb-2.5 border-b last:border-0 mr-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[9px]">
                                  {idx + 1}
                                </span>
                                <span className="font-extrabold text-slate-900">
                                  {dist.district} {currentLanguage === 'English' ? 'District' : currentLanguage === 'Hindi' ? 'जिला' : 'జిల్లా'}
                                </span>
                              </div>
                              
                              <div className="text-right">
                                <span className="font-extrabold text-slate-900">
                                  {dist.count}k {currentLanguage === 'English' ? 'matches' : currentLanguage === 'Hindi' ? 'मिलान' : 'సరిపోలికలు'}
                                </span>
                                <span className="text-[9px] text-slate-400 block font-mono">
                                  {currentLanguage === 'English' ? 'SECC priority rank' : currentLanguage === 'Hindi' ? 'SECC प्राथमिकता रैंक' : 'SECC ప్రాధాన్యతా ర్యాంక్'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t mt-4 bg-slate-50 p-3 rounded-2xl border">
                        <p className="text-[10px] text-slate-500 leading-normal">
                          📊 <b>{currentLanguage === 'English' ? 'Analytics Methodology:' : currentLanguage === 'Hindi' ? 'विश्लेषण पद्धति:' : 'విశ్లేషణ విధానం:'}</b> {currentLanguage === 'English' ? 'Data feeds reflect socio-demographic statistics compiled dynamically from the Indian Census databases and platform feedback reports.' : currentLanguage === 'Hindi' ? 'डेटा फीड भारतीय जनगणना डेटाबेस और प्लेटफॉर्म फीडबैक रिपोर्ट से गतिशील रूप से संकलित सामाजिक-जनसांख्यिकीय आंकड़ों को दर्शाते हैं।' : 'డేటా ఫీడ్‌లు భారతీయ జనాభా లెక్కల డేటాబేస్‌లు మరియు ప్లాట్‌ఫారమ్ ఫీడ్‌బ్యాక్ నివేదికల నుండి డైనమిక్‌గా సేకరించిన సామాజిక-జనగణన గణాంకాలను ప్రతిబింబిస్తాయి।'}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border text-center text-slate-450">
                  {currentLanguage === 'English' ? 'Loading system analytical parameters...' : currentLanguage === 'Hindi' ? 'सिस्टम विश्लेषणात्मक पैरामीटर लोड हो रहा है...' : 'సిస్టమ్ విశ్లేషణాత్మక పారామితులను లోడ్ చేస్తోంది...'}
                </div>
              )}

            </div>
          )}

          {/* VIEW: USER PROFILE CONFIGURATION */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="mb-6 pb-4 border-b">
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest block">
                  {currentLanguage === 'English' ? 'MODULE 1: PROFILE MANAGEMENT' : currentLanguage === 'Hindi' ? 'मॉड्यूल 1: प्रोफ़ाइल प्रबंधन' : 'మాడ్యూల్ 1: ప్రొఫైల్ నిర్వహణ'}
                </span>
                <h3 className="text-xl font-black text-slate-950 mt-1">
                  {currentLanguage === 'English' ? 'Configure Demographic Data Parameters' : currentLanguage === 'Hindi' ? 'जनसांख्यिकीय डेटा पैरामीटर कॉन्फ़िगर करें' : 'జనగణన ప్రొఫైల్ సమాచారాన్ని మార్చండి'}
                </h3>
                <p className="text-xs text-slate-500 leading-normal mt-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>
                    {currentLanguage === 'English' ? 'These status variables feed directly into the AI Eligibility Recommendation metrics.' :
                     currentLanguage === 'Hindi' ? 'ये स्थिति चर सीधे एआई पात्रता अनुशंसा मीट्रिक में फ़ीड करते हैं।' :
                     'ఈ వేరియబుల్స్ నేరుగా ఏఐ అర్హత సిఫార్సుల లెక్कीంపునకు ఉపయోగించబడతాయి.'}
                  </span>
                </p>
              </div>

              <form onSubmit={updateProfile} className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('citizenName')}</label>
                    <input 
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('citizenEmail')}</label>
                    <input 
                      type="email"
                      value={profileForm.email}
                      disabled={!!sessionUser}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. user@gmail.com"
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 disabled:text-slate-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('citizenAge')}</label>
                    <input 
                      type="number"
                      value={profileForm.age}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100"
                      min={1}
                      max={120}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {currentLanguage === 'English' ? 'Gender' : currentLanguage === 'Hindi' ? 'लिंग' : 'లింగం'}
                    </label>
                    <select 
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value as any }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="Male">{currentLanguage === 'English' ? 'Male' : currentLanguage === 'Hindi' ? 'पुरुष' : 'పురుషులు'}</option>
                      <option value="Female">{currentLanguage === 'English' ? 'Female' : currentLanguage === 'Hindi' ? 'महिला' : 'మహిళలు'}</option>
                      <option value="Transgender">{currentLanguage === 'English' ? 'Transgender' : currentLanguage === 'Hindi' ? 'ट्रांसजेंडर' : 'ట్రాన్స్‌జెండర్'}</option>
                      <option value="Other">{currentLanguage === 'English' ? 'Other' : currentLanguage === 'Hindi' ? 'अन्य' : 'ఇతర'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('categoryCaste')}</label>
                    <select 
                      value={profileForm.category}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="General">{currentLanguage === 'English' ? 'General' : currentLanguage === 'Hindi' ? 'सामान्य' : 'సాధారణం'}</option>
                      <option value="OBC">{currentLanguage === 'English' ? 'OBC (Other Backward Classes)' : currentLanguage === 'Hindi' ? 'ओबीसी (अन्य पिछड़ा वर्ग)' : 'OBC (ఇతర వెనుకబడిన తరగతులు)'}</option>
                      <option value="SC">{currentLanguage === 'English' ? 'Scheduled Caste (SC)' : currentLanguage === 'Hindi' ? 'अनुसूचित जाति (SC)' : 'SC (షెడ్యూల్డ్ కులాలు)'}</option>
                      <option value="ST">{currentLanguage === 'English' ? 'Scheduled Tribe (ST)' : currentLanguage === 'Hindi' ? 'अनुसूचित जनजाति (ST)' : 'ST (షెడ్యూల్డ్ తెగలు)'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{currentLanguage === 'English' ? 'State of Jurisdiction' : currentLanguage === 'Hindi' ? 'अधिकार क्षेत्र राज्य' : 'రాష్ట్రం'}</label>
                    <input 
                      type="text"
                      value={profileForm.state}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value.replace(/[0-9]/g, '') }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{currentLanguage === 'English' ? 'District Area' : currentLanguage === 'Hindi' ? 'जिला क्षेत्र' : 'జిల్లా'}</label>
                    <input 
                      type="text"
                      value={profileForm.district}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, district: e.target.value.replace(/[0-9]/g, '') }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('annualFamilyIncome')}</label>
                    <input 
                      type="number"
                      value={profileForm.annualIncome}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, annualIncome: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('educationLevel')}</label>
                    <select 
                      value={profileForm.education}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, education: e.target.value as any }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                    >
                      <option value="Illiterate">{currentLanguage === 'English' ? 'Illiterate' : currentLanguage === 'Hindi' ? 'अनपढ़' : 'అక్షరాస్యత లేనివారు'}</option>
                      <option value="Primary">{currentLanguage === 'English' ? 'Primary (till class 5)' : currentLanguage === 'Hindi' ? 'प्राथमिक (कक्षा 5 तक)' : 'ప్రాథమిక విద్యా (5వ తరగతి వరకు)'}</option>
                      <option value="High School">{currentLanguage === 'English' ? 'High School (till class 10)' : currentLanguage === 'Hindi' ? 'हाई स्कूल (कक्षा 10 तक)' : 'హైస్కూల్ (10వ తరగతి వరకు)'}</option>
                      <option value="Graduate">{currentLanguage === 'English' ? 'Graduate (Degree)' : currentLanguage === 'Hindi' ? 'स्नातक (डिग्री)' : 'డిగ్రీ (గ్రాడ్యуయేట్)'}</option>
                      <option value="Post Graduate">{currentLanguage === 'English' ? 'Post Graduate' : currentLanguage === 'Hindi' ? 'स्नातकोत्तर' : 'పోస్ట్ గ్రాడ్యుయేట్'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('occupationProfession')}</label>
                    <select 
                      value={profileForm.occupation}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, occupation: e.target.value as any }))}
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                    >
                      <option value="Farmer">{currentLanguage === 'English' ? 'Farmer / Agriculturalist' : currentLanguage === 'Hindi' ? 'किसान / कृषि' : 'రైతు / వ్యవసాయ రంగం'}</option>
                      <option value="Student">{currentLanguage === 'English' ? 'Student' : currentLanguage === 'Hindi' ? 'छात्र' : 'విద్యార్థి'}</option>
                      <option value="Unemployed">{currentLanguage === 'English' ? 'Unemployed' : currentLanguage === 'Hindi' ? 'बेरोजगार' : 'ఉద్యోగం లేనివారు'}</option>
                      <option value="Salaried">{currentLanguage === 'English' ? 'Salaried (Govt/Private Sector)' : currentLanguage === 'Hindi' ? 'वेतनभोगी (सरकारी/निजी क्षेत्र)' : 'వేతన ఉద్యోగి (ప్రభుత్వ/ప్రైవేట్ రంగం)'}</option>
                      <option value="Self-employed">{currentLanguage === 'English' ? 'Self-employed Business owner' : currentLanguage === 'Hindi' ? 'स्व-नियोजित व्यवसाय स्वामी' : 'స్వయం ఉపాధి / వ్యాపార యజమాని'}</option>
                      <option value="Artisan">{currentLanguage === 'English' ? 'Local Artisan / Handicrafts worker' : currentLanguage === 'Hindi' ? 'स्थानीय कारीगर / हस्तशिल्प' : 'స్థానిక కళాకారులు / హస్తకళలు'}</option>
                    </select>
                  </div>
                </div>

                {/* Checklist variables */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {currentLanguage === 'English' ? 'Special Priority Demographics statuses' : currentLanguage === 'Hindi' ? 'विशेष प्राथमिकता जनसांख्यिकी स्थितियां' : 'ప్రత్యేక ప్రాధాన్యత గల సామాజిక-జనగణన అంశాలు'}
                  </label>
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border">
                    <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={profileForm.isPhysicallyChallenged}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, isPhysicallyChallenged: e.target.checked }))}
                        className="w-4 h-4 text-indigo-650 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <span>{t('physicallyChallengedLabel')}</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={profileForm.isMinority}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, isMinority: e.target.checked }))}
                        className="w-4 h-4 text-indigo-650 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <span>{t('minorityStatusLabel')}</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={profileForm.isWidowOrSingleMother}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, isWidowOrSingleMother: e.target.checked }))}
                        className="w-4 h-4 text-indigo-650 rounded border-slate-300"
                      />
                      <span>{t('widowSingleMotherLabel')}</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-[10px] text-slate-400">
                    {currentLanguage === 'English' ? 'Values save securely into in-memory platform cache.' :
                     currentLanguage === 'Hindi' ? 'मान सुरक्षित रूप से इन-मेमोरी प्लेटफ़ॉर्म कैश में सहेजे जाते हैं।' :
                     'విలువలు సురక్షితంగా ప్లాట్‌ఫారమ్ ఇన్‌-మెమరీ కాష్‌లో సేవ్ చేయబడతాయి.'}
                  </span>
                  
                  {sessionUser ? (
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer"
                    >
                      {t('recalculateMatchesBtn')}
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={handleSignup}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer"
                      >
                        {t('signupBtn')}
                      </button>
                    </div>
                  )}
                </div>

              </form>

              {/* Explicit logout option */}
              {sessionUser && (
                <div className="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center bg-red-50/50 p-4 rounded-2xl border border-red-100">
                  <div>
                    <h5 className="text-xs font-bold text-red-900">Configure simulated new citizen account?</h5>
                    <p className="text-[10px] text-red-700 leading-normal">
                      Disconnect current profile and login or sign up with different configurations.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSessionUser(null);
                      setAuthMode('signup');
                      setProfileForm({
                        name: "",
                        email: "",
                        age: 25,
                        gender: 'Male',
                        state: "Telangana",
                        district: "Hyderabad",
                        annualIncome: 150000,
                        category: "General",
                        education: "High School",
                        occupation: "Farmer",
                        isPhysicallyChallenged: false,
                        isMinority: false,
                        isWidowOrSingleMother: false
                      });
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black cursor-pointer shadow"
                  >
                    Disconnect Profile
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
        
        {/* REAL-TIME SYSTEM CONTEXT FOOTER */}
        <footer className="h-10 border-t bg-white px-8 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
          <div>
            <span>India National Welfare Registry System • 2026 FY Smart Platform</span>
          </div>
        </footer>

      </main>

      {/* Real-time Notification Detail Lightbox Modal */}
      {selectedNotification && (() => {
        const localizedN = translateNotification(selectedNotification, currentLanguage);
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in text-slate-800">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden p-6 relative">
              <button 
                onClick={() => setSelectedNotification(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-lg w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 cursor-pointer"
                title="Close dialog"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-lg">
                  📢
                </div>
                <div className="text-left">
                  <span className={`text-[9px] px-2.5 py-0.5 rounded font-black uppercase tracking-wider ${
                    localizedN.type === 'Deadline' || localizedN.type === 'समय सीमा' || localizedN.type === 'గడువు తేదీ' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {localizedN.type} BULLETIN
                  </span>
                  <h4 className="font-extrabold text-base text-slate-950 mt-0.5 tracking-tight">{localizedN.title}</h4>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-4 text-xs text-slate-800 space-y-3 leading-relaxed text-left">
                <p className="font-medium text-slate-700 whitespace-pre-wrap">{localizedN.message}</p>
                
                {localizedN.deadline && (
                  <div className="bg-red-50 text-red-650 border border-red-100/50 p-3 rounded-xl flex justify-between items-center text-[11px] font-extrabold leading-none">
                    <span>⏳ {currentLanguage === 'English' ? 'Registration Deadline' : currentLanguage === 'Hindi' ? 'पंजीकरण की समय सीमा' : 'నమోదు గడువు తేదీ'}:</span>
                    <span className="font-mono bg-white text-slate-800 px-2.5 py-1 rounded-lg border shadow-sm">{localizedN.deadline}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3.5 mb-4 text-[10px] text-slate-500 font-mono bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-left">
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wide">Target Audience:</span>
                  <span className="font-bold text-slate-700">{selectedNotification.sentTo}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[8px] tracking-wide">Dispatch Time:</span>
                  <span className="font-bold text-slate-700">{new Date(selectedNotification.sentAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const query = currentLanguage === 'English' 
                      ? `I received an alert about "${selectedNotification.title}". What are the documents required and who is eligible?` 
                      : currentLanguage === 'Hindi' 
                      ? `मुझे "${selectedNotification.title}" योजना बुलेटिन मिला। इसके लिए क्या दस्तावेज चाहिए और कौन पात्र है?` 
                      : `నాకు "${selectedNotification.title}" నోటిఫికేషన్ వచ్చింది. దీని నిబంధనలు ఏమిటి?`;
                    setChatInput('');
                    setActiveTab('chatbot');
                    setSelectedNotification(null);
                    setTimeout(() => {
                      handleChatSubmit(undefined, query);
                    }, 150);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  💬 <span>Ask Yojana Assistant</span>
                </button>
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
