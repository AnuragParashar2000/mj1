import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Play,
    ArrowRight,
    Brain,
    ShieldCheck,
    Globe,
    Zap,
    Users,
    ChevronRight
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="admin-panel" style={{ padding: 0, overflowX: 'hidden' }}>
            {/* NAVBAR */}
            <nav style={{
                padding: '1.5rem 4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '10px' }}>
                        <Zap size={20} color="white" />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>SkillSphereX</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem' }}>
                        Sign In
                    </button>
                    <button onClick={() => navigate('/register')} className="btn" style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
                        Join Now
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                padding: '120px 4rem 80px',
                background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%)'
            }}>
                {/* Visual Elements */}
                <div style={{ position: 'absolute', top: '15%', right: '10%', width: '400px', height: '400px', background: 'var(--primary-glow)', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }}></div>

                <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '50px',
                        color: 'var(--primary)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        marginBottom: '2rem',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                        <Sparkles size={16} /> THE FUTURE OF UPSKILLING IS HERE
                    </div>

                    <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                        Unlock Your Potential with <span className="text-primary" style={{ position: 'relative' }}>
                            AI-Driven
                            <svg style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%' }} height="12" viewBox="0 0 400 12" fill="none">
                                <path d="M4 8C60 4 120 4 396 8" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
                            </svg>
                        </span> Mastery.
                    </h1>

                    <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '650px' }}>
                        The only platform that combines professional structured courses with a personal <span style={{ color: 'white', fontWeight: 600 }}>AI Skill Mentor</span> to guide your journey.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate('/register')}
                            className="btn"
                            style={{ width: 'auto', padding: '1.25rem 3rem', fontSize: '1.25rem', boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)' }}
                        >
                            Get Started for Free <ArrowRight size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Play size={20} color="white" fill="white" />
                            </div>
                            <span style={{ fontWeight: 600 }}>Explore Platform</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '5rem', display: 'flex', gap: '4rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Users size={20} /> <strong>10k+</strong> Students
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShieldCheck size={20} /> Verified Certificates
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Globe size={20} /> Global Recognition
                        </div>
                    </div>
                </div>

                {/* Floating Preview Card */}
                <div style={{ position: 'absolute', right: '5%', top: '55%', transform: 'translateY(-50%) rotate(-5deg)', width: '450px', display: 'none' /* Will show on desktop only in CSS */ }} className="desktop-only">
                    <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div style={{ padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>AI SELECTION</div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}></div>)}
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Web3 Development</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Master decentralized applications with our AI-guided roadmap.</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>PREMIUM TRACK</div>
                            <button className="btn" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Enroll Now</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section style={{ padding: '100px 4rem', background: 'rgba(15, 23, 42, 0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Engineered for Excellence</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>A complete ecosystem designed to take you from amateur to professional.</p>
                </div>

                <div className="course-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                    <div className="glass-panel" style={{ padding: '3rem', transition: 'transform 0.3s ease' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                            <Brain size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI Skill Mentor</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Get personalized learning roadmaps based on your current skills and career goals. AI that actually understands you.</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '3rem', transition: 'transform 0.3s ease' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                            <Play size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Structured Courses</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Zero fluff. High-definition video lessons and interactive content curated by industry experts.</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '3rem', transition: 'transform 0.3s ease' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                            <ShieldCheck size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Official Certificates</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Earn verifiable certificates and professional badges as you master new skills and complete assessments.</p>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section style={{ padding: '120px 4rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{
                    padding: '5rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    border: '1px solid var(--primary)'
                }}>
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Ready to redefine your career?</h2>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        Join thousands of learners who are already using SkillSphereX to stay ahead of the curve.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="btn"
                        style={{ width: 'auto', padding: '1.25rem 4rem', fontSize: '1.25rem', marginBottom: '2rem' }}
                    >
                        Create Your Free Account
                    </button>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No credit card required. Instant access to catalog.
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ padding: '4rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                    <Zap size={24} className="text-primary" />
                    <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>SkillSphereX</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', color: 'var(--text-muted)' }}>
                    <span>Courses</span>
                    <span>AI Mentor</span>
                    <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate('/compiler')}>IDE & Compiler</span>
                    <span>Admin Hub</span>
                    <span>Documentation</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                    © 2026 SkillSphereX. Engineered for the future of education.
                </p>
            </footer>
        </div>
    );
};

export default Landing;
