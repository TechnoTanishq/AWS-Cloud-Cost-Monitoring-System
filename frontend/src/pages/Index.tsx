// import { Link } from "react-router-dom";
// import { PublicLayout } from "@/components/PublicLayout";
// import { Button } from "@/components/ui/button";
// import { BarChart3, Shield, Brain, Layers, ArrowRight, Play } from "lucide-react";
// import { motion } from "framer-motion";

// const features = [
//   {
//     icon: BarChart3,
//     title: "Real-time Cost Monitoring",
//     description: "Track your AWS spending in real-time with granular service-level breakdowns and instant visibility.",
//   },
//   {
//     icon: Layers,
//     title: "Service & Project Breakdown",
//     description: "Analyze costs by AWS service, project tags, and custom dimensions to identify optimization opportunities.",
//   },
//   {
//     icon: Brain,
//     title: "ML-Powered Prediction",
//     description: "Leverage moving averages and linear regression to forecast costs and detect anomalies before they escalate.",
//   },
//   {
//     icon: Shield,
//     title: "Security-First IAM Integration",
//     description: "Connect via IAM roles and STS—no permanent credentials stored. Least-privilege access by design.",
//   },
// ];

// const fadeUp = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.1, duration: 0.5 },
//   }),
// };

// export default function Index() {
//   return (
//     <PublicLayout>
//       {/* Hero */}
//       <section className="relative overflow-hidden section-padding">
//         <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
//         <div className="container-tight relative">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             className="max-w-3xl mx-auto text-center"
//           >
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-xs font-medium text-muted-foreground mb-6">
//               <span className="h-1.5 w-1.5 rounded-full gradient-bg" />
//               AWS Cloud Cost Intelligence
//             </div>
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
//               Intelligent AWS Cloud{" "}
//               <span className="gradient-text">Cost Monitoring</span>
//             </h1>
//             <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
//               Predict. Prevent. Optimize. — Gain full visibility into your AWS costs with ML-powered forecasting, automated alerts, and actionable insights.
//             </p>
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
//               <Link to="/register">
//                 <Button size="lg" className="gap-2 px-8">
//                   Get Started <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </Link>
//               <a href="https://youtube.com" target="_blank" rel="noreferrer">
//                 <Button variant="outline" size="lg" className="gap-2 px-8">
//                   <Play className="h-4 w-4" /> See the Platform
//                 </Button>
//               </a>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="section-padding bg-card border-y">
//         <div className="container-tight">
//           <div className="text-center mb-12">
//             <h2 className="text-2xl sm:text-3xl font-bold mb-3">Why FinSight?</h2>
//             <p className="text-muted-foreground max-w-xl mx-auto">
//               Enterprise-grade cost intelligence designed for modern cloud teams.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((f, i) => (
//               <motion.div
//                 key={f.title}
//                 custom={i}
//                 variants={fadeUp}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 className="card-elevated-lg p-6 group hover:border-primary/20 transition-colors"
//               >
//                 <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                   <f.icon className="h-5 w-5 text-primary-foreground" />
//                 </div>
//                 <h3 className="font-semibold mb-2">{f.title}</h3>
//                 <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="section-padding">
//         <div className="container-tight">
//           <div className="card-elevated-lg gradient-bg p-10 sm:p-14 text-center">
//             <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
//               Start optimizing your cloud costs today
//             </h2>
//             <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
//               Set up in minutes. No permanent AWS credentials required.
//             </p>
//             <Link to="/register">
//               <Button size="lg" variant="secondary" className="gap-2 px-8">
//                 Create Free Account <ArrowRight className="h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>
//     </PublicLayout>
//   );
// }

//------------------------------------------------------------------------------------------

// New Landing page - MOdified by Tanishq Kathar 


// import { useState, useEffect, useRef } from "react";
// import { motion, useScroll, useSpring } from "framer-motion";

// /* ── Icons ──────────────────────────────────────────────────────────────── */
// const Ic = ({ d, size = 20, fill = "none" }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
//     stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
//     <path d={d} />
//   </svg>
// );
// const BarChart3Icon  = () => <Ic d="M3 3v18h18M18 9V3M12 13V3M6 17V3" />;
// const LayersIcon     = () => <Ic d="M2 20h20M2 15h20M2 10h20M2 5h20" />;
// const BrainIcon      = () => <Ic d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.69 3 3 0 0 1-.37-5.23 2.5 2.5 0 0 1 1.37-4.12A2.5 2.5 0 0 1 9.5 2M14.5 2a2.5 2.5 0 0 0-2.5 2.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.69 3 3 0 0 0 .37-5.23 2.5 2.5 0 0 0-1.37-4.12A2.5 2.5 0 0 0 14.5 2" />;
// const ShieldIcon     = () => <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />;
// const ArrowRightIcon = () => <Ic d="M5 12h14M12 5l7 7-7 7" />;
// const PlayIcon       = () => <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
// const SunIcon        = () => <Ic d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5" />;
// const MoonIcon       = () => <Ic d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />;
// const MenuIcon       = () => <Ic d="M3 12h18M3 6h18M3 18h18" />;
// const XIcon          = () => <Ic d="M18 6L6 18M6 6l12 12" />;
// const CheckIcon      = () => <Ic d="M20 6L9 17l-5-5" size={14} />;

// /* ── Grid background ── */
// function GridBackground() {
//   return (
//     <div className="grid-bg" aria-hidden>
//       <div className="grid-mesh" />
//       <div className="grid-glow glow-1" />
//       <div className="grid-glow glow-2" />
//       <div className="grid-glow glow-3" />
//     </div>
//   );
// }

// /* ── 3-D Cube ── */
// function CubeOrb({ size = 80, x = 0, y = 0, delay = 0 }) {
//   return (
//     <motion.div className="cube-orb"
//       style={{ width: size, height: size, left: x, top: y, "--size": `${size}px` }}
//       animate={{ rotateY: [0, 360], rotateX: [0, 12, 0, -12, 0] }}
//       transition={{ duration: 14 + delay, repeat: Infinity, ease: "linear", delay }}>
//       {["front","back","left","right","top","bottom"].map(f => <div key={f} className={`cube-face ${f}`} />)}
//     </motion.div>
//   );
// }

// /* ── Floating chip ── */
// function FloatingCard({ style, children, delay = 0 }) {
//   return (
//     <motion.div className="float-card" style={style}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: [0, -10, 0] }}
//       transition={{ delay, duration: 4, repeat: Infinity, ease: "easeInOut" }}>
//       {children}
//     </motion.div>
//   );
// }

// /* ── Sparkline ── */
// function SparkChart() {
//   const pts = [60, 80, 55, 90, 70, 110, 85, 130, 95, 140, 120, 160];
//   const max = Math.max(...pts), min = Math.min(...pts);
//   const norm = pts.map(p => 88 - ((p - min) / (max - min)) * 70);
//   const path = norm.map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 260} ${y}`).join(" ");
//   const area = `${path} L 260 100 L 0 100 Z`;
//   return (
//     <svg width="100%" height="80" viewBox="0 0 260 100" preserveAspectRatio="none" fill="none">
//       <defs>
//         <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
//           <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
//         </linearGradient>
//       </defs>
//       <motion.path d={area} fill="url(#sg)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} />
//       <motion.path d={path} stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
//         initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 2, ease: "easeInOut" }} />
//     </svg>
//   );
// }

// /* ── Dashboard mock ── */
// function DashboardMock() {
//   const [tick, setTick] = useState(0);
//   useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 2500); return () => clearInterval(t); }, []);
//   const costs   = ["$14,230","$14,887","$13,991","$15,340"];
//   const savings = ["$2,100","$1,840","$2,380","$1,990"];
//   return (
//     <motion.div className="dashboard-mock"
//       initial={{ opacity: 0, y: 48, rotateX: 6 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
//       transition={{ delay: 0.5, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
//       <div className="mock-bar">
//         <span className="dot dr"/><span className="dot dy"/><span className="dot dg"/>
//         <span className="mock-title-txt">FinSight · Dashboard</span>
//         <span className="live-badge"><span className="live-dot"/>LIVE</span>
//       </div>
//       <div className="mock-stats-row">
//         {[
//           { label:"MTD Spend", val:costs[tick%costs.length],   delta:"+3.2%", cls:"up" },
//           { label:"Saved",     val:savings[tick%savings.length],delta:"−12%", cls:"dn" },
//           { label:"Services",  val:"47",                       delta:"Active",cls:"nt" },
//         ].map(s => (
//           <motion.div key={s.label} className="mock-stat" animate={{ scale:[1,1.02,1] }} transition={{ duration:0.35 }}>
//             <span className="ms-label">{s.label}</span>
//             <span className="ms-val">{s.val}</span>
//             <span className={`ms-delta ${s.cls}`}>{s.delta}</span>
//           </motion.div>
//         ))}
//       </div>
//       <div className="mock-chart">
//         <div className="mc-head">
//           <span>Cost Trend — Last 12 Days</span>
//           <span className="mc-tag">ML forecast active</span>
//         </div>
//         <SparkChart />
//       </div>
//       <div className="mock-svcs">
//         {[{n:"EC2",c:"$5,240",p:78},{n:"RDS",c:"$2,190",p:45},{n:"S3",c:"$890",p:22}].map((s,i) => (
//           <div key={s.n} className="svc-row">
//             <span className="svc-n">{s.n}</span>
//             <div className="svc-track">
//               <motion.div className="svc-fill" initial={{ scaleX: 0 }} animate={{ scaleX: s.p / 100 }}
//                 transition={{ delay: 1 + i * 0.15, duration: 0.8, ease: "easeOut" }} />
//             </div>
//             <span className="svc-c">{s.c}</span>
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }

// /* ── Feature card ── */
// const FEATURES = [
//   { Icon: BarChart3Icon, title: "Real-time Monitoring",  desc: "Granular service-level breakdowns with instant cost visibility across all AWS regions." },
//   { Icon: LayersIcon,    title: "Service Breakdown",     desc: "Analyze costs by service, project tags, and custom dimensions to surface savings." },
//   { Icon: BrainIcon,     title: "ML Forecasting",        desc: "Moving averages and linear regression detect anomalies before they escalate." },
//   { Icon: ShieldIcon,    title: "IAM-First Security",    desc: "Connect via IAM roles & STS — zero permanent credentials, least-privilege by design." },
// ];

// function FeatCard({ f, i }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <motion.div className={`feat-card${hov ? " hov" : ""}`}
//       initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16,1,0.3,1] }}
//       onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
//       <div className="feat-icon">
//         <motion.div animate={{ rotateY: hov ? 180 : 0 }} transition={{ duration: 0.5 }}>
//           <f.Icon />
//         </motion.div>
//       </div>
//       <h3 className="feat-title">{f.title}</h3>
//       <p className="feat-desc">{f.desc}</p>
//       <motion.span className="feat-arr" animate={{ x: hov ? 5 : 0 }}><ArrowRightIcon /></motion.span>
//     </motion.div>
//   );
// }

// /* ── Count-up ── */
// function CountUp({ to, suffix = "" }) {
//   const [v, setV] = useState(0);
//   const done = useRef(false);
//   return (
//     <motion.span onViewportEnter={() => {
//       if (done.current) return; done.current = true;
//       let n = 0;
//       const go = () => { n += Math.ceil((to - n) / 10); setV(n); if (n < to) requestAnimationFrame(go); else setV(to); };
//       go();
//     }}>{v.toLocaleString()}{suffix}</motion.span>
//   );
// }

// /* ── PAGE ── */
// export default function FinSightLanding() {
//   const [dark, setDark] = useState(true);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { scrollYProgress } = useScroll();
//   const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

//   return (
//     <div className={dark ? "app dark" : "app light"}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }

//         .dark {
//           --bg:       #070d1a;
//           --bg2:      #0c1426;
//           --surface:  #0f1b2d;
//           --surface2: #162032;
//           --border:   rgba(255,255,255,.07);
//           --border-hi:rgba(59,130,246,.28);
//           --text:     #f0f6ff;
//           --text2:    #8fa8c8;
//           --text3:    #526480;
//           --accent:   #3b82f6;
//           --accent2:  #6366f1;
//           --green:    #34d399;
//           --red:      #f87171;
//           --shadow:   rgba(0,0,0,.6);
//           --shadow-sm:rgba(0,0,0,.28);
//           --card-bg:  rgba(15,27,45,.85);
//           --nav-bg:   rgba(7,13,26,.85);
//           --mesh-c:   rgba(59,130,246,.05);
//         }
//         .light {
//           --bg:       #f6f8fc;
//           --bg2:      #eef2f8;
//           --surface:  #ffffff;
//           --surface2: #f6f8fc;
//           --border:   rgba(0,0,0,.07);
//           --border-hi:rgba(59,130,246,.3);
//           --text:     #0d1626;
//           --text2:    #4a5f7a;
//           --text3:    #8fa0b8;
//           --accent:   #2563eb;
//           --accent2:  #4f46e5;
//           --green:    #059669;
//           --red:      #dc2626;
//           --shadow:   rgba(0,0,0,.10);
//           --shadow-sm:rgba(0,0,0,.05);
//           --card-bg:  rgba(255,255,255,.92);
//           --nav-bg:   rgba(246,248,252,.88);
//           --mesh-c:   rgba(37,99,235,.045);
//         }

//         .app {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//           background: var(--bg); color: var(--text);
//           min-height: 100vh; overflow-x: hidden;
//           transition: background .28s, color .28s;
//           -webkit-font-smoothing: antialiased;
//         }

//         /* Progress */
//         .prog { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 200;
//           background: linear-gradient(90deg, var(--accent), var(--accent2)); transform-origin: 0 0; }

//         /* ── NAV ── */
//         .nav {
//   position: fixed; 
//   top: 0; 
//   left: 0; 
//   right: 0; 
//   z-index: 100; 
//   height: 64px;
//   display: flex; 
//   align-items: center; 
//   justify-content: center; /* Changed to center the inner container */
//   background: var(--nav-bg); 
//   backdrop-filter: blur(20px) saturate(180%);
//   border-bottom: 1px solid var(--border);
//   transition: background .28s, border-color .28s;
// }


// .nav-content {
//   width: 100%;
//   max-width: 1140px; /* Matches your .hero-inner max-width */
//   padding: 0 40px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }
//         .nav-logo { font-size: 1.18rem; font-weight: 800; letter-spacing: -.025em;
//           background: linear-gradient(135deg, var(--accent), var(--accent2));
//           -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
//         .nav-links { display: flex; gap: 2px; }
//         .nav-links a { padding: 6px 13px; border-radius: 7px; color: var(--text2);
//           font-size: .875rem; font-weight: 500; text-decoration: none; transition: color .18s, background .18s; }
//         .nav-links a:hover { color: var(--text); background: rgba(59,130,246,.07); }
//         .nav-right { display: flex; align-items: center; gap: 8px; }
//         .icon-btn {
//           width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border);
//           background: var(--surface); display: flex; align-items: center; justify-content: center;
//           color: var(--text2); cursor: pointer; transition: color .18s, border-color .18s, background .18s;
//         }
//         .icon-btn:hover { color: var(--accent); border-color: var(--border-hi); background: var(--surface2); }
//         .nav-cta { padding: 8px 20px; border-radius: 8px; background: var(--accent);
//           border: none; color: #fff; font-family: inherit; font-size: .875rem; font-weight: 600;
//           cursor: pointer; transition: opacity .18s, transform .18s; letter-spacing: -.01em; }
//         .nav-cta:hover { opacity: .87; transform: translateY(-1px); }
//         .menu-btn { display: none; }

//         /* Mobile drawer */
//         .mob-nav { display: none; position: fixed; inset: 0; top: 64px; z-index: 98;
//           background: var(--surface); border-top: 1px solid var(--border);
//           flex-direction: column; padding: 16px 20px; gap: 2px; }
//         .mob-nav.open { display: flex; }
//         .mob-nav a { padding: 12px 14px; border-radius: 8px; color: var(--text);
//           font-size: .95rem; font-weight: 500; text-decoration: none; transition: background .18s; }
//         .mob-nav a:hover { background: var(--bg2); }
//         .mob-divider { height: 1px; background: var(--border); margin: 8px 0; }
//         .mob-cta { padding: 13px; border-radius: 8px; background: var(--accent); border: none;
//           color: #fff; font-family: inherit; font-size: .95rem; font-weight: 600; cursor: pointer; }

//         /* ── GRID BG ── */
//         .grid-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
//         .grid-mesh { position: absolute; inset: -12%;
//           background-image: linear-gradient(var(--mesh-c) 1px, transparent 1px), linear-gradient(90deg, var(--mesh-c) 1px, transparent 1px);
//           background-size: 54px 54px;
//           transform: perspective(900px) rotateX(18deg);
//           animation: gridMove 28s linear infinite; }
//         @keyframes gridMove { to { background-position: 0 54px; } }
//         .grid-glow { position: absolute; border-radius: 50%; filter: blur(110px); animation: glowAnim 9s ease-in-out infinite alternate; }
//         .glow-1 { width: 600px; height: 600px; left: -120px; top: -80px; background: rgba(59,130,246,.12); }
//         .glow-2 { width: 500px; height: 500px; right: -60px; top: 32%; background: rgba(99,102,241,.10); animation-delay: -4s; }
//         .glow-3 { width: 380px; height: 380px; left: 36%; bottom: -60px; background: rgba(56,189,248,.08); animation-delay: -2s; }
//         @keyframes glowAnim { to { transform: scale(1.2) translate(8px,-16px); } }

//         /* ── CUBE ── */
//         .cube-orb { position: absolute; transform-style: preserve-3d; z-index: 0; }
//         .cube-face { position: absolute; width: var(--size); height: var(--size);
//           border: 1px solid rgba(59,130,246,.12); background: rgba(59,130,246,.025); border-radius: 2px; }
//         .cube-face.front  { transform: translateZ(calc(var(--size)/2)); }
//         .cube-face.back   { transform: rotateY(180deg) translateZ(calc(var(--size)/2)); }
//         .cube-face.left   { transform: rotateY(-90deg) translateZ(calc(var(--size)/2)); }
//         .cube-face.right  { transform: rotateY(90deg) translateZ(calc(var(--size)/2)); }
//         .cube-face.top    { transform: rotateX(90deg) translateZ(calc(var(--size)/2)); }
//         .cube-face.bottom { transform: rotateX(-90deg) translateZ(calc(var(--size)/2)); }

//         /* ── HERO ── */
//         .hero { position: relative; min-height: 100vh; display: flex; align-items: center;
//           justify-content: center; padding: 120px 40px 80px; overflow: hidden; }
//         .hero-inner { max-width: 1140px; width: 100%;
//           display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
//         .hero-left { position: relative; z-index: 1; }
//         .hero-right { position: relative; z-index: 1; perspective: 1200px; }

//         .badge { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px;
//           border-radius: 100px; border: 1px solid var(--border-hi); background: rgba(59,130,246,.08);
//           font-size: .75rem; font-weight: 600; color: var(--accent); letter-spacing: .05em;
//           text-transform: uppercase; margin-bottom: 20px; }
//         .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
//           box-shadow: 0 0 6px var(--accent); animation: blink 2s ease-in-out infinite; }
//         @keyframes blink { 0%,100%{opacity:1}50%{opacity:.3} }

//         h1.hero-h { font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 800;
//           line-height: 1.12; letter-spacing: -.03em; margin-bottom: 18px; }
//         .grad { background: linear-gradient(135deg, var(--accent), var(--accent2));
//           -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
//         .hero-sub { color: var(--text2); font-size: 1rem; line-height: 1.78;
//           max-width: 450px; margin-bottom: 30px; font-weight: 400; }

//         .actions { display: flex; gap: 10px; flex-wrap: wrap; }
//         .btn-p { display: inline-flex; align-items: center; gap: 7px;
//           background: var(--accent); color: #fff; padding: 11px 22px; border-radius: 8px; border: none;
//           font-family: inherit; font-size: .875rem; font-weight: 600; cursor: pointer; text-decoration: none;
//           box-shadow: 0 4px 16px rgba(59,130,246,.32); letter-spacing: -.01em;
//           transition: opacity .18s, transform .18s, box-shadow .18s; }
//         .btn-p:hover { opacity: .87; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,.4); }
//         .btn-o { display: inline-flex; align-items: center; gap: 7px;
//           background: transparent; color: var(--text); padding: 11px 22px; border-radius: 8px;
//           border: 1px solid var(--border); font-family: inherit; font-size: .875rem; font-weight: 500;
//           cursor: pointer; text-decoration: none; letter-spacing: -.01em;
//           transition: border-color .18s, background .18s, transform .18s; }
//         .btn-o:hover { border-color: var(--border-hi); background: rgba(59,130,246,.05); transform: translateY(-2px); }

//         .trust { display: flex; align-items: center; gap: 12px; margin-top: 26px; }
//         .avs { display: flex; }
//         .av { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--bg);
//           font-size: .62rem; font-weight: 700; color: #fff;
//           display: flex; align-items: center; justify-content: center; }
//         .trust-txt { color: var(--text3); font-size: .8rem; }
//         .trust-txt strong { color: var(--text2); font-weight: 600; }

//         /* ── FLOAT CARD ── */
//         .float-card { position: absolute; background: var(--card-bg); backdrop-filter: blur(14px);
//           border: 1px solid var(--border-hi); border-radius: 10px; padding: 11px 14px;
//           font-size: .8rem; pointer-events: none; z-index: 2; box-shadow: 0 8px 28px var(--shadow); }
//         .fc-lbl { color: var(--text3); font-size: .68rem; margin-bottom: 3px; font-weight: 500; }
//         .fc-val { font-size: .98rem; font-weight: 700; color: var(--text); margin-bottom: 5px; }
//         .fc-tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px;
//           border-radius: 100px; font-size: .67rem; font-weight: 600; }
//         .fc-tag.g { background: rgba(52,211,153,.1); color: var(--green); }
//         .fc-tag.r { background: rgba(248,113,113,.1); color: var(--red); }

//         /* ── DASH MOCK ── */
//         .dashboard-mock { background: var(--surface); border: 1px solid var(--border);
//           border-radius: 12px; overflow: hidden;
//           box-shadow: 0 28px 64px var(--shadow), 0 0 0 1px var(--border); }
//         .mock-bar { display: flex; align-items: center; gap: 6px; padding: 10px 14px;
//           border-bottom: 1px solid var(--border); background: var(--surface2); }
//         .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
//         .dot.dr{background:#ff5f57}.dot.dy{background:#febc2e}.dot.dg{background:#28c840}
//         .mock-title-txt { flex:1; font-size:.74rem; color:var(--text3); margin-left:6px; font-weight:500; }
//         .live-badge { display:flex; align-items:center; gap:5px; padding:2px 8px; border-radius:100px;
//           font-size:.63rem; font-weight:700; background:rgba(52,211,153,.08); color:var(--green);
//           border:1px solid rgba(52,211,153,.16); }
//         .live-dot { width:5px; height:5px; border-radius:50%; background:var(--green);
//           box-shadow:0 0 5px var(--green); animation:blink 1.4s ease-in-out infinite; }
//         .mock-stats-row { display:grid; grid-template-columns:repeat(3,1fr);
//           gap:1px; background:var(--border); border-bottom:1px solid var(--border); }
//         .mock-stat { background:var(--surface); padding:12px 13px; }
//         .ms-label { display:block; font-size:.63rem; color:var(--text3); text-transform:uppercase;
//           letter-spacing:.07em; margin-bottom:3px; font-weight:600; }
//         .ms-val { display:block; font-size:1.05rem; font-weight:700; color:var(--text); margin-bottom:2px; }
//         .ms-delta { font-size:.67rem; font-weight:600; }
//         .ms-delta.up{color:var(--red)}.ms-delta.dn{color:var(--green)}.ms-delta.nt{color:var(--text3)}
//         .mock-chart { padding:12px 14px; border-bottom:1px solid var(--border); }
//         .mc-head { display:flex; justify-content:space-between; align-items:center;
//           font-size:.69rem; color:var(--text3); margin-bottom:8px; font-weight:500; }
//         .mc-tag { background:rgba(99,102,241,.1); color:var(--accent2);
//           padding:2px 8px; border-radius:100px; font-size:.62rem; font-weight:600; }
//         .mock-svcs { padding:11px 14px; display:flex; flex-direction:column; gap:8px; }
//         .svc-row { display:flex; align-items:center; gap:9px; }
//         .svc-n { width:28px; font-size:.67rem; font-weight:700; color:var(--text3); }
//         .svc-track { flex:1; height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
//         .svc-fill { height:100%; border-radius:2px; transform-origin:left;
//           background:linear-gradient(90deg, var(--accent), var(--accent2)); }
//         .svc-c { width:48px; text-align:right; font-size:.67rem; font-weight:600; color:var(--text2); }

//         /* ── STATS STRIP ── */
//         .stats-strip { display:grid; grid-template-columns:repeat(4,1fr);
//           border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--surface); }
//         .stat-item { padding:44px 24px; text-align:center; border-right:1px solid var(--border); }
//         .stat-item:last-child { border-right:none; }
//         .stat-num { font-size:2.1rem; font-weight:800; letter-spacing:-.03em;
//           background:linear-gradient(135deg,var(--accent),var(--accent2));
//           -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
//         .stat-lbl { color:var(--text3); font-size:.8rem; margin-top:5px; font-weight:500; }

//         /* ── FEATURES ── */
//         .features-sec { padding:96px 40px; }
//         .fi { max-width:1100px; margin:0 auto; }
//         .eyebrow { font-size:.72rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
//           color:var(--accent); margin-bottom:9px; }
//         .sec-h { font-size:clamp(1.55rem,2.6vw,2.3rem); font-weight:800;
//           letter-spacing:-.025em; margin-bottom:12px; line-height:1.22; }
//         .sec-sub { color:var(--text2); max-width:460px; line-height:1.75;
//           font-size:.93rem; margin-bottom:48px; }
//         .feat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
//         .feat-card { background:var(--surface); border:1px solid var(--border); border-radius:11px;
//           padding:26px; cursor:default;
//           transition:border-color .22s,box-shadow .22s,background .22s; position:relative; overflow:hidden; }
//         .feat-card::before { content:''; position:absolute; inset:0; opacity:0;
//           background:radial-gradient(circle at top left, rgba(59,130,246,.055), transparent 65%);
//           transition:opacity .28s; }
//         .feat-card.hov { border-color:var(--border-hi); box-shadow:0 10px 36px var(--shadow-sm); background:var(--surface2); }
//         .feat-card.hov::before { opacity:1; }
//         .feat-icon { width:42px; height:42px; border-radius:9px; margin-bottom:16px;
//           background:rgba(59,130,246,.09); border:1px solid var(--border-hi);
//           display:flex; align-items:center; justify-content:center; color:var(--accent); }
//         .feat-title { font-size:.95rem; font-weight:700; margin-bottom:8px; letter-spacing:-.015em; }
//         .feat-desc { color:var(--text2); font-size:.858rem; line-height:1.72; }
//         .feat-arr { display:block; color:var(--text3); margin-top:16px; }

//         /* ── HOW ── */
//         .how-sec { padding:96px 40px; background:var(--surface);
//           border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
//         .hi { max-width:820px; margin:0 auto; }
//         .steps { display:flex; flex-direction:column; margin-top:48px; position:relative; }
//         .steps::before { content:''; position:absolute; left:22px; top:4px; bottom:4px; width:1px;
//           background:linear-gradient(to bottom, var(--accent), var(--accent2), transparent); }
//         .step { display:flex; gap:22px; padding-bottom:34px; }
//         .step:last-child { padding-bottom:0; }
//         .step-n { width:46px; height:46px; border-radius:50%; flex-shrink:0; z-index:1;
//           background:linear-gradient(135deg,var(--accent),var(--accent2));
//           display:flex; align-items:center; justify-content:center;
//           font-size:.78rem; font-weight:800; color:#fff;
//           box-shadow:0 0 0 4px var(--surface), 0 0 14px rgba(59,130,246,.28); }
//         .step-body { padding-top:9px; }
//         .step-title { font-size:.92rem; font-weight:700; margin-bottom:6px; letter-spacing:-.01em; }
//         .step-desc { color:var(--text2); font-size:.858rem; line-height:1.72; max-width:520px; }

//         /* ── CTA ── */
//         .cta-sec { padding:96px 40px; }
//         .ci { max-width:740px; margin:0 auto; text-align:center; }
//         .cta-card { background:var(--surface); border:1px solid var(--border-hi);
//           border-radius:18px; padding:60px 44px; position:relative; overflow:hidden; }
//         .cta-glow { position:absolute; width:340px; height:340px; border-radius:50%;
//           background:rgba(59,130,246,.07); filter:blur(80px);
//           left:50%; top:50%; transform:translate(-50%,-50%); pointer-events:none; }
//         .cta-h { font-size:clamp(1.55rem,2.8vw,2.3rem); font-weight:800; letter-spacing:-.025em;
//           margin-bottom:13px; position:relative; z-index:1; }
//         .cta-sub { color:var(--text2); line-height:1.75; margin-bottom:30px;
//           font-size:.93rem; position:relative; z-index:1; }
//         .cta-btns { display:flex; gap:10px; justify-content:center; flex-wrap:wrap;
//           position:relative; z-index:1; }
//         .cta-trust { display:flex; gap:18px; justify-content:center; flex-wrap:wrap;
//           margin-top:22px; position:relative; z-index:1; }
//         .ct-item { display:flex; align-items:center; gap:5px; color:var(--text3);
//           font-size:.78rem; font-weight:500; }
//         .ct-item svg { color:var(--green); }

//         /* ── FOOTER ── */
//         .footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap;
//           gap:14px; padding:26px 40px; border-top:1px solid var(--border); }
//         .footer-logo { font-size:.98rem; font-weight:800; letter-spacing:-.02em;
//           background:linear-gradient(135deg,var(--accent),var(--accent2));
//           -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
//         .footer-links { display:flex; gap:18px; flex-wrap:wrap; }
//         .footer-links a { color:var(--text3); font-size:.8rem; text-decoration:none;
//           font-weight:500; transition:color .18s; }
//         .footer-links a:hover { color:var(--text2); }
//         .footer-copy { color:var(--text3); font-size:.76rem; }

//         /* ── RESPONSIVE ── */
//         @media (max-width: 1024px) {
//           .hero { padding: 110px 28px 72px; }
//           .hero-inner { gap: 40px; }
//           .features-sec,.how-sec,.cta-sec { padding-inline: 28px; }
//           .footer,.nav { padding-inline: 28px; }
//         }
//         @media (max-width: 860px) {
//           .hero-inner { grid-template-columns: 1fr; }
//           .hero-right { display: none; }
//           .hero-left { text-align: center; }
//           .badge { margin-inline: auto; display: inline-flex; }
//           .hero-sub { margin-inline: auto; }
//           .actions { justify-content: center; }
//           .trust { justify-content: center; }
//           .stats-strip { grid-template-columns: repeat(2,1fr); }
//           .stat-item:nth-child(2) { border-right: none; }
//           .feat-grid { grid-template-columns: 1fr; }
//           .nav-links { display: none; }
//           .menu-btn { display: flex; }
//         }
//         @media (max-width: 520px) {
//           h1.hero-h { font-size: 1.85rem; }
//           .hero { padding: 100px 18px 64px; }
//           .features-sec,.how-sec,.cta-sec { padding: 72px 18px; }
//           .footer,.nav { padding-inline: 18px; }
//           .stats-strip { grid-template-columns: 1fr 1fr; }
//           .stat-num { font-size: 1.7rem; }
//           .cta-card { padding: 36px 22px; }
//           .actions { flex-direction: column; align-items: stretch; }
//           .actions a { justify-content: center; }
//           .footer { flex-direction: column; align-items: flex-start; gap: 12px; }
//           .step-desc { max-width: 100%; }
//           .cta-btns { flex-direction: column; }
//           .cta-btns a { justify-content: center; }
//         }
//       `}</style>

//       {/* Progress bar */}
//       <motion.div className="prog" style={{ scaleX: bar }} />

//      {/* Nav */}
// <nav className="nav">
//   <div className="nav-content"> {/* Added this wrapper */}
//     <div className="nav-logo">FinSight</div>
//     <div className="nav-links">
//       {["Features","Pricing","Docs","Blog"].map(l => <a key={l} href="#">{l}</a>)}
//     </div>
//     <div className="nav-right">
//       <button className="icon-btn" onClick={() => setDark(p => !p)} title={dark ? "Light mode" : "Dark mode"}>
//         {dark ? <SunIcon /> : <MoonIcon />}
//       </button>
//       <button className="nav-cta">Get Started</button>
//       <button className="icon-btn menu-btn" onClick={() => setMenuOpen(p => !p)}>
//         {menuOpen ? <XIcon /> : <MenuIcon />}
//       </button>
//     </div>
//   </div>
// </nav>

//       {/* Mobile drawer */}
//       <div className={`mob-nav${menuOpen ? " open" : ""}`}>
//         {["Features","Pricing","Docs","Blog"].map(l => (
//           <a key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</a>
//         ))}
//         <div className="mob-divider" />
//         <button className="mob-cta">Get Started Free</button>
//       </div>

//       {/* Hero */}
//       <section className="hero">
//         <GridBackground />
//         <CubeOrb size={60}  x="4%"  y="14%" delay={0} />
//         <CubeOrb size={44}  x="88%" y="21%" delay={2} />
//         <CubeOrb size={76}  x="77%" y="65%" delay={4} />
//         <CubeOrb size={34}  x="2%"  y="72%" delay={1} />

//         <div className="hero-inner">
//           <motion.div className="hero-left"
//             initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}>
//             <div className="badge"><span className="badge-dot"/>AWS Cloud Cost Intelligence</div>
//             <h1 className="hero-h">
//               Intelligent AWS<br />
//               <span className="grad">Cost Monitoring</span>
//             </h1>
//             <p className="hero-sub">
//               Predict. Prevent. Optimize. — Full visibility into your AWS costs with ML-powered forecasting, automated alerts, and actionable insights.
//             </p>
//             <div className="actions">
//               <a href="/register" className="btn-p">Get Started Free <ArrowRightIcon /></a>
//               <a href="https://youtube.com" className="btn-o" target="_blank" rel="noreferrer">
//                 <PlayIcon /> See the Platform
//               </a>
//             </div>
//             <div className="trust">
//               <div className="avs">
//                 {[["A","#2563eb"],["B","#7c3aed"],["C","#0891b2"],["D","#059669"]].map(([l,c],i) => (
//                   <div key={l} className="av" style={{ background:c, marginLeft: i ? -8 : 0 }}>{l}</div>
//                 ))}
//               </div>
//               <p className="trust-txt">Trusted by <strong>2,400+</strong> cloud engineers worldwide</p>
//             </div>
//           </motion.div>

//           <div className="hero-right">
//             <FloatingCard style={{ top: -18, right: 0 }} delay={1.1}>
//               <div className="fc-lbl">Anomaly Detected</div>
//               <div className="fc-val">EC2 spike +34%</div>
//               <span className="fc-tag r">↑ Investigating</span>
//             </FloatingCard>
//             <FloatingCard style={{ bottom: 36, left: -22 }} delay={1.5}>
//               <div className="fc-lbl">Monthly Savings</div>
//               <div className="fc-val">$2,380</div>
//               <span className="fc-tag g">↓ Optimized</span>
//             </FloatingCard>
//             <DashboardMock />
//           </div>
//         </div>
//       </section>

//       {/* Stats strip */}
//       <div className="stats-strip">
//         {[
//           { n:2400, s:"+",  lbl:"Active Users" },
//           { n:98,   s:"%",  lbl:"Uptime SLA" },
//           { n:4,    s:"B+", lbl:"Cost Data Points" },
//           { n:12,   s:"M+", lbl:"Saved Monthly" },
//         ].map((x,i) => (
//           <motion.div key={x.lbl} className="stat-item"
//             initial={{ opacity:0 }} whileInView={{ opacity:1 }}
//             viewport={{ once:true }} transition={{ delay: i*0.09 }}>
//             <div className="stat-num"><CountUp to={x.n} suffix={x.s} /></div>
//             <div className="stat-lbl">{x.lbl}</div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Features */}
//       <section className="features-sec">
//         <div className="fi">
//           <div className="eyebrow">Core Capabilities</div>
//           <h2 className="sec-h">Why engineering teams<br />choose FinSight</h2>
//           <p className="sec-sub">Enterprise-grade cost intelligence built for modern cloud teams who need more than a dashboard.</p>
//           <div className="feat-grid">
//             {FEATURES.map((f,i) => <FeatCard key={f.title} f={f} i={i} />)}
//           </div>
//         </div>
//       </section>

//       {/* How it works */}
//       <section className="how-sec">
//         <div className="hi">
//           <div className="eyebrow">Setup in Minutes</div>
//           <h2 className="sec-h">Zero-friction onboarding</h2>
//           <div className="steps">
//             {[
//               { n:"01", t:"Connect via IAM Role",    d:"Assume a least-privilege IAM role via STS — no permanent credentials, no security compromise." },
//               { n:"02", t:"Auto-discover Services",  d:"FinSight maps every service, tag, and project to a cost dimension automatically." },
//               { n:"03", t:"ML Models Activate",      d:"Moving averages and regression models start learning your spend patterns within 24 hours." },
//               { n:"04", t:"Alerts & Insights Flow",  d:"Receive anomaly alerts, budget warnings, and optimization tips in Slack, email, or webhooks." },
//             ].map((s,i) => (
//               <motion.div key={s.n} className="step"
//                 initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }}
//                 viewport={{ once:true }} transition={{ delay:i*0.11, duration:0.5 }}>
//                 <div className="step-n">{s.n}</div>
//                 <div className="step-body">
//                   <div className="step-title">{s.t}</div>
//                   <p className="step-desc">{s.d}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="cta-sec">
//         <div className="ci">
//           <div className="cta-card">
//             <div className="cta-glow" />
//             <h2 className="cta-h">Start optimizing your<br /><span className="grad">cloud costs today</span></h2>
//             <p className="cta-sub">Set up in minutes. No permanent AWS credentials required.<br />Full feature access — no credit card needed.</p>
//             <div className="cta-btns">
//               <a href="/register" className="btn-p">Create Free Account <ArrowRightIcon /></a>
//               <a href="/demo" className="btn-o">Schedule Demo</a>
//             </div>
//             <div className="cta-trust">
//               {["Free forever plan","SOC 2 Type II","GDPR compliant"].map(t => (
//                 <span key={t} className="ct-item"><CheckIcon />{t}</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-logo">FinSight</div>
//         <div className="footer-links">
//           {["Privacy","Terms","Security","Status"].map(l => <a key={l} href="#">{l}</a>)}
//         </div>
//         <div className="footer-copy">© 2026 FinSight, Inc.</div>
//       </footer>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/* ── Icons ──────────────────────────────────────────────────────────────── */
const Ic = ({ d, size = 20, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const BarChart3Icon  = () => <Ic d="M3 3v18h18M18 9V3M12 13V3M6 17V3" />;
const LayersIcon     = () => <Ic d="M2 20h20M2 15h20M2 10h20M2 5h20" />;
const BrainIcon      = () => <Ic d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.69 3 3 0 0 1-.37-5.23 2.5 2.5 0 0 1 1.37-4.12A2.5 2.5 0 0 1 9.5 2M14.5 2a2.5 2.5 0 0 0-2.5 2.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.69 3 3 0 0 0 .37-5.23 2.5 2.5 0 0 0-1.37-4.12A2.5 2.5 0 0 0 14.5 2" />;
const ShieldIcon     = () => <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />;
const ArrowRightIcon = () => <Ic d="M5 12h14M12 5l7 7-7 7" />;
const PlayIcon       = () => <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const SunIcon        = () => <Ic d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5" />;
const MoonIcon       = () => <Ic d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />;
const MenuIcon       = () => <Ic d="M3 12h18M3 6h18M3 18h18" />;
const XIcon          = () => <Ic d="M18 6L6 18M6 6l12 12" />;
const CheckIcon      = () => <Ic d="M20 6L9 17l-5-5" size={14} />;

/* ── UI Components (Grid, Cube, etc.) ────────────────────────────────────── */
function GridBackground() {
  return (
    <div className="grid-bg" aria-hidden>
      <div className="grid-mesh" />
      <div className="grid-glow glow-1" />
      <div className="grid-glow glow-2" />
      <div className="grid-glow glow-3" />
    </div>
  );
}

function CubeOrb({ size = 80, x = 0, y = 0, delay = 0 }) {
  return (
    <motion.div className="cube-orb"
      style={{ width: size, height: size, left: x, top: y, "--size": `${size}px` }}
      animate={{ rotateY: [0, 360], rotateX: [0, 12, 0, -12, 0] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: "linear", delay }}>
      {["front","back","left","right","top","bottom"].map(f => <div key={f} className={`cube-face ${f}`} />)}
    </motion.div>
  );
}

function FloatingCard({ style, children, delay = 0 }) {
  return (
    <motion.div className="float-card" style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ delay, duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      {children}
    </motion.div>
  );
}

function SparkChart() {
  const pts = [60, 80, 55, 90, 70, 110, 85, 130, 95, 140, 120, 160];
  const max = Math.max(...pts), min = Math.min(...pts);
  const norm = pts.map(p => 88 - ((p - min) / (max - min)) * 70);
  const path = norm.map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 260} ${y}`).join(" ");
  const area = `${path} L 260 100 L 0 100 Z`;
  return (
    <svg width="100%" height="80" viewBox="0 0 260 100" preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#sg)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} />
      <motion.path d={path} stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 2, ease: "easeInOut" }} />
    </svg>
  );
}

function DashboardMock() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 2500); return () => clearInterval(t); }, []);
  const costs   = ["$14,230","$14,887","$13,991","$15,340"];
  const savings = ["$2,100","$1,840","$2,380","$1,990"];
  return (
    <motion.div className="dashboard-mock"
      initial={{ opacity: 0, y: 48, rotateX: 6 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.5, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
      <div className="mock-bar">
        <span className="dot dr"/><span className="dot dy"/><span className="dot dg"/>
        <span className="mock-title-txt">FinSight · Dashboard</span>
        <span className="live-badge"><span className="live-dot"/>LIVE</span>
      </div>
      <div className="mock-stats-row">
        {[
          { label:"MTD Spend", val:costs[tick%costs.length],   delta:"+3.2%", cls:"up" },
          { label:"Saved",     val:savings[tick%savings.length],delta:"−12%", cls:"dn" },
          { label:"Services",  val:"47",                       delta:"Active",cls:"nt" },
        ].map(s => (
          <motion.div key={s.label} className="mock-stat" animate={{ scale:[1,1.02,1] }} transition={{ duration:0.35 }}>
            <span className="ms-label">{s.label}</span>
            <span className="ms-val">{s.val}</span>
            <span className={`ms-delta ${s.cls}`}>{s.delta}</span>
          </motion.div>
        ))}
      </div>
      <div className="mock-chart">
        <div className="mc-head">
          <span>Cost Trend — Last 12 Days</span>
          <span className="mc-tag">ML forecast active</span>
        </div>
        <SparkChart />
      </div>
      <div className="mock-svcs">
        {[{n:"EC2",c:"$5,240",p:78},{n:"RDS",c:"$2,190",p:45},{n:"S3",c:"$890",p:22}].map((s,i) => (
          <div key={s.n} className="svc-row">
            <span className="svc-n">{s.n}</span>
            <div className="svc-track">
              <motion.div className="svc-fill" initial={{ scaleX: 0 }} animate={{ scaleX: s.p / 100 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.8, ease: "easeOut" }} />
            </div>
            <span className="svc-c">{s.c}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const FEATURES = [
  { Icon: BarChart3Icon, title: "Real-time Monitoring",  desc: "Granular service-level breakdowns with instant cost visibility across all AWS regions." },
  { Icon: LayersIcon,    title: "Service Breakdown",     desc: "Analyze costs by service, project tags, and custom dimensions to surface savings." },
  { Icon: BrainIcon,     title: "ML Forecasting",        desc: "Moving averages and linear regression detect anomalies before they escalate." },
  { Icon: ShieldIcon,    title: "IAM-First Security",    desc: "Connect via IAM roles & STS — zero permanent credentials, least-privilege by design." },
];

function FeatCard({ f, i }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div className={`feat-card${hov ? " hov" : ""}`}
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16,1,0.3,1] }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="feat-icon">
        <motion.div animate={{ rotateY: hov ? 180 : 0 }} transition={{ duration: 0.5 }}>
          <f.Icon />
        </motion.div>
      </div>
      <h3 className="feat-title">{f.title}</h3>
      <p className="feat-desc">{f.desc}</p>
      <motion.span className="feat-arr" animate={{ x: hov ? 5 : 0 }}><ArrowRightIcon /></motion.span>
    </motion.div>
  );
}

function CountUp({ to, suffix = "" }) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  return (
    <motion.span onViewportEnter={() => {
      if (done.current) return; done.current = true;
      let n = 0;
      const go = () => { n += Math.ceil((to - n) / 10); setV(n); if (n < to) requestAnimationFrame(go); else setV(to); };
      go();
    }}>{v.toLocaleString()}{suffix}</motion.span>
  );
}

/* ── MAIN LANDING PAGE ──────────────────────────────────────────────────── */
export default function FinSightLanding() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/feedback", label: "Feedback" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={dark ? "app dark" : "app light"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .dark {
          --bg:       #070d1a;
          --bg2:      #0c1426;
          --surface:  #0f1b2d;
          --surface2: #162032;
          --border:   rgba(255,255,255,.07);
          --border-hi:rgba(59,130,246,.28);
          --text:     #f0f6ff;
          --text2:    #8fa8c8;
          --text3:    #526480;
          --accent:   #3b82f6;
          --accent2:  #6366f1;
          --green:    #34d399;
          --red:      #f87171;
          --shadow:   rgba(0,0,0,.6);
          --shadow-sm:rgba(0,0,0,.28);
          --card-bg:  rgba(15,27,45,.85);
          --nav-bg:   rgba(7,13,26,.85);
          --mesh-c:   rgba(59,130,246,.05);
        }
        .light {
          --bg:       #f6f8fc;
          --bg2:      #eef2f8;
          --surface:  #ffffff;
          --surface2: #f6f8fc;
          --border:   rgba(0,0,0,.07);
          --border-hi:rgba(59,130,246,.3);
          --text:     #0d1626;
          --text2:    #4a5f7a;
          --text3:    #8fa0b8;
          --accent:   #2563eb;
          --accent2:  #4f46e5;
          --green:    #059669;
          --red:      #dc2626;
          --shadow:   rgba(0,0,0,.10);
          --shadow-sm:rgba(0,0,0,.05);
          --card-bg:  rgba(255,255,255,.92);
          --nav-bg:   rgba(246,248,252,.88);
          --mesh-c:   rgba(37,99,235,.045);
        }

        .app {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--bg); color: var(--text);
          min-height: 100vh; overflow-x: hidden;
          transition: background .28s, color .28s;
          -webkit-font-smoothing: antialiased;
        }

        .prog { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 200;
          background: linear-gradient(90deg, var(--accent), var(--accent2)); transform-origin: 0 0; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 64px;
          display: flex; align-items: center; justify-content: center;
          background: var(--nav-bg); backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid var(--border);
          transition: background .28s, border-color .28s;
        }
        .nav-content {
          width: 100%; max-width: 1140px; padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { font-size: 1.18rem; font-weight: 800; letter-spacing: -.025em; text-decoration: none;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-links { display: flex; gap: 2px; }
        .nav-links a { padding: 6px 13px; border-radius: 7px; color: var(--text2);
          font-size: .875rem; font-weight: 500; text-decoration: none; transition: color .18s, background .18s; }
        .nav-links a:hover { color: var(--text); background: rgba(59,130,246,.07); }
        .nav-right { display: flex; align-items: center; gap: 8px; }
        .icon-btn {
          width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border);
          background: var(--surface); display: flex; align-items: center; justify-content: center;
          color: var(--text2); cursor: pointer; transition: color .18s, border-color .18s, background .18s;
        }
        .icon-btn:hover { color: var(--accent); border-color: var(--border-hi); background: var(--surface2); }
        .nav-cta { padding: 8px 20px; border-radius: 8px; background: var(--accent);
          border: none; color: #fff; font-family: inherit; font-size: .875rem; font-weight: 600;
          cursor: pointer; transition: opacity .18s, transform .18s; letter-spacing: -.01em; }
        .nav-cta:hover { opacity: .87; transform: translateY(-1px); }
        .menu-btn { display: none; }

        .mob-nav { display: none; position: fixed; inset: 0; top: 64px; z-index: 98;
          background: var(--surface); border-top: 1px solid var(--border);
          flex-direction: column; padding: 16px 20px; gap: 2px; }
        .mob-nav.open { display: flex; }
        .mob-nav a { padding: 12px 14px; border-radius: 8px; color: var(--text);
          font-size: .95rem; font-weight: 500; text-decoration: none; transition: background .18s; }
        .mob-nav a:hover { background: var(--bg2); }
        .mob-divider { height: 1px; background: var(--border); margin: 8px 0; }
        .mob-cta { padding: 13px; border-radius: 8px; background: var(--accent); border: none;
          color: #fff; font-family: inherit; font-size: .95rem; font-weight: 600; cursor: pointer; }

        .grid-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .grid-mesh { position: absolute; inset: -12%;
          background-image: linear-gradient(var(--mesh-c) 1px, transparent 1px), linear-gradient(90deg, var(--mesh-c) 1px, transparent 1px);
          background-size: 54px 54px;
          transform: perspective(900px) rotateX(18deg);
          animation: gridMove 28s linear infinite; }
        @keyframes gridMove { to { background-position: 0 54px; } }
        .grid-glow { position: absolute; border-radius: 50%; filter: blur(110px); animation: glowAnim 9s ease-in-out infinite alternate; }
        .glow-1 { width: 600px; height: 600px; left: -120px; top: -80px; background: rgba(59,130,246,.12); }
        .glow-2 { width: 500px; height: 500px; right: -60px; top: 32%; background: rgba(99,102,241,.10); animation-delay: -4s; }
        .glow-3 { width: 380px; height: 380px; left: 36%; bottom: -60px; background: rgba(56,189,248,.08); animation-delay: -2s; }
        @keyframes glowAnim { to { transform: scale(1.2) translate(8px,-16px); } }

        .cube-orb { position: absolute; transform-style: preserve-3d; z-index: 0; }
        .cube-face { position: absolute; width: var(--size); height: var(--size);
          border: 1px solid rgba(59,130,246,.12); background: rgba(59,130,246,.025); border-radius: 2px; }
        .cube-face.front  { transform: translateZ(calc(var(--size)/2)); }
        .cube-face.back   { transform: rotateY(180deg) translateZ(calc(var(--size)/2)); }
        .cube-face.left   { transform: rotateY(-90deg) translateZ(calc(var(--size)/2)); }
        .cube-face.right  { transform: rotateY(90deg) translateZ(calc(var(--size)/2)); }
        .cube-face.top    { transform: rotateX(90deg) translateZ(calc(var(--size)/2)); }
        .cube-face.bottom { transform: rotateX(-90deg) translateZ(calc(var(--size)/2)); }

        .hero { position: relative; min-height: 100vh; display: flex; align-items: center;
          justify-content: center; padding: 120px 40px 80px; overflow: hidden; }
        .hero-inner { max-width: 1140px; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .hero-left { position: relative; z-index: 1; }
        .hero-right { position: relative; z-index: 1; perspective: 1200px; }

        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px;
          border-radius: 100px; border: 1px solid var(--border-hi); background: rgba(59,130,246,.08);
          font-size: .75rem; font-weight: 600; color: var(--accent); letter-spacing: .05em;
          text-transform: uppercase; margin-bottom: 20px; }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          box-shadow: 0 0 6px var(--accent); animation: blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:.3} }

        h1.hero-h { font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 800;
          line-height: 1.12; letter-spacing: -.03em; margin-bottom: 18px; }
        .grad { background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-sub { color: var(--text2); font-size: 1rem; line-height: 1.78;
          max-width: 450px; margin-bottom: 30px; font-weight: 400; }

        .actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-p { display: inline-flex; align-items: center; gap: 7px;
          background: var(--accent); color: #fff; padding: 11px 22px; border-radius: 8px; border: none;
          font-family: inherit; font-size: .875rem; font-weight: 600; cursor: pointer; text-decoration: none;
          box-shadow: 0 4px 16px rgba(59,130,246,.32); letter-spacing: -.01em;
          transition: opacity .18s, transform .18s, box-shadow .18s; }
        .btn-p:hover { opacity: .87; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,.4); }
        .btn-o { display: inline-flex; align-items: center; gap: 7px;
          background: transparent; color: var(--text); padding: 11px 22px; border-radius: 8px;
          border: 1px solid var(--border); font-family: inherit; font-size: .875rem; font-weight: 500;
          cursor: pointer; text-decoration: none; letter-spacing: -.01em;
          transition: border-color .18s, background .18s, transform .18s; }
        .btn-o:hover { border-color: var(--border-hi); background: rgba(59,130,246,.05); transform: translateY(-2px); }

        .trust { display: flex; align-items: center; gap: 12px; margin-top: 26px; }
        .avs { display: flex; }
        .av { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--bg);
          font-size: .62rem; font-weight: 700; color: #fff;
          display: flex; align-items: center; justify-content: center; }
        .trust-txt { color: var(--text3); font-size: .8rem; }
        .trust-txt strong { color: var(--text2); font-weight: 600; }

        .float-card { position: absolute; background: var(--card-bg); backdrop-filter: blur(14px);
          border: 1px solid var(--border-hi); border-radius: 10px; padding: 11px 14px;
          font-size: .8rem; pointer-events: none; z-index: 2; box-shadow: 0 8px 28px var(--shadow); }
        .fc-lbl { color: var(--text3); font-size: .68rem; margin-bottom: 3px; font-weight: 500; }
        .fc-val { font-size: .98rem; font-weight: 700; color: var(--text); margin-bottom: 5px; }
        .fc-tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px;
          border-radius: 100px; font-size: .67rem; font-weight: 600; }
        .fc-tag.g { background: rgba(52,211,153,.1); color: var(--green); }
        .fc-tag.r { background: rgba(248,113,113,.1); color: var(--red); }

        .dashboard-mock { background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden;
          box-shadow: 0 28px 64px var(--shadow), 0 0 0 1px var(--border); }
        .mock-bar { display: flex; align-items: center; gap: 6px; padding: 10px 14px;
          border-bottom: 1px solid var(--border); background: var(--surface2); }
        .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .dot.dr{background:#ff5f57}.dot.dy{background:#febc2e}.dot.dg{background:#28c840}
        .mock-title-txt { flex:1; font-size:.74rem; color:var(--text3); margin-left:6px; font-weight:500; }
        .live-badge { display:flex; align-items:center; gap:5px; padding:2px 8px; border-radius:100px;
          font-size:.63rem; font-weight:700; background:rgba(52,211,153,.08); color:var(--green);
          border:1px solid rgba(52,211,153,.16); }
        .live-dot { width:5px; height:5px; border-radius:50%; background:var(--green);
          box-shadow:0 0 5px var(--green); animation:blink 1.4s ease-in-out infinite; }
        .mock-stats-row { display:grid; grid-template-columns:repeat(3,1fr);
          gap:1px; background:var(--border); border-bottom:1px solid var(--border); }
        .mock-stat { background:var(--surface); padding:12px 13px; }
        .ms-label { display:block; font-size:.63rem; color:var(--text3); text-transform:uppercase;
          letter-spacing:.07em; margin-bottom:3px; font-weight:600; }
        .ms-val { display:block; font-size:1.05rem; font-weight:700; color:var(--text); margin-bottom:2px; }
        .ms-delta { font-size:.67rem; font-weight:600; }
        .ms-delta.up{color:var(--red)}.ms-delta.dn{color:var(--green)}.ms-delta.nt{color:var(--text3)}
        .mock-chart { padding:12px 14px; border-bottom:1px solid var(--border); }
        .mc-head { display:flex; justify-content:space-between; align-items:center;
          font-size:.69rem; color:var(--text3); margin-bottom:8px; font-weight:500; }
        .mc-tag { background:rgba(99,102,241,.1); color:var(--accent2);
          padding:2px 8px; border-radius:100px; font-size:.62rem; font-weight:600; }
        .mock-svcs { padding:11px 14px; display:flex; flex-direction:column; gap:8px; }
        .svc-row { display:flex; align-items:center; gap:9px; }
        .svc-n { width:28px; font-size:.67rem; font-weight:700; color:var(--text3); }
        .svc-track { flex:1; height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
        .svc-fill { height:100%; border-radius:2px; transform-origin:left;
          background:linear-gradient(90deg, var(--accent), var(--accent2)); }
        .svc-c { width:48px; text-align:right; font-size:.67rem; font-weight:600; color:var(--text2); }

        .stats-strip { display:grid; grid-template-columns:repeat(4,1fr);
          border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--surface); }
        .stat-item { padding:44px 24px; text-align:center; border-right:1px solid var(--border); }
        .stat-item:last-child { border-right:none; }
        .stat-num { font-size:2.1rem; font-weight:800; letter-spacing:-.03em;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .stat-lbl { color:var(--text3); font-size:.8rem; margin-top:5px; font-weight:500; }

        .features-sec { padding:96px 40px; }
        .fi { max-width:1100px; margin:0 auto; }
        .eyebrow { font-size:.72rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          color:var(--accent); margin-bottom:9px; }
        .sec-h { font-size:clamp(1.55rem,2.6vw,2.3rem); font-weight:800;
          letter-spacing:-.025em; margin-bottom:12px; line-height:1.22; }
        .sec-sub { color:var(--text2); max-width:460px; line-height:1.75;
          font-size:.93rem; margin-bottom:48px; }
        .feat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .feat-card { background:var(--surface); border:1px solid var(--border); border-radius:11px;
          padding:26px; cursor:default;
          transition:border-color .22s,box-shadow .22s,background .22s; position:relative; overflow:hidden; }
        .feat-card::before { content:''; position:absolute; inset:0; opacity:0;
          background:radial-gradient(circle at top left, rgba(59,130,246,.055), transparent 65%);
          transition:opacity .28s; }
        .feat-card.hov { border-color:var(--border-hi); box-shadow:0 10px 36px var(--shadow-sm); background:var(--surface2); }
        .feat-card.hov::before { opacity:1; }
        .feat-icon { width:42px; height:42px; border-radius:9px; margin-bottom:16px;
          background:rgba(59,130,246,.09); border:1px solid var(--border-hi);
          display:flex; align-items:center; justify-content:center; color:var(--accent); }
        .feat-title { font-size:.95rem; font-weight:700; margin-bottom:8px; letter-spacing:-.015em; }
        .feat-desc { color:var(--text2); font-size:.858rem; line-height:1.72; }
        .feat-arr { display:block; color:var(--text3); margin-top:16px; }

        .how-sec { padding:96px 40px; background:var(--surface);
          border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
        .hi { max-width:820px; margin:0 auto; }
        .steps { display:flex; flex-direction:column; margin-top:48px; position:relative; }
        .steps::before { content:''; position:absolute; left:22px; top:4px; bottom:4px; width:1px;
          background:linear-gradient(to bottom, var(--accent), var(--accent2), transparent); }
        .step { display:flex; gap:22px; padding-bottom:34px; }
        .step:last-child { padding-bottom:0; }
        .step-n { width:46px; height:46px; border-radius:50%; flex-shrink:0; z-index:1;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          display:flex; align-items:center; justify-content:center;
          font-size:.78rem; font-weight:800; color:#fff;
          box-shadow:0 0 0 4px var(--surface), 0 0 14px rgba(59,130,246,.28); }
        .step-body { padding-top:9px; }
        .step-title { font-size:.92rem; font-weight:700; margin-bottom:6px; letter-spacing:-.01em; }
        .step-desc { color:var(--text2); font-size:.858rem; line-height:1.72; max-width:520px; }

        .cta-sec { padding:96px 40px; }
        .ci { max-width:740px; margin:0 auto; text-align:center; }
        .cta-card { background:var(--surface); border:1px solid var(--border-hi);
          border-radius:18px; padding:60px 44px; position:relative; overflow:hidden; }
        .cta-glow { position:absolute; width:340px; height:340px; border-radius:50%;
          background:rgba(59,130,246,.07); filter:blur(80px);
          left:50%; top:50%; transform:translate(-50%,-50%); pointer-events:none; }
        .cta-h { font-size:clamp(1.55rem,2.8vw,2.3rem); font-weight:800; letter-spacing:-.025em;
          margin-bottom:13px; position:relative; z-index:1; }
        .cta-sub { color:var(--text2); line-height:1.75; margin-bottom:30px;
          font-size:.93rem; position:relative; z-index:1; }
        .cta-btns { display:flex; gap:10px; justify-content:center; flex-wrap:wrap;
          position:relative; z-index:1; }
        .cta-trust { display:flex; gap:18px; justify-content:center; flex-wrap:wrap;
          margin-top:22px; position:relative; z-index:1; }
        .ct-item { display:flex; align-items:center; gap:5px; color:var(--text3);
          font-size:.78rem; font-weight:500; }
        .ct-item svg { color:var(--green); }

        .footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap;
          gap:14px; padding:26px 40px; border-top:1px solid var(--border); }
        .footer-logo { font-size:.98rem; font-weight:800; letter-spacing:-.02em; text-decoration: none;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .footer-links { display:flex; gap:18px; flex-wrap:wrap; }
        .footer-links a { color:var(--text3); font-size:.8rem; text-decoration:none;
          font-weight:500; transition:color .18s; }
        .footer-links a:hover { color:var(--text2); }
        .footer-copy { color:var(--text3); font-size:.76rem; }

        @media (max-width: 1024px) {
          .hero { padding: 110px 28px 72px; }
          .hero-inner { gap: 40px; }
          .features-sec,.how-sec,.cta-sec { padding-inline: 28px; }
          .footer,.nav { padding-inline: 28px; }
        }
        @media (max-width: 860px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .hero-left { text-align: center; }
          .badge { margin-inline: auto; display: inline-flex; }
          .hero-sub { margin-inline: auto; }
          .actions { justify-content: center; }
          .trust { justify-content: center; }
          .stats-strip { grid-template-columns: repeat(2,1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .feat-grid { grid-template-columns: 1fr; }
          .nav-links { display: none; }
          .menu-btn { display: flex; }
        }
        @media (max-width: 520px) {
          h1.hero-h { font-size: 1.85rem; }
          .hero { padding: 100px 18px 64px; }
          .features-sec,.how-sec,.cta-sec { padding: 72px 18px; }
          .footer,.nav { padding-inline: 18px; }
          .stats-strip { grid-template-columns: 1fr 1fr; }
          .stat-num { font-size: 1.7rem; }
          .cta-card { padding: 36px 22px; }
          .actions { flex-direction: column; align-items: stretch; }
          .actions a { justify-content: center; }
          .footer { flex-direction: column; align-items: flex-start; gap: 12px; }
          .step-desc { max-width: 100%; }
          .cta-btns { flex-direction: column; }
          .cta-btns a { justify-content: center; }
        }
      `}</style>

      {/* Progress bar */}
      <motion.div className="prog" style={{ scaleX: bar }} />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-content">
          <Link to="/" className="nav-logo">FinSight</Link>
          
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to}
                style={{ 
                  color: isActive(link.to) ? 'var(--accent)' : 'var(--text2)',
                  fontWeight: isActive(link.to) ? '700' : '500'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-right">
            <button className="icon-btn" onClick={() => setDark(p => !p)} title={dark ? "Light mode" : "Dark mode"}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <button className="nav-cta">Dashboard</button>
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <span style={{ color: 'var(--text2)', cursor: 'pointer', fontSize: '.875rem', marginRight: '10px', fontWeight: '500' }}>Login</span>
                </Link>
                <Link to="/register">
                  <button className="nav-cta">Get Started</button>
                </Link>
              </>
            )}

            <button className="icon-btn menu-btn" onClick={() => setMenuOpen(p => !p)}>
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mob-nav${menuOpen ? " open" : ""}`}>
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
        <div className="mob-divider" />
        
        {isAuthenticated ? (
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            <button className="mob-cta" style={{ width: '100%' }}>Go to Dashboard</button>
          </Link>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="btn-o" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <button className="mob-cta" style={{ width: '100%' }}>Register Free</button>
            </Link>
          </div>
        )}
      </div>

      {/* Hero */}
      <section className="hero">
        <GridBackground />
        <CubeOrb size={60}  x="4%"  y="14%" delay={0} />
        <CubeOrb size={44}  x="88%" y="21%" delay={2} />
        <CubeOrb size={76}  x="77%" y="65%" delay={4} />
        <CubeOrb size={34}  x="2%"  y="72%" delay={1} />

        <div className="hero-inner">
          <motion.div className="hero-left"
            initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}>
            <div className="badge"><span className="badge-dot"/>AWS Cloud Cost Intelligence</div>
            <h1 className="hero-h">
              Intelligent AWS<br />
              <span className="grad">Cost Monitoring</span>
            </h1>
            <p className="hero-sub">
              Predict. Prevent. Optimize. — Full visibility into your AWS costs with ML-powered forecasting, automated alerts, and actionable insights.
            </p>
            <div className="actions">
              <Link to="/register" className="btn-p">Get Started Free <ArrowRightIcon /></Link>
              <a href="https://youtube.com" className="btn-o" target="_blank" rel="noreferrer">
                <PlayIcon /> See the Platform
              </a>
            </div>
            <div className="trust">
              <div className="avs">
                {[["A","#2563eb"],["B","#7c3aed"],["C","#0891b2"],["D","#059669"]].map(([l,c],i) => (
                  <div key={l} className="av" style={{ background:c, marginLeft: i ? -8 : 0 }}>{l}</div>
                ))}
              </div>
              <p className="trust-txt">Trusted by <strong>2,400+</strong> cloud engineers worldwide</p>
            </div>
          </motion.div>

          <div className="hero-right">
            <FloatingCard style={{ top: -18, right: 0 }} delay={1.1}>
              <div className="fc-lbl">Anomaly Detected</div>
              <div className="fc-val">EC2 spike +34%</div>
              <span className="fc-tag r">↑ Investigating</span>
            </FloatingCard>
            <FloatingCard style={{ bottom: 36, left: -22 }} delay={1.5}>
              <div className="fc-lbl">Monthly Savings</div>
              <div className="fc-val">$2,380</div>
              <span className="fc-tag g">↓ Optimized</span>
            </FloatingCard>
            <DashboardMock />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="stats-strip">
        {[
          { n:2400, s:"+",  lbl:"Active Users" },
          { n:98,   s:"%",  lbl:"Uptime SLA" },
          { n:4,    s:"B+", lbl:"Cost Data Points" },
          { n:12,   s:"M+", lbl:"Saved Monthly" },
        ].map((x,i) => (
          <motion.div key={x.lbl} className="stat-item"
            initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true }} transition={{ delay: i*0.09 }}>
            <div className="stat-num"><CountUp to={x.n} suffix={x.s} /></div>
            <div className="stat-lbl">{x.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* Features */}
      <section className="features-sec">
        <div className="fi">
          <div className="eyebrow">Core Capabilities</div>
          <h2 className="sec-h">Why engineering teams<br />choose FinSight</h2>
          <p className="sec-sub">Enterprise-grade cost intelligence built for modern cloud teams who need more than a dashboard.</p>
          <div className="feat-grid">
            {FEATURES.map((f,i) => <FeatCard key={f.title} f={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-sec">
        <div className="hi">
          <div className="eyebrow">Setup in Minutes</div>
          <h2 className="sec-h">Zero-friction onboarding</h2>
          <div className="steps">
            {[
              { n:"01", t:"Connect via IAM Role",    d:"Assume a least-privilege IAM role via STS — no permanent credentials, no security compromise." },
              { n:"02", t:"Auto-discover Services",  d:"FinSight maps every service, tag, and project to a cost dimension automatically." },
              { n:"03", t:"ML Models Activate",      d:"Moving averages and regression models start learning your spend patterns within 24 hours." },
              { n:"04", t:"Alerts & Insights Flow",  d:"Receive anomaly alerts, budget warnings, and optimization tips in Slack, email, or webhooks." },
            ].map((s,i) => (
              <motion.div key={s.n} className="step"
                initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.11, duration:0.5 }}>
                <div className="step-n">{s.n}</div>
                <div className="step-body">
                  <div className="step-title">{s.t}</div>
                  <p className="step-desc">{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="ci">
          <div className="cta-card">
            <div className="cta-glow" />
            <h2 className="cta-h">Start optimizing your<br /><span className="grad">cloud costs today</span></h2>
            <p className="cta-sub">Set up in minutes. No permanent AWS credentials required.<br />Full feature access — no credit card needed.</p>
            <div className="cta-btns">
              <Link to="/register" className="btn-p">Create Free Account <ArrowRightIcon /></Link>
              <Link to="/demo" className="btn-o">Schedule Demo</Link>
            </div>
            <div className="cta-trust">
              {["Free forever plan","SOC 2 Type II","GDPR compliant"].map(t => (
                <span key={t} className="ct-item"><CheckIcon />{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Link to="/" className="footer-logo">FinSight</Link>
        <div className="footer-links">
          {navLinks.map(link => (
             <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
        <div className="footer-copy">© {new Date().getFullYear()} FinSight, Inc.</div>
      </footer>
    </div>
  );
}