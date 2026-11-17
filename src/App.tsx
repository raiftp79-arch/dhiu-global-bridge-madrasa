import React from 'react';
import { MotionConfig } from 'motion/react';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { AuthPage } from './pages/AuthPage';
import { AssistantPage, CommunityPage } from './pages/CommunityAndAssistant';
import { DashboardShell } from './pages/dashboards/DashboardShell';
import { ExploreIslamPage, NewMuslimsPage } from './pages/ExploreAndNewMuslims';
import { HomePage } from './pages/HomePage';
import { CourseDetailPage, LearningCentrePage } from './pages/LearningCentrePage';
import { MentorshipPage, ResourcesPage } from './pages/MentorshipAndResources';

function RouteView() {
  const { route, error, refresh } = usePlatform();

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-base font-semibold text-[#202B27]">
          Unable to load NoorPath
        </p>
        <p className="text-sm text-[#6D7972]">{error}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-[#164B3B] text-[#FFFFFF] cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (route === '/explore') return <ExploreIslamPage />;
  if (route === '/learn') return <LearningCentrePage />;
  if (route.startsWith('/learn/')) {
    const courseId = route.slice('/learn/'.length);
    return <CourseDetailPage courseId={courseId} />;
  }
  if (route === '/new-muslims') return <NewMuslimsPage />;
  if (route === '/mentorship') return <MentorshipPage />;
  if (route === '/resources') return <ResourcesPage />;
  if (route === '/community') return <CommunityPage />;
  if (route === '/assistant') return <AssistantPage />;
  if (route === '/auth') return <AuthPage />;
  if (route === '/dashboard') return <DashboardShell />;
  return <HomePage />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <PlatformProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF9F4] text-[#202B27]">
          <Navbar />
          <div className="flex-1">
            <RouteView />
          </div>
          <Footer />
        </div>
      </PlatformProvider>
    </MotionConfig>
  );
}
