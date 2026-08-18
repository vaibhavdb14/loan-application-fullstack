import React, { useState } from 'react';
import { Bell, Search, Menu, X } from 'lucide-react';

const Header = ({ onMenuClick, pageTitle }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-banking-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger - mobile & tablet only */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="lg:hidden text-text-secondary hover:text-banking-primary p-2 -ml-2 shrink-0"
        >
          <Menu size={22} />
        </button>

        {/* Page title on mobile (replaces search bar to save space) */}
        {pageTitle && (
          <span className="lg:hidden font-semibold text-text-primary text-base truncate">{pageTitle}</span>
        )}

        {/* Full search - desktop/tablet */}
        <div className="hidden lg:flex items-center bg-banking-background rounded-md px-3 py-1.5 border border-border-light w-96">
          <Search size={16} className="text-text-muted mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search applications (e.g., APP-2026-001024)..."
            className="bg-transparent border-none focus:outline-none text-sm w-full text-text-primary placeholder-text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile search toggle */}
        <button
          onClick={() => setMobileSearchOpen((v) => !v)}
          aria-label="Toggle search"
          className="lg:hidden text-text-secondary hover:text-banking-primary p-2"
        >
          {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
        </button>

        <button className="text-text-secondary hover:text-banking-primary transition-colors relative p-2 -mr-2 sm:mr-0" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 bg-banking-warning w-2.5 h-2.5 rounded-full" aria-hidden="true"></span>
        </button>

        <div className="hidden sm:flex items-center gap-3 border-l border-border-light pl-4 ml-2">
          <div className="w-8 h-8 bg-banking-primary text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
            JM
          </div>
          <div className="text-sm hidden md:block">
            <p className="font-semibold text-text-primary">Jane Manager</p>
            <p className="text-xs text-text-muted">Underwriter</p>
          </div>
        </div>
      </div>

      {/* Mobile search bar - expands below header */}
      {mobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-banking-card border-b border-border p-3 lg:hidden animate-fade-in">
          <div className="flex items-center bg-banking-background rounded-md px-3 py-2 border border-border-light">
            <Search size={16} className="text-text-muted mr-2 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search applications..."
              className="bg-transparent border-none focus:outline-none text-sm w-full text-text-primary placeholder-text-muted"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
