import { PlayerAvatar } from './PlayerAvatar';
import { RoleBadge } from './RoleBadge';
import { Player } from '@/models/player';
import { leagueConfig } from '@/config/leagueConfig';

interface PlayerCardProps {
   player: Player;
   offerTeamName?: string;
}

export function PlayerCard({ player, offerTeamName }: PlayerCardProps) {
   const { name, team, role, mantra_role } = player;
   const playerRole = leagueConfig.system === 'mantra' ? mantra_role : role;
   return (
      <div className="flex items-center">
         <PlayerAvatar name={name} />
         <div className="ml-4">
            <h3 className="text-xl font-semibold tracking-tight flex items-center">
               {name}
               <RoleBadge role={playerRole} />
            </h3>
            <p className="text-sm text-muted-foreground">{team}</p>
            {offerTeamName && <p className="text-sm text-muted-foreground">Offerta da: {offerTeamName}</p>}
         </div>
      </div>
   );
}
