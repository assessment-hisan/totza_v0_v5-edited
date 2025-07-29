import React, { useState, useMemo, useEffect, Fragment, useCallback } from 'react';
import { Trash2, X, ArrowRight, Building, User, Truck } from 'lucide-react';
import { mockData } from '../utils/mockData';
import { useStore } from '../stores/useStore';
// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children, size = "sm" }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl"
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-auto p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Entity Flow Component ---



const EntityFlow = ({ entities, compact = false }) => {
  if (!entities) return <span className="text-gray-400">N/A</span>;

  const parts = entities.split(' → ').map(p => p.trim());
  const total = parts.length;

  // Compact mode: show first, middle (if >3), and last – max 3 chips
  if (compact && total > 3) {
    return (
      <div className="flex items-center space-x-1" title={entities}>
        <span className="text-sm font-medium text-blue-600">{parts[0]}</span>
        <ArrowRight size={12} className="text-gray-400" />
        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
          ...{total - 2} more...
        </span>
        <ArrowRight size={12} className="text-gray-400" />
        <span className="text-sm font-medium text-green-600">{parts[total - 1]}</span>
      </div>
    );
  }

  // Compact mode: show all if ≤3
  return (
    <div className="flex flex-wrap items-center gap-1">
      {parts.slice(0, compact ? 3 : total).map((part, idx) => (
        <Fragment key={idx}>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium border
              ${idx === 0
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : idx === total - 1
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-gray-100 text-gray-700 border-gray-200'}`}
            title={part}
          >
            {part.length > 15 ? `${part.slice(0, 15)}…` : part}
          </span>
          {idx < total - 1 && (
            <ArrowRight size={12} className="text-gray-400 flex-shrink-0" />
          )}
        </Fragment>
      ))}
    </div>
  );
};


// --- Helper functions ---
const groupTransactionsByDate = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {};
  }

  return transactions.reduce((acc, txn) => {
    if (!txn) return acc;

    const txnDate = new Date(txn.date);
    if (isNaN(txnDate.getTime())) {
      console.warn("Invalid date found in transaction:", txn);
      return acc;
    }

    const dateKey = txnDate.toISOString().split('T')[0];
    const formattedDate = txnDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (!acc[dateKey]) {
      acc[dateKey] = {
        formattedDate,
        transactions: []
      };
    }
    acc[dateKey].transactions.push(txn);
    return acc;
  }, {});
};

const calculateTotals = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { credit: 0, debit: 0, due: 0, loan: 0 };
  }

  return transactions.reduce(
    (totals, txn) => {
      if (!txn) return totals;

      const type = txn.type?.toLowerCase();
      const amount = Number(txn.amount) || 0;

      switch (type) {
        case 'credit':
          totals.credit += amount;
          break;
        case 'debit':
          totals.debit += amount;
          break;
        case 'due':
          totals.due += amount;
          break;
        case 'loan':
          totals.loan += amount;
          break;
      }
      return totals;
    },
    { credit: 0, debit: 0, due: 0, loan: 0 }
  );
};

// --- Loading Component ---
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Loading transactions...</span>
  </div>
);

// --- Empty State Component ---
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Building size={32} className="text-gray-400" />
    </div>
    <p className="text-gray-500 text-lg font-medium">No transactions available</p>
    <p className="text-gray-400 text-sm mt-1">Add a transaction to get started</p>
  </div>
);

// --- TransactionTable Component ---
const TransactionTable = ({ initialTransactions = [], isLoading = false }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedTransactions, setProcessedTransactions] = useState([]);

 const deleteTransaction = useStore(state => state.deleteTransaction)  

  // Process transactions
useEffect(() => {
  try {
    let validTransactions = [];

    if (Array.isArray(initialTransactions) && initialTransactions.length > 0) {
      validTransactions = initialTransactions.filter(
        (t) => t && typeof t === "object" && t.id
      );
    } else {
      validTransactions = mockData.transactions;
    }

    const processed = validTransactions
      .filter((t) => t && typeof t === "object" && t.id)
      .map((t) => ({
        ...t,
        date: t.date || new Date().toISOString(),
        account: t.account || { name: "N/A" },
        amount: Number(t.amount) || 0,
      }))
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    setProcessedTransactions(processed);
  } catch (error) {
    console.error("Error processing transactions:", error);
    setProcessedTransactions(mockData.transactions);
  }
}, [initialTransactions]);
  // Memoized grouped transactions
  const groupedTransactions = useMemo(() =>
    groupTransactionsByDate(processedTransactions),
    [processedTransactions]
  );

  // Memoized monthly totals
  const monthlyTotals = useMemo(() =>
    calculateTotals(processedTransactions),
    [processedTransactions]
  );

  // Get today's date key
  const todayDateKey = useMemo(() => 
    new Date().toISOString().split('T')[0], 
    []
  );

  // Handlers
  const handleOpenModal = useCallback((id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedId(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedId) {
      setProcessedTransactions(prev =>
        prev.filter(txn => txn.id !== selectedId)
      );
      deleteTransaction(selectedId)
      handleCloseModal();
    }
  }, [selectedId, handleCloseModal]);

  const handleRowClick = useCallback((txn) => {
    if (txn.type === 'Due') {
      console.log(`Clicked on Due transaction: ${txn.id}. Would navigate to dues page.`);
    }
  }, []);

  // Find transaction for modal
  const transactionForModal = useMemo(() => {
    return processedTransactions.find(txn => txn.id === selectedId);
  }, [selectedId, processedTransactions]);

  // Get type styling
  const getTypeStyle = (type) => {
    const styles = {
      'Credit': 'bg-green-100 text-green-800 border-green-200',
      'Debit': 'bg-red-100 text-red-800 border-red-200',
      'Due': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Loan': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return styles[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Empty state
  if (!processedTransactions.length) {
    return <EmptyState />;
  }

  // Sort dates in descending order
  const sortedDateKeys = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b) - new Date(a);
  });
 

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Account</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Entity Flow</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Monthly Summary Row */}
            <tr className="bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <td colSpan={7} className="px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <span className="text-sm font-semibold text-blue-800 mb-2 sm:mb-0">Monthly Summary</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      Credits: ₹{monthlyTotals.credit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                      Debits: ₹{monthlyTotals.debit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                      Dues: ₹{monthlyTotals.due.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      Loans: ₹{monthlyTotals.loan.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </td>
            </tr>

            {/* Daily Transaction Groups */}
            {sortedDateKeys.map((dateKey) => {
              const { formattedDate, transactions: dailyTransactions } = groupedTransactions[dateKey];
              const dailyTotals = calculateTotals(dailyTransactions);
              const isToday = dateKey === todayDateKey;
              const date = new Date(dateKey);
              const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

              return (
                <Fragment key={`date-group-${dateKey}`}>
                  {/* Daily Summary Row */}
                  <tr className={isToday ? 'bg-green-50 border-b-2 border-green-200' : 'bg-gray-50 border-b border-gray-200'}>
                    <td colSpan={7} className="px-6 py-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center mb-1 sm:mb-0">
                          <span className={`text-sm font-semibold ${isToday ? 'text-green-800' : 'text-gray-700'}`}>
                            {isToday ? 'Today - ' : ''}{dayOfWeek}, {formattedDate}
                          </span>
                          <span className="ml-2 text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                            {dailyTransactions.length} transaction{dailyTransactions.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="font-medium text-green-700">
                            ↑ ₹{dailyTotals.credit.toLocaleString('en-IN')}
                          </span>
                          <span className="font-medium text-red-700">
                            ↓ ₹{dailyTotals.debit.toLocaleString('en-IN')}
                          </span>
                          {dailyTotals.due > 0 && (
                            <span className="font-medium text-yellow-700">
                              ⚠ ₹{dailyTotals.due.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Transaction Rows */}
                  {dailyTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        txn.type === 'Due' ? 'cursor-pointer hover:bg-yellow-50' : ''
                      }`}
                      onClick={() => txn.type === 'Due' && handleRowClick(txn)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(txn.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getTypeStyle(txn.type)}`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center">
                          <User size={14} className="mr-1 text-gray-400" />
                          {txn.account?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xl">
                        <EntityFlow entities={txn.entities} compact={true} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="line-clamp-2" title={txn.description || 'N/A'}>
                          {txn.description || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(txn.id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Confirm Deletion"
        size="md"
      >
        <div>
          {transactionForModal ? (
            <>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Amount:</span>
                    <span className="text-lg font-bold text-gray-900">₹{transactionForModal.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full border ${getTypeStyle(transactionForModal.type)}`}>
                      {transactionForModal.type}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Entity Flow:</span>
                    </p>
                    <EntityFlow entities={transactionForModal.entities} />
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Description:</span> {transactionForModal.description || 'N/A'}
                    </p>
                  </div>
                  {transactionForModal.reference && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reference:</span> {transactionForModal.reference}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-700 mb-6">Are you sure you want to delete this transaction?</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
            >
              Delete Transaction
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};


export default TransactionTable