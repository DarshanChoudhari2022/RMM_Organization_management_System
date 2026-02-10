import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Shield, Users, MapPin,
  ChevronRight, Crown, Star,
  Flag, Sparkles, Scroll, Heart, Calendar,
  Camera, Music, MessageSquare
} from "lucide-react";

import Rajmudra3D from "@/components/Rajmudra3D";

const Landing = () => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const heroParallax = useTransform(scrollY, [0, 800], [0, 200]);

  return (
    <div className="bg-white min-h-screen">
      {/* 🚩 HERO SECTION - MAJESTIC EVENT PROMOTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#2a0a0a]">
        <motion.div
          style={{ opacity: heroOpacity, y: heroParallax }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1624314138470-5a2f24623f10?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            alt="Historical Coronation Theme - Raigad"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a0a0a]/80 via-transparent to-[#2a0a0a]" />
        </motion.div>

        <div className="relative z-10 w-full px-6 text-white max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="w-12 h-[1px] bg-shiv-orange" />
              <span className="text-shiv-orange font-black uppercase tracking-[0.4em] text-xs">Since 2014 • Pune</span>
            </div>
            <h1 className="mb-8 drop-shadow-2xl leading-[1.1] text-6xl md:text-8xl font-black">
              SHIV <span className="text-shiv-orange italic">JAYANTI</span> <br />
              <span className="text-white">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-serif italic mb-12 max-w-2xl mx-auto lg:mx-0 leading-shiv">
              Experience the grandeur of Swarajya at **Kedari Nagar**. Join the Shrimant Shivgarjana Prathisthan as we celebrate the legacy of Chhatrapati Shivaji Maharaj.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link to="/events" className="px-12 py-5 bg-shiv-orange text-white font-black uppercase tracking-widest text-xs shadow-[0_20px_50px_rgba(255,94,0,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-4">
                View Event Schedule <Calendar size={18} />
              </Link>
              <Link to="/gallery" className="px-12 py-5 border-2 border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4">
                Past Highlights <Camera size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="lg:w-1/2 h-[400px] lg:h-[600px] w-full relative"
          >
            <Rajmudra3D />
            <div className="absolute -bottom-10 right-0 lg:-right-10 bg-white/5 backdrop-blur-md p-10 border border-white/10 shadow-2xl skew-x-[-10deg]">
              <div className="skew-x-[10deg]">
                <div className="text-shiv-orange text-5xl font-black mb-2 leading-none">19 FEB</div>
                <div className="text-white/60 text-[10px] uppercase font-black tracking-widest">Mark the Date</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🚩 THE MANDAL LEGACY - KEDARI NAGAR PRIDE */}
      <ScrollSection id="mandal" number="01">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative group">
              <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1620766182577-b8a9134a6ee1?q=80&w=2070"
                  alt="Mandal Celebration"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a0a0a] to-transparent opacity-60" />
              </div>
              <div className="absolute -bottom-12 -right-12 bg-shiv-orange p-12 text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                <div className="text-5xl font-black mb-2">11+</div>
                <div className="text-[10px] uppercase font-black tracking-widest leading-normal">Years of <br />Unified Pride</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-10">
            <div className="flex items-center gap-3 text-shiv-orange font-black text-[10px] uppercase tracking-widest">
              <Crown size={14} /> Our Foundation
            </div>
            <h2 className="text-6xl font-black leading-tight">Shrimant Shivgarjana <br /><span className="text-shiv-orange italic">Prathisthan</span></h2>
            <p className="text-xl text-gray-500 font-serif leading-shiv lg:max-w-xl">
              Since 2014, our Mandal has been a pillar of cultural unity in **Kedari Nagar, Pune**. We don't just organize an event; we carry forward the **Spirit of Swarajya**.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-8">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#2a0a0a] mb-4 flex items-center gap-3">
                  <Users size={16} className="text-shiv-orange" /> Strength
                </h4>
                <p className="text-sm text-gray-400 font-serif italic">Backed by a dedicated council of 50+ members and 5000+ well-wishers.</p>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#2a0a0a] mb-4 flex items-center gap-3">
                  <MapPin size={16} className="text-shiv-orange" /> Impact
                </h4>
                <p className="text-sm text-gray-400 font-serif italic">Leading social initiatives and heritage conservation drives across Pune.</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* 🚩 CELEBRATION HIGHLIGHTS - WHAT TO EXPECT */}
      <section className="bg-[#1a0505] py-32 px-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <Scroll size={800} className="-rotate-12 translate-x-40" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="numbered-label">02</span>
            <h2 className="text-white text-6xl font-black">Utsav <span className="text-shiv-orange italic">Highlights</span></h2>
            <p className="text-white/40 font-serif italic text-xl mt-6">Professional, Immersive, Unforgettable.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Grand Procession",
                label: "Mirvunuk",
                icon: Music,
                desc: "Experience the thunderous beats of Dhol Tasha Pathak and traditional folk dancers."
              },
              {
                title: "Heritage Showcase",
                label: "Exhibition",
                icon: Shield,
                desc: "Visual storytelling of the Maratha Empire including 3D fort models and weaponry."
              },
              {
                title: "Community Feast",
                label: "Maha-Prasad",
                icon: Heart,
                desc: "Bringing the entire neighborhood together in the spirit of brotherhood and sharing."
              }
            ].map((item, i) => (
              <EntranceCard key={i} delay={i * 0.2}>
                <div className="p-12 bg-white/5 border border-white/5 hover:border-shiv-orange/30 transition-all group backdrop-blur-sm h-full">
                  <div className="text-shiv-orange mb-8 group-hover:scale-110 transition-transform">
                    <item.icon size={48} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-3 block">{item.label}</span>
                  <h3 className="text-white text-3xl mb-6 font-black">{item.title}</h3>
                  <p className="text-white/50 text-lg leading-shiv font-serif italic">{item.desc}</p>
                </div>
              </EntranceCard>
            ))}
          </div>
        </div>
      </section>

      {/* 🚩 JOIN THE MISSION - PROFESSIONAL CTA */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-block p-4 bg-shiv-orange/10 rounded-full mb-10">
            <Sparkles size={40} className="text-shiv-orange animate-pulse" />
          </div>
          <h2 className="mb-8 text-6xl font-black text-[#2a0a0a]">Support the <span className="text-shiv-orange italic underline decoration-shiv-orange/30">Mandal</span></h2>
          <p className="text-xl mb-16 text-gray-400 font-serif italic max-w-2xl mx-auto leading-shiv">
            Our celebrations are powered by the people of Pune. Contribute or join our committee to help us organize the grandest Shiv Jayanti 2025.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <button className="px-16 py-6 bg-shiv-orange text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-[#e65500] transition-all flex items-center gap-4">
              Donate to Mandal <Heart size={18} fill="currentColor" />
            </button>
            <Link to="/members" className="px-16 py-6 border-2 border-gray-100 text-gray-400 font-black uppercase tracking-widest text-xs hover:border-shiv-orange hover:text-shiv-orange transition-all flex items-center gap-4">
              Join Committee <MessageSquare size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0505] text-white/40 py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 border border-shiv-orange/30 flex items-center justify-center">
                <Crown size={20} className="text-shiv-orange" />
              </div>
              <h4 className="logo-marathi text-4xl font-devanagari text-shiv-orange">शिवगर्जना</h4>
            </div>
            <p className="text-lg font-serif italic max-w-md leading-shiv">
              Kedari Nagar's premier Mandal dedicated to preserving and promoting the glorious heritage of Chhatrapati Shivaji Maharaj.
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white/60">Navigation</h5>
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
              <Link to="/events" className="hover:text-shiv-orange transition-colors">Celebrations</Link>
              <Link to="/gallery" className="hover:text-shiv-orange transition-colors">Archives</Link>
              <Link to="/members" className="hover:text-shiv-orange transition-colors">Committee</Link>
            </div>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white/60">Headquarters</h5>
            <p className="text-sm font-serif italic">
              Main Chowk, Kedari Nagar,<br />
              Wanowrie, Pune - 411040
            </p>
            <div className="pt-4 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-shiv-orange hover:text-white transition-all cursor-pointer">
                <Camera size={14} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-shiv-orange hover:text-white transition-all cursor-pointer">
                <MessageSquare size={14} />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">© 2026 Shrimant Shivgarjana Prathisthan • Designed for Swarajya</p>
        </div>
      </footer>
    </div>
  );
};

/* Helper Components for Scroll Animations */
const ScrollSection = ({ children, id, number }: { children: React.ReactNode, id: string, number: string }) => {
  return (
    <section id={id} className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="numbered-label !text-shiv-orange/20 tracking-[0.5em]">{number}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

const EntranceCard = ({ children, delay }: { children: React.ReactNode, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Landing;
