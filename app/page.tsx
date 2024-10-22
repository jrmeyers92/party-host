import Hero from "@/components/hero";

export default async function Index() {
  return (
    <section className="flex flex-col items-center justify-center">
      <Hero />
      <main className="flex flex-1 flex-col gap-6 px-4"></main>
    </section>
  );
}
