// client/src/hooks/useAuth.js - React hook for managing authentication state
import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch (err) {
      console.error('Error checking auth status:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, refetch: fetchUser, setUser };
};

export default useAuth;
