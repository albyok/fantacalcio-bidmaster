import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { leagueConfig } from '@/config/leagueConfig';

type SortConfig = {
   column: string;
   direction: 'asc' | 'desc';
};

export const usePlayerFilters = () => {
   const [searchQuery, setSearchQuery] = useState('');
   const [roleFilter, setRoleFilter] = useState<string>('all');
   const [mantraRoleFilter, setMantraRoleFilter] = useState<string>('all');
   const [sortConfig, setSortConfig] = useState<SortConfig>({
      column: 'name',
      direction: 'asc',
   });

   const { data: players, isLoading } = useQuery({
      queryKey: ['players'],
      queryFn: async () => {
         const { data, error } = await supabase.from('players').select(`
          *,
          fantasy_team:teams(name)
        `);

         if (error) throw error;
         return data;
      },
   });

   const handleSort = (column: string) => {
      setSortConfig(current => ({
         column,
         direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc',
      }));
   };

   const filteredAndSortedPlayers = players
      ?.filter(
         ({ name, role, mantra_role }) =>
            name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (roleFilter === 'all' || role === roleFilter) &&
            (mantraRoleFilter === 'all' || mantra_role === mantraRoleFilter)
      )
      .sort((a, b) => {
         const aValue = a[sortConfig.column as keyof typeof a];
         const bValue = b[sortConfig.column as keyof typeof b];

         if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
         }

         return sortConfig.direction === 'asc'
            ? String(aValue || '').localeCompare(String(bValue || ''))
            : String(bValue || '').localeCompare(String(aValue || ''));
      });

   const uniqueRoles = [...new Set(players?.map(player => player.role) || [])];
   const uniqueMantraRoles = [...new Set(players?.map(player => player.mantra_role).filter(Boolean) || [])];

   return {
      filteredAndSortedPlayers,
      uniqueRoles,
      uniqueMantraRoles,
      isLoading,
      searchQuery,
      setSearchQuery,
      roleFilter,
      setRoleFilter,
      mantraRoleFilter,
      setMantraRoleFilter,
      handleSort,
   };
};
