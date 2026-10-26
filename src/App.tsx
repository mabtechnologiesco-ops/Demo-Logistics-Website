import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TrackingBar } from '@/components/sections/TrackingBar';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Industries } from '@/components/sections/Industries';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { CTA } from '@/components/sections/CTA';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { AiAssistant } from '@/components/assistant/AiAssistant';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { LoginPage } from '@/components/portal/LoginPage';
import { PortalDashboard } from '@/components/portal/PortalDashboard';

type View = 'site' | 'portal';

function AppContent() {
  const { session, loading } = useAuth();
  const [view, setView] = useState<View>('site');

  const openPortal = () => setView('portal');
  const backToSite = () => setView('site');

  // Portal view: show login if no session, dashboard if signed in
  if (view === 'portal') {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-navy-900">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent-500" />
        </div>
      );
    }
    if (!session) {
      return <LoginPage onBack={backToSite} />;
    }
    return <PortalDashboard onExit={backToSite} />;
  }

  // Main website
  return (
    <div className="min-h-screen bg-white">
      <Navbar onPortal={openPortal} />
      <main>
        <Hero />
        <TrackingBar />
        <Stats />
        <Services />
        <About />
        <Industries />
        <HowItWorks />
        <CTA />
        <Contact />
      </main>
      <Footer />

      {/* Floating controls — AI on LEFT, WhatsApp on RIGHT */}
      <AiAssistant />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
