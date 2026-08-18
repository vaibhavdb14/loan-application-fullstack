import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Clock,
  CheckCircle2,
  XCircle,
  LayoutList,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

// Mock data to populate the dashboard table
const recentApplications = [
  { id: 'APP-2026-001024', name: 'Arjun Mehta', type: 'Home Loan', amount: '₹75,00,000', status: 'Pending', date: '12 Aug 2026' },
  { id: 'APP-2026-001023', name: 'Priya Sharma', type: 'Personal Loan', amount: '₹5,00,000', status: 'Approved', date: '11 Aug 2026' },
  { id: 'APP-2026-001022', name: 'Rohan Desai', type: 'Business Loan', amount: '₹1,50,00,000', status: 'Declined', date: '10 Aug 2026' },
  { id: 'APP-2026-001021', name: 'Neha Gupta', type: 'Education Loan', amount: '₹20,00,000', status: 'Pending', date: '10 Aug 2026' },
  { id: 'APP-2026-001020', name: 'Vikram Singh', type: 'Vehicle Loan', amount: '₹12,50,000', status: 'Approved', date: '09 Aug 2026' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Applications', value: '1,248', icon: LayoutList, iconColor: 'text-text-secondary', borderColor: '' },
    { label: 'Pending Review', value: '320', icon: Clock, iconColor: 'text-banking-warning', borderColor: 'border-b-banking-warning' },
    { label: 'Approved', value: '814', icon: CheckCircle2, iconColor: 'text-banking-success', borderColor: 'border-b-banking-success' },
    { label: 'Declined', value: '114', icon: XCircle, iconColor: 'text-banking-error', borderColor: 'border-b-banking-error' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="hidden lg:block text-2xl font-bold text-text-primary">Good Morning, Manager</h1>
          <p className="text-text-secondary mt-1 text-sm sm:text-base">Loan Application Overview</p>
        </div>
        <button
          onClick={() => navigate('/new')}
          className="w-full sm:w-auto bg-banking-primary hover:bg-blue-700 text-white px-5 py-3 sm:py-2.5 rounded-md font-medium flex items-center justify-center gap-2 transition-colors shadow-sm min-h-[44px]"
        >
          <FilePlus size={18} />
          File New Application
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`bg-banking-card p-4 sm:p-6 rounded-lg border border-border shadow-sm flex flex-col border-b-4 ${s.borderColor}`}
            >
              <div className={`flex items-center gap-2 sm:gap-3 text-text-secondary mb-2 sm:mb-3`}>
                <Icon size={18} className={s.iconColor} />
                <h3 className="font-medium text-xs sm:text-sm leading-tight">{s.label}</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-text-primary">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Applications */}
      <div className="bg-banking-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-border-light flex justify-between items-center bg-banking-softBlue/30 gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-text-primary">Recent Applications</h2>
          <button
            onClick={() => navigate('/applications')}
            className="text-xs sm:text-sm font-medium text-banking-primary hover:underline flex items-center gap-1 shrink-0"
          >
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Desktop / tablet table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-light bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Application No.</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Applicant Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Loan Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-sm">
              {recentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-text-primary">{app.id}</td>
                  <td className="px-6 py-4 text-text-secondary">{app.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{app.type}</td>
                  <td className="px-6 py-4 font-medium text-text-primary">{app.amount}</td>
                  <td className="px-6 py-4 text-text-muted">{app.date}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-banking-primary font-medium text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden divide-y divide-border-light">
          {recentApplications.map((app) => (
            <button
              key={app.id}
              onClick={() => navigate(`/applications/${app.id}`)}
              className="w-full text-left p-4 flex items-center justify-between gap-3 active:bg-gray-50"
            >
              <div className="min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">{app.name}</p>
                <p className="text-xs text-text-muted truncate">{app.id} · {app.type}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={app.status} size="sm" />
                  <span className="text-xs text-text-muted">{app.date}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-semibold text-text-primary">{app.amount}</span>
                <ChevronRight size={16} className="text-text-muted" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
