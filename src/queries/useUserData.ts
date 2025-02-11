import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const useTeamData = userId => {
   return useQuery({
      queryKey: ['user-team', userId],
      queryFn: async () => {
         if (!userId) return null;

         const { data: userTeam } = await supabase.from('user_teams').select('team_id').eq('user_id', userId).single();

         if (!userTeam) return null;

         const { data: team } = await supabase.from('teams').select('*').eq('id', userTeam.team_id).single();

         return team;
      },
      enabled: !!userId,
   });
};

export const useProfileData = userId => {
   return useQuery({
      queryKey: ['user-profile', userId],
      queryFn: async () => {
         if (!userId) return null;

         const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();

         return data;
      },
      enabled: !!userId,
   });
};

export const useCurrentUserId = () => {
   const { user } = useAuth();
   return user?.id || null;
};

export const useUserIsAdmin = () => {
   const userId = useCurrentUserId();

   const { data: profileData, isLoading } = useProfileData(userId);

   return {
      isAdmin: profileData?.is_admin || false,
      isLoading,
   };
};
