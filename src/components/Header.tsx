import { User, Coins, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { processExcelFile } from '@/utils/excelProcessor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Header = ({ profile, teamData, isLoading, setIsLoading }) => {
   const { toast } = useToast();

   const handleImportClick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';
      input.onchange = async e => {
         const file = (e.target as HTMLInputElement).files?.[0];
         if (!file) return;

         setIsLoading(true);
         try {
            await processExcelFile(file, supabase, toast);
         } catch (error) {
            console.error('Errore durante il caricamento:', error);
            toast({
               title: 'Errore durante il caricamento',
               description: 'Si è verificato un errore durante il caricamento del file.',
               variant: 'destructive',
            });
         } finally {
            setIsLoading(false);
         }
      };
      input.click();
   };

   return (
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
               <User className="h-5 w-5 text-gray-500" />
               <span className="text-sm text-gray-600">{profile?.email}</span>
            </div>
            <div className="flex items-center space-x-3">
               <span className="text-sm font-medium">{teamData?.name}</span>
               <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <Coins className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">{teamData?.budget}M</span>
               </div>
            </div>
         </div>

         {profile?.is_admin && (
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                     <Menu className="h-5 w-5" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleImportClick} disabled={isLoading} className="bg-white">
                     {isLoading ? 'Importazione in corso...' : 'Importa Giocatori'}
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         )}
      </div>
   );
};

export default Header;
