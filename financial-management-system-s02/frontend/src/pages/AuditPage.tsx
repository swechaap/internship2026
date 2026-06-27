export function AuditPage() {
  return (
    <div className="glass-card rounded-[2rem] p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">Audit logs</p>
      <h2 className="mt-2 text-2xl font-semibold">Immutable activity trail</h2>
      <p className="mt-3 text-sm text-muted">This page can be connected to the backend audit log endpoint. The log model is already seeded on startup.</p>
    </div>
  );
}
