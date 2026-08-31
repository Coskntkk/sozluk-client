import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import Spinner from '@/components/shared/Spinner';

interface RequireRoleProps {
  children: React.ReactNode;
  minRoleId?: number; // 2: Author, 3: Mod, 4: Admin
}

const RequireRole: React.FC<RequireRoleProps> = ({ children, minRoleId = 3 }) => {
  const router = useRouter();
  const { isAuthenticated, roleId, isInitialized, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isInitialized && !loading) {
      if (!isAuthenticated || !roleId || roleId < minRoleId) {
        router.push('/');
      }
    }
  }, [isAuthenticated, roleId, isInitialized, loading, minRoleId, router]);

  if (!isInitialized || loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !roleId || roleId < minRoleId) {
    return null;
  }

  return <>{children}</>;
};

export default RequireRole;
