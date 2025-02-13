import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Player } from '@/models/player';

export const usePlayersForFantateam = (teamId: string) => {
   const queryResult = useQuery({
      queryKey: ['players-for-fantateam', teamId],
      queryFn: async () => {
         const { data, error } = await supabase.rpc('get_fantateam_players', { p_fantasy_team_id: teamId });
         if (error) {
            console.error('Error fetching players for fantateam:', error);
            return [];
         }
         console.log('Players for fantateam:', data as Player[]);

         return data as Player[];
      },
   });

   return queryResult.data ?? [];
};
