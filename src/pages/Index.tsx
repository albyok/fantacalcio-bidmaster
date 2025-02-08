import { useState } from "react";
import { PlayerCard } from "@/components/PlayerCard";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, User } from "lucide-react";
import { PlayersTable } from "@/components/PlayersTable";
import { PlayerImport } from "@/components/PlayerImport";

const MOCK_PLAYERS = [
  {
    id: 1,
    name: "Lautaro Martinez",
    team: "Inter",
    role: "ATT",
    startingPrice: 25,
    currentBid: 28,
    timeLeft: "2:30",
  },
  {
    id: 2,
    name: "Federico Chiesa",
    team: "Juventus",
    role: "ATT",
    startingPrice: 20,
    currentBid: 20,
    timeLeft: "3:45",
  },
  {
    id: 3,
    name: "Rafael Leão",
    team: "Milan",
    role: "ATT",
    startingPrice: 22,
    currentBid: 25,
    timeLeft: "1:15",
  },
];

const Index = () => {
  const { toast } = useToast();
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const { user } = useAuth();

  const { data: teamData } = useQuery({
    queryKey: ['user-team', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: userTeam } = await supabase
        .from('user_teams')
        .select('team_id')
        .eq('user_id', user.id)
        .single();

      if (!userTeam) return null;

      const { data: team } = await supabase
        .from('teams')
        .select('*')
        .eq('id', userTeam.team_id)
        .single();

      return team;
    },
    enabled: !!user?.id
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return data;
    },
    enabled: !!user?.id
  });

  const handleBid = (playerId: number) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            currentBid: player.currentBid + 1,
          };
        }
        return player;
      })
    );

    toast({
      title: "Offerta effettuata!",
      description: "La tua offerta è stata registrata con successo.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8">
        <div className="space-y-6">
          <Card className="bg-white">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Allenatore</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Squadra</p>
                  <p className="font-medium">{teamData?.name}</p>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <Coins className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">{teamData?.budget}M</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Asta Fantacalcio</h1>
            <p className="text-muted-foreground">
              Fai le tue offerte per i migliori giocatori della Serie A
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Importa Giocatori</h2>
            <PlayerImport />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                {...player}
                onBid={() => handleBid(player.id)}
              />
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Lista Giocatori</h2>
            <PlayersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
