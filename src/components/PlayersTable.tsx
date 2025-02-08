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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { columns } from "@/config/playersTableColumns";
import { PlayerFilters } from "./PlayerFilters";
import { leagueConfig } from "@/config/leagueConfig";

type SortConfig = {
    column: string;
    direction: "asc" | "desc";
};

const formatPlayerNameForImage = (name: string) => {
    return name.toUpperCase().replace(/\s+/g, "-").replace(/[.'’]/g, "");
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
        ?.filter((player) => {
            const matchesSearch = player.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesRole =
                roleFilter === "all" || player.role === roleFilter;
            const matchesMantraRole =
                mantraRoleFilter === "all" ||
                player.mantra_role === mantraRoleFilter;
            return matchesSearch && matchesRole && matchesMantraRole;
        })
        .sort((a, b) => {
            const aValue = a[sortConfig.column as keyof typeof a];
            const bValue = b[sortConfig.column as keyof typeof b];

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            }

            const aString = String(aValue || "");
            const bString = String(bValue || "");
            return sortConfig.direction === "asc"
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
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

    const avatarClass = "w-[60px] h-[80px] object-cover";

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
                                        {column.key === "photo" ? (
                                            <Avatar className={avatarClass}>
                                                <AvatarImage
                                                    src={`https://content.fantacalcio.it/web/campioncini/medium/${formatPlayerNameForImage(
                                                        player.name
                                                    )}.png`}
                                                    alt={player.name}
                                                />
                                                <AvatarFallback>
                                                    {player.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : column.key === "fantateam" ? (
                                            player.fantateam ||
                                            player.fantasy_team?.name ||
                                            "Svincolato"
                                        ) : column.key === "out_of_list" ? (
                                            player.out_of_list ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                                            )
                                        ) : column.key === "average_vote" ||
                                          column.key === "average_fantavote" ? (
                                            player[column.key]?.toFixed(2)
                                        ) : column.key === "fantaprice" ? (
                                            `${player[column.key]}M`
                                        ) : column.key === "role" ? (
                                            leagueConfig.system ===
                                            "classic" ? (
                                                player.role
                                            ) : null
                                        ) : column.key === "mantra_role" ? (
                                            leagueConfig.system === "mantra" ? (
                                                player.mantra_role
                                            ) : null
                                        ) : (
                                            player[column.key]
                                        )}
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
