import { useState, useEffect } from 'react';

export function useMutation<T>(
  mutationThunk: () => Promise<T>,
): [
  () => Promise<T | null>,
  {
    error: Error | null;
    loading: boolean;
  },
] {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const runMutation = async () => {
    try {
      setLoading(true);
      return await mutationThunk();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return [runMutation, { error, loading }];
}
