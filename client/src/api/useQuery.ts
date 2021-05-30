import { useState, useEffect } from 'react';

// Should query also be a thunk???
export function useQuery<T>(query: Promise<T>, initialData: T | null = null) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(initialData);

  const runQuery = async () => {
    try {
      const data = await query;
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runQuery();
  }, []);

  return { error, loading, data };
}
