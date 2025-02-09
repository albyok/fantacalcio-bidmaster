import { SupabaseClient } from '@supabase/supabase-js';

export const placeBid = async (supabase: SupabaseClient, userId: string, playerId: number, bidAmount: number) => {
   const { error } = await supabase.from('bids').insert({
      user_id: userId,
      player_id: playerId,
      bid_amount: bidAmount,
   });

   if (error) {
      throw error;
   }
};
