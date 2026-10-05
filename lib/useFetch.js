'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

// Fetches `path` (skips when null). Returns { data, error (string|null), loading, reload }.
export function useFetch(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(path));

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try { setData(await api.get(path)); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [path]);

  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load };
}
