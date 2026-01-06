"use client";
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import Image from 'next/image';
import {Link, usePathname} from '@/i18n/routing';
import { Home, NotebookPenIcon, ListCheck, Menu, X, MapPin, Map } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  logo: string;
}

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
}

export default function Header({ logo }: HeaderProps) {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: '/', labelKey: 'home', icon: <Home className="w-5 h-5" /> },
    { href: '/posts', labelKey: 'about', icon: <NotebookPenIcon className="w-5 h-5" /> },
    { href: '/concierge', labelKey: 'concierge', icon: <MapPin className="w-5 h-5" /> },
    { href: '/map', labelKey: 'map', icon: <Map className="w-5 h-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 ">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center pb-2 justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src={logo}
                alt="Logo"
                width={130}
                height={130}
                priority
                className="h-18 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-accent/10 text-accent"
                          : "text-gray-600 hover:text-accent hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  );
                })}
              </nav>
              <LocaleSwitcher />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                priority
                className="h-14 w-auto"
              />
            </Link>

            {/* Right: Locale Switcher + Hamburger */}
            <div className="flex items-center gap-1">
              <LocaleSwitcher />
              <button
                onClick={toggleMobileMenu}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[1060] md:hidden flex flex-col">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 flex-shrink-0">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                className="h-12 w-auto"
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-11 h-11 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all mb-2 touch-manipulation active:scale-[0.98] ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      active ? "bg-accent/20" : "bg-gray-100"
                    }`}>
                      {item.icon}
                    </div>
                    <span>{t(item.labelKey)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}