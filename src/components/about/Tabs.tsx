'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Achievement {
  period: string;
  details: string;
  url: string;
}

interface TabsProps {
  skills: string[];
  achievements: Achievement[];
}

const Tabs: React.FC<TabsProps> = ({ skills, achievements }) => {
  const t = useTranslations("AboutPage");
  const [activeTab, setActiveTab] = useState("skills");

  const tabs = [
    { id: "skills", name: t("tabs.skills") },
    { id: "achievements", name: t("tabs.achievements") },
  ];

  return (
    <>
      <div className="border-t border-b border-gray-200">
        <ul className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <li key={tab.id} className="px-4">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 relative ${
                  activeTab === tab.id ? "text-accent font-semibold" : ""
                }`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === "skills" && (
          <div className="border border-gray-200 rounded-lg bg-gray-50 shadow-md p-6">
            <h3 className="text-lg font-semibold border-b pb-2">{t("tabs.skills")}</h3>
            <div className="space-y-2 mt-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                >
                  <p className="text-sm text-gray-700">{skill}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="border border-gray-200 rounded-lg bg-gray-50 shadow-md p-6">
            <h3 className="text-lg font-semibold border-b pb-2">{t("tabs.achievements")}</h3>
            <div className="space-y-4 mt-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                >
                  <p className="text-sm text-gray-600">
                    {achievement.period}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <Link
                      href={achievement.url}
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {achievement.url}
                    </Link>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tabs;
