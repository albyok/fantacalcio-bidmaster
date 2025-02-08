
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

        // Process each row and insert into the database
        for (const row of jsonData as any[]) {
          await supabase
            .from('players')
            .insert({
              name: row.Nome,
              team: row.Squadra,
              role: row.Ruolo,
              starting_price: parseInt(row.Prezzo) || 1,
            });
        }

        toast({
          title: "Importazione completata",
          description: `Importati ${jsonData.length} giocatori con successo.`,
        });
      } catch (error) {
        console.error('Errore durante l\'importazione:', error);
        toast({
          title: "Errore durante l'importazione",
          description: "Si è verificato un errore durante l'importazione dei giocatori. Verifica che il file Excel abbia le colonne corrette: Nome, Squadra, Ruolo, Prezzo",
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
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('xlsx')
        .upload(`players-${Date.now()}.xlsx`, file);

      if (error) throw error;

      // Process the Excel file
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
