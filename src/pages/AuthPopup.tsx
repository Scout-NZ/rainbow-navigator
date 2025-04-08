import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPopup() {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Auth popup is no longer used - redirecting to main auth page');
    
    if (window.opener) {
      window.opener.postMessage({ 
        type: 'AUTH_COMPLETE', 
        success: false, 
        error: 'This authentication method is no longer supported' 
      }, window.location.origin);
      window.close();
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-xl mb-4">Authentication Method Changed</div>
      <p className="text-muted-foreground mb-4">
        This authentication method is no longer supported. 
        Please use email and password to register or login.
      </p>
      <p className="text-sm">Redirecting to login page...</p>
    </div>
  );
}
