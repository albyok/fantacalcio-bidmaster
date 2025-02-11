import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { GetAllBidDetailsResponse } from './types';

export const placeBid = async (userId: string, playerId: number, bidAmount: number) => {
   const { error } = await supabase.from('bids').insert({
      user_id: userId,
      player_id: playerId,
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

export const deleteBid = async (playerId: number) => {
   const { error } = await supabase.from('bids').delete().eq('player_id', playerId);

   if (error) {
      throw error;
   }
};
