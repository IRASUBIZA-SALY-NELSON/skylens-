import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpWideNarrow, LayoutDashboard, Menu, X } from 'lucide-react';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Scroll Animation Component
const ScrollAnimation = ({ children, className = "", variant = "fadeInUp", ...props }) => {
  const controls = useAnimation();

  // Start animation immediately when component mounts
  React.useEffect(() => {
    controls.start("show");
  }, [controls]);

  const variants = {
    fadeInUp,
    scaleIn,
    item
  };

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={variants[variant] || fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const smoothScrollToSection = (e, sectionId) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

export default function Landing() {
  const [openModal, setOpenModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { id: 'features', label: 'Features' },
    { id: 'how', label: 'How' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'partners', label: 'Partners' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full sticky top-0 bg-white/80 backdrop-blur-md z-50 border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1508612761958-e931fab3ec6a?q=80&w=240&auto=format&fit=crop" alt="Skylens drone logo" className="h-10 w-10 md:h-12 md:w-12 rounded" />
                <span className="font-semibold text-gray-900 text-xl md:text-2xl tracking-tight">SKYLENS RWANDA</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden [@media(min-width:1280px)]:flex items-center space-x-6">
              {navItems.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={(e) => { smoothScrollToSection(e, n.id); closeMobileMenu(); }}
                  className="text-gray-600 hover:text-gray-900 px-2 py-2 text-sm font-medium transition-colors"
                >
                  {n.label}
                </a>
              ))}
              <Link
                to="/auth/login"
                className="ml-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/plans"
                className="inline-flex items-center justify-center rounded-md bg-[#7152F3] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="[@media(min-width:1280px)]:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="[@media(min-width:1280px)]:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((n) => (
                  <a
                    key={`mobile-${n.id}`}
                    href={`#${n.id}`}
                    onClick={(e) => { smoothScrollToSection(e, n.id); closeMobileMenu(); }}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    {n.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-200 mt-2">
                  <Link
                    to="/auth/login"
                    className="block w-full text-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md mb-2"
                    onClick={closeMobileMenu}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/plans"
                    className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-[#7152F3] hover:opacity-90 rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-[130px] pb-16 md:pb-20"
          >
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <motion.div variants={item} className="w-full md:w-1/2">
                <motion.h1
                  variants={item}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900 tracking-tight"
                >
                  Multi‑purpose Drone Solutions for Rwanda
                </motion.h1>
                <motion.p
                  variants={item}
                  className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600"
                >
                  SKYLENS RWANDA builds versatile drones for aerial photography, surveying & mapping, and lightweight package delivery—serving industry, education, and environmental monitoring.
                </motion.p>
                <motion.div
                  variants={item}
                  className="mt-6 flex flex-col sm:flex-row gap-3"
                >
                  <a
                    href="#features"
                    onClick={(e) => smoothScrollToSection(e, 'features')}
                    className="inline-flex items-center justify-center gap-3 rounded-[15px] bg-[#7152F3] px-6 py-4 text-sm sm:text-base font-semibold text-white shadow-soft hover:opacity-90 hover:scale-105 transition-all duration-300"
                  >
                    Explore Features <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5' />
                  </a>
                </motion.div>
              </motion.div>
              <ScrollAnimation variant="scaleIn" className="w-full md:w-1/2 mt-10 md:mt-0">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl shadow-soft ring-1 shadow-[rgba(113,82,243,0.05)] ring-gray-200 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1200&auto=format&fit=crop"
                    alt="Drone flying over fields"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </motion.div>
        </section>

        {/* Introduction */}
        <section id="introduction" className="border-y border-gray-100 bg-white/50 py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4">Project Introduction</h2>
                <p className="text-lg text-gray-600">
                  This project presents a multi‑purpose drone designed for surveying, mapping, and delivery applications. Equipped with a high‑resolution camera, powerful receiver & transmitter, efficient motors, and modular components, the drone captures aerial images and videos for land surveys and mapping while also performing lightweight package deliveries.
                </p>
                <p className="text-lg text-gray-600 mt-4">
                  Its versatile design makes it suitable for industrial use, environmental monitoring, and educational purposes.
                </p>
              </div>
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl shadow-soft ring-1 ring-gray-200 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
                    alt="Drone inspecting landscape"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Function */}
        <section id="main-function" className="py-12 md:py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">Main Functions</h2>
              <p className="text-lg text-gray-600 mt-2">Core use‑cases delivered by our drone platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aerial Photography & Videography</h3>
                <p className="text-gray-600">Captures high‑quality photos and videos from above. Useful for land observation and project monitoring.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Surveying & Mapping</h3>
                <p className="text-gray-600">Uses a camera and QGIS software to create accurate land maps. Helps measure areas, analyze terrain, and plan construction.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Package Delivery</h3>
                <p className="text-gray-600">Light payload system for small item delivery. Can transport medical kits, documents, and more.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Educational Application</h3>
                <p className="text-gray-600">Demonstrates robotics, programming, electronics, and aerodynamics. Supports student learning in drone control and data collection.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-12 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4">Key Features</h2>
                <ul className="space-y-3 text-gray-700 list-disc pl-5">
                  <li><span className="font-medium">Versatile:</span> photography, surveying, mapping, delivery, learning</li>
                  <li><span className="font-medium">Modular design:</span> easy to repair and upgrade</li>
                  <li><span className="font-medium">Cost‑effective:</span> only 800,000 RWF</li>
                  <li><span className="font-medium">Long flight time:</span> 40–60 minutes</li>
                  <li><span className="font-medium">Flight distance:</span> 2 km</li>
                  <li><span className="font-medium">Educational tool:</span> helps students learn drones</li>
                </ul>
              </div>
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl shadow-soft ring-1 ring-gray-200 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1508873535684-277a3cbcc4e0?q=80&w=1200&auto=format&fit=crop"
                    alt="Drone in flight"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How (workflow) */}
        <section id="how" className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">How It Works</h2>
              <p className="text-lg text-gray-600 mt-2">Plan flight • Capture data • Process in QGIS • Deliver insights or payloads</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { t: 'Plan', d: 'Define route, altitude, and safety constraints.' },
                { t: 'Fly', d: 'Autonomous or manual flight with live telemetry.' },
                { t: 'Process', d: 'Generate orthomosaics, DSM/DTM, and measurements.' },
                { t: 'Act', d: 'Share results or deliver small payloads.' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.t}</h3>
                  <p className="text-gray-600">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-white py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">Pricing</h2>
              <p className="text-lg text-gray-600 mt-2">Simple options to get started with Skylens drones</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Starter Kit', price: '800,000 RWF', items: ['Multitask drone', 'Controller', 'Basic battery', 'Training guide'] },
                { name: 'Survey Kit', price: '1,400,000 RWF', items: ['4K camera', 'Extra battery', 'QGIS workflow guide', 'Carrying case'] },
                { name: 'Edu Lab', price: 'Custom', items: ['STEM curriculum', 'Spare parts', 'On-site workshop', 'Support SLA'] },
              ].map((p, idx) => (
                <div key={idx} className={`rounded-xl border ${idx === 1 ? 'border-[#7152F3] shadow-soft' : 'border-gray-200'} bg-white p-6`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    {idx === 1 && <span className="text-xs px-2 py-1 rounded-full bg-[#7152F3]/10 text-[#7152F3]">Popular</span>}
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-gray-900">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {p.items.map((it, i) => (<li key={i} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7152F3]" />{it}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section id="partners" className="py-12 md:py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">Partners</h2>
              <p className="text-lg text-gray-600 mt-2">Working with schools, NGOs, and local innovators in Rwanda</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=480&auto=format&fit=crop" alt="Partners with drone" className="w-full md:w-1/3 rounded-xl object-cover" />
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-900">Local Tech Ecosystem</h3>
                <p className="text-gray-600 mt-2">We collaborate with educational institutions and community initiatives to expand access to drone technology and training.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">FAQ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { q: 'What payload can the drone carry?', a: 'It supports lightweight items suitable for documents or medical kits in the field.' },
                { q: 'How long is the flight time?', a: 'Typical flights range from 40–60 minutes depending on payload and wind.' },
                { q: 'Do you provide training?', a: 'Yes—starter training is included, with advanced workshops available.' },
                { q: 'Can I map with QGIS?', a: 'Yes. We provide a workflow guide for stitching imagery and measuring areas.' },
              ].map((f, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-[16px] font-semibold text-gray-900">{f.q}</h3>
                  <p className="mt-2 text-[16px] text-gray-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-12 md:py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4">About Skylens Rwanda</h2>
                <p className="text-lg text-gray-600">We design and assemble multipurpose drones in Rwanda, focusing on accessibility, education, and local impact. Our mission is to make aerial data and delivery capabilities available to schools, NGOs, and SMEs.</p>
              </div>
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl shadow-soft ring-1 ring-gray-200 bg-white">
                  <img src="https://images.unsplash.com/photo-1520975964184-9ca7d7b9a2f3?q=80&w=1200&auto=format&fit=crop" alt="About Skylens" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-white py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">Contact Us</h2>
              <p className="text-lg text-gray-600 mt-2">We’re based in Kigali, Rwanda</p>
            </div>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="mt-1 text-gray-900 font-medium">(+250) 798 642 237</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 text-gray-900 font-medium">uwayezurw@gmail.com</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">Address</p>
                <p className="mt-1 text-gray-900 font-medium">Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SKYLENS RWANDA. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
