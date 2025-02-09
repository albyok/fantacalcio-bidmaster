import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { columns } from '@/config/playersTableColumns';
import { PlayerFilters } from './PlayerFilters';
import { leagueConfig } from '@/config/leagueConfig';
import { PlayerAvatar } from './PlayerAvatar';
import { useToast } from '@/components/ui/use-toast';
import { placeBid } from '@/integrations/supabase/bids';
import { usePlayerFilters } from '@/hooks/usePlayerFilters';

const renderTableCell = (player: any, column: any) => {
   switch (column.key) {
      case 'photo':
         return <PlayerAvatar name={player.name} />;
      case 'fantateam':
         return player.fantateam || player.fantasy_team?.name || 'Svincolato';
      case 'out_of_list':
         return player.out_of_list ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
         ) : (
            <XCircle className="h-4 w-4 text-red-500 mx-auto" />
         );
      case 'average_vote':
      case 'average_fantavote':
         return player[column.key]?.toFixed(2);
      case 'fantaprice':
         return `${player[column.key]}M`;
      case 'role':
         return leagueConfig.system === 'classic' ? player.role : null;
      case 'mantra_role':
         return leagueConfig.system === 'mantra' ? player.mantra_role : null;
      default:
         return player[column.key];
   }
};

export function PlayersTable() {
   const { toast } = useToast();
   const { filteredAndSortedPlayers, isLoading, searchQuery, setSearchQuery, roleFilter, setRoleFilter, handleSort } = usePlayerFilters();

   if (isLoading) {
      return <div className="text-center py-4">Caricamento giocatori...</div>;
   }

   const renderSortButton = (column: string, label: string) => (
      <Button variant="ghost" onClick={() => handleSort(column)} className="h-8 px-2 lg:px-3">
         {label}
         <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
   );

   const visibleColumns = columns.filter(column => {
      if (column.key === 'role' && leagueConfig.system !== 'classic') {
         return false;
      }
      if (column.key === 'mantra_role' && leagueConfig.system !== 'mantra') {
         return false;
      }
      return true;
   });

   const handlePlayerClick = async (playerId: number, bidAmount: number) => {
      try {
         await placeBid(playerId, bidAmount);
         toast({
            title: 'Offerta effettuata!',
            description: 'La tua offerta è stata registrata con successo.',
         });
      } catch (error) {
         console.error("Errore durante l'inserimento dell'offerta:", error);
         toast({
            title: 'Errore',
            description: "Si è verificato un errore durante l'inserimento dell'offerta.",
            variant: 'destructive',
         });
      }
   };

   return (
      <div className="space-y-4">
         <PlayerFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} roleFilter={roleFilter} setRoleFilter={setRoleFilter} />
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  <TableRow>
                     {visibleColumns.map(column => (
                        <TableHead key={column.key} className={column.align ? `text-${column.align}` : ''}>
                           {column.sortable ? renderSortButton(column.key, column.label) : column.label}
                        </TableHead>
                     ))}
                     <TableHead className="text-center">Offerta</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredAndSortedPlayers?.map(player => (
                     <TableRow key={player.id}>
                        {visibleColumns.map(column => (
                           <TableCell key={column.key} className={column.align ? `text-${column.align}` : ''}>
                              {renderTableCell(player, column)}
                           </TableCell>
                        ))}
                        <TableCell className="text-center">
                           <Button variant="outline" onClick={() => handlePlayerClick(player.player_id, 1)}>
                              Offri
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
