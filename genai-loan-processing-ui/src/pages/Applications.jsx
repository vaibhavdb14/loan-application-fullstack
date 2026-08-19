import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, AlertTriangle, FolderOpen, Loader2 } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const Applications = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // --- State Management ---
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['Pending', 'Approved', 'Declined'];

  // --- Fetch Data ---
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/applications');
        if (!response.ok) throw new Error('Failed to fetch applications');
        const result = await response.json();
        
        // Ensure we always have an array
        setApplications(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.message);
        showToast('Failed to load applications', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [showToast]);

  // --- Data Helpers ---
  const formatCurrency = (amount) => amount ? `₹${Number(amount).toLocaleString('en-IN')}` : 'N/A';
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatLoanType = (type) => type ? type.replace('_', ' ') : 'N/A';
  
  // Create a display ID like APP-2026-A1B2C3
  const formatAppId = (app) => {
    const year = new Date(app.createdAt).getFullYear() || new Date().getFullYear();
    const shortId = app._id ? app._id.slice(-6).toUpperCase() : 'XXXXXX';
    return `APP-${year}-${shortId}`;
  };

  // Map backend processingStatus to frontend Tabs
  const deriveTabStatus = (app) => {
    const status = app.processingStatus?.toUpperCase();
    if (status === 'FAILED') return 'Declined';
    if (status === 'COMPLETED') return 'Approved';
    return 'Pending'; // 'PENDING' or 'PROCESSING'
  };

  const getRiskIndicator = (risk) => {
    const r = risk?.toUpperCase();
    switch (r) {
      case 'LOW':
        return <span className="flex items-center gap-1 text-banking-success text-sm font-medium"><div className="w-2 h-2 rounded-full bg-banking-success"></div> Low</span>;
      case 'MEDIUM':
        return <span className="flex items-center gap-1 text-banking-warning text-sm font-medium"><div className="w-2 h-2 rounded-full bg-banking-warning"></div> Medium</span>;
      case 'HIGH':
        return <span className="flex items-center gap-1 text-banking-error text-sm font-medium"><AlertTriangle size={14} /> High</span>;
      default:
        return <span className="text-text-muted text-sm font-medium">Pending</span>;
    }
  };

  // --- Filtering ---
  const filteredApps = applications.filter(app => {
    const tabMatch = deriveTabStatus(app) === activeTab;
    const nameStr = (app.applicantDetails?.fullName || '').toLowerCase();
    const idStr = formatAppId(app).toLowerCase();
    const rawIdStr = (app._id || '').toLowerCase();
    const searchMatch = nameStr.includes(searchTerm.toLowerCase()) || idStr.includes(searchTerm.toLowerCase()) || rawIdStr.includes(searchTerm.toLowerCase());
    
    return tabMatch && searchMatch;
  });

  const emptyMessages = {
    Pending: 'No applications are waiting for review.',
    Approved: 'No approved applications yet.',
    Declined: 'No declined applications.',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Applications</h1>
        <p className="text-text-secondary mt-1 text-sm sm:text-base">Manage and review all loan applications.</p>
      </div>

      <div className="bg-banking-card border border-border rounded-lg shadow-sm flex-1 flex flex-col min-h-[500px]">

        {/* Tabs & Toolbar */}
        <div className="pt-2 border-b border-border-light bg-gray-50/50 rounded-t-lg">
          <div className="flex gap-1 px-2 sm:px-4 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'border-banking-primary text-banking-primary bg-white rounded-t-md'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-100/50 rounded-t-md'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-4 pb-3 sm:pb-2 sm:pr-4">
            <div className="relative flex-1 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search applicant or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 sm:py-1.5 border border-border rounded-md text-sm focus:ring-2 focus:ring-banking-primary focus:outline-none w-full sm:w-64 bg-white"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-3 py-2.5 sm:py-1.5 border border-border rounded-md text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors shrink-0 bg-white">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-banking-primary" />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center p-6 text-banking-error">
              Error: {error}
            </div>
          ) : filteredApps.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title={`No ${activeTab.toLowerCase()} applications`}
              description={emptyMessages[activeTab]}
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-light bg-white">
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">App ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Applicant Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Loan Type</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Risk Level</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-sm bg-white">
                    {filteredApps.map((app) => (
                      <tr key={app._id} className="hover:bg-banking-softBlue/20 transition-colors group">
                        <td className="px-6 py-4 font-medium text-text-primary">{formatAppId(app)}</td>
                        <td className="px-6 py-4 font-medium text-text-primary">{app.applicantDetails?.fullName || 'N/A'}</td>
                        <td className="px-6 py-4 text-text-secondary">{formatLoanType(app.loanDetails?.loanType)}</td>
                        <td className="px-6 py-4 font-medium text-text-primary">{formatCurrency(app.loanDetails?.loanAmount)}</td>
                        <td className="px-6 py-4 text-text-muted">{formatDate(app.createdAt)}</td>
                        <td className="px-6 py-4">{getRiskIndicator(app.riskLevel)}</td>
                        <td className="px-6 py-4"><StatusBadge status={activeTab} /></td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/applications/${app._id}`)}
                            className="text-banking-primary font-medium text-sm hover:underline inline-flex items-center gap-1"
                          >
                            View Details <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet cards */}
              <div className="lg:hidden divide-y divide-border-light flex-1 overflow-y-auto">
                {filteredApps.map((app) => (
                  <button
                    key={app._id}
                    onClick={() => navigate(`/applications/${app._id}`)}
                    className="w-full text-left p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors bg-white"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">{app.applicantDetails?.fullName || 'N/A'}</p>
                        <p className="text-xs text-text-muted truncate">{formatAppId(app)}</p>
                      </div>
                      <ChevronRight size={18} className="text-text-muted shrink-0 mt-0.5" />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary mb-2">
                      <span>{formatLoanType(app.loanDetails?.loanType)}</span>
                      <span className="font-semibold text-text-primary">{formatCurrency(app.loanDetails?.loanAmount)}</span>
                      <span>{formatDate(app.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={activeTab} size="sm" />
                      {getRiskIndicator(app.riskLevel)}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-border-light bg-gray-50 flex justify-between items-center rounded-b-lg mt-auto">
          <span className="text-xs sm:text-sm text-text-secondary">Showing {filteredApps.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-border rounded-md text-xs sm:text-sm bg-white text-text-muted cursor-not-allowed shadow-sm">Previous</button>
            <button className="px-3 py-1.5 border border-border rounded-md text-xs sm:text-sm bg-white text-text-secondary hover:bg-gray-50 shadow-sm transition-colors">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Applications;