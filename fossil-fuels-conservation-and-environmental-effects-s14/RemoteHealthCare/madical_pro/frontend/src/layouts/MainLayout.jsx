import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaHeartbeat, FaUserMd, FaFileMedical, FaChartPie, FaStethoscope } from 'react-icons/fa';

export default function MainLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', name: 'Patient Dashboard', icon: FaUserMd },
    { path: '/doctor-dashboard', name: 'Doctor Dashboard', icon: FaStethoscope },
    { path: '/reports', name: 'Medical Reports', icon: FaFileMedical },
    { path: '/analytics', name: 'Analytics', icon: FaChartPie },
  ];

  return (
    <div className="flex h-screen bg-[#0A192F] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black/30 backdrop-blur-md border-r border-cyan/20 p-6 flex flex-col gap-6 relative z-10 shadow-2xl">
        <div className="flex items-center gap-3 text-cyan text-2xl font-bold mb-8">
          <FaHeartbeat className="text-3xl animate-pulse text-cyan" />
          MedPro
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${location.pathname === item.path ? 'bg-cyan/20 text-cyan border border-cyan/30 shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'hover:bg-cyan/10 hover:text-cyan'}`}
            >
              <item.icon className="text-xl" /> {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-[#0A192F] relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan/5 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan/5 blur-[120px]"></div>
        </div>
        <div className="relative z-10 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
