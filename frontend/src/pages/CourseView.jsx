import api from '../api';

const CourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('curriculum');
    const [discussions, setDiscussions] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                const [courseRes, enrollmentRes, discussionsRes, reviewsRes] = await Promise.all([
                    api.get(`/api/courses/${id}`),
                    api.get('/api/enrollments/my-courses', config),
                    api.get(`/api/discussions/${id}`, config),
                    api.get(`/api/reviews/${id}`)
                ]);

                setCourse(courseRes.data);
                const currentEnrollment = enrollmentRes.data.find(e => e.course?._id === id);
                setEnrollment(currentEnrollment);
                setDiscussions(discussionsRes.data);
                setReviews(reviewsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course data', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user.token]);

    const handleAddReview = async (reviewData) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.post('/api/reviews', { ...reviewData, courseId: course._id }, config);
            setReviews([data, ...reviews]);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add review');
        }
    };

    const handleAddDiscussion = async (question) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.post('/api/discussions', { question, courseId: course._id }, config);
            setDiscussions([data, ...discussions]);
        } catch (error) {
            console.error('Error adding discussion', error);
        }
    };

    if (loading) return <div className="admin-panel"><p>Loading course...</p></div>;
    if (!course) return <div className="admin-panel"><p>Course not found.</p></div>;

    const isLessonCompleted = (lessonTitle) => {
        return enrollment?.completedLessons?.includes(lessonTitle);
    };

    const handlePremiumEnroll = async () => {
        try {
            const { data } = await api.post('/api/payments/create-checkout-session', { courseId: course._id }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            window.location.href = data.url; // Redirect to Stripe
        } catch (error) {
            console.error('Payment checkout error:', error);
        }
    };

    const paymentSuccess = new URLSearchParams(location.search).get('payment_success');

    return (
        <div className="admin-panel">
            <button onClick={() => navigate('/courses')} className="btn btn-secondary" style={{ width: 'auto', marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Catalog
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
                <div>
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', borderBottom: '4px solid var(--primary)' }}>
                        <span className="course-category">{course.category}</span>
                        <h1 className="section-title" style={{ marginBottom: '1rem', fontSize: '3rem' }}>{course.title}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>{course.description}</p>

                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={20} className="text-primary" />
                                <span>{course.duration}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BookOpen size={20} className="text-primary" />
                                <span>{course.lessons?.length || 0} Lessons</span>
                            </div>
                        </div>
                    </div>

                    {paymentSuccess && (
                        <div style={{ background: 'var(--success)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={20} />
                            Payment successful! Your premium enrollment is complete.
                        </div>
                    )}

                    {/* Tabs Navigation */}
                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2.5rem' }}>
                        {['curriculum', 'discussions', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                                    color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)',
                                    paddingBottom: '1rem',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'curriculum' && (
                        <>
                            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Course Roadmap</h2>
                            {course.isPremium && !enrollment ? (
                                <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                                    <Lock size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1.5rem' }} />
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Premium Content Locked</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                                        Purchase to unlock the full curriculum and certification.
                                    </p>
                                    <button
                                        className="btn btn-premium"
                                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '0.8rem 2rem' }}
                                        onClick={handlePremiumEnroll}
                                    >
                                        Unlock for ${course.price}
                                    </button>
                                </div>
                            ) : (
                                <div className="course-grid" style={{ gridTemplateColumns: '1fr' }}>
                                    {course.lessons?.map((lesson, index) => (
                                        <div
                                            key={index}
                                            className="course-card"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '1.5rem',
                                                gap: '1.5rem',
                                                cursor: 'pointer',
                                                borderLeft: isLessonCompleted(lesson.title) ? '4px solid var(--success)' : '1px solid var(--glass-border)'
                                            }}
                                            onClick={() => navigate(`/lesson/${course._id}/${index}`)}
                                        >
                                            <div className={`roadmap-node ${isLessonCompleted(lesson.title) ? 'completed' : 'active'}`}>
                                                {isLessonCompleted(lesson.title) ? <CheckCircle size={20} /> : index + 1}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{lesson.title}</h3>
                                            </div>
                                            <button className="btn" style={{ width: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                                                <Play size={16} /> {isLessonCompleted(lesson.title) ? 'Review' : 'Start'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'discussions' && (
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ marginBottom: '2rem' }}>Course Discussions</h2>
                            {!enrollment ? (
                                <p style={{ color: 'var(--text-muted)' }}>Enroll in this course to participate in discussions.</p>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '3rem' }}>
                                        <textarea
                                            id="new-question"
                                            placeholder="Ask a question about this course..."
                                            className="search-input"
                                            style={{ width: '100%', minHeight: '100px', marginBottom: '1rem', padding: '1rem' }}
                                        />
                                        <button className="btn" style={{ width: 'auto' }} onClick={() => {
                                            const q = document.getElementById('new-question').value;
                                            if (q) {
                                                handleAddDiscussion(q);
                                                document.getElementById('new-question').value = '';
                                            }
                                        }}>Post Question</button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {discussions.map(d => (
                                            <div key={d._id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                                                        {d.user?.name?.charAt(0)}
                                                    </div>
                                                    <span style={{ fontWeight: 'bold' }}>{d.user?.name}</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p style={{ marginBottom: '1.5rem' }}>{d.question}</p>
                                                <div style={{ paddingLeft: '2rem', borderLeft: '2px solid var(--glass-border)' }}>
                                                    {d.replies?.map((r, idx) => (
                                                        <div key={idx} style={{ marginBottom: '1rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                                                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{r.user?.name}</span>
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p style={{ fontSize: '0.95rem' }}>{r.reply}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ marginBottom: '2rem' }}>Student Reviews</h2>
                            {enrollment && !reviews.find(r => r.user?._id === user._id) && (
                                <div style={{ marginBottom: '3rem', padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px' }}>
                                    <h3>Leave a Review</h3>
                                    <div style={{ display: 'flex', gap: '10px', margin: '1rem 0' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} onClick={() => window.selectedRating = star} className="btn-secondary" style={{ width: '40px', padding: '10px' }}>{star}★</button>
                                        ))}
                                    </div>
                                    <textarea
                                        id="new-review"
                                        placeholder="Share your experience with this course..."
                                        className="search-input"
                                        style={{ width: '100%', minHeight: '80px', marginBottom: '1rem', padding: '1rem' }}
                                    />
                                    <button className="btn" style={{ width: 'auto' }} onClick={() => {
                                        const comment = document.getElementById('new-review').value;
                                        if (comment && window.selectedRating) {
                                            handleAddReview({ rating: window.selectedRating, comment });
                                        } else {
                                            alert('Please select a rating and write a comment');
                                        }
                                    }}>Submit Review</button>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {reviews.map(r => (
                                    <div key={r._id} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold' }}>{r.user?.name}</span>
                                            <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)' }}>{r.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Course Progress</h3>
                        <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 1.5rem' }}>
                            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="var(--glass-border)"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="var(--primary)"
                                    strokeWidth="3"
                                    strokeDasharray={`${enrollment?.progress || 0}, 100`}
                                />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800' }}>
                                {enrollment?.progress || 0}%
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {enrollment?.completedLessons?.length || 0} of {course.lessons?.length || 0} lessons completed
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Award className="text-warning" size={24} /> Certification
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Complete all lessons and pass the final assessment with at least 70% to earn your certificate.
                        </p>
                        <button
                            className="btn"
                            disabled={enrollment?.progress < 100}
                            onClick={() => navigate(`/quiz/${course._id}`)}
                        >
                            Take Final Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseView;
