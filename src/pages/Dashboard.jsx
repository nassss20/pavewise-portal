import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Map as MapIcon, Edit2, Trash2, Sparkles, FileSpreadsheet, Calendar } from 'lucide-react';
import { fetchProjects, fetchLccaResults, deleteProject } from '../lib/api';
import ProjectModal from '../components/ProjectModal';
import LccaDetailModal from '../components/LccaDetailModal';
import MaintenanceActivityEditModal from '../components/MaintenanceActivityEditModal';
import MaintenanceActivityModal from '../components/MaintenanceActivityModal';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [lccaResults, setLccaResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registry');

  // LCCA Detail Modal State
  const [selectedLccaAlternative, setSelectedLccaAlternative] = useState(null);
  const [isLccaModalOpen, setIsLccaModalOpen] = useState(false);
  const [isMaintPopUpModalOpen, setIsMaintPopUpModalOpen] = useState(false);

  // Maintenance Activity State
  const [maintenanceActivities, setMaintenanceActivities] = useState(() => {
    const saved = localStorage.getItem('muar_maintenance_activities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        year: '2024',
        maintenance_activity: 'Mill & Pave 50mm Bituminous Wearing Course (SFM)',
        distress: 'Pothole & Longitudinal Crack (Lubang & Retak)',
        cost_rm: 120000.00,
        condition_after: 'Good',
        status: 'Completed'
      },
      {
        id: 2,
        year: '2026',
        maintenance_activity: 'Crack Sealing & Localized Patching',
        distress: 'Transverse Cracking',
        cost_rm: 45000.00,
        condition_after: 'Good',
        status: 'Scheduled'
      }
    ];
  });

  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [editingMaintActivity, setEditingMaintActivity] = useState(null);

  useEffect(() => {
    localStorage.setItem('muar_maintenance_activities', JSON.stringify(maintenanceActivities));
  }, [maintenanceActivities]);

  const handleSaveMaintActivity = (activityData) => {
    if (activityData.id) {
      setMaintenanceActivities(prev => prev.map(a => a.id === activityData.id ? activityData : a));
    } else {
      const newActivity = { ...activityData, id: Date.now() };
      setMaintenanceActivities(prev => [...prev, newActivity]);
    }
  };

  const handleDeleteMaintActivity = (id) => {
    if (window.confirm("Are you sure you want to delete this maintenance activity entry?")) {
      setMaintenanceActivities(prev => prev.filter(a => a.id !== id));
    }
  };



  // Filters
  const [search, setSearch] = useState('');
  const [filterRoad, setFilterRoad] = useState('');
  const [filterMix, setFilterMix] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const projData = await fetchProjects();
      setProjects(projData);

      const lccaData = await fetchLccaResults();
      setLccaResults(lccaData);
    } catch (err) {
      console.error("Failed to load data:", err);
      alert("Failed to load data from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this road project record?")) return;
    try {
      await deleteProject(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const filteredProjects = projects.filter(p => {
    const matchSearch = !search ||
      (p.road_name?.toLowerCase().includes(search.toLowerCase())) ||
      (p.mix_category?.toLowerCase().includes(search.toLowerCase())) ||
      (p.pavement_alternative?.toLowerCase().includes(search.toLowerCase())) ||
      (p.route_no?.toLowerCase().includes(search.toLowerCase()));

    const matchRoad = !filterRoad || p.road_name === filterRoad;
    const matchMix = !filterMix || p.mix_category === filterMix;

    return matchSearch && matchRoad && matchMix;
  });

  // Calculate Metrics
  const totalKm = projects.reduce((acc, p) => acc + (Math.abs((parseFloat(p.end_km) || 0) - (parseFloat(p.start_km) || 0))), 0);
  const totalCost = projects.reduce((acc, p) => acc + (parseFloat(p.cost_rm) || 0), 0);
  const totalMaintCost = projects.reduce((acc, p) => acc + (parseFloat(p.maintenance_cost) || 0), 0);
  const recurringDistressCount = projects.filter(p => p.is_recurring === 'Ya').length;
  const topAlternative = lccaResults.length > 0 ? lccaResults[0] : null;

  const getMixColorClasses = (mix) => {
    switch (mix?.toUpperCase()) {
      case 'SFM':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'CMA':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'CRMA':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30';
      case 'LATEX':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
      case 'AC':
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/25 border border-cyan-400/20 hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm"
        >
          <Plus size={19} className="stroke-[2.5]" />
          Add New Road Record
        </button>
      </div>



      {/* ArcGIS Map Embedded */}
      <div className="glass-panel rounded-2xl shadow-xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <MapIcon size={18} />
            </div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">GIS Road Layer Visualization</h2>
          </div>
        </div>
        <div className="h-[550px] w-full relative">
          <iframe
            src="https://geouitm.maps.arcgis.com/apps/dashboards/a39283d010a0452ca27094d5cd3caffa#"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            title="ArcGIS Dashboard"
          />
        </div>
      </div>

      {/* Data Section */}
      <div className="glass-panel rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">

        {/* Tabs and Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 flex flex-col lg:flex-row justify-between gap-4 items-stretch lg:items-center">
          <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl self-start overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('registry')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'registry' ? 'bg-white dark:bg-slate-700 shadow-md text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Road Project Registry
            </button>
            <button
              onClick={() => setActiveTab('lcca')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'lcca' ? 'bg-white dark:bg-slate-700 shadow-md text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Life Cycle Cost Analysis (LCCA)
            </button>
            <button
              onClick={() => setIsMaintPopUpModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
            >
              Maintenance Activity
            </button>
          </div>

          {activeTab === 'registry' && (
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none w-full sm:w-64 transition-all"
                />
              </div>
              <select
                value={filterRoad}
                onChange={e => setFilterRoad(e.target.value)}
                className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
              >
                <option value="">All Roads</option>
                <option value="Muar By Pass">Muar Bypass (FT0224)</option>
                <option value="Yong Peng - Muar">Yong Peng - Muar (FT0024)</option>
                <option value="Johor Bahru - Melaka">JB - Melaka (FT0005)</option>
                <option value="Jalan Parit Yusof">Jalan Parit Yusof</option>
              </select>
              <select
                value={filterMix}
                onChange={e => setFilterMix(e.target.value)}
                className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
              >
                <option value="">All Mixes</option>
                <option value="SFM">SFM</option>
                <option value="CMA">CMA</option>
                <option value="CRMA">CRMA</option>
                <option value="LATEX">LATEX</option>
                <option value="AC">AC</option>
              </select>
            </div>
          )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] relative">
          {activeTab === 'registry' ? (
              <table className="w-full min-w-[1300px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider sticky top-0 z-20 shadow-xs">
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 w-12 text-center">No.</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[170px]">Road Name</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[100px]">Route No</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[90px]">Dari (KM)</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[90px]">Ke (KM)</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[100px]">Length</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[130px] text-center">Pavement Mix</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[160px]">Work Type</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[140px]">Initial Cost</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[180px]">Current Condition</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[120px]">Recurring</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 min-w-[100px]">Lane</th>
                  <th className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900 text-right sticky right-0 z-30 min-w-[100px] border-l border-slate-200 dark:border-slate-800">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-sm">
                {loading ? (
                  <tr><td colSpan="13" className="px-4 py-12 text-center text-slate-400">Loading road network registry...</td></tr>
                ) : filteredProjects.length === 0 ? (
                  <tr><td colSpan="13" className="px-4 py-12 text-center text-slate-400">No project records found.</td></tr>
                ) : (
                  filteredProjects.map((p, index) => {
                    const calculatedLength = p.length_km || (p.start_km !== undefined && p.end_km !== undefined ? Math.abs((parseFloat(p.end_km) || 0) - (parseFloat(p.start_km) || 0)).toFixed(2) : '-');
                    return (
                      <tr key={p.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 text-slate-400 text-xs font-mono text-center font-bold">{index + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">{p.road_name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-xs font-medium font-mono text-slate-700 dark:text-slate-300">{p.route_no || '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">{p.start_km}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">{p.end_km}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">{calculatedLength} km</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getMixColorClasses(p.mix_category)}`}>
                            {p.mix_category || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium text-xs whitespace-nowrap">{p.pavement_alternative || p.work_type || '-'}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-semibold text-xs whitespace-nowrap">RM {p.cost_rm?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">{p.distress_1_type || p.current_condition || '-'}</td>
                        <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
                          {p.is_recurring === 'Ya' || p.is_recurring === 'Yes' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              Yes (Ya)
                            </span>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400">
                              No (Tidak)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs font-mono whitespace-nowrap">{p.lane_type || '-'}</td>
                        <td className="px-4 py-3 text-right sticky right-0 z-10 bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setIsMaintPopUpModalOpen(true)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Maintenance Activity Pop-Up"
                            >
                              <Calendar size={16} />
                            </button>
                            <button onClick={() => handleEdit(p)} className="p-1.5 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950/50 rounded-lg transition-colors" title="Edit Record">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 rounded-lg transition-colors" title="Delete Record">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider sticky top-0 z-10 shadow-sm backdrop-blur-md">
                  <th className="px-4 py-3.5">Rank</th>
                  <th className="px-4 py-3.5">Pavement Alternative</th>
                  <th className="px-4 py-3.5">Avg Initial Cost</th>
                  <th className="px-4 py-3.5">Total Maintenance</th>
                  <th className="px-4 py-3.5">Ratio</th>
                  <th className="px-4 py-3.5">NPV Cost (4%)</th>
                  <th className="px-4 py-3.5">Distress Level</th>
                  <th className="px-4 py-3.5">Recommendation</th>
                  <th className="px-4 py-3.5 text-center">20-Year Maintenance Schedule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-sm">
                {loading ? (
                  <tr><td colSpan="9" className="px-4 py-12 text-center text-slate-400">Loading LCCA calculations...</td></tr>
                ) : lccaResults.length === 0 ? (
                  <tr><td colSpan="9" className="px-4 py-12 text-center text-slate-400">No LCCA evaluation data found.</td></tr>
                ) : (
                  lccaResults.map((r, i) => (
                    <tr key={i} className={`transition-colors ${r.alternative === 'SFM' ? 'bg-cyan-500/10 dark:bg-cyan-950/30 hover:bg-cyan-500/15 border-l-4 border-cyan-500' : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border-l-4 border-transparent'}`}>
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {r.ranking === 1 ? (
                          <span className="inline-flex items-center gap-1 text-amber-500 font-extrabold">
                            <Sparkles size={14} /> #{r.ranking}
                          </span>
                        ) : `#${r.ranking}`}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{r.alternative}</td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">RM {r.initial_cost?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">RM {r.maintenance_cost?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">{r.cost_ratio}</td>
                      <td className="px-4 py-3.5 font-extrabold text-cyan-600 dark:text-cyan-400 font-mono text-xs whitespace-nowrap">RM {r.npv?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 min-w-[140px] text-xs">{r.distress_level}</td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 min-w-[220px] text-xs leading-relaxed">{r.remark}</td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedLccaAlternative(r.alternative);
                            setIsLccaModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs"
                          title="View 20-Year LCCA Schedule Breakdown Spreadsheet"
                        >
                          <FileSpreadsheet size={14} />
                          20-Yr Schedule
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Sensitivity Analysis Section */}
            <div className="mt-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-500" />
                Sensitivity Analysis (NPV)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                      <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-700">Asphalt Mix Alternatives</th>
                      <th className="px-4 py-3.5 text-center bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">NPV (3%)</th>
                      <th className="px-4 py-3.5 text-center bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">NPV (4%)</th>
                      <th className="px-4 py-3.5 text-center bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">NPV (5%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-sm">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">SFM</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,086,399.27</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,070,914.94</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,057,815.89</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-emerald-500/5 dark:bg-emerald-500/5">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">
                        CRMA <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-normal bg-emerald-500/10 px-1.5 py-0.5 rounded">*most cost-effective</span>
                      </td>
                      <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400 font-mono font-semibold text-xs text-center">RM 1,031,307.60</td>
                      <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400 font-mono font-semibold text-xs text-center">RM 1,023,616.00</td>
                      <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400 font-mono font-semibold text-xs text-center">RM 1,005,199.68</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">LATEX</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,161,471.46</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,136,719.39</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,115,038.44</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">CMA</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,099,957.04</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,081,995.58</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs text-center">RM 1,065,997.80</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-rose-500/5 dark:bg-rose-500/5">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">
                        AC <span className="inline-block mt-1 text-[10px] text-rose-600 dark:text-rose-400 font-normal bg-rose-500/10 px-1.5 py-0.5 rounded">*most uneconomical</span>
                      </td>
                      <td className="px-4 py-3 text-rose-700 dark:text-rose-400 font-mono font-semibold text-xs text-center">RM 1,286,460.54</td>
                      <td className="px-4 py-3 text-rose-700 dark:text-rose-400 font-mono font-semibold text-xs text-center">RM 1,263,978.72</td>
                      <td className="px-4 py-3 text-rose-700 dark:text-rose-400 font-mono font-semibold text-xs text-center">RM 1,244,379.77</td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>
            </>
          )}
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
        onSave={() => {
          setIsModalOpen(false);
          loadData();
        }}
      />

      <LccaDetailModal
        isOpen={isLccaModalOpen}
        onClose={() => setIsLccaModalOpen(false)}
        alternativeKey={selectedLccaAlternative}
      />

      <MaintenanceActivityEditModal
        isOpen={isMaintModalOpen}
        onClose={() => setIsMaintModalOpen(false)}
        activity={editingMaintActivity}
        onSave={handleSaveMaintActivity}
      />

      <MaintenanceActivityModal
        isOpen={isMaintPopUpModalOpen}
        onClose={() => setIsMaintPopUpModalOpen(false)}
        title="Maintenance Activity"
      />

    </div>
  );
}
