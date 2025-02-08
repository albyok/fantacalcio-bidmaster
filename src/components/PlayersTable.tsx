import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { columns } from "@/config/playersTableColumns";
import { PlayerFilters } from "./PlayerFilters";
import { leagueConfig } from "@/config/leagueConfig";
import { PlayerAvatar } from "./PlayerAvatar";

type SortConfig = {
    column: string;
    direction: "asc" | "desc";
};

const renderTableCell = (player: any, column: any) => {
    switch (column.key) {
        case "photo":
            return <PlayerAvatar name={player.name} />;
        case "fantateam":
            return (
                player.fantateam || player.fantasy_team?.name || "Svincolato"
            );
        case "out_of_list":
            return player.out_of_list ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
            ) : (
                <XCircle className="h-4 w-4 text-red-500 mx-auto" />
            );
        case "average_vote":
        case "average_fantavote":
            return player[column.key]?.toFixed(2);
        case "fantaprice":
            return `${player[column.key]}M`;
        case "role":
            return leagueConfig.system === "classic" ? player.role : null;
        case "mantra_role":
            return leagueConfig.system === "mantra" ? player.mantra_role : null;
        default:
            return player[column.key];
    }
};

export function PlayersTable() {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [mantraRoleFilter, setMantraRoleFilter] = useState<string>("all");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        column: "name",
        direction: "asc",
    });

    const { data: players, isLoading } = useQuery({
        queryKey: ["players"],
        queryFn: async () => {
            const { data, error } = await supabase.from("players").select(`
          *,
          fantasy_team:teams(name)
        `);

            if (error) throw error;
            return data;
        },
    });

    const handleSort = (column: string) => {
        setSortConfig((current) => ({
            column,
            direction:
                current.column === column && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const filteredAndSortedPlayers = players
        ?.filter(
            ({ name, role, mantra_role }) =>
                name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (roleFilter === "all" || role === roleFilter) &&
                (mantraRoleFilter === "all" || mantra_role === mantraRoleFilter)
        )
        .sort((a, b) => {
            const aValue = a[sortConfig.column as keyof typeof a];
            const bValue = b[sortConfig.column as keyof typeof b];

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            }

            return sortConfig.direction === "asc"
                ? String(aValue || "").localeCompare(String(bValue || ""))
                : String(bValue || "").localeCompare(String(aValue || ""));
        });

    const uniqueRoles = [
        ...new Set(players?.map((player) => player.role) || []),
    ];
    const uniqueMantraRoles = [
        ...new Set(
            players?.map((player) => player.mantra_role).filter(Boolean) || []
        ),
    ];

    if (isLoading) {
        return <div className="text-center py-4">Caricamento giocatori...</div>;
    }

    const renderSortButton = (column: string, label: string) => (
        <Button
            variant="ghost"
            onClick={() => handleSort(column)}
            className="h-8 px-2 lg:px-3"
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );

    const visibleColumns = columns.filter((column) => {
        if (column.key === "role" && leagueConfig.system !== "classic") {
            return false;
        }
        if (column.key === "mantra_role" && leagueConfig.system !== "mantra") {
            return false;
        }
        return true;
    });

    return (
        <div className="space-y-4">
            <PlayerFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                mantraRoleFilter={mantraRoleFilter}
                setMantraRoleFilter={setMantraRoleFilter}
                uniqueRoles={uniqueRoles}
                uniqueMantraRoles={uniqueMantraRoles}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className={
                                        column.align
                                            ? `text-${column.align}`
                                            : ""
                                    }
                                >
                                    {column.sortable
                                        ? renderSortButton(
                                              column.key,
                                              column.label
                                          )
                                        : column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedPlayers?.map((player) => (
                            <TableRow key={player.id}>
                                {visibleColumns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        className={
                                            column.align
                                                ? `text-${column.align}`
                                                : ""
                                        }
                                    >
                                        {renderTableCell(player, column)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
