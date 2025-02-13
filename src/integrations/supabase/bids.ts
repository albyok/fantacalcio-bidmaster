import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const placeBid = async (userId: string, playerId: number, selling_player_id: number, bidAmount: number) => {
   const { error } = await supabase.from('bids').insert({
      user_id: userId,
      player_id: playerId,
      selling_player_id: selling_player_id,
      bid_amount: bidAmount,
   });

   if (error) {
      throw error;
   }
};

export const getBids = () => {
   return useQuery({
      queryKey: ['user-bids'],
      queryFn: async () => {
         const { data, error } = await supabase.rpc('get_all_bid_details', {});

         if (error) {
            console.error('Error fetching bid details:', error);
            return [];
         }

         const maxBids = data.reduce((acc, bid) => {
            if (!acc[bid.player_id] || acc[bid.player_id].bid_amount < bid.bid_amount) {
               acc[bid.player_id] = bid;
            }
            return acc;
         }, {});

         const result = Object.values(maxBids);

         console.log('Bid details:', result);

         return result;
      },
   });
};

export const getWinningBids = (teamUserId: string) => {
   return useQuery({
      queryKey: ['winning-bids', teamUserId],
      queryFn: async () => {
         const { data, error } = await supabase.rpc('get_winning_bids_by_team', { team_user_id: teamUserId });

         if (error) {
            console.error('Error fetching winning bids:', error);
            return [];
         }

         console.log('Winning bids:', data);
         return data;
      },
   });
};

export const deleteBid = async (playerId: number) => {
   const { error } = await supabase.from('bids').delete().eq('player_id', playerId);

   if (error) {
      throw error;
   }
};

export const getRemainingBudget = (userId: string) => {
   return useQuery({
      queryKey: ['remaining-budget', userId],
      queryFn: async () => {
         const { data, error } = await supabase.rpc('get_remaining_budget', { p_user_id: userId });

         if (error) {
            console.error('Error fetching remaining budget:', error);
            return null;
         }

         console.log('Remaining budget:', data);
         return data;
      },
   });
};
