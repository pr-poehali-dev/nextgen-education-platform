import { useState } from "react";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SearchSection } from "@/components/SearchSection";
import { CatalogSection } from "@/components/CatalogSection";
import { Features } from "@/components/Features";
import { ContactSection } from "@/components/ContactSection";

export default function Index() {
  const [filters, setFilters] = useState<{ brand: string; body: string; budget: string; mileage: string } | undefined>();
  const [searchLoading, setSearchLoading] = useState(false);

  return (
    <>
      <Hero />
      <HowItWorks />
      <SearchSection onSearch={setFilters} loading={searchLoading} />
      <CatalogSection filters={filters} onLoadingChange={setSearchLoading} />
      <Features />
      <ContactSection />
    </>
  );
}