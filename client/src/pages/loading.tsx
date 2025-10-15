'use client';

import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '@/components';
import { OrientationLock } from '@/components/ui';

export default function LoadingPage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/game');
  };

  return (
    <OrientationLock>
      <LoadingScreen
        onComplete={handleComplete}
        duration={5000}
        showTips={true}
      />
    </OrientationLock>
  );
}
