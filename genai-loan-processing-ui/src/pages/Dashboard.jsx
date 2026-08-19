import React, { useEffect, useMemo, useState } from 'react';
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

const normalizeLoanType = (value) => {
  if (!value) return 'N/A';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return `₹${numericValue.toLocaleString('en-IN')}`;
};

const normalizeStatus = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'Approved';
    case 'FAILED':
      return 'Declined';
    case 'PROCESSING':
      return 'Pending Review';
    case 'PENDING':
    default:
      return 'Pending';
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/applications');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const result = await response.json();
        const mappedApplications = (result.data || []).map((application) => {
          const applicant = application.applicantDetails || {};
          const loan = application.loanDetails || {};
          const status = normalizeStatus(application.processingStatus);
          const createdAt = application.createdAt ? new Date(application.createdAt) : new Date();

          return {
            _id: application._id || null,
            id: application._id ? `APP-${String(application._id).slice(-6).toUpperCase()}` : 'APP-N/A',
            name: applicant.fullName || 'Unnamed Applicant',
            type: normalizeLoanType(loan.loanType),
            amount: formatCurrency(loan.loanAmount),
            status,
            date: createdAt.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          };
        });

        setApplications(mappedApplications);
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((app) => app.status === 'Pending' || app.status === 'Pending Review').length;
    const approved = applications.filter((app) => app.status === 'Approved').length;
    const declined = applications.filter((app) => app.status === 'Declined').length;

    return [
      { label: 'Total Applications', value: total.toLocaleString('en-IN'), icon: LayoutList, iconColor: 'text-text-secondary', borderColor: '' },
      { label: 'Pending Review', value: pending.toLocaleString('en-IN'), icon: Clock, iconColor: 'text-banking-warning', borderColor: 'border-b-banking-warning' },
      { label: 'Approved', value: approved.toLocaleString('en-IN'), icon: CheckCircle2, iconColor: 'text-banking-success', borderColor: 'border-b-banking-success' },
      { label: 'Declined', value: declined.toLocaleString('en-IN'), icon: XCircle, iconColor: 'text-banking-error', borderColor: 'border-b-banking-error' },
    ];
  }, [applications]);

  const recentApplications = applications.slice(0, 5);

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
        {loading ? (
          <div className="p-6 text-sm text-text-secondary">Loading recent applications...</div>
        ) : recentApplications.length === 0 ? (
          <div className="p-6 text-sm text-text-secondary">No applications found.</div>
        ) : (
          <>
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
                    <tr key={app._id || app.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-text-primary">{app.id}</td>
                      <td className="px-6 py-4 text-text-secondary">{app.name}</td>
                      <td className="px-6 py-4 text-text-secondary">{app.type}</td>
                      <td className="px-6 py-4 font-medium text-text-primary">{app.amount}</td>
                      <td className="px-6 py-4 text-text-muted">{app.date}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => app._id && navigate(`/applications/${app._id}`)}
                          className="text-banking-primary font-medium text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-border-light">
              {recentApplications.map((app) => (
                <button
                  key={app._id || app.id}
                  onClick={() => app._id && navigate(`/applications/${app._id}`)}
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
          </>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
