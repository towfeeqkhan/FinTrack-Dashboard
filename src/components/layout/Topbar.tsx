import { Menu, Search, Bell } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Badge from '../ui/Badge';
import { useRole } from '../../context/RoleContext';

interface TopbarProps {
  onMenuToggle: () => void;
}



export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { role } = useRole();

  return (
    <header className="sticky top-0 z-30 h-15 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
          id="mobile-menu-btn"
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 w-65">
          <Search size={15} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-xs text-gray-700 dark:text-slate-300 placeholder-gray-400 outline-none focus:ring-0 focus:outline-none border-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <ThemeToggle />

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400">
            JH
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight">FinTrack User</p>
            <Badge variant={role === 'admin' ? 'info' : 'default'} className="text-[10px] mt-0.5">
              {role === 'admin' ? 'Admin' : 'Viewer'}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
