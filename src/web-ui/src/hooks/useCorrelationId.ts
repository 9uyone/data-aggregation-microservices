import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook to manage and generate Correlation IDs (UUIDs)
 * Used for distributed tracing across microservices
 */
export const useCorrelationId = () => {
  const [correlationId, setCorrelationId] = useState<string>(() => uuidv4());

  /**
   * Generate a new Correlation ID
   */
  const generateNewId = useCallback(() => {
    const newId = uuidv4();
    setCorrelationId(newId);
    return newId;
  }, []);

  /**
   * Get current Correlation ID without generating a new one
   */
  const getCurrentId = useCallback(() => {
    return correlationId;
  }, [correlationId]);

  /**
   * Create a new Correlation ID without storing it in state
   * Useful for one-off requests
   */
  const createTransientId = useCallback(() => {
    return uuidv4();
  }, []);

  return useMemo(
    () => ({
      correlationId,
      generateNewId,
      getCurrentId,
      createTransientId,
    }),
    [correlationId, generateNewId, getCurrentId, createTransientId]
  );
};

export default useCorrelationId;
