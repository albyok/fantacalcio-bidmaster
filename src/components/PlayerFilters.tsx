import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { leagueConfig } from '@/config/leagueConfig';

interface PlayerFiltersProps {
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   roleFilter: string;
   setRoleFilter: (role: string) => void;
   showPurchasable: boolean;
   setShowPurchasable: (show: boolean) => void;
}

export function PlayerFilters({
   searchQuery,
   setSearchQuery,
   roleFilter,
   setRoleFilter,
   showPurchasable,
   setShowPurchasable,
}: PlayerFiltersProps) {
   const isClassic = leagueConfig.system === 'classic';
   const roleOptions = isClassic ? leagueConfig.classicRoles : leagueConfig.mantraRoles;

   return (
      <div className="flex flex-col sm:flex-row gap-4">
         <div className="flex-1">
            <Input
               placeholder="Cerca giocatore..."
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="max-w-sm"
            />
         </div>
         <div className="flex gap-2">
            <ToggleGroup type="single" value={roleFilter} onValueChange={setRoleFilter} className="flex gap-2">
               <ToggleGroupItem value="all">Tutti i ruoli</ToggleGroupItem>
               {roleOptions.map(role => (
                  <ToggleGroupItem key={role} value={role}>
                     {role}
                  </ToggleGroupItem>
               ))}
            </ToggleGroup>
            <ToggleGroup
               type="single"
               value={showPurchasable ? 'purchasable' : 'all'}
               onValueChange={() => setShowPurchasable(!showPurchasable)}
               className="flex gap-2"
            >
               <ToggleGroupItem value="purchasable" className={`flex gap-2 ${showPurchasable ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  Solo acquistabili
               </ToggleGroupItem>
            </ToggleGroup>
         </div>
      </div>
   );
}
