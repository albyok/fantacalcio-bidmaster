
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

export function PlayerImport() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const processExcelFile = async (file: File) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        console.log('Dati Excel letti:', jsonData);

        // Process each row and insert into the database
        for (const row of jsonData as any[]) {
          if (!row.Nome || !row.Squadra || !row.Ruolo) {
            console.error('Dati mancanti nella riga:', row);
            continue;
          }

          let fantasyTeamId = null;
          if (row.Fantasquadra) {
            console.log('Cerco la Fantasquadra:', row.Fantasquadra);
            const { data: teamData, error: teamError } = await supabase
              .rpc('get_team_id_by_name', {
                team_name: row.Fantasquadra
              });

            if (teamError) {
              console.error('Errore nel recupero del team ID:', teamError);
            } else {
              console.log('Team ID trovato:', teamData);
              fantasyTeamId = teamData;
            }
          }

          const playerData = {
            name: row.Nome,
            team: row.Squadra,
            role: row.Ruolo,
            fantateam: row.Fantasquadra || null,
            mantra_role: row["Ruolo mantra"] || null,
            out_of_list: row["Fuori lista"] === true || row["Fuori lista"] === "true" || row["Fuori lista"] === 1,
            played_matches: parseInt(row.PGv) || 0,
            average_vote: parseFloat(row.MV) || 0,
            average_fantavote: parseFloat(row.FM) || 0,
            fantaprice: parseInt(row.Prezzo) || 1,
            fantasy_team_id: fantasyTeamId
          };

          console.log('Inserimento giocatore:', playerData);

          const { data, error } = await supabase
            .from('players')
            .insert(playerData);

          if (error) {
            console.error('Errore durante l\'inserimento del giocatore:', error);
            toast({
              title: "Errore durante l'inserimento",
              description: `Errore per il giocatore ${row.Nome}: ${error.message}`,
              variant: "destructive",
            });
          } else {
            console.log('Giocatore inserito con successo:', data);
          }
        }

        toast({
          title: "Importazione completata",
          description: `Elaborati ${jsonData.length} giocatori.`,
        });
      } catch (error) {
        console.error('Errore durante l\'importazione:', error);
        toast({
          title: "Errore durante l'importazione",
          description: "Si è verificato un errore durante l'importazione dei giocatori. Verifica che il file Excel abbia le colonne corrette.",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      await processExcelFile(file);
    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      toast({
        title: "Errore durante il caricamento",
        description: "Si è verificato un errore durante il caricamento del file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={isLoading}
      />
      {isLoading && <div>Caricamento in corso...</div>}
    </div>
  );
}
