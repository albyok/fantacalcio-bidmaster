import { useState } from 'react';
import { AuctionCard } from '@/components/AuctionCard';

export const BidManager = ({ playersData, toast }) => {
   const [players, setPlayers] = useState(playersData || []);

   const handleBid = (playerId: number, bidAmount: number) => {
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

      toast({
         title: 'Offerta effettuata!',
         description: 'La tua offerta è stata registrata con successo.',
      });
   };

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {players.map(player => (
            <AuctionCard
               key={player.id}
               {...player}
               player_id={player.player_id}
               onBid={(playerId, bidAmount) => handleBid(playerId, bidAmount)}
            />
         ))}
      </div>
   );
};
