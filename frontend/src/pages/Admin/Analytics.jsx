import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart as ReBarChart, Bar, Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';
import {
    Users,
    TrendingUp,
    Award,
    BookOpen,
    ArrowLeft,
    TrendingDown,
    Activity,
    Target
} from 'lucide-react';
import api from '../../api';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalAttempts: 0,
        totalRevenue: 0,
        averageScore: 0,
        userGrowth: [],
        revenueStats: [],
        popularCourses: [],
        courseFunnels: [],
        topPerformers: [],
        needsAttention: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                const { data } = await api.get('/api/admin/stats', config);
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="admin-panel content-fade-in"><p>Loading Analytics...</p></div>;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

    return (
        <div className="admin-panel content-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}
                ><ArrowLeft size={18} /> Back to Dashboard
                </button>
                <h1 className="section-title" style={{ margin: 0 }}>Platform Analytics Specialist</h1>
            </div>

            {/* Quick Stats Grid */}
            <div className="course-grid">
                <div className="course-card glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--primary)' }}>
                        <Users size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Total Learners</p>
                        <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '700' }}>{stats.totalUsers}</h2>
                    </div>
                </div>

                <div className="course-card glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--success)' }}>
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Total Revenue</p>
                        <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '700' }}>${stats.totalRevenue?.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="course-card glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--accent)' }}>
                        <Award size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Avg. Mastery Score</p>
                        <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '700' }}>{stats.averageScore}%</h2>
                    </div>
                </div>

                <div className="course-card glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '12px', color: '#a78bfa' }}>
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Active Projects</p>
                        <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '700' }}>{stats.totalCourses}</h2>
                    </div>
                </div>
            </div>

            {/* Growth & Revenue Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', marginTop: '3rem' }}>
                <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '400px' }}>
                    <h3 style={{ marginBottom: '2rem' }}>Revenue Stream (7-Day Projection)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <ReBarChart data={stats.revenueStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--primary)' }}
                            />
                            <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </ReBarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '2rem' }}>Popular Courses</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.popularCourses}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="enrolled"
                            >
                                {stats.popularCourses.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem', marginTop: '3rem' }}>
                <h3 style={{ marginBottom: '2rem' }}>New Enrollments Velocity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.userGrowth}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                        <YAxis stroke="var(--text-muted)" fontSize={12} />
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="count" stroke="var(--success)" fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="admin-controls" style={{ marginTop: '3rem' }}>
                <h3 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.5rem' }}>Course Funnel Overview</h3>
                {stats.courseFunnels && stats.courseFunnels.length > 0 ? (
                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                        {stats.courseFunnels.map((course) => (
                            <div key={course.courseId} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{course.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {course.enrolled} Enrolled • {course.completed} Completed • {course.certificates} Certificates
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                                    <div style={{ marginBottom: '4px' }}>Completion: <strong className="text-primary">{course.completionRate}%</strong></div>
                                    <div>Certification: <strong style={{ color: 'var(--success)' }}>{course.certificationRate}%</strong></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Funnel metrics will appear once learners progress through courses.</p>
                )}
            </div>

            <div className="admin-controls" style={{ marginTop: '3rem' }}>
                <h3 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.5rem' }}>Student Performance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                        <h4 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Top Performers
                        </h4>
                        {stats.topPerformers && stats.topPerformers.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {stats.topPerformers.map(u => (
                                    <div key={u.userId} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontWeight: '600', fontSize: '1rem' }}>{u.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }} className="text-primary">{u.averageScore}% avg score</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Insufficient data for performance rankings.</p>
                        )}
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                        <h4 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.1rem', color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Needs Attention
                        </h4>
                        {stats.needsAttention && stats.needsAttention.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {stats.needsAttention.map(u => (
                                    <div key={u.userId} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontWeight: '600', fontSize: '1rem' }}>{u.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px', color: '#ff4d4d' }}>{u.averageScore}% avg score</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No critical issues detected in student performance.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
