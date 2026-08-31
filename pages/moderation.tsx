import React from 'react';
import RequireRole from '@/components/Auth/RequireRole';
import ModerationDashboard from '@/components/Moderation/ModerationDashboard';

const ModerationPage: React.FC = () => {
  return (
    <RequireRole minRoleId={3}>
      <ModerationDashboard />
    </RequireRole>
  );
};

export default ModerationPage;
