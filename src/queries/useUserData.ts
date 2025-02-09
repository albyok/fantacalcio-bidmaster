import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamData = (userId) => {
    return useQuery({
        queryKey: ["user-team", userId],
        queryFn: async () => {
            if (!userId) return null;

            const { data: userTeam } = await supabase
                .from("user_teams")
                .select("team_id")
                .eq("user_id", userId)
                .single();

            if (!userTeam) return null;

            const { data: team } = await supabase
                .from("teams")
                .select("*")
                .eq("id", userTeam.team_id)
                .single();

            return team;
        },
        enabled: !!userId,
    });
};

export const useProfileData = (userId) => {
    return useQuery({
        queryKey: ["user-profile", userId],
        queryFn: async () => {
            if (!userId) return null;

            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            return data;
        },
        enabled: !!userId,
    });
};

export const usePlayersData = (userId) => {
    return useQuery({
        queryKey: ["user-bids", userId],
        queryFn: async () => {
            if (!userId) return [];

            const { data: userBids } = await supabase
                .from("bids")
                .select("player_id, bid_amount")
                .eq("user_id", userId);

            if (!userBids) return [];

            const playerIds = userBids.map((bid) => bid.player_id);
            const { data: players } = await supabase
                .from("players")
                .select("*")
                .in("player_id", playerIds);

            const playersWithBids = players.map((player) => ({
                ...player,
                currentBid:
                    userBids.find((bid) => bid.player_id === player.player_id)
                        ?.bid_amount || player.fantaprice,
            }));

            return playersWithBids;
        },
        enabled: !!userId,
    });
};
