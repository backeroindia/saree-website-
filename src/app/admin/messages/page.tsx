import { prisma } from "@/lib/db";
import MarkReadButton from "@/components/admin/MarkReadButton";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">Messages</h1>
      <p className="mt-1 text-sm text-ink/60">
        Submissions from the Contact Us form.
      </p>

      <div className="mt-6 space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-gold/15 bg-white p-10 text-center text-ink/50">
            No messages yet.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-5 transition-colors ${
                m.read ? "border-gold/15 bg-white" : "border-gold/40 bg-gold/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {m.subject}
                    {!m.read && (
                      <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-background">
                        NEW
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {m.name} · {m.email} ·{" "}
                    {new Date(m.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {!m.read && <MarkReadButton id={m.id} />}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/70">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
