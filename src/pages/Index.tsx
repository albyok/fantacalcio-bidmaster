import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { PlayersTable } from '@/components/PlayersTable';
import Header from '@/components/Header';
import { useTeamData, useProfileData } from '@/queries/useUserData';
import { getBids } from '@/integrations/supabase/bids';
import { BidManager } from '@/components/BidManager';

const Index = () => {
   const { toast } = useToast();
   const [isLoading, setIsLoading] = useState(false);
   const { user } = useAuth();

   const { data: teamData } = useTeamData(user?.id);
   const { data: profile } = useProfileData(user?.id);
   const { data: playersData } = getBids(user?.id);

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="container px-4 py-8">
            <div className="space-y-6">
               <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">Asta Fantacalcio</h1>
                  <p className="text-muted-foreground">Fai le tue offerte per i migliori giocatori della Serie A</p>
               </div>
               <Header profile={profile} teamData={teamData} isLoading={isLoading} setIsLoading={setIsLoading} />
               {playersData && <BidManager playersData={playersData} toast={toast} />}
               <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Lista Giocatori</h2>
                  <PlayersTable />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Index;
