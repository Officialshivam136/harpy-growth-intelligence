import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-harpy-charcoal border border-harpy-cardBorder flex items-center justify-center text-electric mb-6 shadow-electric-glow font-bold text-2xl font-mono">
        404
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">
        Analytics View Not Found
      </h1>
      <p className="text-xs text-harpy-subtle max-w-md mb-6">
        The requested Amazon intelligence report or dashboard route does not exist or has been archived.
      </p>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => navigate('/')}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default NotFound;

