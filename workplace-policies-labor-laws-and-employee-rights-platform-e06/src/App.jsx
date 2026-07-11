import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseClient } from './lib/supabaseClient';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Icon from './components/Icon';
import StatusBadge from './components/StatusBadge';
import { IconBadge } from './components/IconBadge';

// Pages
import Hero from './pages/Hero';
import Profile from './pages/Profile';
import RightsFinder from './pages/RightsFinder';
import LawExplorer from './pages/LawExplorer';
import PoliciesCenter from './pages/PoliciesCenter';
import ComplaintTracker from './pages/ComplaintTracker';
import Dashboard from './pages/Dashboard';
import SupabaseSetup from './pages/SupabaseSetup';
import AuthScreen from './pages/AuthScreen';

// Default static lists (as fallbacks if DB load fails)
import { LAWS } from './data/laws';
import { POLICIES } from './data/policies';

const Footer = () => (
  <footer className="py-8 border-t mt-12" style={{ borderColor: 'var(--line)', background: 'var(--paper-deep)' }}>
    <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--ink)' }}>
          <Icon name="compass" size={13} className="text-white" />
        </div>
        <span className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
          WorkRights Hub
        </span>
      </div>
      <p className="text-[12.5px] text-center md:text-right" style={{ color: 'var(--stone)' }}>
        Built for clarity, not legal advice. For binding guidance, consult a labour-law professional or your local labour authority.
      </p>
    </div>
  </footer>
);

const PAGES = {
  home: Hero,
  profile: Profile,
  finder: RightsFinder,
  laws: LawExplorer,
  policies: PoliciesCenter,
  complaints: ComplaintTracker,
  dashboard: Dashboard,
};

export default function App() {
  const [configured, setConfigured] = useState(!!supabaseClient);
  const [dark, setDark] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ rightsViewed: new Set(), scenariosViewed: new Set() });
  const [highlight, setHighlight] = useState(null); // { type, refId, nonce }

  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const [employee, setEmployee] = useState({
    name: 'New Employee',
    employeeId: 'EMP-00000',
    company: 'Demo Corporation',
    department: 'Operations',
    designation: 'Associate',
    joiningDate: 'Just Joined',
    email: '',
    phone: '',
    location: 'Remote',
    initials: 'EE',
    role: 'employee',
    lastLogin: {
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN'),
      device: 'Web Browser',
      ip: 'Active Session',
    },
  });

  // Keep configured state in sync with supabase client availability
  useEffect(() => {
    if (supabaseClient) {
      setConfigured(true);
    }
  }, [configured]);

  // Dark mode trigger
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  // Session handler
  useEffect(() => {
    if (!configured || !supabaseClient) {
      setLoadingSession(false);
      return;
    }

    supabaseClient.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  // Load employee profile and dynamic data from DB
  useEffect(() => {
    if (!session || !supabaseClient) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        // Fetch profile
        const { data: profile, error: pErr } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (pErr && pErr.code !== 'PGRST116') throw pErr;

        if (profile) {
          setEmployee({
            name: profile.name || '',
            employeeId: profile.employee_id || '',
            company: profile.company || '',
            department: profile.department || '',
            designation: profile.designation || '',
            joiningDate: profile.joining_date || '',
            email: profile.email || session.user.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            role: profile.role || 'employee',
            initials:
              (profile.name || '')
                .split(' ')
                .filter(Boolean)
                .map((x) => x[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || (session.user.email || '??')[0].toUpperCase(),
            lastLogin: {
              date: new Date(session.user.last_sign_in_at || Date.now()).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
              time: new Date(session.user.last_sign_in_at || Date.now()).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              device: 'Web Browser',
              ip: 'Active Session',
            },
          });
          setAvatar(profile.avatar_url || null);
        }

        // Fetch complaints
        const { data: dbComplaints, error: cErr } = await supabaseClient
          .from('complaints')
          .select('*')
          .order('created_at', { ascending: false });

        if (cErr) throw cErr;
        setComplaints(dbComplaints || []);

        // Fetch notifications
        const { data: dbNotifs, error: nErr } = await supabaseClient
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (nErr) throw nErr;
        setNotifications(dbNotifs || []);
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [session]);

  const onNav = useCallback((id) => {
    setActivePage(id);
    setMobileOpen(false);
    setNotifOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const onMarkAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (session && supabaseClient) {
      try {
        await supabaseClient.from('notifications').update({ unread: false }).eq('user_id', session.user.id);
      } catch (err) {
        console.error(err);
      }
    }
  }, [session]);

  const onNotificationClick = useCallback(
    async (n) => {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
      setNotifOpen(false);
      setMobileOpen(false);
      if (n.target) {
        setActivePage(n.target.page);
        setHighlight({ type: n.target.type, refId: n.target.refId, nonce: Date.now() });
      }
      window.scrollTo(0, 0);

      if (session && supabaseClient) {
        try {
          await supabaseClient.from('notifications').update({ unread: false }).eq('id', n.id);
        } catch (err) {
          console.error(err);
        }
      }
    },
    [session]
  );

  const clearHighlight = useCallback(() => setHighlight(null), []);

  const logRightView = useCallback((id) => {
    setStats((s) => ({ ...s, rightsViewed: new Set([...s.rightsViewed, id]) }));
  }, []);
  const logScenarioView = useCallback((id) => {
    setStats((s) => ({ ...s, scenariosViewed: new Set([...s.scenariosViewed, id]) }));
  }, []);

  const addNotificationHelper = async ({ title, body, icon, color, page, type, refId }) => {
    const id = 'n-' + Math.floor(10000 + Math.random() * 89999);
    const newNotif = {
      id,
      icon,
      color,
      title,
      body,
      time: 'Just now',
      unread: true,
      target: { page, type, refId },
    };

    setNotifications((prev) => [newNotif, ...prev]);

    if (session && supabaseClient) {
      try {
        await supabaseClient.from('notifications').insert({
          id,
          user_id: session.user.id,
          icon,
          color,
          title,
          body,
          time: 'Just now',
          unread: true,
          target: { page, type, refId },
        });
      } catch (err) {
        console.warn('Could not insert notification in DB', err);
      }
    }
  };

  const submitComplaint = useCallback(
    async (c) => {
      if (!session || !supabaseClient) {
        setComplaints((prev) => [c, ...prev]);
        return;
      }

      setLoadingData(true);
      try {
        const { error: insErr } = await supabaseClient.from('complaints').insert({
          id: c.id,
          user_id: session.user.id,
          category: c.category,
          desc: c.desc,
          stage: c.stage,
          date: c.date,
          hr: c.hr,
          resolution_date: c.resolutionDate,
          last_updated: c.lastUpdated,
        });

        if (insErr) throw insErr;

        setComplaints((prev) => [c, ...prev]);
        await addNotificationHelper({
          title: 'Complaint submitted',
          body: `${c.id} has been logged and assigned to ${c.hr}.`,
          icon: 'flag',
          color: 'ink',
          page: 'complaints',
          type: 'complaint',
          refId: c.id,
        });

        // Simulate status updates locally/optimistically over intervals
        const STAGES_LIST = ['Submitted', 'Under Review', 'Investigation', 'Resolved'];
        const STAGE_DELAYS = { 1: 2 * 60 * 1000, 2: 5 * 60 * 1000, 3: 10 * 60 * 1000 };
        [1, 2, 3].forEach((stage) => {
          setTimeout(async () => {
            const nowStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            try {
              await supabaseClient
                .from('complaints')
                .update({
                  stage,
                  last_updated: nowStr,
                  resolution_date: stage === 3 ? nowStr : null,
                })
                .eq('id', c.id);

              setComplaints((prev) =>
                prev.map((x) =>
                  x.id === c.id
                    ? {
                        ...x,
                        stage,
                        lastUpdated: nowStr,
                        resolutionDate: stage === 3 ? nowStr : x.resolutionDate,
                      }
                    : x
                )
              );

              await addNotificationHelper({
                title: 'Complaint status updated',
                body: `${c.id} moved to "${STAGES_LIST[stage]}".`,
                icon: 'flag',
                color: stage === 3 ? 'teal' : 'coral',
                page: 'complaints',
                type: 'complaint',
                refId: c.id,
              });
            } catch (e) {
              console.warn(e);
            }
          }, STAGE_DELAYS[stage]);
        });
      } catch (err) {
        console.error(err);
        alert('Failed to submit complaint: ' + err.message);
      } finally {
        setLoadingData(false);
      }
    },
    [session]
  );

  const updateProfile = async (updatedData) => {
    if (!session || !supabaseClient) {
      setEmployee((prev) => ({ ...prev, ...updatedData }));
      return;
    }
    setLoadingData(true);
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({
          name: updatedData.name,
          email: updatedData.email,
          phone: updatedData.phone,
          location: updatedData.location,
          company: updatedData.company,
          department: updatedData.department,
          designation: updatedData.designation,
          joining_date: updatedData.joiningDate,
          updated_at: new Date(),
        })
        .eq('id', session.user.id);

      if (error) throw error;
      setEmployee((prev) => ({
        ...prev,
        ...updatedData,
        initials: (updatedData.name || '')
          .split(' ')
          .map((x) => x[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      }));

      await addNotificationHelper({
        title: 'Profile Updated',
        body: 'Your profile changes have been successfully saved.',
        icon: 'userCheck',
        color: 'teal',
        page: 'profile',
        type: 'profile',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update profile: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const updateAvatar = async (base64Data) => {
    if (!session || !supabaseClient) {
      setAvatar(base64Data);
      return;
    }
    setLoadingData(true);
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({
          avatar_url: base64Data,
          updated_at: new Date(),
        })
        .eq('id', session.user.id);

      if (error) throw error;
      setAvatar(base64Data);
      await addNotificationHelper({
        title: 'Profile Picture Updated',
        body: 'Your profile picture has been successfully uploaded.',
        icon: 'camera',
        color: 'teal',
        page: 'profile',
        type: 'profile',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update profile picture: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (err) {
        console.error(err);
      }
    }
    setSession(null);
    setActivePage('home');
  };

  if (!configured) {
    return <SupabaseSetup onConfigured={() => setConfigured(true)} />;
  }

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[var(--coral)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono mt-4" style={{ color: 'var(--stone)' }}>
            Checking Session...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onAuthSuccess={(s) => setSession(s)} />;
  }

  const PageComponent = PAGES[activePage] || Hero;
  const pageProps =
    {
      home: { onNav },
      profile: {
        complaints,
        onNav,
        avatar,
        setAvatar: updateAvatar,
        employee,
        setEmployee: updateProfile,
        onSignOut: handleSignOut,
      },
      finder: { onLog: logScenarioView, onNav },
      laws: { onView: logRightView, highlight, clearHighlight },
      policies: { highlight, clearHighlight },
      complaints: {
        complaints,
        onSubmit: submitComplaint,
        highlight,
        clearHighlight,
        userId: session?.user?.id,
        userRole: employee?.role,
      },
      dashboard: {
        stats,
        complaints,
        onNav,
        employee,
        notifications,
        setHighlight,
        onNotificationClick,
      },
    }[activePage] || {};

  return (
    <div className="relative">
      {loadingData && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] overflow-hidden" style={{ background: 'var(--line)' }}>
          <div className="h-full bg-[var(--coral)] animate-pulse w-full"></div>
        </div>
      )}
      <Sidebar active={activePage} onNav={onNav} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Topbar
        dark={dark}
        setDark={setDark}
        active={activePage}
        setMobileOpen={setMobileOpen}
        notifications={notifications}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        onMarkAllRead={onMarkAllRead}
        onNav={onNav}
        onNotificationClick={onNotificationClick}
        avatar={avatar}
        employee={employee}
      />

      <main className="lg:pl-[232px] pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <PageComponent {...pageProps} />
          </motion.div>
        </AnimatePresence>
        <Footer />
      </main>
    </div>
  );
}
