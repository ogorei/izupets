"use client";
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import Image from 'next/image';
import {Link} from '@/i18n/routing';
import { Home, NotebookPenIcon, Contact, ListCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  logo: string;
}

export default function Header({ logo }: HeaderProps) {
  const t = useTranslations('Header');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center py-4">
          <div className="flex items-center space-x-12">
            <Image
              src={logo}
              alt="Logo"
              width={120}
              height={120}
              priority
              className="h-20 w-auto"
            />
            <nav className="flex space-x-8 ml-[50px]">
              <Link href="/" className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity">
                <div className="p-3">
                  <Home className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs text-accent">{t('home')}</span>
              </Link>
              <Link href="/posts" className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity">
                <div className="p-3">
                  <NotebookPenIcon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs text-accent">{t('about')}</span>
              </Link>
              <Link href="/concierge" className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity">
                <div className="p-3">
                  <ListCheck className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs text-accent">{t('concierge')}</span>
              </Link>
              {/* <Link href="/about" className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity">
                <div className="p-3 border border-accent">
                  <Contact className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs text-accent">{t('contact')}</span>
              </Link> */}
            </nav>
          </div>
          <LocaleSwitcher />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Header with Logo and Hamburger */}
          <div className="flex justify-between items-center py-4">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              priority
              className="h-16 w-auto"
            />
            <div className="flex items-center space-x-4">
              <LocaleSwitcher />
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-accent" />
                ) : (
                  <Menu className="w-6 h-6 text-accent" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="py-4 border-t border-gray-200 bg-white">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="p-2 border border-accent">
                    <Home className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-accent font-medium">{t('home')}</span>
                </Link>
                <Link 
                  href="/posts" 
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="p-2 border border-accent">
                    <NotebookPenIcon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-accent font-medium">{t('about')}</span>
                </Link>
                <Link 
                  href="/concierge" 
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="p-2 border border-accent">
                    <ListCheck className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-accent font-medium">{t('concierge')}</span>
                </Link>
                {/* <Link 
                  href="/about" 
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="p-2 border border-accent">
                    <Contact className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-accent font-medium">{t('contact')}</span>
                </Link> */}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}