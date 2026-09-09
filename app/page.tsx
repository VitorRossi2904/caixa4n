export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8 text-white">
      <h1 className="text-4xl font-bold">caixa4n</h1>
      <p className="mt-2 text-zinc-400">O copiloto financeiro do seu negócio</p>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Quanto entra por mês</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">R$ 0</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Quanto falta receber</p>
          <p className="mt-2 text-2xl font-bold text-amber-400">R$ 0</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Serviço com melhor margem</p>
          <p className="mt-2 text-2xl font-bold text-sky-400">—</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Quando o caixa aperta</p>
          <p className="mt-2 text-2xl font-bold text-rose-400">—</p>
        </div>
      </div>

      <p className="mt-10 text-sm text-zinc-500">caixa4n versão 0.1 — em construção</p>
    </main>
  );
}