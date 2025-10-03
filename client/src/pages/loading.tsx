'use client';

import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '@/components';

export default function LoadingPage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/game');
  };

  return (
    <LoadingScreen
      onComplete={handleComplete}
      duration={5000}
      showTips={true}
    />
  );
}
