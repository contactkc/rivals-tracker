import { useState, useEffect } from 'react';

const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8080/api/proxy/${endpoint}`,
          {
            method: options.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
            ...options,
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, options.method, options.headers]);

  return { data, loading, error };
};

export default useApi;
