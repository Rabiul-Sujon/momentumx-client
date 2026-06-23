'use client';

import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function TransactionsPage() {
  // Fetch all transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: () => axios.get('/api/payments/transactions').then((r) => r.data),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Transactions</h1>
        <p className="text-neutral/60 text-sm mt-1">
          {transactions?.length > 0
            ? `Total ${transactions.length} transaction${transactions.length > 1 ? 's' : ''}`
            : 'No transactions found'}
        </p>
      </div>

      {/* Transactions Table */}
      {transactions?.length > 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    User Email
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Class
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Transaction ID
                  </th>
                  <th className="text-left text-xs font-medium text-neutral/60 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">{tx.userEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">{tx.className}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-primary font-bold">${tx.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-xs font-mono truncate max-w-[150px]">
                        {tx.transactionId}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral/60 text-sm">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-5xl mb-4">💰</p>
          <h3 className="text-xl font-bold text-white mb-2">No Transactions</h3>
          <p className="text-neutral/60 text-sm">No payment transactions have been recorded yet.</p>
        </div>
      )}
    </div>
  );
}