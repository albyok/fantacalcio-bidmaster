import { useState } from 'react';
import { AuctionCard } from '@/components/AuctionCard';
import { placeBid, deleteBid, getWinningBids, useRemainingBudget } from '@/integrations/supabase/bids';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { BidDetail } from '@/integrations/supabase/types';
import { useCurrentUserId } from '@/queries/useUserData';

export const BidManager = ({ allBids, toast }) => {
   const [bids, setBids] = useState<BidDetail[]>(allBids || []);
   const { user } = useAuth();

   const handleBid = async (playerId: number, bidAmount: number) => {
      setBids(currentBids =>
         currentBids.map(bid => {
            if (bid.player_id === playerId) {
               return {
                  ...bid,
                  bid_amount: bidAmount,
               };
            }
            return bid;
         })
      );

      try {
         await placeBid(user.id, playerId, bidAmount);
         toast({
            title: 'Offerta effettuata!',
            description: 'La tua offerta è stata registrata con successo.',
         });
      } catch (error) {
         console.error("Errore durante la registrazione dell'offerta:", error);
         toast({
            title: 'Errore',
            description: 'Si è verificato un errore durante la registrazione della tua offerta.',
            status: 'error',
         });
      }
   };

   const handleDelete = async (playerId: number) => {
      setBids(currentBids => currentBids.filter(bid => bid.player_id !== playerId));

      try {
         await deleteBid(playerId);
         toast({
            title: 'Giocatore eliminato',
            description: 'Il giocatore è stato eliminato con successo.',
         });
      } catch (error) {
         console.error("Errore durante l'eliminazione del giocatore:", error);
         toast({
            title: 'Errore',
            description: "Si è verificato un errore durante l'eliminazione del giocatore.",
            status: 'error',
         });
      }
   };

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {bids.map(bid => (
            <AuctionCard
               key={bid.player_id}
               bidDetails={bid}
               onBid={(playerId, bidAmount) => handleBid(playerId, bidAmount)}
               onDelete={playerId => handleDelete(playerId)}
            />
         ))}
      </div>
   );
};
