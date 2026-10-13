import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { createProject, updateProject } from '../lib/api';

export default function ProjectModal({ isOpen, onClose, project, onSave }) {
  const [formData, setFormData] = useState({
    road_name: 'Muar By Pass',
    route_no: '',
    start_km: '',
    end_km: '',
    length_km: '',
    mix_category: '',
    construction_year: new Date().getFullYear().toString(),
    cost_rm: '',
    distress_1_type: 'None / Healthy (Tiada Kerosakan)',
    is_recurring: 'Tidak',
    lane_type: '',
    work_description: '',
    latitude: '',
    longitude: '',
    remarks: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      const start = parseFloat(project.start_km);
      const end = parseFloat(project.end_km);
      const calcLength = (!isNaN(start) && !isNaN(end)) ? Math.abs(end - start).toFixed(2) : '';

      setFormData({
        id: project.id,
        road_name: project.road_name || 'Muar By Pass',
        route_no: project.route_no || '',
        start_km: project.start_km !== undefined && project.start_km !== null ? project.start_km : '',
        end_km: project.end_km !== undefined && project.end_km !== null ? project.end_km : '',
        length_km: project.length_km || calcLength,
        mix_category: project.mix_category || '',
        construction_year: project.construction_year || '',
        cost_rm: project.cost_rm !== undefined && project.cost_rm !== null ? project.cost_rm : '',
        distress_1_type: project.distress_1_type || project.current_condition || 'None / Healthy (Tiada Kerosakan)',
        is_recurring: project.is_recurring || 'Tidak',
        lane_type: project.lane_type || '',
        work_description: project.work_description || '',
        latitude: project.latitude !== undefined && project.latitude !== null ? project.latitude : '',
        longitude: project.longitude !== undefined && project.longitude !== null ? project.longitude : '',
        remarks: project.remarks || ''
      });
    } else {
      setFormData({
        road_name: 'Muar By Pass',
        route_no: '',
        start_km: '',
        end_km: '',
        length_km: '',
        mix_category: '',
        construction_year: new Date().getFullYear().toString(),
        cost_rm: '',
        distress_1_type: 'None / Healthy (Tiada Kerosakan)',
        is_recurring: 'Tidak',
        lane_type: '',
        work_description: '',
        latitude: '',
        longitude: '',
        remarks: ''
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'start_km' || name === 'end_km') {
        const start = parseFloat(name === 'start_km' ? value : prev.start_km);
        const end = parseFloat(name === 'end_km' ? value : prev.end_km);
        if (!isNaN(start) && !isNaN(end)) {
          updated.length_km = Math.abs(end - start).toFixed(2);
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Auto calculate length if empty
    const start = parseFloat(formData.start_km);
    const end = parseFloat(formData.end_km);
    const calculatedLength = (!isNaN(start) && !isNaN(end)) ? Math.abs(end - start).toFixed(2) : '0.00';

    const payload = {
      ...formData,
      start_km: !isNaN(start) ? start : 0,
      end_km: !isNaN(end) ? end : 0,
      length_km: formData.length_km || calculatedLength,
      cost_rm: parseFloat(formData.cost_rm) || 0,
      construction_year: formData.construction_year ? parseInt(formData.construction_year, 10) : null,
      current_condition: formData.distress_1_type,
      latitude: formData.latitude !== '' && formData.latitude !== null ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude !== '' && formData.longitude !== null ? parseFloat(formData.longitude) : null
    };

    try {
      if (project) {
        await updateProject(payload);
        alert("Record successfully updated!");
      } else {
        await createProject(payload);
        alert("New record successfully added!");
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save project record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200/80 dark:border-slate-800">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {project ? 'Edit Road Record' : 'Add New Road Record'}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. ROAD NAME */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Road Name *
              </label>
              <input
                type="text"
                name="road_name"
                value={formData.road_name}
                onChange={handleChange}
                required
                list="road-name-list"
                placeholder="e.g. Muar By Pass"
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none"
              />
              <datalist id="road-name-list">
                <option value="Muar By Pass" />
                <option value="Yong Peng - Muar" />
                <option value="Johor Bahru - Melaka" />
                <option value="Jalan Parit Yusof" />
              </datalist>
            </div>

            {/* 2. ROUTE NO */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Route No.
              </label>
              <input 
                type="text" 
                name="route_no" 
                value={formData.route_no} 
                onChange={handleChange} 
                placeholder="e.g. FT 0224" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none" 
              />
            </div>

            {/* 3. KM FROM & KM TO */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                KM From (Dari KM) *
              </label>
              <input 
                type="number" 
                step="0.001" 
                name="start_km" 
                value={formData.start_km} 
                onChange={handleChange} 
                required 
                placeholder="0.000" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                KM To (Ke KM) *
              </label>
              <input 
                type="number" 
                step="0.001" 
                name="end_km" 
                value={formData.end_km} 
                onChange={handleChange} 
                required 
                placeholder="1.000" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none" 
              />
            </div>

            {/* 4. LENGTH (KM) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Length (KM)
              </label>
              <input 
                type="text" 
                name="length_km" 
                value={formData.length_km} 
                onChange={handleChange} 
                placeholder="Calculated automatically (e.g. 1.0)" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none font-mono" 
              />
            </div>

            {/* 5. PAVEMENT MIX */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Pavement Mix *
              </label>
              <select 
                name="mix_category" 
                value={formData.mix_category} 
                onChange={handleChange} 
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none"
              >
                <option value="">-- Select Pavement Mix --</option>
                <option value="SFM">SFM</option>
                <option value="CMA">CMA</option>
                <option value="CRMA">CRMA</option>
                <option value="LATEX">LATEX</option>
                <option value="AC">AC</option>
              </select>
            </div>

            {/* 6. CONSTRUCTION YEAR */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Construction Year
              </label>
              <input 
                type="number" 
                min="1990" 
                max="2100"
                name="construction_year" 
                value={formData.construction_year} 
                onChange={handleChange} 
                placeholder="e.g. 2022" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none font-mono" 
              />
            </div>


            {/* 7. INITIAL COST (RM) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Initial Cost (RM)
              </label>
              <input 
                type="number" 
                step="0.01" 
                name="cost_rm" 
                value={formData.cost_rm} 
                onChange={handleChange} 
                placeholder="0.00" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none font-mono" 
              />
            </div>

            {/* 8. CURRENT CONDITION */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Current Condition
              </label>
              <select 
                name="distress_1_type" 
                value={formData.distress_1_type} 
                onChange={handleChange} 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none"
              >
                <option value="None / Healthy (Tiada Kerosakan)">Good / Healthy (Tiada Kerosakan)</option>
                <option value="Fair">Fair (Sederhana)</option>
                <option value="Poor">Poor (Teruk)</option>
                <option value="Pothole">Pothole (Lubang)</option>
                <option value="Crack">Crack (Retak)</option>
                <option value="Pothole & Crack">Pothole & Crack (Lubang & Retak)</option>
                <option value="Shoving">Shoving (Anjakan / Engsutan Premix)</option>
                <option value="Corrugation">Corrugation (Gelombang Premix)</option>
                <option value="Rutting">Rutting (Aluran Roda)</option>
                <option value="Bleeding">Bleeding (Penyerapan Tar)</option>
                <option value="Ravelling">Ravelling (Pelepasan Agregat)</option>
                <option value="Depression">Depression (Mendakan)</option>
                <option value="Edge Failure">Edge Failure (Kerosakan Tepi Jalan)</option>
              </select>
            </div>

            {/* 9. RECURRING DAMAGE (YES/NO) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Recurring Damage (Yes / No)
              </label>
              <select 
                name="is_recurring" 
                value={formData.is_recurring} 
                onChange={handleChange} 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none"
              >
                <option value="Tidak">No (Tidak)</option>
                <option value="Ya">Yes (Ya)</option>
              </select>
            </div>

            {/* 10. LANE / DIRECTION */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Lane / Direction
              </label>
              <input 
                type="text" 
                name="lane_type" 
                value={formData.lane_type} 
                onChange={handleChange} 
                placeholder="e.g. LHS, RHS, L&R" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none" 
              />
            </div>

            {/* 11. WORK DESCRIPTION / YEARS PROGRAM */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Work Description / Years Program
              </label>
              <input 
                type="text" 
                name="work_description" 
                value={formData.work_description} 
                onChange={handleChange} 
                placeholder="e.g. 2022 - FASA 2" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none" 
              />
            </div>

            {/* 12. LATITUDE */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Latitude
              </label>
              <input 
                type="number" 
                step="0.00000001" 
                name="latitude" 
                value={formData.latitude} 
                onChange={handleChange} 
                placeholder="e.g. 2.0305" 
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none font-mono" 
              />
            </div>

            {/* REMARKS */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks or additional notes..."
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm outline-none resize-y min-h-[80px]"
              />
            </div>

          </div>
          
          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-5 py-2.5 font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-all shadow-md shadow-cyan-500/20 disabled:opacity-70 text-sm"
            >
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}

