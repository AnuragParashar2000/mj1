import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { BookOpen, Clock, User, Search, ArrowLeft, Star } from 'lucide-react';

const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/api/courses');
                setCourses(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses', error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEnroll = async (course) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            if (course.isPremium) {
                // Call Stripe Checkout Endpoint
                const { data } = await api.post('/api/payments/create-checkout-session', { courseId: course._id }, config);
                window.location.href = data.url; // Redirect to Stripe
            } else {
                // Free course enrollment
                await api.post('/api/enrollments', { courseId: course._id }, config);
                navigate(`/course/${course._id}`);
            }
        } catch (error) {
            console.error('Enrollment error:', error.response?.data?.message || error.message);
            if (course.isPremium) {
                alert('Failed to initiate payment. Please try again later.');
            } else {
                // If already enrolled (or other error) on a free course, attempt to just navigate
                navigate(`/course/${course._id}`);
            }
        }
    };

    if (loading) return <div className="admin-panel"><p>Loading courses...</p></div>;

    return (
        <div className="admin-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ width: 'auto', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <h1 className="section-title" style={{ margin: 0, fontSize: '2.2rem', lineHeight: '1.2' }}>Explore Courses</h1>
                </div>

                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search courses or categories..."
                        style={{ paddingLeft: '42px', width: '100%', height: '3.2rem', background: 'rgba(15, 23, 42, 0.4)' }}
                        className="input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="course-grid">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div key={course._id} className="course-card glass-panel">
                            <img src={course.coverImage} alt={course.title} className="course-image" />
                            <div className="course-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span className="course-category">{course.category}</span>
                                    {course.isPremium && (
                                        <span style={{
                                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                            color: 'white',
                                            padding: '4px 10px',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <Star size={12} fill="white" /> PREMIUM - ${course.price}
                                        </span>
                                    )}
                                </div>
                                <h3 className="course-title">{course.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={14}
                                                fill={star <= Math.round(course.averageRating) ? '#f59e0b' : 'transparent'}
                                                color={star <= Math.round(course.averageRating) ? '#f59e0b' : '#cbd5e1'}
                                            />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{course.averageRating || '0.0'}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({course.reviewCount || 0})</span>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    {course.description.substring(0, 80)}...
                                </p>
                                <div className="course-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <User size={16} />
                                        <span>{course.instructor}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={16} />
                                        <span>{course.duration}</span>
                                    </div>
                                </div>
                                <button
                                    className={`btn ${course.isPremium ? 'btn-premium' : ''}`}
                                    style={{
                                        marginTop: '1.5rem',
                                        background: course.isPremium ? 'linear-gradient(135deg, #f59e0b, #d97706)' : ''
                                    }}
                                    onClick={() => handleEnroll(course)}
                                >
                                    {course.isPremium ? 'Buy & Enroll' : 'Enroll & Start'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '4rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No courses found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseList;
