"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Bell, ChevronDown, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardHeader({ userName, userEmail, onLogout }: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 10 py-3.5 flex items-center justify-between px-10">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-teal-700 flex items-center justify-center">
          <FileText size={15} className="text-white" />
        </div>
        <span className="text-sm font-medium text-gray-900">Ajaia Docs</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell — visual placeholder, not wired to a real notification system */}
        <button
          aria-label="Notifications"
          className="relative w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-600" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="w-6.5 h-6.5 w-7 h-7 rounded-full bg-teal-700 flex items-center justify-center text-[11px] font-medium text-white">
              {getInitials(userName)}
            </div>
            <span className="text-sm text-gray-700">{userName}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-10">
              <div className="px-3.5 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}