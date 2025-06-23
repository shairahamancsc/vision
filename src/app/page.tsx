import { EcommerceSection } from '@/components/EcommerceSection';
import { RepairTicketCreator } from '@/components/RepairTicketCreator';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <RepairTicketCreator />

      <Separator className="my-12 md:my-16" />

      <EcommerceSection />
    </div>
  );
}
