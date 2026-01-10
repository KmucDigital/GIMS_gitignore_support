import React, { useState, useEffect } from 'react';
import {
    Home, Users, Bug, AlertTriangle, MessageSquare,
    Newspaper, Server, Shield, Menu, X, Plus, Edit,
    Trash2, Eye, LogOut, Search, ChevronRight
} from 'lucide-react';

const API_BASE = '/api';

export default function GamingBlockDashboard() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    // Data states
    const [users, setUsers] = useState([]);
    const [bugs, setBugs] = useState([]);
    const [reports, setReports] = useState([]);
    const [messages, setMessages] = useState([]);
    const [news, setNews] = useState([]);
    const [servers, setServers] = useState([]);
    const [suspections, setSuspections] = useState([]);

    // Form states
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [newBug, setNewBug] = useState({ name: '', content: '' });
    const [newReport, setNewReport] = useState({ player: '', content: '' });
    const [newMessage, setNewMessage] = useState({ msg: '' });
    const [newNews, setNewNews] = useState({ title: '', content: '', level: 1 });
    const [newSuspection, setNewSuspection] = useState({ title: '', description: '', subject: '' });

    // Edit states
    const [editingNews, setEditingNews] = useState(null);
    const [editingReport, setEditingReport] = useState(null);
    const [editingSuspection, setEditingSuspection] = useState(null);

    const fetchWithAuth = async (endpoint, options = {}) => {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });
        return response.json();
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/staff/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(loginForm),
            });
            const data = await response.json();
            if (data.main?.accessToken) {
                setToken(data.main.accessToken);
                localStorage.setItem('token', data.main.accessToken);
            }
        } catch (err) {
            console.error('Login failed:', err);
        }
        setLoading(false);
    };

    const loadData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [usersRes, bugsRes, reportsRes, messagesRes, newsRes, serversRes, suspectionsRes] = await Promise.all([
                fetchWithAuth('/staff/users/get'),
                fetchWithAuth('/bugs/get'),
                fetchWithAuth('/reports/get'),
                fetchWithAuth('/msg/get'),
                fetchWithAuth('/news/get'),
                fetchWithAuth('/servers/get'),
                fetchWithAuth('/suspections/get'),
            ]);

            setUsers(usersRes.data || []);
            setBugs(bugsRes.data || []);
            setReports(reportsRes.data || []);
            setMessages(messagesRes.data || []);
            setNews(newsRes.data || []);
            setServers(serversRes.data || []);
            setSuspections(suspectionsRes.data || []);
        } catch (err) {
            console.error('Failed to load data:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) loadData();
    }, [token]);

    const createBug = async () => {
        await fetchWithAuth('/bugs/create', {
            method: 'POST',
            body: JSON.stringify(newBug),
        });
        setNewBug({ name: '', content: '' });
        loadData();
    };

    const deleteBug = async (name) => {
        await fetchWithAuth('/bugs/delete', {
            method: 'DELETE',
            body: JSON.stringify({ name }),
        });
        loadData();
    };

    const createReport = async () => {
        await fetchWithAuth('/reports/create', {
            method: 'POST',
            body: JSON.stringify(newReport),
        });
        setNewReport({ player: '', content: '' });
        loadData();
    };

    const sendMessage = async () => {
        await fetchWithAuth('/msg/send', {
            method: 'POST',
            body: JSON.stringify(newMessage),
        });
        setNewMessage({ msg: '' });
        loadData();
    };

    const createNews = async () => {
        await fetchWithAuth('/news/write', {
            method: 'POST',
            body: JSON.stringify(newNews),
        });
        setNewNews({ title: '', content: '', level: 1 });
        loadData();
    };

    const createSuspection = async () => {
        await fetchWithAuth('/suspections/create', {
            method: 'POST',
            body: JSON.stringify(newSuspection),
        });
        setNewSuspection({ title: '', description: '', subject: '' });
        loadData();
    };

    const deleteReport = async (id) => {
        await fetchWithAuth('/reports/delete', {
            method: 'DELETE',
            body: JSON.stringify({ player: id }),
        });
        loadData();
    };

    const deleteNews = async (id) => {
        await fetchWithAuth('/news/delete', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
        loadData();
    };

    const deleteMsg = async (id) => {
        await fetchWithAuth('/msg/delete', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
        loadData();
    };

    const deleteSuspection = async (id) => {
        await fetchWithAuth('/suspections/delete', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
        loadData();
    };

    const updateNews = async () => {
        if (!editingNews) return;
        await fetchWithAuth('/news/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: editingNews.id,
                title: editingNews.title,
                content: editingNews.content,
                level: editingNews.level,
            }),
        });
        setEditingNews(null);
        loadData();
    };

    const updateReport = async () => {
        if (!editingReport) return;
        await fetchWithAuth('/reports/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: editingReport.id,
                player: editingReport.player,
                content: editingReport.content,
            }),
        });
        setEditingReport(null);
        loadData();
    };

    const updateSuspection = async () => {
        if (!editingSuspection) return;
        await fetchWithAuth('/suspections/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: editingSuspection.id,
                title: editingSuspection.title,
                description: editingSuspection.description,
                subject: editingSuspection.subject,
            }),
        });
        setEditingSuspection(null);
        loadData();
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700 animate-fade-in">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">GamingBlock</h1>
                        <p className="text-gray-400">Staff Dashboard</p>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                placeholder="Enter password"
                            />
                        </div>
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition transform hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'bugs', label: 'Bugs', icon: Bug },
        { id: 'reports', label: 'Reports', icon: AlertTriangle },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'news', label: 'News', icon: Newspaper },
        { id: 'servers', label: 'Servers', icon: Server },
        { id: 'suspections', label: 'Suspections', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex">
            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
      `}</style>

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    {sidebarOpen && <h2 className="text-xl font-bold text-white">GamingBlock</h2>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-700 rounded-lg transition">
                        {sidebarOpen ? <X className="text-white" size={20} /> : <Menu className="text-white" size={20} />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                    activeTab === item.id
                                        ? 'bg-green-500 text-white shadow-lg'
                                        : 'text-white hover:bg-gray-700'
                                }`}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <button
                    onClick={() => {
                        setToken('');
                        localStorage.removeItem('token');
                    }}
                    className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 transition"
                >
                    <LogOut size={20} />
                    {sidebarOpen && <span>Logout</span>}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        {menuItems.find(item => item.id === activeTab)?.label}
                        <ChevronRight className="text-gray-600" size={24} />
                    </h1>

                    {/* Dashboard */}
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg card-hover cursor-pointer">
                                <Users size={32} className="mb-4 opacity-80" />
                                <h3 className="text-4xl font-bold mb-2">{users.length}</h3>
                                <p className="text-blue-100">Total Users</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg card-hover cursor-pointer">
                                <Bug size={32} className="mb-4 opacity-80" />
                                <h3 className="text-4xl font-bold mb-2">{bugs.length}</h3>
                                <p className="text-red-100">Active Bugs</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg card-hover cursor-pointer">
                                <AlertTriangle size={32} className="mb-4 opacity-80" />
                                <h3 className="text-4xl font-bold mb-2">{reports.length}</h3>
                                <p className="text-yellow-100">Reports</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg card-hover cursor-pointer">
                                <Server size={32} className="mb-4 opacity-80" />
                                <h3 className="text-4xl font-bold mb-2">{servers.length}</h3>
                                <p className="text-green-100">Servers</p>
                            </div>
                        </div>
                    )}

                    {/* Users */}
                    {activeTab === 'users' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid gap-4">
                                {users.map((user, i) => (
                                    <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg card-hover">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                                <p className="text-gray-400 text-sm">IGN: {user.ign}</p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                user.permissions === 'admin'
                                                    ? 'bg-purple-500/20 text-purple-300'
                                                    : 'bg-blue-500/20 text-blue-300'
                                            }`}>
                        {user.permissions}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bugs */}
                    {activeTab === 'bugs' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4">Report New Bug</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Bug name"
                                        value={newBug.name}
                                        onChange={(e) => setNewBug({ ...newBug, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                    <textarea
                                        placeholder="Bug description"
                                        value={newBug.content}
                                        onChange={(e) => setNewBug({ ...newBug, content: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                                    />
                                    <button onClick={createBug} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition">
                                        <Plus size={20} className="inline mr-2" />
                                        Create Bug Report
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {bugs.map((bug) => (
                                    <div key={bug.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg card-hover">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-2">{bug.name}</h3>
                                                <p className="text-gray-400 mb-3">{bug.content}</p>
                                                {bug.date && <p className="text-sm text-gray-500">{new Date(bug.date).toLocaleString()}</p>}
                                            </div>
                                            <button
                                                onClick={() => deleteBug(bug.name)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-lg transition"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reports */}
                    {activeTab === 'reports' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4">Create New Report</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Player name"
                                        value={newReport.player}
                                        onChange={(e) => setNewReport({ ...newReport, player: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                    <textarea
                                        placeholder="Report content"
                                        value={newReport.content}
                                        onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                                    />
                                    <button onClick={createReport} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition">
                                        <Plus size={20} className="inline mr-2" />
                                        Submit Report
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {reports.map((report) => (
                                    <div key={report.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg card-hover">
                                        {editingReport?.id === report.id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={editingReport.player}
                                                    onChange={(e) => setEditingReport({ ...editingReport, player: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                                    placeholder="Player name"
                                                />
                                                <textarea
                                                    value={editingReport.content}
                                                    onChange={(e) => setEditingReport({ ...editingReport, content: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                                                    placeholder="Report content"
                                                />
                                                <div className="flex gap-3">
                                                    <button onClick={updateReport} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                                                        Save
                                                    </button>
                                                    <button onClick={() => setEditingReport(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-xl font-bold text-white">Player: {report.player}</h3>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setEditingReport(report)}
                                                            className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteReport(report.player)}
                                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-400">{report.content}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {activeTab === 'messages' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Chat Container */}
                            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col" style={{ height: '600px' }}>
                                {/* Chat Header */}
                                <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                                    <h3 className="text-xl font-bold text-white">Staff Chat</h3>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="text-center text-gray-500 mt-8">
                                            <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, i) => (
                                            <div key={msg.id || i} className="flex gap-3 animate-fade-in">
                                                {/* Avatar */}
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {(msg.sender || 'U')[0].toUpperCase()}
                                                </div>
                                                {/* Message Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <span className="text-white font-semibold">{msg.sender || 'Unknown User'}</span>
                                                        <span className="text-xs text-gray-500">{msg.date ? new Date(msg.date).toLocaleString() : 'Just now'}</span>
                                                    </div>
                                                    <div className="bg-gray-700 rounded-lg rounded-tl-none px-4 py-2 flex items-center justify-between">
                                                        <p className="text-gray-200 flex-1">{msg.content || '(empty message)'}</p>
                                                        <button
                                                            onClick={() => deleteMsg(msg.id)}
                                                            className="text-red-400 hover:text-red-300 ml-3 p-1 hover:bg-gray-600 rounded transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="bg-gray-900 px-6 py-4 border-t border-gray-700">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Type your message..."
                                            value={newMessage.msg}
                                            onChange={(e) => setNewMessage({ msg: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && newMessage.msg.trim() && sendMessage()}
                                            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!newMessage.msg.trim()}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* News */}
                    {activeTab === 'news' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4">Create News</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="News title"
                                        value={newNews.title}
                                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                    <textarea
                                        placeholder="News content"
                                        value={newNews.content}
                                        onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
                                    />
                                    <select
                                        value={newNews.level}
                                        onChange={(e) => setNewNews({ ...newNews, level: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    >
                                        {[1, 2, 3, 4, 5].map(level => (
                                            <option key={level} value={level}>Level {level}</option>
                                        ))}
                                    </select>
                                    <button onClick={createNews} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition">
                                        <Plus size={20} className="inline mr-2" />
                                        Publish News
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {news.map((item) => (
                                    <div key={item.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg card-hover">
                                        {editingNews?.id === item.id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={editingNews.title}
                                                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                                    placeholder="News title"
                                                />
                                                <textarea
                                                    value={editingNews.content}
                                                    onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
                                                    placeholder="News content"
                                                />
                                                <select
                                                    value={editingNews.level}
                                                    onChange={(e) => setEditingNews({ ...editingNews, level: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                                >
                                                    {[1, 2, 3, 4, 5].map(level => (
                                                        <option key={level} value={level}>Level {level}</option>
                                                    ))}
                                                </select>
                                                <div className="flex gap-3">
                                                    <button onClick={updateNews} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                                                        Save
                                                    </button>
                                                    <button onClick={() => setEditingNews(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                                    <div className="flex items-center gap-2">
                            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                              Level {item.level}
                            </span>
                                                        <button
                                                            onClick={() => setEditingNews({ id: item.id, title: item.title, content: item.msg, level: item.level })}
                                                            className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteNews(item.id)}
                                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 mb-3">{item.msg}</p>
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <span>By {item.author}</span>
                                                    <span>{new Date(item.creation).toLocaleDateString()}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Servers */}
                    {activeTab === 'servers' && (
                        <div className="grid gap-4 animate-fade-in">
                            {servers.length === 0 ? (
                                <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                                    <Server size={48} className="mx-auto mb-4 text-gray-600" />
                                    <p className="text-gray-400">No servers found</p>
                                </div>
                            ) : (
                                servers.map((server, i) => (
                                    <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg card-hover">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{server.server_name}</h3>
                                                <p className="text-sm text-gray-500 font-mono">{server.server_id}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                server.auto_start
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                        {server.auto_start ? 'Auto-start' : 'Manual'}
                      </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">Type</p>
                                                <p className="font-semibold text-white capitalize">{server.type.replace('minecraft-', '')}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">Port</p>
                                                <p className="font-semibold text-white font-mono">{server.server_port}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">Executable</p>
                                                <p className="font-semibold text-white text-sm truncate">{server.executable}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">Created</p>
                                                <p className="font-semibold text-white text-sm">{new Date(server.created).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <p className="text-sm text-gray-400 mb-2">Execution Command:</p>
                                            <code className="text-xs bg-gray-900 text-green-400 px-3 py-2 rounded block overflow-x-auto">
                                                {server.execution_command}
                                            </code>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Suspections */}
                    {activeTab === 'suspections' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4">Create Suspection</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={newSuspection.title}
                                        onChange={(e) => setNewSuspection({ ...newSuspection, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        value={newSuspection.subject}
                                        onChange={(e) => setNewSuspection({ ...newSuspection, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newSuspection.description}
                                        onChange={(e) => setNewSuspection({ ...newSuspection, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                                    />
                                    <button onClick={createSuspection} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition">
                                        <Plus size={20} className="inline mr-2" />
                                        Create Suspection
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {suspections.map((sus) => (
                                    <div key={sus.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg card-hover">
                                        {editingSuspection?.id === sus.id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={editingSuspection.title}
                                                    onChange={(e) => setEditingSuspection({ ...editingSuspection, title: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                                    placeholder="Title"
                                                />
                                                <input
                                                    type="text"
                                                    value={editingSuspection.subject}
                                                    onChange={(e) => setEditingSuspection({ ...editingSuspection, subject: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                                    placeholder="Subject"
                                                />
                                                <textarea
                                                    value={editingSuspection.description}
                                                    onChange={(e) => setEditingSuspection({ ...editingSuspection, description: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                                                    placeholder="Description"
                                                />
                                                <div className="flex gap-3">
                                                    <button onClick={updateSuspection} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                                                        Save
                                                    </button>
                                                    <button onClick={() => setEditingSuspection(null)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-white">{sus.title}</h3>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setEditingSuspection(sus)}
                                                            className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteSuspection(sus.id)}
                                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 mb-2">Subject: {sus.subject}</p>
                                                <p className="text-gray-300">{sus.description}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}