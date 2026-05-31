import { useCheckAuthQuery } from '../state/services/authAPI';

export const useAuth = () => {
  const query = useCheckAuthQuery(undefined);

  const isAuthenticated = !!query.data && !query.isError;

  return {
    user: query.data,
    isAuthenticated,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    status: query.status,
  };
};
