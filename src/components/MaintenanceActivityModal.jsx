import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Edit2, Trash2, Calendar, FileText } from 'lucide-react';
import MaintenanceActivityEditModal from './MaintenanceActivityEditModal';

const DEFAULT_ACTIVITIES = [
  {
    id: '1',
    year: '2024',
    maintenance_activity: 'Mill & Pave 50mm Bituminous Wearing Course (SFM)',
    distress: 'Pothole & Longitudinal Crack (Lubang & Retak)',
    cost_rm: 120000.00,
    condition_after: 'Good',
    status: 'Completed'
  },
  {
    id: '2',
    year: '2026',
    maintenance_activity: 'Crack Sealing & Localized Patching',
    distress: 'Transverse Cracking',
    cost_rm: 45000.00,
    condition_after: 'Good',
    status: 'Scheduled'
  },
  {
    id: '3',
    year: '2029',
    maintenance_activity: 'Preventive Resurfacing & Overlay',
    distress: 'Surface Wear & Minor Rutting',
    cost_rm: 85000.00,
    condition_after: 'Good',
    status: 'Scheduled'
  }
];

export default function MaintenanceActivityModal({ isOpen, onClose, title = "Maintenance Activity" }) {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('muar_maintenance_activities_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_ACTIVITIES;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    localStorage.setItem('muar_maintenance_activities_data', JSON.stringify(activities));
  }, [activities]);

  if (!isOpen) return null;

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return 'RM 0.00';
    return `RM ${parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleSaveRow = (rowObj) => {
    if (rowObj.id) {
      setActivities(prev => prev.map(r => r.id === rowObj.id ? rowObj : r));
    } else {
      setActivities(prev => [...prev, { ...rowObj, id: Date.now().toString() }]);
    }
  };

  const handleDeleteRow = (id) => {
    if (window.confirm("Are you sure you want to delete this maintenance activity row?")) {
      setActivities(prev => prev.filter(r => r.id !== id));
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {title}
              </h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Control Bar inside Modal */}
        <div className="font-noto-sans px-6 py-4 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600 dark:text-slate-400">
            <span>Total Scheduled Activities: <strong className="text-slate-900 dark:text-white">{activities.length}</strong></span>
          </div>

          <button
            onClick={() => {
              setEditingRow(null);
              setIsEditModalOpen(true);
            }}
            className="font-noto-sans flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-[13px] rounded-xl shadow-md shadow-cyan-500/20 transition-all shrink-0"
          >
            <Plus size={18} />
            Add Activity
          </button>
        </div>

        {/* Modal Scrollable Table Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <table className="font-noto-sans w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950 text-[13px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-20">
                  <th className="px-4 py-3.5 w-24">YEAR</th>
                  <th className="px-4 py-3.5 min-w-[220px]">MAINTENANCE ACTIVITY</th>
                  <th className="px-4 py-3.5 min-w-[180px]">DISTRESS</th>
                  <th className="px-4 py-3.5 min-w-[140px]">COST (RM)</th>
                  <th className="px-4 py-3.5 text-center min-w-[130px]">CONDITION AFTER</th>
                  <th className="px-4 py-3.5 text-center min-w-[120px]">STATUS</th>
                  <th className="px-4 py-3.5 text-right sticky right-0 bg-slate-100 dark:bg-slate-950 min-w-[90px] border-l border-slate-200 dark:border-slate-800">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-[15px]">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-slate-400 font-medium">
                      No maintenance activity records found. Click "+ Add Activity" to add one.
                    </td>
                  </tr>
                ) : (
                  activities.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.year}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {item.maintenance_activity}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 text-xs">
                        {item.distress || '-'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {formatCurrency(item.cost_rm)}
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          item.condition_after === 'Good' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                          item.condition_after === 'Fair' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}>
                          {item.condition_after || 'Good'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                          item.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                          'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                        }`}>
                          {item.status || 'Scheduled'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right sticky right-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingRow(item);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950/50 rounded-lg transition-colors"
                            title="Edit Activity"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(item.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                            title="Delete Activity"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex justify-end items-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            Close
          </button>
        </div>

      </div>

      <MaintenanceActivityEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        activity={editingRow}
        onSave={handleSaveRow}
      />
    </div>,
    document.body
  );
}
