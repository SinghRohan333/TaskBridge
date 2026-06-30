const statusStyles = {
  succeeded: "bg-[var(--color-green-tint)] text-[var(--color-green-dark)]",
  failed: "bg-[#fef2f2] text-[var(--color-danger)]",
  pending: "bg-[#fef3c7] text-[#92400e]",
};

export default function TransactionsTable({ transactions }) {
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Client
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Freelancer
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-[#f9fafb] transition-colors">
                <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                  {tx.client_email}
                </td>
                <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                  {tx.freelancer_email}
                </td>
                <td className="py-4 px-4">
                  <span className="font-semibold text-[var(--color-success-green)]">
                    ${tx.amount.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                  {new Date(tx.paid_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      statusStyles[tx.payment_status] || statusStyles.pending
                    }`}
                  >
                    {tx.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {transactions.map((tx) => (
          <div
            key={tx._id}
            className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-[var(--color-success-green)]">
                ${tx.amount.toLocaleString()}
              </span>
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                  statusStyles[tx.payment_status] || statusStyles.pending
                }`}
              >
                {tx.payment_status}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Client: {tx.client_email}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Freelancer: {tx.freelancer_email}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {new Date(tx.paid_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
