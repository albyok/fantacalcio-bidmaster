import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { PlayerAvatar } from './PlayerAvatar';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCurrentUserId, useUserIsAdmin } from '@/queries/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { BidDetail } from '@/integrations/supabase/types';
import { leagueConfig } from '@/config/leagueConfig';

interface AuctionCardProps {
   bidDetails: BidDetail;
   onBid: (playerId: number, bidAmount: number) => void;
   onDelete: (playerId: number) => void;
}

export function AuctionCard({ bidDetails, onBid, onDelete }: AuctionCardProps) {
   const { player_name, player_team, player_role, player_id, player_mantra_role } = bidDetails;
   const { bid_amount: currentBid } = bidDetails;
   const [showInput, setShowInput] = useState(false);
   const [bidAmount, setBidAmount] = useState(currentBid + 1);
   const isAdmin = useUserIsAdmin();
   const [teamName, setTeamName] = useState<string | null>(null);
   const userId = useCurrentUserId();

   useEffect(() => {
      async function fetchTeamName() {
         const { data, error } = await supabase.from('user_teams').select('teams(name)').eq('user_id', userId).single();
         if (data) {
            setTeamName(data.teams.name);
         }
      }
      fetchTeamName();
   }, [player_id]);

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
               <div className="flex items-center">
                  <PlayerAvatar name={player_name} />
                  <div className="ml-4">
                     <h3 className="text-xl font-semibold tracking-tight flex items-center">
                        {player_name}
                        <Badge className="ml-2" variant="secondary">
                           {leagueConfig.system === 'mantra' ? player_mantra_role : player_role}
                        </Badge>
                     </h3>
                     <p className="text-sm text-muted-foreground">{player_team}</p>
                     {teamName && <p className="text-sm text-muted-foreground">Offerta da: {teamName}</p>}
                  </div>
               </div>
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

            <div className="flex space-x-2">
               <Button onClick={() => setShowInput(true)} className="w-full group hover:shadow-md transition-all duration-300">
                  Fai un'offerta
               </Button>
               <Button onClick={() => onBid(player_id, currentBid + 1)} className="group hover:shadow-md transition-all duration-300">
                  +1
               </Button>
            </div>
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
