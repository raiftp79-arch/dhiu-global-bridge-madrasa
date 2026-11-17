import React, { useState } from 'react';
import {
  BookOpen,
  Compass,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import type { UserRole } from '../../types';
import { Button, EmptyState } from '../../components/ui/Primitives';
import { LearnerDashboard } from './LearnerDashboard';
import {
  AdminDashboard,
  MentorDashboard,
  ScholarDashboard,
  TeacherDashboard,
} from './RoleDashboards';

export function DashboardShell() {
  const { data, navigate, loginDemo, logout } = usePlatform();
  const user = data?.user ?? null;
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          title="Sign in to open your workspace"
          description="Access your personalized learner dashboard, mentor queue, teacher studio, scholarly review board, or platform administration."
          actionLabel="Sign In or Choose Demo Role"
          onAction={() => navigate('/auth')}
        />
      </div>
    );
  }

  const roleLabels: Record<UserRole, string> = {
    learner: 'Learner',
    mentor: 'Mentor',
    teacher: 'Teacher',
    scholar: 'Scholar Reviewer',
    admin: 'Administrator',
  };

  return (
    <div className="bg-[#FAF9F4] min-h-[calc(100vh-4rem)]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Workspace Sidebar */}
          <aside className="lg:col-span-3 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-5 space-y-6">
            <div className="pb-4 border-b border-[#202B27]/10">
              <p className="text-xs font-medium text-[#C5A46D]">
                {roleLabels[user.role]}
              </p>
              <p className="text-base font-bold text-[#202B27] mt-0.5">{user.name}</p>
              <p className="text-xs text-[#6D7972] mt-0.5">
                {user.city}, {user.country}
              </p>
            </div>

            <nav aria-label="Workspace navigation" className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#164B3B] text-[#FFFFFF]'
                    : 'text-[#202B27] hover:bg-[#FAF9F4]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Workspace Overview</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/learn')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#202B27] hover:bg-[#FAF9F4] transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#164B3B]" />
                <span>Learning Centre</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/mentorship')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#202B27] hover:bg-[#FAF9F4] transition-colors cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-[#164B3B]" />
                <span>Mentorship Directory</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/assistant')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#202B27] hover:bg-[#FAF9F4] transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#164B3B]" />
                <span>AI Learning Assistant</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#202B27] hover:bg-[#FAF9F4] transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#164B3B]" />
                <span>Community Directory</span>
              </button>
            </nav>

            {/* Quick Role Switcher for Demo Inspection */}
            <div className="pt-4 border-t border-[#202B27]/10 space-y-2">
              <p className="text-[11px] font-semibold text-[#6D7972]">
                Switch Demo Role View
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {(
                  [
                    { role: 'learner', label: 'Learner', icon: BookOpen },
                    { role: 'mentor', label: 'Mentor', icon: HeartHandshake },
                    { role: 'teacher', label: 'Teacher', icon: Users },
                    { role: 'scholar', label: 'Scholar Review', icon: UserCheck },
                    { role: 'admin', label: 'Administrator', icon: Shield },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const current = user.role === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => {
                        setActiveTab('overview');
                        void loginDemo(item.role);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        current
                          ? 'bg-[#E8F0E8] text-[#10382F]'
                          : 'text-[#6D7972] hover:bg-[#FAF9F4] hover:text-[#202B27]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => void logout()}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </aside>

          {/* Main Role Viewport */}
          <main className="lg:col-span-9 min-w-0">
            {user.role === 'learner' && <LearnerDashboard activeTab={activeTab} />}
            {user.role === 'mentor' && <MentorDashboard activeTab={activeTab} />}
            {user.role === 'teacher' && <TeacherDashboard />}
            {user.role === 'scholar' && <ScholarDashboard />}
            {user.role === 'admin' && <AdminDashboard activeTab={activeTab} />}
          </main>
        </div>
      </div>
    </div>
  );
}
