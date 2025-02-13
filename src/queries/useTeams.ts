import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Fantateam } from '@/models/fantateam';

export const useFantateams = () => {
   return useQuery<Fantateam[]>({
      queryKey: ['teams'],
      queryFn: async () => {
         const { data: teams, error } = await supabase.from('teams').select('name');
         if (error) {
            throw new Error(error.message);
         }

         return teams.map(team => ({
            name: team.name,
            username: '',
         })) as Fantateam[];
      },
   });
};
