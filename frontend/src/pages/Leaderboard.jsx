import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, User } from 'lucide-react';
import api from '../api';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await api.get('/api/users/leaderboard');
                setLeaderboard(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leaderboard', error);
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <div className="admin-panel"><p>Loading rankings...</p></div>;

    return (
        <div className="admin-panel">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <Trophy size={64} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                <h1 className="section-title">Global Leaderboard</h1>
                <p style={{ color: '#666' }}>Top learners pushing the boundaries of SkillSphereX</p>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
                <div className="stat-card" style={{ padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(79, 70, 229, 0.05)' }}>
                            <tr>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: '#4f46e5' }}>Rank</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: '#4f46e5' }}>Learner</th>
                                <th style={{ padding: '1.2rem', textAlign: 'right', color: '#4f46e5' }}>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((student, index) => (
                                <tr key={student._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <td style={{ padding: '1.2rem', fontWeight: 'bold' }}>
                                        {index === 0 ? <Medal color="#f59e0b" size={24} /> :
                                            index === 1 ? <Medal color="#94a3b8" size={24} /> :
                                                index === 2 ? <Medal color="#b45309" size={24} /> :
                                                    index + 1}
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="avatar">
                                                <User size={18} color="#fff" />
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{student.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem', textAlign: 'right', fontWeight: 'bold', color: '#4f46e5' }}>
                                        {student.points.toLocaleString()} XP
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
