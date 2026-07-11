import React from 'react';
import * as Lucide from 'lucide-react';

const iconMap = {
  search: Lucide.Search,
  wallet: Lucide.Wallet,
  sun: Lucide.Sun,
  shield: Lucide.Shield,
  shieldAlert: Lucide.ShieldAlert,
  clock: Lucide.Clock,
  scale: Lucide.Scale,
  heart: Lucide.Heart,
  gift: Lucide.Gift,
  book: Lucide.Book,
  fileText: Lucide.FileText,
  chevronDown: Lucide.ChevronDown,
  chevronRight: Lucide.ChevronRight,
  arrowRight: Lucide.ArrowRight,
  x: Lucide.X,
  check: Lucide.Check,
  checkCircle: Lucide.CheckCircle,
  alertTriangle: Lucide.AlertTriangle,
  send: Lucide.Send,
  activity: Lucide.Activity,
  bookmark: Lucide.Bookmark,
  bell: Lucide.Bell,
  user: Lucide.User,
  users: Lucide.Users,
  mapPin: Lucide.MapPin,
  compass: Lucide.Compass,
  plus: Lucide.Plus,
  minus: Lucide.Minus,
  moon: Lucide.Moon,
  home: Lucide.Home,
  list: Lucide.List,
  layers: Lucide.Layers,
  target: Lucide.Target,
  trendingUp: Lucide.TrendingUp,
  filter: Lucide.Filter,
  info: Lucide.Info,
  play: Lucide.Play,
  folder: Lucide.Folder,
  star: Lucide.Star,
  sliders: Lucide.Sliders,
  download: Lucide.Download,
  flag: Lucide.Flag,
  eye: Lucide.Eye,
  eyeOff: Lucide.EyeOff,
  mail: Lucide.Mail,
  phone: Lucide.Phone,
  briefcase: Lucide.Briefcase,
  calendar: Lucide.Calendar,
  logOut: Lucide.LogOut,
  panelLeft: Lucide.PanelLeft,
  userCheck: Lucide.UserCheck,
  settings: Lucide.Settings,
  camera: Lucide.Camera,
  upload: Lucide.Upload,
  trash: Lucide.Trash,
  edit: Lucide.Edit,
};

export const Icon = ({ name, size = 20, className = "", strokeWidth = 1.8, filled = false }) => {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) {
    console.warn(`Icon component: "${name}" is not a registered icon.`);
    return null;
  }
  return (
    <LucideIcon
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      fill={filled ? 'currentColor' : 'none'}
    />
  );
};
export default Icon;
