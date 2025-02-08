
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function TeamSelect() {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !user) return;

    setIsLoading(true);
    try {
      // Create a new team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert([{ name: teamName }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Associate the user with the team
      const { error: userTeamError } = await supabase
        .from("user_teams")
        .insert([{ user_id: user.id, team_id: team.id }]);

      if (userTeamError) throw userTeamError;

      toast({
        title: "Squadra creata!",
        description: "La tua squadra è stata creata con successo.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione della squadra.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Crea la tua squadra</h1>
          <p className="text-gray-600 mt-2">
            Per partecipare all'asta, devi prima creare una squadra
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
              Nome della squadra
            </label>
            <Input
              id="teamName"
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Inserisci il nome della tua squadra"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !teamName.trim()}
          >
            {isLoading ? "Creazione in corso..." : "Crea squadra"}
          </Button>
        </form>
      </div>
    </div>
  );
}
