import api from '../api';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Award } from 'lucide-react';

const QuizView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [attemptHistory, setAttemptHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await api.get(`/api/quizzes/course/${id}`, config);
                if (data.length > 0) {
                    // Prefer easier quiz first if difficulty is set
                    const sorted = [...data].sort((a, b) => {
                        const order = { Beginner: 0, Intermediate: 1, Advanced: 2 };
                        return (order[a.difficulty] ?? 0) - (order[b.difficulty] ?? 0);
                    });
                    setAllQuizzes(sorted);
                    setQuiz(sorted[0]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching quiz', error);
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const loadAttemptHistory = async (quizId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await api.get(`/api/quizzes/${quizId}/attempts`, config);
            setAttemptHistory(data);
        } catch (error) {
            console.error('Error fetching attempts', error);
        }
    };

    const handleOptionSelect = (optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: optionIndex
        });
    };

    const handleSubmit = async () => {
        const answersArray = quiz.questions.map((_, index) => selectedAnswers[index]);
        if (answersArray.includes(undefined)) {
            alert('Please answer all questions before submitting.');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await api.post(`/api/quizzes/${quiz._id}/submit`, { answers: answersArray }, config);
            setResult(data);
            loadAttemptHistory(quiz._id);
        } catch (error) {
            console.error('Error submitting quiz', error);
        }
    };

    if (loading) return <div className="admin-panel">Loading Assessment...</div>;
    if (!quiz) return <div className="admin-panel">No quiz available for this course yet.</div>;

    if (result) {
        const advancedQuiz = allQuizzes.find(q => q._id !== quiz._id && q.difficulty === 'Advanced');
        const strongPass = result.passed && result.score >= (quiz.passingScore + 20);

        return (
            <div className="auth-container">
                <div className="auth-card" style={{ maxWidth: '500px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        {result.passed ? (
                            <CheckCircle size={64} color="var(--success-color)" style={{ margin: '0 auto 1rem' }} />
                        ) : (
                            <XCircle size={64} color="var(--error-color)" style={{ margin: '0 auto 1rem' }} />
                        )}
                        <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
                            {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
                        </h2>
                        <p style={{ color: '#64748b' }}>You scored {result.score}% in {quiz.title}</p>
                    </div>

                    <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Correct Answers:</span>
                            <strong>{result.correctCount} / {result.totalQuestions}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Result:</span>
                            <strong style={{ color: result.passed ? 'var(--success-color)' : 'var(--error-color)' }}>
                                {result.passed ? 'PASSED' : 'FAILED'}
                            </strong>
                        </div>
                    </div>

                    {result.passed && result.enrollmentId && (
                        <button
                            onClick={() => navigate(`/certificate/${result.enrollmentId}`)}
                            className="btn"
                            style={{ width: '100%', marginBottom: '1rem', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <Award size={18} />
                            View Certificate
                        </button>
                    )}

                    {strongPass && advancedQuiz && (
                        <div style={{ background: '#ecfdf5', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#166534' }}>
                            <strong>Challenge unlocked:</strong> You scored well above the passing score. Try the <em>{advancedQuiz.title}</em> to push into advanced difficulty.
                            <button
                                className="btn"
                                style={{ width: '100%', marginTop: '0.75rem', background: '#16a34a' }}
                                onClick={() => {
                                    setQuiz(advancedQuiz);
                                    setResult(null);
                                    setSelectedAnswers({});
                                    setCurrentQuestion(0);
                                    setAttemptHistory([]);
                                }}
                            >
                                Take Advanced Quiz
                            </button>
                        </div>
                    )}

                    {!result.passed && attemptHistory.length >= 2 && (
                        <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#92400e' }}>
                            <strong>Smart feedback:</strong> You’ve attempted this quiz multiple times. Revisit the related lessons in your course, focus on misunderstood concepts, and then try again with shorter, focused study sessions.
                        </div>
                    )}

                    <button onClick={() => navigate('/dashboard')} className="btn" style={{ width: '100%' }}>Back to Dashboard</button>
                    {!result.passed && (
                        <button onClick={() => { setResult(null); setCurrentQuestion(0); setSelectedAnswers({}); }} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', marginTop: '0.75rem', width: '100%' }}>
                            Retry Quiz
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const currentQ = quiz.questions[currentQuestion];

    return (
        <div className="admin-panel">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>{quiz.title}</h1>
                        <p style={{ color: '#64748b' }}>Question {currentQuestion + 1} of {quiz.questions.length}</p>
                    </div>
                </div>

                <div className="course-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{currentQ.questionText}</h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {currentQ.options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleOptionSelect(index)}
                                className={`glass-panel ${selectedAnswers[currentQuestion] === index ? 'selected-option' : ''}`}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: `1px solid ${selectedAnswers[currentQuestion] === index ? 'var(--primary)' : 'var(--glass-border)'}`,
                                    background: selectedAnswers[currentQuestion] === index ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    color: 'var(--text-light)'
                                }}
                            >
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    border: `1px solid ${selectedAnswers[currentQuestion] === index ? 'var(--primary)' : 'var(--glass-border)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    color: selectedAnswers[currentQuestion] === index ? 'var(--primary)' : 'var(--text-muted)',
                                    background: selectedAnswers[currentQuestion] === index ? 'rgba(99, 102, 241, 0.2)' : 'transparent'
                                }}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span style={{ fontSize: '1.05rem', fontWeight: selectedAnswers[currentQuestion] === index ? 600 : 400 }}>
                                    {option}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                        <button
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(v => v - 1)}
                            className="btn"
                            style={{ width: 'auto', background: '#94a3b8', visibility: currentQuestion === 0 ? 'hidden' : 'visible' }}
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>

                        {currentQuestion === quiz.questions.length - 1 ? (
                            <button onClick={handleSubmit} className="btn" style={{ width: 'auto', background: 'var(--success-color)' }}>
                                Submit Assessment
                            </button>
                        ) : (
                            <button onClick={() => setCurrentQuestion(v => v + 1)} className="btn" style={{ width: 'auto' }}>
                                Next <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizView;
