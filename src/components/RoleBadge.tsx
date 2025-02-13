import { Badge } from '@/components/ui/badge';
import { leagueConfig } from '@/config/leagueConfig';

interface RoleBadgeProps {
   role: string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
   return (
      <Badge className="ml-2" variant="secondary">
         {role}
      </Badge>
   );
}
