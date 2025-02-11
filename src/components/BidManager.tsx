import { useState } from 'react';
import { AuctionCard } from '@/components/AuctionCard';
import { placeBid, deleteBid } from '@/integrations/supabase/bids';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';

export const BidManager = ({ playersData, toast }) => {
   const [players, setPlayers] = useState(playersData || []);
   const { user } = useAuth();

   const handleBid = async (playerId: number, bidAmount: number) => {
      setPlayers(currentPlayers =>
         currentPlayers.map(player => {
            if (player.player_id === playerId) {
               return {
                  ...player,
                  currentBid: bidAmount,
               };
            }
            return player;
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
      setPlayers(currentPlayers => currentPlayers.filter(player => player.player_id !== playerId));

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
         {players.map(player => (
            <AuctionCard
               key={player.id}
               {...player}
               player_id={player.player_id}
               onBid={(playerId, bidAmount) => handleBid(playerId, bidAmount)}
               onDelete={playerId => handleDelete(playerId)}
            />
         ))}
      </div>
   );
};
