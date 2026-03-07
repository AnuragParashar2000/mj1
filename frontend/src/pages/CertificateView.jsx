import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Shield, CheckCircle, Download, Printer, ArrowLeft } from 'lucide-react';
import api from '../api';

const CertificateView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await api.get('/api/enrollments/my-courses', config);
                const current = data.find(e => e._id === id);
                setEnrollment(current);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching enrollment', error);
                setLoading(false);
            }
        };
        fetchEnrollment();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="admin-panel">Generating Certificate...</div>;
    if (!enrollment || !enrollment.certificateEarned) return <div className="admin-panel">Certificate not found or not yet earned.</div>;

    return (
        <div className="admin-panel" style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 1rem' }}>
            <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate('/dashboard')} className="btn" style={{ width: 'auto', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
                <button onClick={handlePrint} className="btn" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Printer size={18} /> Print Certificate
                </button>
            </div>

            <div id="certificate" style={{
                maxWidth: '900px',
                margin: '0 auto',
                background: 'white',
                padding: '4rem',
                border: '20px solid #f1f5f9',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif"
            }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', border: '2px solid #e2e8f0', pointerEvents: 'none' }}></div>

                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>SkillSphereX</h1>
                    <p style={{ letterSpacing: '4px', textTransform: 'uppercase', color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>Online Learning & Assessment Platform</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '1.25rem', color: '#1e293b' }}>This is to certify that</p>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', margin: '1rem 0', color: '#0f172a', borderBottom: '2px solid #f1f5f9', display: 'inline-block', paddingBottom: '0.5rem' }}>
                        {JSON.parse(localStorage.getItem('user')).name}
                    </h2>
                </div>

                <div style={{ marginBottom: '3rem' }}>
                    <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: '1.6' }}>
                        has successfully completed the professional development course
                    </p>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)', margin: '1rem 0' }}>
                        {enrollment.course?.title}
                    </h3>
                    <p style={{ color: '#64748b' }}>
                        verifying their proficiency in {enrollment.course?.category} with a {enrollment.badgeEarned} Level achievement.
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', marginTop: '4rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '150px', borderBottom: '1px solid #cbd5e1', marginBottom: '0.5rem' }}></div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Program Director</p>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            background: 'var(--primary-color)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.1)'
                        }}>
                            <Award size={48} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            VERIFIED AUTHENTIC
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '150px', borderBottom: '1px solid #cbd5e1', marginBottom: '0.5rem' }}></div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Date: {new Date(enrollment.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', opacity: 0.3, fontSize: '0.7rem' }}>
                    Certificate ID: {enrollment._id.toUpperCase()} • SkillSphereX Verification System
                </div>
            </div>
        </div>
    );
};

export default CertificateView;
