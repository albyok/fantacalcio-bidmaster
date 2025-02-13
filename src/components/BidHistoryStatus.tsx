import { useEffect, useState } from 'react';
import { BidDetail } from '@/integrations/supabase/types';
import { useFantateams } from '@/queries/useTeams';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@mdi/react';
import { mdiExitRun } from '@mdi/js';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@radix-ui/react-hover-card';
import { PlayerCard } from './PlayerCard';
import { useAllPlayers, usePlayerById } from '@/queries/usePlayersData';

interface BidHistoryStatusProps {
   bidHistory: BidDetail[];
}

export function BidHistoryStatus({ bidHistory }: BidHistoryStatusProps) {
   const { data: teamsData } = useFantateams();
   const [bidEntry, setBidEntry] = useState<{ team_name: string; selling_player_id: number; status: string; bidAmount?: number }[]>([]);
   const allPlayers = useAllPlayers();

   useEffect(() => {
      if (teamsData) {
         const bidEntry = teamsData.map(team => {
            const bids = bidHistory.filter(bid => bid.fantateam_name === team.name);
            const highestBid = bids.reduce((max, bid) => (bid.bid_amount > max.bid_amount ? bid : max), {
               bid_amount: -1,
               selling_player_id: -1,
            });
            if (highestBid.bid_amount !== -1) {
               return {
                  team_name: team.name,
                  selling_player_id: highestBid.selling_player_id,
                  status: highestBid.bid_amount === -1 ? 'gray' : 'green',
                  bidAmount: highestBid.bid_amount,
               };
            } else {
               return { team_name: team.name, selling_player_id: -1, status: 'red' };
            }
         });
         setBidEntry(bidEntry);
      }
   }, [bidHistory, teamsData]);

   return (
      <div className="p-4 flex justify-center">
         <ul className="list-none flex space-x-2">
            {bidEntry.map(bid => {
               const soldPlayer = allPlayers.players?.find(player => player.player_id === bid.selling_player_id);
               return (
                  <li key={bid.team_name} className="relative group">
                     <HoverCard>
                        <HoverCardTrigger asChild>
                           <Avatar
                              className={`w-9 h-9 border-2 rounded-full select-none ${
                                 bid.status === 'green' ? 'border-green-500' : bid.status === 'red' ? 'border-red-500' : 'border-gray-500'
                              }`}
                           >
                              <AvatarImage src={`/path/to/avatar/${bid.team_name}.png`} alt={bid.team_name} />
                              <AvatarFallback>
                                 {bid.team_name
                                    .split(' ')
                                    .map(word => word.charAt(0))
                                    .join('')}
                              </AvatarFallback>
                           </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent
                           className="bg-white text-black text-xs rounded p-1 select-none shadow-lg"
                           style={{ width: 'max-content', whiteSpace: 'nowrap', zIndex: 10 }}
                        >
                           {soldPlayer && <PlayerCard player={soldPlayer} />}
                        </HoverCardContent>
                     </HoverCard>
                     {bid.bidAmount !== undefined ? (
                        bid.bidAmount === -1 ? (
                           <div className="flex justify-center text-xs mt-1 select-none">
                              <Icon path={mdiExitRun} size={1} />
                           </div>
                        ) : (
                           <div className="text-center text-xs mt-1 select-none">{bid.bidAmount}</div>
                        )
                     ) : (
                        <div className="text-center text-xs mt-1">-</div>
                     )}
                  </li>
               );
            })}
         </ul>
      </div>
   );
}
