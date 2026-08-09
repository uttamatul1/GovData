import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { HealthSimulator } from '../components/simulator/modules/HealthSimulator';
import { EducationSimulator } from '../components/simulator/modules/EducationSimulator';
import { EconomySimulator } from '../components/simulator/modules/EconomySimulator';
import { AgricultureSimulator } from '../components/simulator/modules/AgricultureSimulator';
import { LawSafetySimulator } from '../components/simulator/modules/LawSafetySimulator';
import { BudgetBar } from '../components/simulator/BudgetBar';
import { HappinessMeter } from '../components/simulator/HappinessMeter';
import { HappinessDialog } from '../components/simulator/HappinessDialog';
import { DataDisclaimer } from '../components/shared/DataDisclaimer';

export function SimulatorPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto scrollbar-thin">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1 flex flex-col">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-3xl font-bold mb-1">Policy Simulator</h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-3xl">
            You are India's Finance Minister. Allocate the Union Budget across sectors and see how your
            decisions impact key development indicators. Every rupee you add to one sector must come
            from somewhere — choose wisely.
          </p>
        </div>

        {/* Happiness Meter - always visible */}
        <div className="mb-3 sm:mb-4">
          <HappinessMeter />
        </div>

        {/* Budget allocator - always visible */}
        <BudgetBar />

        <Tabs defaultValue="health" className="flex-1 flex flex-col">
          <TabsList className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar w-full mb-4 sm:mb-6 p-1 bg-muted/60 rounded-xl shrink-0">
            <TabsTrigger value="health" className="shrink-0 text-xs sm:text-sm px-3 py-1.5">🏥 Health</TabsTrigger>
            <TabsTrigger value="education" className="shrink-0 text-xs sm:text-sm px-3 py-1.5">📚 Education</TabsTrigger>
            <TabsTrigger value="economy" className="shrink-0 text-xs sm:text-sm px-3 py-1.5">🏗️ Economy</TabsTrigger>
            <TabsTrigger value="agriculture" className="shrink-0 text-xs sm:text-sm px-3 py-1.5">🌾 Agriculture</TabsTrigger>
            <TabsTrigger value="safety" className="shrink-0 text-xs sm:text-sm px-3 py-1.5">⚖️ Law & Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="flex-1 mt-0">
            <HealthSimulator />
          </TabsContent>

          <TabsContent value="education" className="flex-1 mt-0">
            <EducationSimulator />
          </TabsContent>

          <TabsContent value="economy" className="flex-1 mt-0">
            <EconomySimulator />
          </TabsContent>

          <TabsContent value="agriculture" className="flex-1 mt-0">
            <AgricultureSimulator />
          </TabsContent>

          <TabsContent value="safety" className="flex-1 mt-0">
            <LawSafetySimulator />
          </TabsContent>
        </Tabs>
      </div>
      <DataDisclaimer />
      <HappinessDialog />
    </div>
  );
}
