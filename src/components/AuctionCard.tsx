import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCurrentUserId, useTeamData, useUserIsAdmin } from '@/queries/useUserData';
import { BidDetail } from '@/integrations/supabase/types';
import { leagueConfig } from '@/config/leagueConfig';
import { PlayerCard } from './PlayerCard';
import { Player } from '@/models/player';

interface AuctionCardProps {
   bidDetails: BidDetail;
   onBid: (playerId: number, bidAmount: number) => void;
   onDelete: (playerId: number) => void;
}

function BidButtons({ onBid, setShowInput, player_id, currentBid }) {
   return (
      <div className="flex space-x-2">
         <Button onClick={() => setShowInput(true)} className="w-full group hover:shadow-md transition-all duration-300">
            Fai un'offerta
         </Button>
         <Button onClick={() => onBid(player_id, currentBid + 1)} className="group hover:shadow-md transition-all duration-300">
            +1
         </Button>
      </div>
   );
}

export function AuctionCard({ bidDetails, onBid, onDelete }: AuctionCardProps) {
   const { player_name, player_team, player_role, player_id, player_mantra_role } = bidDetails;
   const { bid_amount: currentBid } = bidDetails;
   const [showInput, setShowInput] = useState(false);
   const [bidAmount, setBidAmount] = useState(currentBid + 1);
   const isAdmin = useUserIsAdmin();
   const userId = useCurrentUserId();
   const role = leagueConfig.system === 'mantra' ? player_mantra_role : player_role;
   const { data: currentTeamData } = useTeamData(userId);

   const player: Player = {
      id: player_id.toString(),
      name: player_name,
      team: player_team,
      role: role,
      fantasy_team_id: bidDetails.fantateam_id,
      fantateam: bidDetails.fantateam_name,
      mantra_role: role,
      out_of_list: false,
      played_matches: 0,
      average_vote: 0,
      average_fantavote: 0,
      fantaprice: 0,
      player_id: player_id,
   };

   const handleBid = () => {
      if (bidAmount > currentBid) {
         onBid(player_id, bidAmount);
         setShowInput(false);
      }
   };

   return (
      <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg animate-slide-up">
         <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
               <PlayerCard player={player} offerTeamName={bidDetails.fantateam_name} />
               {isAdmin && (
                  <button onClick={() => onDelete(player_id)} className="text-red-500 hover:text-red-700 transition-colors duration-300">
                     <TrashIcon className="w-5 h-5" />
                  </button>
               )}
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Offerta attuale</span>
                  <span className="font-medium text-primary">{currentBid}M</span>
               </div>
            </div>

            {currentTeamData && bidDetails.fantateam_id != currentTeamData.id && (
               <BidButtons onBid={onBid} setShowInput={setShowInput} player_id={player_id} currentBid={currentBid} />
            )}

            {showInput && (
               <div className="mt-4 flex space-x-2">
                  <input
                     type="number"
                     min={currentBid + 1}
                     value={bidAmount}
                     onChange={e => setBidAmount(Number(e.target.value))}
                     className="w-full p-2 border rounded"
                  />
                  <Button onClick={handleBid} className="group hover:shadow-md transition-all duration-300">
                     Conferma
                  </Button>
               </div>
            )}
         </div>
      </Card>
   );
}
