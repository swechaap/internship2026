import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  medicalRecords 
} from '../data/dummyData';
import MedicalRecordCard from '../components/cards/MedicalRecordCard';
import RecordDetailsModal from '../components/modals/RecordDetailsModal';
import UploadRecordModal from '../components/modals/UploadRecordModal';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  PlusCircle,
  FileCheck,
  FileText,
  Pill,
  FlaskConical,
  X,
  Lock,
  ArrowUpDown
} from 'lucide-react';

export default function MedicalRecords() {
  const { globalSearchQuery, role } = useOutletContext();

  const API_URL = 'http://localhost:5000/api';
  const [records, setRecords] = useState([]);

  // Fetch records from backend on mount
  useEffect(() => {
    fetch(`${API_URL}/records`)
      .then(res => res.json())
      .then(data => {
        if (data) setRecords(data);
      })
      .catch(err => console.error("Failed to load records from storage", err));
  }, []);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('');
  const [sortBy, setSortBy] = useState('Latest'); // 'Latest' or 'Oldest'
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  // Modal State
  const [selectedRecordForModal, setSelectedRecordForModal] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);

  // Sync global search query
  useEffect(() => {
    if (globalSearchQuery !== undefined) {
      setSearchTerm(globalSearchQuery);
      setCurrentPage(1);
    }
  }, [globalSearchQuery]);

  // Handle Search Change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Categories definition
  const categories = [
    { name: 'All Records', id: 'All', icon: FileCheck },
    { name: 'Clinical Reports', id: 'Report', icon: FileText },
    { name: 'Prescriptions', id: 'Prescription', icon: Pill },
    { name: 'Lab Results', id: 'Lab Result', icon: FlaskConical },
    { name: 'Diagnostic Scans', id: 'Scan', icon: SlidersHorizontal },
  ];

  // Helper for Date Formatter (Month Year)
  const getMonthYearString = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length < 2) return 'Other';
    const year = parts[0];
    const monthIndex = parseInt(parts[1]) - 1;
    const date = new Date(year, monthIndex, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Lists for dynamic filters
  const uniqueMonths = [...new Set(records.map(r => getMonthYearString(r.date)))].sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  const uniquePatients = [...new Set(records.map(r => r.patientName))];

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedTypeFilter('');
    setSelectedDateFilter('');
    setSelectedPatientFilter('');
    setSortBy('Latest');
    setCurrentPage(1);
  };

  // Save Record (both Create and Update)
  const handleSaveRecord = async (record) => {
    const exists = records.some(r => r.id === record.id);
    try {
      if (exists) {
        // Edit mode
        const response = await fetch(`${API_URL}/records/${record.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        const data = await response.json();
        if (response.ok) {
          setRecords(prev => prev.map(r => r.id === record.id ? data : r));
        } else {
          alert('Failed to update record on backend.');
        }
      } else {
        // Create mode
        const response = await fetch(`${API_URL}/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        const data = await response.json();
        if (response.ok) {
          setRecords(prev => [data, ...prev]);
        } else {
          alert('Failed to save record to backend.');
        }
      }
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend.');
    }
  };

  // Delete Record
  const handleDeleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this clinical record from HIPAA secure storage?")) {
      try {
        const response = await fetch(`${API_URL}/records/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
          setRecords(prev => prev.filter(r => r.id !== id));
          if (currentPage > 1 && filteredRecords.length - 1 <= (currentPage - 1) * recordsPerPage) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          alert(data.message || 'Failed to delete record.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to backend.');
      }
    }
  };

  // Trigger Edit modal
  const handleEditRecordClick = (record) => {
    setRecordToEdit(record);
    setIsUploadOpen(true);
  };

  // Trigger Create modal
  const handleUploadRecordClick = () => {
    setRecordToEdit(null);
    setIsUploadOpen(true);
  };

  // Open Details Modal
  const handleOpenDetails = (record) => {
    setSelectedRecordForModal(record);
    setIsDetailsOpen(true);
  };

  // Download record summary
  const handleDownloadRecord = (record) => {
    const element = document.createElement("a");
    const file = new Blob([
      `CAREPORTAL MEDICAL ARCHIVE SUMMARY\n`,
      `===================================\n`,
      `Record ID: ${record.id}\n`,
      `Document Title: ${record.title}\n`,
      `Classification Type: ${record.recordType}\n`,
      `Timestamp Date: ${record.date}\n`,
      `Patient Name: ${record.patientName} (${record.patientGender}, ${record.patientAge}y)\n`,
      `Patient ID Ref: ${record.patientId}\n`,
      `Consultant Practitioner: ${record.doctorName} (${record.department})\n`,
      `-----------------------------------\n`,
      `CLINICAL FINDINGS ABSTRACT:\n`,
      `${record.shortDescription}\n\n`,
      `DETAILED COMPREHENSIVE FINDINGS:\n`,
      record.details.trim(),
      `\n===================================\n`,
      `SECURITY SEAL: Verification signed electronically under CarePortal clinical privilege policies.`
    ], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${record.patientName.replace(/\s+/g, '_')}_${record.recordType}_${record.date}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtering Logic
  const filteredRecords = records.filter((rec) => {
    // If user is a Patient, force filter to John Doe records only
    if (role === 'Patient' && rec.patientName !== 'John Doe') {
      return false;
    }

    const matchesSearch = 
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All' || rec.recordType === selectedCategory;

    const matchesType = 
      !selectedTypeFilter || rec.recordType === selectedTypeFilter;

    const matchesDate = (() => {
      if (!selectedDateFilter) return true;
      const recYear = rec.date ? rec.date.split('-')[0] : '';
      if (selectedDateFilter === '2025-2026') {
        return recYear === '2025' || recYear === '2026';
      }
      return recYear === selectedDateFilter;
    })();

    const matchesPatient = 
      role === 'Patient' || !selectedPatientFilter || rec.patientName === selectedPatientFilter;

    return matchesSearch && matchesCategory && matchesType && matchesDate && matchesPatient;
  });

  // Sorting Logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortBy === 'Latest' ? dateB - dateA : dateA - dateB;
  });

  // Pagination bounds
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Security checks
  const canUpload = role === 'Manager';
  const isPatient = role === 'Patient';

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            {isPatient ? 'Medical Records - Patient Portal' : 'Medical Records - Clinical Repository'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isPatient 
              ? 'Access, download, and review your secure health records, prescriptions, and lab findings.' 
              : 'Access secure HIPAA-compliant records, laboratory reports, scans, and physician prescriptions.'}
          </p>
        </div>
        {canUpload ? (
          <button 
            onClick={handleUploadRecordClick}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Medical Record</span>
          </button>
        ) : (
          <div className="px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span>{isPatient ? 'Secure Patient Portal' : `View Only Mode (${role})`}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar Categories */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-premium p-4 space-y-5">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Quick Filters</h3>
            <p className="text-[10px] text-slate-400 pl-2">Filter repository by clinical category</p>
          </div>
          <div className="space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const matchingRecords = records.filter(r => {
                const belongsToUser = !isPatient || r.patientName === 'John Doe';
                const matchesType = cat.id === 'All' || r.recordType === cat.id;
                return belongsToUser && matchesType;
              });
              
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                    ${isSelected 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100/50' 
                      : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                    <span>{cat.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                    ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}
                  `}>
                    {matchingRecords.length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 bg-sky-50/20 p-3 rounded-xl border border-sky-100/40">
            <h4 className="text-[10px] font-extrabold text-sky-850 uppercase tracking-wide">Storage Telemetry</h4>
            <div className="flex items-center justify-between mt-2 text-[10px] font-bold text-slate-500">
              <span>Secure Capsule Space</span>
              <span className="text-sky-600">{(filteredRecords.length * 1.2 + 8.4).toFixed(1)} MB / 512 MB</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (((filteredRecords.length * 1.2 + 8.4) / 512) * 100))}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Mobile Categories Swiper */}
          <div className="flex lg:hidden overflow-x-auto pb-2 gap-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer
                    ${isSelected 
                      ? 'bg-blue-655 text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200'}
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Filters Dashboard Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-4 md:p-5 space-y-4">
            
            {/* Search Input */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder={isPatient ? "Filter my records by title, doctor name, or keyword..." : "Filter records by document title, patient details, or practitioner name..."}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-800"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-655 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {(searchTerm || selectedCategory !== 'All' || selectedTypeFilter || selectedDateFilter || selectedPatientFilter || sortBy !== 'Latest') && (
                <button
                  onClick={resetFilters}
                  className="w-full md:w-auto px-4 py-2.5 text-xs font-bold text-red-650 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-all text-center whitespace-nowrap cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className={`grid grid-cols-1 gap-3 pt-2 border-t border-slate-50 ${isPatient ? 'sm:grid-cols-3' : 'sm:grid-cols-4'}`}>
              
              {!isPatient && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Patient</label>
                  <select
                    value={selectedPatientFilter}
                    onChange={(e) => { setSelectedPatientFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-705 font-bold"
                  >
                    <option value="">All Patients</option>
                    {uniquePatients.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Record Type</label>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => { setSelectedTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-705 font-bold"
                >
                  <option value="">All Record Types</option>
                  <option value="Prescription">Prescriptions</option>
                  <option value="Report">Clinical Reports</option>
                  <option value="Scan">Diagnostic Scans</option>
                  <option value="Lab Result">Lab Results</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Upload Period</label>
                <select
                  value={selectedDateFilter}
                  onChange={(e) => { setSelectedDateFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-705 font-bold"
                >
                  <option value="">All Years</option>
                  <option value="2025-2026">Newest (2025-2026)</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-slate-450" />
                  <span>Sort By Timeline</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-705 font-bold"
                >
                  <option value="Latest">Latest Uploads</option>
                  <option value="Oldest">Oldest Uploads</option>
                </select>
              </div>

            </div>
          </div>

          {/* Cards Grid */}
          {currentRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentRecords.map((record) => (
                <MedicalRecordCard 
                  key={record.id} 
                  record={record}
                  role={role}
                  onView={handleOpenDetails}
                  onDownload={handleDownloadRecord}
                  onEdit={handleEditRecordClick}
                  onDelete={handleDeleteRecord}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-full bg-blue-50 text-blue-550">
                <Filter className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">No matching medical records</h4>
                <p className="text-xs text-slate-450 max-w-sm">
                  We couldn't find any documents matching your active search filters or categories. Try clearing filters.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-bold text-blue-655 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3.5 rounded-2xl border border-slate-100 shadow-premium">
              <div className="text-[10px] font-bold text-slate-400">
                Showing <span className="text-slate-600">{indexOfFirstRecord + 1}</span> to <span className="text-slate-600">{Math.min(indexOfLastRecord, sortedRecords.length)}</span> of <span className="text-slate-600">{sortedRecords.length}</span> records
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all shrink-0 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                  const isCurrent = currentPage === number;
                  return (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer
                        ${isCurrent 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}
                      `}
                    >
                      {number}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all shrink-0 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Record Details Modal */}
      <RecordDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        record={selectedRecordForModal}
        onDownload={handleDownloadRecord}
      />

      {/* Upload/Edit record Modal */}
      <UploadRecordModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={handleSaveRecord}
        record={recordToEdit}
      />

    </div>
  );
}
