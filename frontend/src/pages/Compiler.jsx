import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
    Play,
    Trash2,
    Copy,
    Check,
    Terminal,
    Code2,
    Cpu,
    ArrowLeft,
    Sparkles,
    Settings,
    Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const LANGUAGE_CONFIG = {
    javascript: {
        id: 'nodejs',
        name: 'JavaScript',
        version: '4', // Node.js 17 on JDoodle
        defaultCode: `// Welcome to SkillSphereX IDE\n// Start coding your JavaScript solution here\n\nfunction greet(name) {\n    return "Hello, " + name + "! Welcome to the future of learning.";\n}\n\nconsole.log(greet("Student"));\n`
    },
    python: {
        id: 'python3',
        name: 'Python',
        version: '4', // Python 3.9 on JDoodle
        defaultCode: `# Welcome to SkillSphereX IDE\n# Start coding your Python solution here\n\ndef greet(name):\n    return f"Hello, {name}! Welcome to the future of learning."\n\nprint(greet("Student"))\n`
    },
    cpp: {
        id: 'cpp',
        name: 'C++',
        version: '5', // GCC 11.1.0 on JDoodle
        defaultCode: `#include <iostream>\n#include <string>\n\nint main() {\n    std::string name = "Student";\n    std::cout << "Hello, " << name << "! Welcome to the future of learning." << std::endl;\n    return 0;\n}\n`
    },
    java: {
        id: 'java',
        name: 'Java',
        version: '4', // JDK 17.0.1 on JDoodle
        defaultCode: `public class Main {\n    public static void main(String[] args) {\n        String name = "Student";\n        System.out.println("Hello, " + name + "! Welcome to the future of learning.");\n    }\n}\n`
    }
};

const Compiler = ({ embeddedMode = false, initialLanguage = 'javascript', initialCode = null, courseId = null, lessonIndex = null }) => {
    const [language, setLanguage] = useState(initialLanguage);
    const [code, setCode] = useState(initialCode || LANGUAGE_CONFIG[initialLanguage].defaultCode);
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const editorRef = useRef(null);
    const navigate = useNavigate();

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        setCode(LANGUAGE_CONFIG[newLang].defaultCode);
    };

    const runCode = async () => {
        setLoading(true);
        setOutput('Executing code on SkillSphereX Engine...');

        try {
            const configLanguage = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG['javascript'];
            const response = await api.post('/api/compile', {
                script: code,
                language: configLanguage.id,
                versionIndex: configLanguage.version
            });

            const result = response.data;
            if (result.error) {
                setOutput(`Compilation Error:\n${result.error}`);
            } else if (result.output) {
                setOutput(result.output);
            } else {
                setOutput('Code executed successfully with no output.');
            }
        } catch (error) {
            setOutput(`Execution Failed: ${error.response?.data?.message || error.message}`);
            console.error('Execution error:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearOutput = () => setOutput('');

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const saveSnippet = async () => {
        if (!courseId || lessonIndex === null) return;
        setSaving(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.post('/api/snippets', {
                language,
                code,
                courseId,
                lessonIndex
            }, config);
        } catch (error) {
            console.error('Error saving snippet', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={embeddedMode ? "" : "admin-panel"} style={{ height: embeddedMode ? '100%' : '100vh', padding: embeddedMode ? 0 : '1.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {!embeddedMode && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '4px' }}>
                            <Sparkles size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>SKILLSPHEREX ENGINE</span>
                        </div>
                        <h1 style={{ fontSize: embeddedMode ? '1.2rem' : '1.5rem', fontWeight: 900, margin: 0 }}>Integrated IDE</h1>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Code2 size={16} className="text-primary" />
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                outline: 'none',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                                <option key={key} value={key} style={{ background: '#0f172a' }}>{lang.name}</option>
                            ))}
                        </select>
                    </div>

                    {embeddedMode && courseId && (
                        <button
                            className="btn btn-secondary"
                            onClick={saveSnippet}
                            disabled={saving}
                            style={{ width: 'auto', padding: '10px 16px', borderRadius: '12px' }}
                            title="Save snippet to your profile"
                        >
                            <Save size={18} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                    )}

                    <button
                        className="btn"
                        onClick={runCode}
                        disabled={loading}
                        style={{
                            width: 'auto',
                            padding: '10px 24px',
                            borderRadius: '12px',
                            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        {loading ? (
                            <>
                                <Cpu size={18} className="spin" /> Compiling...
                            </>
                        ) : (
                            <>
                                <Play size={18} /> Run Script
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'grid', gridTemplateColumns: embeddedMode ? '1fr' : '1.4fr 1fr', gridTemplateRows: embeddedMode ? '1.5fr 1fr' : '1fr', gap: '1.5rem', minHeight: 0 }}>
                {/* Editor Section */}
                <div style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border)',
                    background: '#1e1e1e'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1.5rem',
                        zIndex: 10,
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <button
                            onClick={copyCode}
                            className="glass-panel"
                            style={{ padding: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                            title="Copy Code"
                        >
                            {copied ? <Check size={16} color="var(--secondary)" /> : <Copy size={16} />}
                        </button>
                        <button
                            onClick={() => setCode(LANGUAGE_CONFIG[language].defaultCode)}
                            className="glass-panel"
                            style={{ padding: '8px', cursor: 'pointer' }}
                            title="Reset Editor"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <Editor
                        height="100%"
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        onMount={handleEditorDidMount}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 40, bottom: 20 },
                            fontFamily: "'Fira Code', monospace",
                            cursorSmoothCaretAnimation: 'on',
                            smoothScrolling: true
                        }}
                    />
                </div>

                {/* Output Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                        <div style={{
                            padding: '12px 20px',
                            borderBottom: '1px solid var(--glass-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Terminal size={18} className="text-secondary" />
                                <span style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em' }}>SYSTEM CONSOLE</span>
                            </div>
                            <button
                                onClick={clearOutput}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                                CLEAR
                            </button>
                        </div>
                        <div style={{
                            flex: 1,
                            padding: '1.5rem',
                            overflowY: 'auto',
                            fontFamily: "'Fira Code', monospace",
                            fontSize: '0.9rem',
                            color: '#e2e8f0',
                            whiteSpace: 'pre-wrap',
                            background: 'rgba(0,0,0,0.2)'
                        }}>
                            {output || (
                                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'center' }}>
                                    <Cpu size={20} opacity={0.3} />
                                    Wait for execution...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Tips Panel */}
                    {!embeddedMode && (
                        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Settings size={16} className="text-secondary" />
                                <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>EDITOR TIPS</span>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                The SkillSphereX engine uses Piston Runtime. Avoid blocking calls and long-running loops. Always include `console.log` or `print` to see output.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Compiler;
