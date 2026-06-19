import { CommunityDemo } from '@/features/demo/CommunityDemo';

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      <header className="pt-8 text-center">
        <h1 className="text-4xl font-bold">UNISMP</h1>
        <p className="text-lg opacity-80">Infraestructura base conectada.</p>
      </header>
      <CommunityDemo />
    </main>
  );
}
