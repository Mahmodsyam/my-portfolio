import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, 
  Briefcase, DollarSign, Calendar, FileText, 
  Paperclip, Download, Clock, Trash2, Send 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { requestsService } from '../../services/requestsService';

export default function AdminRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const res = await requestsService.getOne(id);
      setRequest(res.data || res);
      setNotes(res.data?.notes || res.notes || []);
    } catch (error) {
      console.error("Failed to load request", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      const newStatus = e.target.value;
      await requestsService.updateStatus(id, newStatus);
      setRequest(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handlePriorityChange = async (e) => {
    try {
      const newPriority = e.target.value;
      await requestsService.updatePriority(id, newPriority);
      setRequest(prev => ({ ...prev, priority: newPriority }));
    } catch (error) {
      console.error("Failed to update priority", error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      const res = await requestsService.addNote(id, noteText);
      setNotes(res.data?.notes || res.notes || []);
      setNoteText('');
      fetchRequestDetails();
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!request) return <div>Request not found</div>;

  const cardClass = `rounded-2xl border backdrop-blur-xl p-6 ${
    isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/80 border-slate-700/50'
  }`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/requests')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowLeft size={18} className={isRTL ? 'rotate-180' : ''} />
          {t.admin?.backToRequests || 'Back to Requests'}
        </button>
        <button className={`p-2 rounded-xl border transition-colors ${isLight ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-red-900/50 text-red-400 hover:bg-red-900/20'}`}>
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
            <h3 className={`text-lg font-display font-semibold mb-4 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <User size={20} className={isLight ? 'text-blue-500' : 'text-cyan-400'} />
              {t.admin?.clientInfo || 'Client Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Name</p>
                <p className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{request.clientName || request.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Email</p>
                <a href={`mailto:${request.clientEmail || request.email}`} className={`font-medium flex items-center gap-2 ${isLight ? 'text-blue-600' : 'text-cyan-400'} hover:underline`}>
                  <Mail size={14} /> {request.clientEmail || request.email || 'N/A'}
                </a>
              </div>
              <div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Phone</p>
                <a href={`tel:${request.clientPhone || request.phone}`} className={`font-medium flex items-center gap-2 ${isLight ? 'text-blue-600' : 'text-cyan-400'} hover:underline`}>
                  <Phone size={14} /> {request.clientPhone || request.phone || 'N/A'}
                </a>
              </div>
              <div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Location</p>
                <p className={`font-medium flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  <MapPin size={14} /> {request.clientLocation || request.country || 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cardClass}>
            <h3 className={`text-lg font-display font-semibold mb-4 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Briefcase size={20} className={isLight ? 'text-blue-500' : 'text-cyan-400'} />
              {t.admin?.projectInfo || 'Project Information'}
            </h3>
            <div className="space-y-4">
              <div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Project Name</p>
                <p className={`text-lg font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{request.projectName || request.project_name || 'Untitled'}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Type</p>
                  <p className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{t.admin?.typeLabels?.[request.projectType || request.project_type] || request.projectType || request.project_type || 'General'}</p>
                </div>
                <div>
                  <p className={`text-xs flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}><DollarSign size={14} /> Budget</p>
                  <p className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{t.admin?.budgetLabels?.[request.budget] || request.budget || 'Not specified'}</p>
                </div>
                <div>
                  <p className={`text-xs flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}><Calendar size={14} /> Deadline</p>
                  <p className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{request.deadline || 'Flexible'}</p>
                </div>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Description</p>
                <div className={`p-4 rounded-xl text-sm leading-relaxed ${isLight ? 'bg-slate-50 text-slate-700' : 'bg-slate-800/50 text-slate-300'}`}>
                  {request.description}
                </div>
              </div>
            </div>
          </motion.div>

          {request.attachments && request.attachments.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardClass}>
              <h3 className={`text-lg font-display font-semibold mb-4 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Paperclip size={20} className={isLight ? 'text-blue-500' : 'text-cyan-400'} />
                {t.admin?.attachments || 'Attachments'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {request.attachments.map((file, i) => (
                  <a 
                    key={i} 
                    href={file.url || `/uploads/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText size={18} className={isLight ? 'text-slate-400' : 'text-slate-500'} />
                      <span className={`text-sm truncate ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{file.originalname || file.filename}</span>
                    </div>
                    <Download size={16} className={isLight ? 'text-blue-500' : 'text-cyan-400'} />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardClass}>
            <h3 className={`text-lg font-display font-semibold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Status & Priority
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Status</label>
                <select 
                  value={request.status || 'new'}
                  onChange={handleStatusChange}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-100'
                  }`}
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Priority</label>
                <select 
                  value={request.priority || 'normal'}
                  onChange={handlePriorityChange}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-100'
                  }`}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/50'}`}>
                <p className={`text-xs flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Clock size={12} /> Created: {new Date(request.createdAt).toLocaleString()}
                </p>
                {request.updatedAt && (
                  <p className={`text-xs flex items-center gap-1 mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Clock size={12} /> Updated: {new Date(request.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={cardClass}>
            <h3 className={`text-lg font-display font-semibold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Private Notes
            </h3>
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
              {notes.length === 0 ? (
                <p className={`text-sm text-center py-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>No notes yet.</p>
              ) : (
                notes.map((note, i) => (
                  <div key={i} className={`p-3 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-slate-800/50'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{note.author || 'Admin'}</span>
                      <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{note.text}</p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleAddNote} className="relative">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a private note..."
                className={`w-full p-3 rounded-xl border outline-none resize-none text-sm ${
                  isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-100'
                }`}
                rows="3"
              />
              <button 
                type="submit"
                disabled={!noteText.trim()}
                className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-colors ${
                  !noteText.trim() ? 'opacity-50 cursor-not-allowed' : ''
                } ${isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
