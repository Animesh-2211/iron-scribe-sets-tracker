
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

type SessionCheckProps = {
  children: React.ReactNode;
};

const SessionCheck = ({ children }: SessionCheckProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };

    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return <>{children}</>;
};

export default SessionCheck;
