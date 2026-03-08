import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Trash, Edit, RefreshCw, BookOpen, Clock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        duration: '',
        coverImage: '',
        category: '',
        lessons: [],
        resources: [],
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.get('/api/courses', config);
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addLesson = () => {
        setFormData({
            ...formData,
            lessons: [...formData.lessons, { title: '', content: '', videoUrl: '' }]
        });
    };

    const removeLesson = (index) => {
        const newLessons = [...formData.lessons];
        newLessons.splice(index, 1);
        setFormData({ ...formData, lessons: newLessons });
    };

    const handleLessonChange = (index, e) => {
        const newLessons = [...formData.lessons];
        newLessons[index][e.target.name] = e.target.value;
        setFormData({ ...formData, lessons: newLessons });
    };

    const addResource = () => {
        setFormData({
            ...formData,
            resources: [...formData.resources, { title: '', url: '', fileType: 'PDF' }]
        });
    };

    const removeResource = (index) => {
        const newResources = [...formData.resources];
        newResources.splice(index, 1);
        setFormData({ ...formData, resources: newResources });
    };

    const handleResourceChange = (index, e) => {
        const newResources = [...formData.resources];
        newResources[index][e.target.name] = e.target.value;
        setFormData({ ...formData, resources: newResources });
    };

    const generateAIQuiz = async (lessonIndex) => {
        const lesson = formData.lessons[lessonIndex];
        if (!lesson.content) {
            alert('Please add lesson content first so the AI can generate a quiz!');
            return;
        }

        try {
            setMessage('Generating AI Quiz... please wait.');
            const user = JSON.parse(localStorage.getItem('user'));
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.post('/api/ai/generate-quiz', { content: lesson.content }, config);

            // Here we would typically save the quiz. For now, let's log it or alert.
            // In a full implementation, we'd create a prompt to "Add to course quizzes".
            console.log('Generated Quiz Questions:', data);
            alert('AI Quiz Generated successfully! Check console for details (Saving logic to be wired).');
            setMessage('AI Quiz Generated!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error generating AI quiz');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        try {
            if (editingId) {
                await api.put(`/api/courses/${editingId}`, formData, config);
                setMessage('Course updated successfully!');
            } else {
                await api.post('/api/courses', formData, config);
                setMessage('Course created successfully!');
            }
            setFormData({
                title: '',
                description: '',
                instructor: '',
                duration: '',
                coverImage: '',
                category: '',
                lessons: [],
                resources: [],
            });
            setEditingId(null);
            fetchCourses();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error saving course');
        }
    };

    const deleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            try {
                await api.delete(`/api/courses/${id}`, config);
                fetchCourses();
                setMessage('Course deleted!');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Error deleting course');
            }
        }
    };

    const startEdit = (course) => {
        setEditingId(course._id);
        setFormData({
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            duration: course.duration,
            coverImage: course.coverImage,
            category: course.category,
            lessons: course.lessons || [],
            resources: course.resources || [],
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="admin-panel content-fade-in">
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}
                    ><ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <h1 className="section-title" style={{ margin: 0 }}>Manage Courses</h1>
                </div>
            </header>

            <div className="admin-controls glass-panel" style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{editingId ? 'Edit Course' : 'Create New Journey'}</h3>

                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '2rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: message.includes('Error') ? '#f87171' : 'var(--success)',
                        border: `1px solid ${message.includes('Error') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Course Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input" style={{ width: '100%' }} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                            rows="4"
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Instructor Name</label>
                            <input type="text" name="instructor" value={formData.instructor} onChange={handleChange} required className="input" style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} required className="input" style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div className="form-group">
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Duration</label>
                            <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 8 Weeks" required className="input" style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Thumbnail Image URL</label>
                            <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://unsplash.com/..." className="input" style={{ width: '100%' }} />
                        </div>
                    </div>

                    {/* Lessons Section */}
                    <div className="lessons-management" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)' }}>Course Curriculum (Lessons)</h4>
                            <button type="button" onClick={addLesson} className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                <Plus size={14} /> Add Lesson
                            </button>
                        </div>

                        {formData.lessons.map((lesson, idx) => (
                            <div key={idx} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h5 style={{ margin: 0 }}>Lesson #{idx + 1}</h5>
                                    <button type="button" onClick={() => removeLesson(idx)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                                        <Trash size={16} />
                                    </button>
                                </div>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <input type="text" placeholder="Lesson Title" name="title" value={lesson.title} onChange={(e) => handleLessonChange(idx, e)} className="input" style={{ width: '100%' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <textarea placeholder="Lesson Content (for AI Quiz generation)" name="content" value={lesson.content} onChange={(e) => handleLessonChange(idx, e)} className="input" style={{ width: '100%', height: '100px' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <input type="text" placeholder="Video URL" name="videoUrl" value={lesson.videoUrl} onChange={(e) => handleLessonChange(idx, e)} className="input" style={{ flex: 1 }} />
                                    <button
                                        type="button"
                                        onClick={() => generateAIQuiz(idx)}
                                        className="btn"
                                        style={{ width: 'auto', background: 'var(--secondary)', padding: '0.6rem 1rem', fontSize: '0.8rem', gap: '8px' }}
                                    >
                                        <RefreshCw size={14} /> AI Quiz Gen
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resources Section */}
                    <div className="resources-management" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#10b981' }}>Downloadable Resources</h4>
                            <button type="button" onClick={addResource} className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                <Plus size={14} /> Add Resource
                            </button>
                        </div>

                        {formData.resources.map((res, idx) => (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 40px', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                                <input type="text" placeholder="Title (e.g. Cheat Sheet)" name="title" value={res.title} onChange={(e) => handleResourceChange(idx, e)} className="input" />
                                <input type="text" placeholder="Download URL" name="url" value={res.url} onChange={(e) => handleResourceChange(idx, e)} className="input" />
                                <select name="fileType" value={res.fileType} onChange={(e) => handleResourceChange(idx, e)} className="input" style={{ height: '3.2rem', padding: '0 1rem' }}>
                                    <option value="PDF">PDF</option>
                                    <option value="ZIP">ZIP</option>
                                    <option value="Code">Code</option>
                                    <option value="Video">Video</option>
                                </select>
                                <button type="button" onClick={() => removeResource(idx)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn" style={{ flex: 1, background: editingId ? 'var(--accent)' : 'var(--primary)' }}>
                            {editingId ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <RefreshCw size={18} /> Update Course Details
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Plus size={18} /> Launch New Course
                                </span>
                            )}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ width: 'auto' }}
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ title: '', description: '', instructor: '', duration: '', coverImage: '', category: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="admin-controls glass-panel">
                <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Active Catalog</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {courses.map(course => (
                        <div key={course._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', background: 'var(--glass)' }}>
                                    <img src={course.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{course.title}</div>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={14} /> {course.category}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><UserIcon size={14} /> {course.instructor}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {course.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => startEdit(course)} className="btn btn-secondary" style={{ padding: '0.75rem', width: 'auto' }}>
                                    <Edit size={18} className="text-primary" />
                                </button>
                                <button onClick={() => deleteCourse(course._id)} className="btn btn-secondary" style={{ padding: '0.75rem', width: 'auto' }}>
                                    <Trash size={18} style={{ color: '#ff4d4d' }} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            The catalog is currently empty. Start by creating a course above.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;
