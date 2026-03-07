import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Book,
    Layout,
    Award,
    Settings,
    LogOut,
    Users,
    BarChart3,
    Clock,
    Sparkles,
    ChevronRight,
    TrendingUp,
    PlayCircle,
    Brain,
    Rocket,
    Zap,
    Code,
    Trophy
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../api';

const Home = () => {
    const [user, setUser] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentStats, setStudentStats] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchEnrollments(storedUser.token);
            fetchStats(storedUser.token);
            const hasSeenOnboarding = localStorage.getItem('skillspherex_onboarding_seen');
            if (!hasSeenOnboarding) {
                setShowOnboarding(true);
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchStats = async (token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.get('/api/users/stats', config);
            setStudentStats(data);
        } catch (error) {
            console.error('Error fetching stats', error);
        }
    };

    const fetchEnrollments = async (token) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await api.get('/api/enrollments/my-courses', config);
            setEnrollments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching enrollments', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    const activeEnrollments = enrollments.filter(en => !en.completed);
    const completedEnrollments = enrollments.filter(en => en.completed);
    const averageProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length)
        : 0;

    return (
        <div className="admin-panel" style={{ paddingBottom: '5rem' }}>
            {/* HERO SECTION */}
            <section style={{
                position: 'relative',
                marginBottom: '4rem',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid var(--glass-border)',
                padding: '4rem 3rem'
            }}>
                {/* Background Glows */}
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--primary-glow)', filter: 'blur(100px)', opacity: 0.2, pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--success-glow)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }}></div>

                <div style={{ position: 'relative', z_index: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ maxWidth: '600px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 16px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            borderRadius: '50px',
                            color: 'var(--primary)',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}>
                            <Sparkles size={14} /> EXPLORE THE FUTURE OF LEARNING
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                            Master Your Future with <span className="text-primary">SkillSphereX</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            Welcome back, <strong>{user.name.split(' ')[0]}</strong>! Continue your journey through our AI-powered learning tracks and earn professional recognition.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => navigate('/courses')}>
                                <PlayCircle size={20} /> Continue Learning
                            </button>
                            <button className="btn btn-secondary" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => navigate('/mentor')}>
                                <Brain size={20} /> AI Skill Mentor
                            </button>
                            <button className="btn btn-secondary" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem', background: 'rgba(16, 185, 129, 0.05)', color: 'var(--secondary)', border: '1px solid rgba(16, 185, 129, 0.1)' }} onClick={() => navigate('/compiler')}>
                                <Code size={20} /> SkillSphereX IDE
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', width: '320px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                            <Zap size={18} className="text-primary" />
                            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>SkillSphereX</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{enrollments.length}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Courses</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)' }}>{user.points || 0}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total XP</div>
                            </div>
                            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Overall Mastery</span>
                                    <span className="text-primary">{averageProgress}%</span>
                                </div>
                                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: `${averageProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)' }}></div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => navigate('/leaderboard')} className="btn" style={{ marginTop: '1.5rem', width: '100%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <Trophy size={16} /> Global Leaderboard
                        </button>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ marginTop: '0.75rem', width: '100%', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                            <LogOut size={16} /> Secure Sign Out
                        </button>
                    </div>
                </div>
            </section>

            {user.role === 'admin' ? (
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Control Center</h2>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Oversee your educational ecosystem with real-time management tools.</p>
                        </div>
                        <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => navigate('/admin/analytics')}>
                            <TrendingUp size={18} /> View Global Metrics
                        </button>
                    </div>

                    <div className="course-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                        <Link to="/admin/courses" style={{ textDecoration: 'none' }}>
                            <div className="course-card glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}>
                                    <Settings size={120} />
                                </div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                        <Layout size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Curriculum Architect</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Define, deploy and iterate on learning materials across the platform.</p>
                                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--primary)' }}>
                                        Manage Catalog <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                            <div className="course-card glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}>
                                    <Users size={120} />
                                </div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                                        <Users size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Command Center</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Monitor student performance, manage permissions and moderate users.</p>
                                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--secondary)' }}>
                                        User Operations <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            ) : (
                <>
                    <section style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Active Directives</h2>
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Courses you are currently mastering.</p>
                            </div>
                            <Link to="/courses" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                                View Full Catalog <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="course-grid">
                            {activeEnrollments.length > 0 ? (
                                activeEnrollments.map(en => (
                                    <div key={en._id} className="course-card glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <div style={{ padding: '4px 12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                {en.course?.category?.toUpperCase()}
                                            </div>
                                            <div style={{ color: 'var(--primary)', fontWeight: 900 }}>{en.progress}%</div>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{en.course?.title}</h3>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
                                            <div style={{ width: `${en.progress}%`, height: '100%', background: 'var(--primary)' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn" style={{ flex: 1 }} onClick={() => navigate(`/course/${en.course?._id}`)}>
                                                Resume Journey
                                            </button>
                                            <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => navigate(`/quiz/${en.course?._id}`)}>
                                                Challenge Quiz
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    padding: '5rem',
                                    textAlign: 'center',
                                    background: 'var(--card-bg)',
                                    border: '1px dashed var(--glass-border)',
                                    borderRadius: 'var(--radius-lg)'
                                }}>
                                    <Rocket size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ready to launch?</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                                        Launch your first learning path today and experience AI-guided education.
                                    </p>
                                    <button className="btn" style={{ width: 'auto', padding: '1rem 3rem' }} onClick={() => navigate('/courses')}>
                                        Browse Course Catalog
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                        <section>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Award size={24} className="text-primary" /> Achievements & Badges
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {enrollments.filter(e => e.badgeEarned || e.certificateEarned).map(en => (
                                    <div key={en._id} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', transition: 'all 0.3s ease' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            margin: '0 auto 1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            background: en.badgeEarned === 'Gold' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                            color: en.badgeEarned === 'Gold' ? '#fbbf24' : 'var(--primary)',
                                            border: `1px solid ${en.badgeEarned === 'Gold' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
                                        }}>
                                            <Award size={32} />
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '4px' }}>
                                            {en.badgeEarned || 'COMPLETION'}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: en.certificateEarned ? '1rem' : '0' }}>
                                            {en.course?.title?.substring(0, 15)}...
                                        </div>
                                        {en.certificateEarned && (
                                            <button
                                                onClick={() => navigate(`/certificate/${en._id}`)}
                                                className="btn"
                                                style={{ width: '100%', fontSize: '0.75rem', padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                                            >
                                                View Certificate
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {enrollments.filter(e => e.badgeEarned || e.certificateEarned).length === 0 && (
                                    <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Complete course quizzes with excellence to unlock professional badges.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Clock size={24} className="text-primary" /> Learning Velocity
                            </h2>
                            <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '300px' }}>
                                {studentStats?.studyStats?.length > 0 ? (
                                    <div style={{ height: '250px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={studentStats.studyStats}>
                                                <XAxis
                                                    dataKey="date"
                                                    hide
                                                />
                                                <Tooltip
                                                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    formatter={(value) => [`${value} mins`, 'Study Time']}
                                                />
                                                <Bar dataKey="duration" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                                            Minutes studied per day (Last 7 Days)
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', textAlign: 'center' }}>
                                        <TrendingUp size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No study sessions recorded yet. Start a lesson to track your velocity!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </>
            )}

            {/* ONBOARDING DIALOG */}
            {showOnboarding && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15,23,42,0.9)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                >
                    <div
                        className="glass-panel"
                        style={{
                            maxWidth: '560px',
                            width: '100%',
                            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
                            padding: '3rem',
                            border: '1px solid var(--primary)'
                        }}
                    >
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                            <Rocket size={32} />
                        </div>

                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to the Future</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            SkillSphereX is your AI-integrated learning ecosystem. Let's get you oriented in 3 simple steps.
                        </p>

                        <div style={{ marginBottom: '3rem' }}>
                            {onboardingStep === 0 && (
                                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                                    <h4 style={{ margin: '0 0 1rem' }}>Step 1: The Catalog</h4>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Browse professional tracks, enroll in any skill, and immediately access video lessons and assessments.</p>
                                </div>
                            )}
                            {onboardingStep === 1 && (
                                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                                    <h4 style={{ margin: '0 0 1rem' }}>Step 2: AI Mentorship</h4>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Use the AI Skill Mentor to generate personalized learning roadmaps based on your performance and time capacity.</p>
                                </div>
                            )}
                            {onboardingStep === 2 && (
                                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                                    <h4 style={{ margin: '0 0 1rem' }}>Step 3: Recognition</h4>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Complete quizzes with high scores to earn badges and official certificates for your professional portfolio.</p>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                                PHASE {onboardingStep + 1}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => {
                                        localStorage.setItem('skillspherex_onboarding_seen', '1');
                                        setShowOnboarding(false);
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Dismiss Tour
                                </button>
                                {onboardingStep < 2 ? (
                                    <button className="btn" style={{ width: 'auto', padding: '0.75rem 2.5rem' }} onClick={() => setOnboardingStep(s => s + 1)}>
                                        Next Phase
                                    </button>
                                ) : (
                                    <button className="btn" style={{ width: 'auto', padding: '0.75rem 2.5rem' }} onClick={() => {
                                        localStorage.setItem('skillspherex_onboarding_seen', '1');
                                        setShowOnboarding(false);
                                    }}>
                                        Initialize Dashboard
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
