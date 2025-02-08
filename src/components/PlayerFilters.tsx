import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PlayerFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    roleFilter: string;
    setRoleFilter: (role: string) => void;
    mantraRoleFilter: string;
    setMantraRoleFilter: (role: string) => void;
    uniqueRoles: string[];
    uniqueMantraRoles: string[];
}

export function PlayerFilters({
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    mantraRoleFilter,
    setMantraRoleFilter,
    uniqueRoles,
    uniqueMantraRoles,
}: PlayerFiltersProps) {
    return (
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
                    <SelectContent className="bg-white border shadow-lg">
                        <SelectItem value="all">Tutti i ruoli</SelectItem>
                        {uniqueRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={mantraRoleFilter}
                    onValueChange={setMantraRoleFilter}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtra per ruolo Mantra" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                        <SelectItem value="all">
                            Tutti i ruoli Mantra
                        </SelectItem>
                        {uniqueMantraRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
