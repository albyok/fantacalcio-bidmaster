
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle } from "lucide-react";

export function PlayersTable() {
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

  if (isLoading) {
    return <div className="text-center py-4">Caricamento giocatori...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Ruolo</TableHead>
            <TableHead>Ruolo Mantra</TableHead>
            <TableHead>Squadra</TableHead>
            <TableHead>Fantateam</TableHead>
            <TableHead className="text-right">PG</TableHead>
            <TableHead className="text-right">MV</TableHead>
            <TableHead className="text-right">FM</TableHead>
            <TableHead className="text-right">Prezzo</TableHead>
            <TableHead className="text-center">Fuori Lista</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players?.map((player) => (
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
  );
}
