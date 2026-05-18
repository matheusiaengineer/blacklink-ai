"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   WORLD MAP — Cinematic global activity visualization
   Shows live user activity with pulsing dots and activity feed
───────────────────────────────────────────────────────────────────────────── */

interface ActivityPoint {
  id: string;
  x: number;
  y: number;
  city: string;
  country: string;
  action: string;
  timestamp: number;
}

// Major tech hubs and cities worldwide (x, y as percentage of map)
const CITY_COORDINATES: Record<string, { x: number; y: number; country: string }> = {
  "San Francisco": { x: 12, y: 38, country: "USA" },
  "New York": { x: 22, y: 40, country: "USA" },
  "Los Angeles": { x: 10, y: 42, country: "USA" },
  "Toronto": { x: 20, y: 35, country: "Canada" },
  "São Paulo": { x: 30, y: 72, country: "Brazil" },
  "Rio de Janeiro": { x: 33, y: 70, country: "Brazil" },
  "Buenos Aires": { x: 28, y: 78, country: "Argentina" },
  "London": { x: 47, y: 32, country: "UK" },
  "Paris": { x: 49, y: 35, country: "France" },
  "Berlin": { x: 52, y: 32, country: "Germany" },
  "Amsterdam": { x: 50, y: 31, country: "Netherlands" },
  "Stockholm": { x: 54, y: 26, country: "Sweden" },
  "Dubai": { x: 62, y: 48, country: "UAE" },
  "Mumbai": { x: 68, y: 52, country: "India" },
  "Bangalore": { x: 69, y: 56, country: "India" },
  "Singapore": { x: 76, y: 60, country: "Singapore" },
  "Tokyo": { x: 85, y: 40, country: "Japan" },
  "Seoul": { x: 82, y: 38, country: "South Korea" },
  "Sydney": { x: 88, y: 78, country: "Australia" },
  "Melbourne": { x: 86, y: 80, country: "Australia" },
  "Lagos": { x: 50, y: 58, country: "Nigeria" },
  "Cape Town": { x: 54, y: 78, country: "South Africa" },
  "Tel Aviv": { x: 58, y: 44, country: "Israel" },
  "Moscow": { x: 60, y: 28, country: "Russia" },
  "Beijing": { x: 78, y: 40, country: "China" },
  "Shanghai": { x: 80, y: 44, country: "China" },
  "Hong Kong": { x: 79, y: 50, country: "China" },
  "Jakarta": { x: 77, y: 64, country: "Indonesia" },
  "Mexico City": { x: 14, y: 52, country: "Mexico" },
  "Miami": { x: 19, y: 48, country: "USA" },
  "Chicago": { x: 17, y: 38, country: "USA" },
  "Austin": { x: 14, y: 46, country: "USA" },
  "Seattle": { x: 10, y: 34, country: "USA" },
  "Denver": { x: 13, y: 40, country: "USA" },
  "Boston": { x: 23, y: 38, country: "USA" },
  "Atlanta": { x: 19, y: 44, country: "USA" },
  "Lisbon": { x: 44, y: 40, country: "Portugal" },
  "Madrid": { x: 46, y: 42, country: "Spain" },
  "Barcelona": { x: 48, y: 42, country: "Spain" },
  "Milan": { x: 51, y: 38, country: "Italy" },
  "Zurich": { x: 51, y: 36, country: "Switzerland" },
  "Vienna": { x: 53, y: 35, country: "Austria" },
  "Warsaw": { x: 55, y: 32, country: "Poland" },
  "Dublin": { x: 44, y: 30, country: "Ireland" },
};

const ACTIONS = [
  "generated AI post",
  "optimized profile",
  "scheduled campaign",
  "connected with recruiter",
  "created AI image",
  "analyzed engagement",
  "built authority strategy",
  "launched 7-day campaign",
  "upgraded to Pro",
  "joined BLACKLINK AI",
];

const CITIES = Object.keys(CITY_COORDINATES);

function generateRandomActivity(): ActivityPoint {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const coords = CITY_COORDINATES[city];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    x: coords.x + (Math.random() - 0.5) * 2,
    y: coords.y + (Math.random() - 0.5) * 2,
    city,
    country: coords.country,
    action,
    timestamp: Date.now(),
  };
}

export function WorldMap() {
  const [activities, setActivities] = useState<ActivityPoint[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityPoint | null>(null);
  const [totalUsers, setTotalUsers] = useState(12847);
  const [activeNow, setActiveNow] = useState(342);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate initial activities
  useEffect(() => {
    const initial: ActivityPoint[] = [];
    for (let i = 0; i < 15; i++) {
      initial.push(generateRandomActivity());
    }
    setActivities(initial);
  }, []);

  // Add new activities periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateRandomActivity();
      
      setActivities((prev) => {
        const updated = [...prev, newActivity];
        // Keep only last 20 activities
        if (updated.length > 20) {
          return updated.slice(-20);
        }
        return updated;
      });
      
      setRecentActivity(newActivity);
      
      // Randomly update counters
      if (Math.random() > 0.7) {
        setTotalUsers((prev) => prev + Math.floor(Math.random() * 3) + 1);
      }
      setActiveNow((prev) => {
        const change = Math.floor(Math.random() * 10) - 4;
        return Math.max(100, prev + change);
      });
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Clear recent activity notification
  useEffect(() => {
    if (recentActivity) {
      const timeout = setTimeout(() => {
        setRecentActivity(null);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [recentActivity]);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-950" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4"
          >
            Global Network
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-white mb-4"
          >
            Building authority <span className="text-neutral-500">worldwide</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-xl mx-auto"
          >
            Join thousands of professionals using AI to grow their LinkedIn presence
          </motion.p>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-8 md:gap-16 mb-12"
        >
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-light text-white tabular-nums">
              {totalUsers.toLocaleString()}
            </div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
              Total Users
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-2xl md:text-4xl font-light text-white tabular-nums">
                {activeNow}
              </span>
            </div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
              Active Now
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-light text-white">
              47
            </div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
              Countries
            </div>
          </div>
        </motion.div>

        {/* Map container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative aspect-[2/1] max-w-5xl mx-auto rounded-2xl overflow-hidden border border-neutral-800/50 bg-neutral-950/50 backdrop-blur-sm"
        >
          {/* World map SVG */}
          <svg
            viewBox="0 0 100 50"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Simplified world map paths */}
            <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.15">
              {/* North America */}
              <path d="M5,25 Q10,20 15,22 Q20,18 25,20 L25,35 Q20,40 15,38 Q10,42 5,38 Z" />
              {/* South America */}
              <path d="M20,45 Q25,42 30,45 Q35,50 32,60 Q28,70 25,75 Q22,70 20,60 Q18,50 20,45 Z" />
              {/* Europe */}
              <path d="M42,20 Q48,18 55,20 Q58,25 55,30 Q50,35 45,32 Q42,28 42,20 Z" />
              {/* Africa */}
              <path d="M42,35 Q50,32 55,38 Q58,50 55,60 Q50,70 45,65 Q40,55 42,35 Z" />
              {/* Asia */}
              <path d="M55,15 Q70,12 85,18 Q90,30 85,40 Q75,45 65,42 Q55,35 55,15 Z" />
              {/* Australia */}
              <path d="M78,55 Q85,52 90,58 Q92,65 88,70 Q82,72 78,68 Q75,62 78,55 Z" />
            </g>

            {/* Connection lines between active points */}
            {activities.slice(-5).map((activity, i) => {
              const nextActivity = activities[activities.length - 5 + i + 1];
              if (!nextActivity) return null;
              return (
                <motion.line
                  key={`line-${activity.id}`}
                  x1={activity.x}
                  y1={activity.y}
                  x2={nextActivity.x}
                  y2={nextActivity.y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              );
            })}
          </svg>

          {/* Activity points */}
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute"
                style={{
                  left: `${activity.x}%`,
                  top: `${activity.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/20"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  style={{
                    width: 8,
                    height: 8,
                    marginLeft: -4,
                    marginTop: -4,
                  }}
                />
                {/* Core dot */}
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Hover tooltip for recent activity */}
          <AnimatePresence>
            {recentActivity && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${Math.min(Math.max(recentActivity.x, 15), 85)}%`,
                  top: `${Math.min(recentActivity.y + 5, 80)}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="bg-white text-black px-3 py-2 rounded-lg shadow-2xl text-xs whitespace-nowrap">
                  <div className="font-medium">{recentActivity.city}, {recentActivity.country}</div>
                  <div className="text-neutral-600">{recentActivity.action}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />
        </motion.div>

        {/* Live activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            <span className="uppercase tracking-wider">Live Activity</span>
          </div>
          
          <div className="h-20 overflow-hidden relative">
            <AnimatePresence mode="popLayout">
              {activities.slice(-3).reverse().map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1 - index * 0.3, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-1"
                >
                  <span className="text-neutral-400">Someone in </span>
                  <span className="text-white font-medium">{activity.city}</span>
                  <span className="text-neutral-400"> just </span>
                  <span className="text-white">{activity.action}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
