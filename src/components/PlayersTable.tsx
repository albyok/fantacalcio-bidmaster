
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type SortConfig = {
  column: string;
  direction: 'asc' | 'desc';
};

export function PlayersTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [mantraRoleFilter, setMantraRoleFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'name', direction: 'asc' });

  const { data: players, isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          fantasy_team:teams(name)
        `);

      if (error) throw error;
      return data;
    },
  });

  const handleSort = (column: string) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedPlayers = players
    ?.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || player.role === roleFilter;
      const matchesMantraRole = mantraRoleFilter === 'all' || player.mantra_role === mantraRoleFilter;
      return matchesSearch && matchesRole && matchesMantraRole;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.column as keyof typeof a];
      const bValue = b[sortConfig.column as keyof typeof b];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = String(aValue || '');
      const bString = String(bValue || '');
      return sortConfig.direction === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });

  const uniqueRoles = [...new Set(players?.map(player => player.role) || [])];
  const uniqueMantraRoles = [...new Set(players?.map(player => player.mantra_role).filter(Boolean) || [])];

  if (isLoading) {
    return <div className="text-center py-4">Caricamento giocatori...</div>;
  }

  const renderSortButton = (column: string, label: string) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(column)}
      className="h-8 px-2 lg:px-3"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cerca giocatore..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtra per ruolo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i ruoli</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={mantraRoleFilter} onValueChange={setMantraRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtra per ruolo Mantra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i ruoli Mantra</SelectItem>
              {uniqueMantraRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{renderSortButton('name', 'Nome')}</TableHead>
              <TableHead>{renderSortButton('role', 'Ruolo')}</TableHead>
              <TableHead>{renderSortButton('mantra_role', 'Ruolo Mantra')}</TableHead>
              <TableHead>{renderSortButton('team', 'Squadra')}</TableHead>
              <TableHead>{renderSortButton('fantateam', 'Fantateam')}</TableHead>
              <TableHead className="text-right">{renderSortButton('played_matches', 'PG')}</TableHead>
              <TableHead className="text-right">{renderSortButton('average_vote', 'MV')}</TableHead>
              <TableHead className="text-right">{renderSortButton('average_fantavote', 'FM')}</TableHead>
              <TableHead className="text-right">{renderSortButton('fantaprice', 'Prezzo')}</TableHead>
              <TableHead className="text-center">Fuori Lista</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedPlayers?.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell>{player.mantra_role}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell>{player.fantateam || player.fantasy_team?.name || 'Svincolato'}</TableCell>
                <TableCell className="text-right">{player.played_matches}</TableCell>
                <TableCell className="text-right">{player.average_vote?.toFixed(2)}</TableCell>
                <TableCell className="text-right">{player.average_fantavote?.toFixed(2)}</TableCell>
                <TableCell className="text-right">{player.fantaprice}M</TableCell>
                <TableCell className="text-center">
                  {player.out_of_list ? 
                    <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : 
                    <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
