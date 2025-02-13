import { useState } from 'react';
import { AuctionCard } from '@/components/AuctionCard';
import { placeBid, deleteBid } from '@/integrations/supabase/bids';
import { useAuth } from './AuthProvider';
import { BidDetail } from '@/integrations/supabase/types';
import { useTeamData } from '@/queries/useUserData';

export const BidManager = ({ allBids, maxBids, toast }) => {
   const [bids, setBids] = useState<BidDetail[]>(maxBids || []);
   const { user } = useAuth();
   const { data: teamData } = useTeamData(user?.id);

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
         const soldPlayerId = allBids.find(bid => bid.player_id === playerId && bid.fantateam_id === teamData?.id)?.selling_player_id;
         await placeBid(user.id, playerId, soldPlayerId, bidAmount);
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
         {bids.map(bid => {
            const bidHistory = allBids.filter(b => b.player_id === bid.player_id);
            return (
               <AuctionCard
                  key={bid.player_id}
                  bidDetails={bid}
                  bidHistory={bidHistory}
                  onBid={(playerId, bidAmount) => handleBid(playerId, bidAmount)}
                  onDelete={playerId => handleDelete(playerId)}
               />
            );
         })}
      </div>
   );
};
