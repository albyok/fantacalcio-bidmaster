import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamSelect() {
   const [teamName, setTeamName] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { user } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();

   // Fetch teams that don't have a coach yet
   const { data: availableTeams } = useQuery({
      queryKey: ['available-teams'],
      queryFn: async () => {
         const { data: teamsWithCoach } = await supabase.from('user_teams').select('team_id');

         const teamIds = teamsWithCoach?.map(ut => ut.team_id) || [];

         // If no teams have coaches yet, just fetch all teams
         if (teamIds.length === 0) {
            const { data: allTeams } = await supabase.from('teams').select('*');
            return allTeams || [];
         }

         // Otherwise, fetch teams that don't have coaches
         const { data: teams } = await supabase.from('teams').select('*').not('id', 'in', teamIds);

         return teams || [];
      },
   });

   const handleCreateTeam = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!teamName.trim() || !user) return;

      setIsLoading(true);
      try {
         // Create a new team
         const { data: team, error: teamError } = await supabase
            .from('teams')
            .insert([{ name: teamName }])
            .select()
            .single();

         if (teamError) throw teamError;

         // Associate the user with the team
         const { error: userTeamError } = await supabase.from('user_teams').insert([{ user_id: user.id, team_id: team.id }]);

         if (userTeamError) throw userTeamError;

         toast({
            title: 'Squadra creata!',
            description: 'La tua squadra è stata creata con successo.',
         });

         navigate('/');
      } catch (error) {
         console.error('Error creating team:', error);
         toast({
            title: 'Errore',
            description: 'Si è verificato un errore durante la creazione della squadra.',
            variant: 'destructive',
         });
      } finally {
         setIsLoading(false);
      }
   };

   const handleJoinTeam = async (teamId: string) => {
      if (!user) return;

      setIsLoading(true);
      try {
         const { error } = await supabase.from('user_teams').insert([{ user_id: user.id, team_id: teamId }]);

         if (error) throw error;

         toast({
            title: 'Squadra selezionata!',
            description: 'Ti sei unito alla squadra con successo.',
         });

         navigate('/');
      } catch (error) {
         console.error('Error joining team:', error);
         toast({
            title: 'Errore',
            description: 'Si è verificato un errore durante la selezione della squadra.',
            variant: 'destructive',
         });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="w-full max-w-4xl">
            <Tabs defaultValue="join" className="w-full">
               <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="join">Unisciti a una squadra</TabsTrigger>
                  <TabsTrigger value="create">Crea una nuova squadra</TabsTrigger>
               </TabsList>

               <TabsContent value="join">
                  <Card>
                     <CardHeader>
                        <CardTitle>Squadre disponibili</CardTitle>
                        <CardDescription>Seleziona una squadra esistente da allenare</CardDescription>
                     </CardHeader>
                     <CardContent className="grid gap-4">
                        {availableTeams?.length === 0 ? (
                           <p className="text-center text-gray-500">Non ci sono squadre disponibili al momento</p>
                        ) : (
                           availableTeams?.map(team => (
                              <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                                 <div>
                                    <h3 className="font-medium">{team.name}</h3>
                                    <p className="text-sm text-gray-500">Budget: {team.budget}M</p>
                                 </div>
                                 <Button onClick={() => handleJoinTeam(team.id)} disabled={isLoading}>
                                    Seleziona
                                 </Button>
                              </div>
                           ))
                        )}
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="create">
                  <Card>
                     <CardHeader>
                        <CardTitle>Crea una nuova squadra</CardTitle>
                        <CardDescription>Inserisci il nome della tua nuova squadra</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                           <div className="space-y-2">
                              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                                 Nome della squadra
                              </label>
                              <Input
                                 id="teamName"
                                 type="text"
                                 required
                                 value={teamName}
                                 onChange={e => setTeamName(e.target.value)}
                                 placeholder="Inserisci il nome della tua squadra"
                              />
                           </div>

                           <Button type="submit" className="w-full" disabled={isLoading || !teamName.trim()}>
                              {isLoading ? 'Creazione in corso...' : 'Crea squadra'}
                           </Button>
                        </form>
                     </CardContent>
                  </Card>
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
}
