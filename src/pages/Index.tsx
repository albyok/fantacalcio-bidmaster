
import { useState } from "react";
import { PlayerCard } from "@/components/PlayerCard";
import { useToast } from "@/components/ui/use-toast";

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
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Asta Fantacalcio</h1>
            <p className="text-muted-foreground">
              Fai le tue offerte per i migliori giocatori della Serie A
            </p>
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
        </div>
      </div>
    </div>
  );
};

export default Index;
