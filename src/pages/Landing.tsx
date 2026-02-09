import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Castle, Calendar, Users, MapPin } from "lucide-react";
import HeroScene from "@/components/3d/HeroScene";
import { getEvents } from "@/lib/api";
import type { EventEntry } from "@/types";

const Landing = () => {
  const [featuredEvents, setFeaturedEvents] = useState<EventEntry[]>([]);

  useEffect(() => {
    getEvents().then((events) => setFeaturedEvents(events.slice(-3)));
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <HeroScene />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-devanagari text-4xl sm:text-5xl md:text-7xl text-gradient-gold leading-tight mb-4"
          >
            श्रीमंत शिवगर्जना प्रतिष्ठान
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-serif text-lg sm:text-xl md:text-2xl text-foreground/80 tracking-wide mb-8"
          >
            Preserving the Legacy of Chhatrapati Shivaji Maharaj
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-primary-foreground font-semibold rounded-lg glow-saffron transition-transform hover:scale-105"
            >
              <span className="font-devanagari">इतिहास जाणा</span>
              <span className="text-sm opacity-80">/ Explore History</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-4 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary/10 transition-all"
            >
              <span className="font-devanagari">कार्यक्रम</span>
              <span className="text-sm opacity-80">/ Events</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-secondary/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-secondary/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-devanagari text-3xl md:text-4xl text-gradient-gold mb-4">
              आमचे ध्येय
            </h2>
            <p className="font-serif text-lg text-secondary mb-6">Our Mission</p>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              To preserve, promote, and celebrate the extraordinary legacy of Chhatrapati Shivaji Maharaj
              through cultural events, historical education, fort preservation, and community engagement
              across Maharashtra and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Castle, value: "350+", labelMr: "किल्ले", labelEn: "Forts Documented" },
            { icon: Calendar, value: "50+", labelMr: "कार्यक्रम", labelEn: "Events Organized" },
            { icon: Users, value: "10,000+", labelMr: "सदस्य", labelEn: "Members" },
            { icon: MapPin, value: "25+", labelMr: "शहरे", labelEn: "Cities Reached" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-xl p-6 text-center glow-gold"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-gradient-saffron mb-1">{stat.value}</div>
              <div className="font-devanagari text-sm text-secondary">{stat.labelMr}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.labelEn}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-devanagari text-3xl md:text-4xl text-gradient-gold mb-2">
              ताजे कार्यक्रम
            </h2>
            <p className="font-serif text-lg text-secondary">Recent Events</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-xl overflow-hidden group hover:glow-saffron transition-shadow duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs bg-primary/80 text-primary-foreground px-3 py-1 rounded-full">
                      {event.year}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-devanagari text-xl text-secondary mb-1">{event.titleMarathi}</h3>
                  <p className="text-sm text-foreground/80 mb-2">{event.titleEnglish}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              सर्व कार्यक्रम पहा / View All Events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 section-padding py-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-devanagari text-xl text-secondary mb-2">श्रीमंत शिवगर्जना प्रतिष्ठान</p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shrimant Shivgarjana Prathisthan. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            जय शिवराय! | Jai Shivray!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
