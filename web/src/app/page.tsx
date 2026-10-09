import { About } from "@/components/About";
import { Closing } from "@/components/Closing";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Method } from "@/components/Method";
import { Nav } from "@/components/Nav";
import { Plans } from "@/components/Plans";
import { StructuredData } from "@/components/StructuredData";
import { SystemSection } from "@/components/system/SystemSection";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Nav />
      <main>
        <Hero />
        <Method />
        <SystemSection />
        <Plans />
        <About />
        <Testimonials />
        <Faq />
      </main>
      <Closing />
    </>
  );
}
