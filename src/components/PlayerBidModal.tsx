import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { placeBid } from '@/integrations/supabase/bids';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { Player } from '@/models/player';
import { leagueConfig } from '@/config/leagueConfig';
import { usePlayersForFantateam } from '@/queries/usePlayersData';
import { useTeamData } from '@/queries/useUserData';
import { PlayerCard } from './PlayerCard';

interface PlayerBidModalProps {
   isOpen: boolean;
   onClose: () => void;
   player: Player;
}

export function PlayerBidModal({ isOpen, onClose, player }: PlayerBidModalProps) {
   const { user } = useAuth();
   const { toast } = useToast();
   const [bidAmount, setBidAmount] = useState<number>(1);
   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

   const teamData = useTeamData(user?.id);
   const fantasyTeamPlayers = usePlayersForFantateam(teamData?.data?.id);

   const handleBid = async () => {
      if (!user?.id) {
         toast({
            title: 'Errore',
            description: 'Utente non autenticato.',
            variant: 'destructive',
         });
         return;
      }

      try {
         await placeBid(user.id, player.player_id, selectedPlayer.player_id, bidAmount);
         toast({
            title: 'Offerta effettuata!',
            description: 'La tua offerta è stata registrata con successo.',
         });
         onClose();
      } catch (error) {
         console.error("Errore durante l'inserimento dell'offerta:", error);
         toast({
            title: 'Errore',
            description: "Si è verificato un errore durante l'inserimento dell'offerta.",
            variant: 'destructive',
         });
      }
   };

   const handleOutsideClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
         onClose();
      }
   };

   const handlePlayerSelect = (player: Player) => {
      setSelectedPlayer(player);
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden" onClick={handleOutsideClick}>
         <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Offerta</h2>
            <div className="flex items-center mb-4">
               <PlayerCard player={player} />
               {selectedPlayer && (
                  <div className="ml-4">
                     <PlayerCard player={selectedPlayer} />
                  </div>
               )}
            </div>
            <div>
               <input
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(Number(e.target.value))}
                  className="mt-2 p-2 border rounded max-w-xs"
                  placeholder="Inserisci la tua offerta"
               />
            </div>
            <div className="mt-4">
               <h3>Seleziona un giocatore da vendere</h3>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Ruolo</TableHead>
                        <TableHead>Prezzo</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {fantasyTeamPlayers.map(player => (
                        <TableRow
                           key={player.id}
                           onClick={() => handlePlayerSelect(player)}
                           className={selectedPlayer?.id === player.id ? 'bg-gray-200' : ''}
                        >
                           <TableCell>{player.name}</TableCell>
                           <TableCell>{player.role}</TableCell>
                           <TableCell>{player.fantaprice}M</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
            <div className="mt-4 flex justify-end">
               <Button variant="outline" onClick={onClose} className="mr-2">
                  Chiudi
               </Button>
               <Button variant="default" onClick={handleBid} disabled={!selectedPlayer}>
                  Offri
               </Button>
            </div>
         </div>
      </div>
   );
}
