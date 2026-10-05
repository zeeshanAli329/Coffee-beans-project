// Standard loading / error / empty handling for any fetched view.
export default function DataState({ loading, error, empty, emptyText = 'Nothing here yet.', onRetry, children }) {
  if (loading) return <div className="state"><span className="spinner" /> Loading…</div>;
  if (error) return (
    <div className="state state-error" role="alert">
      <p>{error}</p>
      {onRetry && <button className="btn btn-ghost btn-sm" onClick={onRetry}>Try again</button>}
    </div>
  );
  if (empty) return <div className="state">{emptyText}</div>;
  return children;
}
