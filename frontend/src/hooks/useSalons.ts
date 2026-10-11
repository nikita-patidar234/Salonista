import {useCallback, useEffect, useState} from 'react';

import {salonApi} from '../services/api/salonApi';
import {getApiErrorMessage} from '../utils/apiErrorUtils';
import type {Salon} from '../types/salon.types';

interface UseSalonsResult {
  salons: Salon[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

interface UseSalonResult {
  salon: Salon | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const salonListErrorMessage = 'We could not load salons right now.';
const salonDetailsErrorMessage = 'We could not load salon details right now.';

export function useSalons(): UseSalonsResult {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  const refresh = useCallback(() => {
    setRequestId(current => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    salonApi
      .getSalons()
      .then(result => {
        if (!cancelled) {
          setSalons(result);
        }
      })
      .catch(requestError => {
        if (!cancelled) {
          setError(getApiErrorMessage(requestError, 'the salon list', salonListErrorMessage));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  return {
    salons,
    isLoading,
    error,
    refresh,
  };
}

export function useSalon(salonId: string): UseSalonResult {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  const refresh = useCallback(() => {
    setRequestId(current => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    salonApi
      .getSalon(salonId)
      .then(result => {
        if (!cancelled) {
          setSalon(result);
        }
      })
      .catch(requestError => {
        if (!cancelled) {
          setError(getApiErrorMessage(requestError, 'salon details', salonDetailsErrorMessage));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [salonId, requestId]);

  return {
    salon,
    isLoading,
    error,
    refresh,
  };
}
