import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: { select: { total: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">Customers</h1>
      <p className="mt-1 text-sm text-ink/50">{customers.length} registered customers</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-left text-ink/40">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Orders</th>
              <th className="p-4 font-medium">Total Spent</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-ink/50">No customers yet.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-gold/10 last:border-0">
                  <td className="p-4 font-medium text-ink whitespace-nowrap">{c.name}</td>
                  <td className="p-4 text-ink/70 whitespace-nowrap">{c.email}</td>
                  <td className="p-4 text-ink/70 whitespace-nowrap">{c.phone ?? "—"}</td>
                  <td className="p-4 text-ink/70">{c.orders.length}</td>
                  <td className="p-4 text-ink/70 whitespace-nowrap">
                    {formatINR(c.orders.reduce((sum, o) => sum + o.total, 0))}
                  </td>
                  <td className="p-4 text-ink/50 whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
