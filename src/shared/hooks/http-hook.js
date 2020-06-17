import { useCallback, useState, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // store active requests in case user accidentally moves
  // away from the component which triggered this request
  // while the request is on its way
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", headers = {}, body = null) => {
      setIsLoading(true);

      const httpAbortCtrl = new AbortController();

      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const data = await response.json();

        // removes abort-controller after successful response
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) throw new Error(data.message);

        setIsLoading(false);

        return data;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // abort all stored requests
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { error, clearError, isLoading, sendRequest };
};
