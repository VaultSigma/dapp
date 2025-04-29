import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";
import Image from "next/image";
import { ChatInterface } from "@/components/ChatInterface";
import BestPoolCard from "@/components/BestPoolCard";

export const metadata: Metadata = {
  title: "Sigma Finance | AI Rebalancer",
};

// async function handleSubmit(formData: FormData) {
//   'use server'
//   const message = formData.get('message') as string;
//   // Here you would typically call your AI service
//   console.log('Message received:', message);
//   // Simulate a delay
//   await new Promise(resolve => setTimeout(resolve, 2000));
//   // Return void instead of a value
//   return;
// }

export default function BorrowPage() {
  return (
    <>
      <section className="flex flex-col justify-between gap-8 pt-8 md:flex-row md:gap-2">
        <div className="flex h-[60px] items-center gap-4">
          <Image src="/swell.png" width={56} height={56} alt="Polygon" className="rounded-[12px]" />
          <div className="flex h-full flex-col justify-between">
            <h1 className="title-2">
              AI Rebalancer <span className="text-content-secondary">• Swell Chain Testnet</span>
            </h1>
            <p className="text-content-secondary">Interact with with our AI chatbot to rebalance your portfolio.</p>
          </div>
        </div>
      </section>

      <div className="flex gap-4">
        <Card className="flex flex-col h-[600px] flex-1">
          <CardHeader>Chatbot</CardHeader>
          <CardContent className="flex-1 p-0">
            <ChatInterface />
          </CardContent>
        </Card>
        
        <Card className="flex flex-col h-[600px] w-80">
          <CardHeader>Best Performing Pool</CardHeader>
          <CardContent className="flex-1 p-0">
            <BestPoolCard />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// async function BorrowTableWrapper() {
//   const marketSummaries = await getMarketSummaries();
//   return <BorrowTable marketSummaries={marketSummaries ?? []} />;
// }

export const dynamic = "force-static";
export const revalidate = 60;
