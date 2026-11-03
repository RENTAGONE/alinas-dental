import { Hero } from "@/components/Hero";
import { TreatmentExplorer } from "@/components/TreatmentExplorer";
import { TrustStats } from "@/components/TrustStats";
import { Doctors } from "@/components/Doctors";
import { AppointmentPicker } from "@/components/AppointmentPicker";
import { Reviews } from "@/components/Reviews";
import { Process } from "@/components/Process";
import { FAQ } from "@/components/FAQ";
import { LocationSection } from "@/components/LocationSection";

// O02: Hero, Treatment explorer with live tier, Trust and stats, Doctors, Appointment picker, Reviews, Process, FAQ, Location
export default function Home() {
  return (
    <>
      <Hero />
      <TreatmentExplorer />
      <TrustStats />
      <Doctors />
      <AppointmentPicker />
      <Reviews />
      <Process tone="dark" />
      <FAQ />
      <LocationSection />
    </>
  );
}
