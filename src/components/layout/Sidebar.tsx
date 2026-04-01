import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, ChevronLeft, Settings, HelpCircle, CreditCard, Shield, Eye, ChevronDown } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const mainMenu = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transaction' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
];

const supportMenu = [
  { to: '#', icon: Settings, label: 'Settings' },
  { to: '#', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { role, setRole } = useRole();
  const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
      isActive
        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  const supportLinkClass = () =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white`;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-60
          bg-white dark:bg-slate-900
          border-r border-gray-100 dark:border-slate-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
              <CreditCard size={16} className="text-white" />
            </div>
            <span className="text-[15px] font-bold text-gray-900 dark:text-white tracking-tight">
              FinTrack
            </span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 overflow-y-auto">
          <p className="px-4 mb-2 text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-[1.5px]">
            Main Menu
          </p>
          <div className="space-y-0.5 mb-6">
            {mainMenu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
                className={linkClass}
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <p className="px-4 mb-2 text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-[1.5px]">
            Support
          </p>
          <div className="space-y-0.5">
            {supportMenu.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={supportLinkClass}
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Role Switcher */}
        <div className="px-3 pb-4">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
            <label className="block text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-[1.5px] mb-1.5 pl-1">
              Role
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:outline-none transition-colors hover:border-gray-300 dark:hover:border-slate-500 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  {role === 'admin' ? <Shield size={14} className="text-amber-500" /> : <Eye size={14} className="text-emerald-500" />}
                  <span className="text-[13px] font-medium text-gray-800 dark:text-white capitalize">{role}</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-lg shadow-lg overflow-hidden z-50 py-1"
                  >
                    <button
                      onClick={() => { setRole('admin'); setRoleDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors ${role === 'admin' ? 'bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'}`}
                    >
                      <Shield size={14} className="text-amber-500" />
                      <span className="font-medium">Admin</span>
                    </button>
                    <button
                      onClick={() => { setRole('viewer'); setRoleDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors ${role === 'viewer' ? 'bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'}`}
                    >
                      <Eye size={14} className="text-emerald-500" />
                      <span className="font-medium">Viewer</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
