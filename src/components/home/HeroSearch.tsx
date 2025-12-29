"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { Search, UtensilsCrossed, Building2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

type SearchTab = "restaurant" | "facilities" | "hotels";

interface HeroSearchProps {
  locale: "en" | "ja";
}

export default function HeroSearch({ locale }: HeroSearchProps) {
  const t = useTranslations("HeroSearch");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTab, setSearchTab] = useState<SearchTab>("restaurant");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Navigate to concierge page with search query
    // Category filtering can be done on the concierge page
    router.push(`/${locale}/concierge?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleTabClick = (tab: SearchTab) => {
    setSearchTab(tab);
    setSearchQuery(""); // Clear search when switching tabs
  };

  return (
    <section className="relative bg-gradient-to-br from-accent/90 via-accent to-accent/80 overflow-hidden -mt-36 md:-mt-40">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Catchphrase */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            <span className="block">{t("titleLine1")}</span>
            <span className="block bg-gradient-to-r from-yellow-200 via-white to-green-200 bg-clip-text text-transparent">
              {t("titleLine2")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Search Tabs and Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* Search Tabs */}
          <div className="flex mb-0 bg-white/5 backdrop-blur-sm rounded-t-2xl overflow-hidden border border-white/20 border-b-0">
            <button
              onClick={() => handleTabClick("restaurant")}
              className={`flex-1 py-3.5 px-2 sm:px-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                searchTab === "restaurant"
                  ? "bg-white text-accent shadow-lg"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              {t("restaurantTab")}
            </button>
            <button
              onClick={() => handleTabClick("facilities")}
              className={`flex-1 py-3.5 px-2 sm:px-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                searchTab === "facilities"
                  ? "bg-white text-accent shadow-lg"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Building2 className="w-4 h-4" />
              {t("facilitiesTab")}
            </button>
            <button
              onClick={() => handleTabClick("hotels")}
              className={`flex-1 py-3.5 px-2 sm:px-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                searchTab === "hotels"
                  ? "bg-white text-accent shadow-lg"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t("hotelsTab")}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative bg-white rounded-b-2xl shadow-2xl overflow-visible">
            <div className="flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t(`placeholder_${searchTab}`)}
                  aria-label={t("searchLabel")}
                  className="w-full h-14 pl-12 pr-4 bg-transparent border-0 rounded-bl-2xl focus:outline-none focus:ring-0 text-base text-gray-900 placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-8 bg-gradient-to-r from-accent to-accent/90 text-white font-bold text-base hover:from-accent/90 hover:to-accent transition-all rounded-br-2xl shadow-lg"
              >
                {t("searchButton")}
              </button>
            </div>
          </div>
        </div>

        {/* Map CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/concierge"
            className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-accent font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/50"
          >
            <span className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-white" />
            </span>
            <span>{t("mapButton")}</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

