import React from 'react';
import Error from '@/components/shared/Error';
import Spinner from '@/components/shared/Spinner';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  error?: {
    isError: boolean;
    message?: string;
  };
  loading?: boolean;
  onRetry?: () => void;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, error, loading, onRetry }) => {
  if (loading) {
    return <Spinner />;
  }

  if (error?.isError) {
    return <Error message={error.message} onRetry={onRetry} />;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
