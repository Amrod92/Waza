'use client';

import { useRef } from 'react';

import FeaturesBlocks from './LandingPageUI/FeaturesBlocks';
import FeaturesHome from './LandingPageUI/FeaturesHome';
import HeroSection from './LandingPageUI/HeroSection';
import Newsletter from './LandingPageUI/Newsletter';
import Testimonials from './LandingPageUI/Testimonials';

const LandingPage = () => {
  const otherSectionRef = useRef(null);

  const scrollToOtherSection = () => {
    otherSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className='relative flex min-h-screen flex-col overflow-hidden bg-background'>
      <main className='relative z-10 flex-grow'>
        <HeroSection scrollDown={scrollToOtherSection} />
        <div ref={otherSectionRef}>
          <FeaturesHome />
        </div>
        <FeaturesBlocks />
        <Testimonials />
        <Newsletter />
      </main>
    </div>
  );
};

export default LandingPage;
