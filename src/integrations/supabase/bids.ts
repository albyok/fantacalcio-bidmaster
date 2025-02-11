import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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

export const getBids = userId => {
   return useQuery({
      queryKey: ['user-bids', userId],
      queryFn: async () => {
         if (!userId) return [];

         const { data: userBids } = await supabase.from('bids').select('player_id, bid_amount').eq('user_id', userId);

         if (!userBids) return [];

         const playerIds = userBids.map(bid => bid.player_id);
         const { data: players } = await supabase.from('players').select('*').in('player_id', playerIds);

         const playersWithBids = players.map(player => ({
            ...player,
            currentBid: userBids.find(bid => bid.player_id === player.player_id)?.bid_amount || player.fantaprice,
         }));

         return playersWithBids;
      },
      enabled: !!userId,
   });
};

export const deleteBid = async (playerId: number) => {
   const { error } = await supabase.from('bids').delete().eq('player_id', playerId);

   if (error) {
      throw error;
   }
};
