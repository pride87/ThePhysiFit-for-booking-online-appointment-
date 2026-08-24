import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/public/Hero';
import ConditionsWeTreat from '../components/public/ConditionsWeTreat';
import TherapySlider from '../components/public/TherapySlider';
import WhyChooseUs from '../components/public/WhyChooseUs';
import PhysiotherapyAdBanner from '../components/public/PhysiotherapyAdBanner';
import TreatmentRecommendation from '../components/public/TreatmentRecommendation';
import PatientReviews from '../components/public/PatientReviews';
import ContactSection from '../components/public/ContactSection';
import Footer from '../components/common/Footer';
import FloatingActions from '../components/common/FloatingActions';
import AppointmentBookingModal from '../components/public/AppointmentBookingModal';

const PublicHomePage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState({
    condition: '',
    therapy: ''
  });

  const openBookingWithPrefill = (condition = '', therapy = '') => {
    setBookingPrefill({ condition, therapy });
    setIsBookingOpen(true);
  };

  // Section observer for active navbar link state
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const handleScroll = () => {
      const scrollY = window.scrollY;
      sections.forEach((sec) => {
        const top = sec.offsetTop - 100;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navbar */}
      <Navbar onOpenBooking={() => openBookingWithPrefill()} activeSection={activeSection} />

      {/* Main Page Sections */}
      <main style={{ flex: 1 }}>
        <Hero onOpenBooking={() => openBookingWithPrefill()} />

        <ConditionsWeTreat onBookCondition={(cond) => openBookingWithPrefill(cond, '')} />

        <TherapySlider onBookTherapy={(th) => openBookingWithPrefill('', th)} />

        <WhyChooseUs onOpenBooking={() => openBookingWithPrefill()} />

        {/* Promotional / Advertising Banner Section */}
        <PhysiotherapyAdBanner onOpenBooking={() => openBookingWithPrefill()} />

        <TreatmentRecommendation onBookWithRecommendation={(cond, th) => openBookingWithPrefill(cond, th)} />

        <PatientReviews />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => openBookingWithPrefill()} />

      {/* Floating Action Buttons */}
      <FloatingActions onOpenBooking={() => openBookingWithPrefill()} />

      {/* Multi-Step Booking System Modal */}
      <AppointmentBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCondition={bookingPrefill.condition}
        initialTherapy={bookingPrefill.therapy}
      />
    </div>
  );
};

export default PublicHomePage;
