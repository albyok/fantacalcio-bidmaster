import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export const TeamRequiredRoute = ({ children }: { children: React.ReactNode }) => {
   const { user } = useAuth();
   const [hasTeam, setHasTeam] = useState<boolean | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const checkTeam = async () => {
         if (!user) return;

         try {
            const { data, error } = await supabase.from('user_teams').select('team_id').eq('user_id', user.id).maybeSingle();

            if (error) throw error;
            setHasTeam(!!data);
         } catch (error) {
            console.error('Error checking team:', error);
            setHasTeam(false);
         } finally {
            setLoading(false);
         }
      };

      checkTeam();
   }, [user]);

   if (loading) {
      return <div>Caricamento...</div>;
   }

   if (!hasTeam) {
      return <Navigate to="/select-team" />;
   }

   return <>{children}</>;
};
