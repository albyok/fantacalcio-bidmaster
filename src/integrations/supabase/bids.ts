import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const placeBid = async (playerId: number, bidAmount: number) => {
   const { user } = useAuth();
   if (!user?.id) throw new Error('User not authenticated');

   const { error } = await supabase.from('bids').insert({
      user_id: user.id,
      player_id: playerId,
      bid_amount: bidAmount,
   });

   if (error) {
      throw error;
   }
};
