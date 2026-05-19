import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SearchSection } from "@/components/SearchSection";
import { CatalogSection } from "@/components/CatalogSection";
import { Features } from "@/components/Features";
import { ContactSection } from "@/components/ContactSection";

export default function Index() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <SearchSection />
      <CatalogSection />
      <Features />
      <ContactSection />
    </>
  );
}
