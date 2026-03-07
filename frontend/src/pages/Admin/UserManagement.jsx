import api from '../../api';
import { User, Shield, Search, MoreVertical, Trash2, UserPlus, UserMinus, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [menuOpenFor, setMenuOpenFor] = useState(null);
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await api.get('/api/admin/users', config);
                setUsers(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users', err);
                setError('Failed to load users. Please try again.');
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleRole = async (u) => {
        if (!window.confirm(`Are you sure you want to make this user a ${u.role === 'admin' ? 'student' : 'admin'}?`)) {
            return;
        }
        setError('');
        setUpdatingUserId(u._id);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const newRole = u.role === 'admin' ? 'student' : 'admin';
            const { data } = await api.put(
                `/api/admin/users/${u._id}/role`,
                { role: newRole },
                config
            );
            setUsers(prev =>
                prev.map(existing => (existing._id === data._id ? data : existing))
            );
            setMessage(`Role updated for ${u.name}`);
        } catch (err) {
            console.error('Error updating role', err);
            setError(err.response?.data?.message || 'Failed to update role.');
        } finally {
            setUpdatingUserId(null);
            setMenuOpenFor(null);
        }
    };

    const handleDeleteUser = async (u) => {
        if (!window.confirm(`Are you sure you want to permanently delete ${u.email}?`)) {
            return;
        }
        setError('');
        setUpdatingUserId(u._id);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await api.delete(`/api/admin/users/${u._id}`, config);
            setUsers(prev => prev.filter(existing => existing._id !== u._id));
        } catch (err) {
            console.error('Error deleting user', err);
            setError(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setUpdatingUserId(null);
            setMenuOpenFor(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="admin-panel content-fade-in"><p>Loading Members...</p></div>;

    return (
        <div className="admin-panel content-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}
                    >    <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <h1 className="section-title" style={{ margin: 0 }}>User Management</h1>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        style={{ paddingLeft: '48px', width: '380px' }}
                        className="input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="error-message" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <div className="admin-controls glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>STUDENT</th>
                            <th style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>ROLE</th>
                            <th style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>JOINED</th>
                            <th style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => {
                            const isSelf = currentUser && currentUser._id === user._id;
                            const isBusy = updatingUserId === user._id;

                            return (
                                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--glass)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                                                <User size={22} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'white' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Mail size={12} /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <span style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            letterSpacing: '0.05em',
                                            background: user.role === 'admin' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                            color: user.role === 'admin' ? 'var(--accent)' : 'var(--primary)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            border: `1px solid ${user.role === 'admin' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
                                        }}>
                                            {user.role === 'admin' && <Shield size={14} />}
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                            {!isSelf && (
                                                <>
                                                    <button
                                                        onClick={() => handleToggleRole(user)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.6rem', width: 'auto' }}
                                                        title={user.role === 'admin' ? "Demote to Student" : "Promote to Admin"}
                                                        disabled={isBusy}
                                                    >
                                                        {user.role === 'admin' ? <UserMinus size={18} /> : <UserPlus size={18} className="text-primary" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.6rem', width: 'auto' }}
                                                        title="Delete Member"
                                                        disabled={isBusy}
                                                    >
                                                        <Trash2 size={18} style={{ color: '#ff4d4d' }} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        No members found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
