import { useEffect, useState } from 'react';
import { BidDetail } from '@/integrations/supabase/types';
import { useFantateams } from '@/queries/useTeams';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@mdi/react';
import { mdiExitRun } from '@mdi/js';

interface BidHistoryStatusProps {
   bidHistory: BidDetail[];
}

export function BidHistoryStatus({ bidHistory }: BidHistoryStatusProps) {
   const { data: teamsData } = useFantateams();
   const [teamsStatus, setTeamsStatus] = useState<{ name: string; status: string; bidAmount?: number }[]>([]);

   useEffect(() => {
      if (teamsData) {
         const teamsStatus = teamsData.map(team => {
            const bid = bidHistory.find(bid => bid.fantateam_name === team.name);
            if (bid) {
               return { name: team.name, status: bid.bid_amount === -1 ? 'red' : 'green', bidAmount: bid.bid_amount };
            } else {
               return { name: team.name, status: 'gray' };
            }
         });
         setTeamsStatus(teamsStatus);
      }
   }, [bidHistory, teamsData]);

   return (
      <div className="p-4 flex justify-center">
         <ul className="list-none flex space-x-2">
            {teamsStatus.map(team => (
               <li key={team.name} className="relative group">
                  <Avatar
                     className={`w-9 h-9 border-2 rounded-full ${
                        team.status === 'green' ? 'border-green-500' : team.status === 'red' ? 'border-red-500' : 'border-gray-500'
                     }`}
                  >
                     <AvatarImage src={`/path/to/avatar/${team.name}.png`} alt={team.name} />
                     <AvatarFallback>
                        {team.name
                           .split(' ')
                           .map(word => word.charAt(0))
                           .join('')}
                     </AvatarFallback>
                  </Avatar>
                  {team.bidAmount !== undefined ? (
                     team.bidAmount === -1 ? (
                        <div className="flex justify-center text-xs mt-1 select-none">
                           <Icon path={mdiExitRun} size={1} />
                        </div>
                     ) : (
                        <div className="text-center text-xs mt-1 select-none">{team.bidAmount}</div>
                     )
                  ) : (
                     <div className="text-center text-xs mt-1">-</div>
                  )}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded p-1 select-none">
                     {team.name}
                  </span>
               </li>
            ))}
         </ul>
      </div>
   );
}
