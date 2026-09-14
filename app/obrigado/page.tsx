export default function Obrigado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8 text-center text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-4xl font-bold">Obrigado por preencher!</h1>
      <p className="mt-4 max-w-md text-zinc-400">
        Seu diagnóstico foi copiado. Em breve entraremos em contato para
        explicar o que os 4 números significam para o seu negócio.
      </p>

      <a href="/" className="mt-10 text-sm text-zinc-500 underline hover:text-white">
        ← Refazer o diagnóstico
      </a>
    </main>
  );
}