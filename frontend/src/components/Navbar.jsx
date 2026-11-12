import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { History, LogOut, TerminalSquare } from 'lucide-react';

const link = ({ isActive }) =>
  `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-tint text-brand' : 'text-ink-soft hover:bg-paper-sunk hover:text-ink'
  }`;

export default function Navbar({ onLogout }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand font-mono text-sm text-mark">{'</>'}</span>
          CodeMentor AI
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={link}><TerminalSquare className="h-4 w-4" />Ask</NavLink>
          <NavLink to="/history" className={link}><History className="h-4 w-4" />History</NavLink>
          <button onClick={onLogout} className="ml-2 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-bug-tint hover:text-bug">
            <LogOut className="h-4 w-4" />Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
