"use client";

import { useState } from "react";

type Servico = { nome: string; preco: string; custo: string };
type Despesa = { nome: string; valor: string };

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const [negocio, setNegocio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [faturamento, setFaturamento] = useState("");
  const [aReceber, setAReceber] = useState("");
  const [servicos, setServicos] = useState<Servico[]>([
    { nome: "", preco: "", custo: "" },
    { nome: "", preco: "", custo: "" },
    { nome: "", preco: "", custo: "" },
  ]);
  const [despesas, setDespesas] = useState<Despesa[]>([
    { nome: "", valor: "" },
    { nome: "", valor: "" },
    { nome: "", valor: "" },
  ]);

  const entrada = Number(faturamento) || 0;
  const pendente = Number(aReceber) || 0;
  const totalDespesas = despesas.reduce((s, d) => s + (Number(d.valor) || 0), 0);

  const margem = (s: Servico) => (Number(s.preco) || 0) - (Number(s.custo) || 0);
  const margemPct = (s: Servico) => {
    const preco = Number(s.preco) || 0;
    if (preco <= 0) return 0;
    return Math.round((margem(s) / preco) * 100);
  };
  const servicosPreenchidos = servicos.filter((s) => s.nome.trim());
  const melhorMargem = servicosPreenchidos.reduce<Servico | null>(
    (melhor, s) => (melhor ? (margem(s) > margem(melhor) ? s : melhor) : s),
    null
  );
  const aperta = totalDespesas > entrada;

  const setServico = (i: number, campo: keyof Servico, valor: string) =>
    setServicos((lista) =>
      lista.map((s, j) => (j === i ? { ...s, [campo]: valor } : s))
    );

  const setDespesa = (i: number, campo: keyof Despesa, valor: string) =>
    setDespesas((lista) =>
      lista.map((d, j) => (j === i ? { ...d, [campo]: valor } : d))
    );

  const textoResumo = () => {
    const linhas = [
      "DIAGNÓSTICO caixa4n",
      "-------------------",
      `Negócio: ${negocio || "—"}`,
      `WhatsApp: ${whatsapp || "—"}`,
      `E-mail: ${email || "—"}`,
      "",
      "SERVIÇOS (preço | custo | margem)",
      ...servicosPreenchidos.map(
        (s) =>
          `${s.nome}: ${brl(Number(s.preco) || 0)} | ${brl(Number(s.custo) || 0)} | ${brl(margem(s))} (${margemPct(s)}%)`
      ),
      "",
      "DESPESAS MENSAIS",
      ...despesas
        .filter((d) => d.nome.trim())
        .map((d) => `${d.nome}: ${brl(Number(d.valor) || 0)}`),
      "",
      "OS 4 NÚMEROS",
      `1. Quanto entra por mês: ${brl(entrada)}`,
      `2. Quanto falta receber: ${brl(pendente)}`,
      `3. Serviço com melhor margem: ${melhorMargem?.nome.trim() || "—"} (margem ${brl(melhorMargem ? margem(melhorMargem) : 0)} — ${melhorMargem ? margemPct(melhorMargem) : 0}%)`,
      `4. Caixa aperta? ${aperta ? "SIM — despesas maiores que a receita" : "OK — receita cobre as despesas"}`,
    ];
    return linhas.join("\n");
  };

  const baixarResumo = () => {
    const blob = new Blob([textoResumo()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagnostico-caixa4n.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

    const enviarParaPlanilha = () => {
    try {
      fetch("https://script.google.com/macros/s/AKfycbzDyyBBBsS9KWjH2nnL_XNXwqiBR1h3sTJYJsiGGXZvdRqQ6IDDw_32rDR6aZtuZ2vwpg/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          negocio,
          whatsapp,
          email,
          faturamento,
          aReceber,
          servicos: servicosPreenchidos
            .map((s) => `${s.nome}: ${s.preco}/${s.custo}`)
            .join("; "),
          despesas: despesas
            .filter((d) => d.nome.trim())
            .map((d) => `${d.nome}: ${d.valor}`)
            .join("; "),
          melhorMargem: melhorMargem
            ? `${melhorMargem.nome} (${brl(margem(melhorMargem))})`
            : "",
          caixaAperta: aperta ? "SIM" : "OK",
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const copiarResumo = async () => {
    try {
      await navigator.clipboard.writeText(textoResumo());
      enviarParaPlanilha();
      window.location.href = "/obrigado";
    } catch {
      alert("Não consegui copiar automaticamente. Use 'Baixar resumo'.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <h1 className="text-4xl font-bold">caixa4n</h1>
          <p className="mt-2 text-zinc-400">
            O copiloto financeiro do seu negócio
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">1. Seu negócio</h2>
          <input
            type="text"
            placeholder="Nome do negócio (ex.: Clínica Beatriz)"
            value={negocio}
            onChange={(e) => setNegocio(e.target.value)}
            className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none placeholder:text-zinc-500"
          />
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="tel"
              placeholder="WhatsApp (ex.: 11 99999-9999)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none placeholder:text-zinc-500"
            />
            <input
              type="email"
              placeholder="E-mail (ex.: contato@clinica.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none placeholder:text-zinc-500"
            />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-400">
                Faturamento recebido no mês (R$)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex.: 5000"
                value={faturamento}
                onChange={(e) => setFaturamento(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none placeholder:text-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">
                Total a receber de clientes (R$)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex.: 2800"
                value={aReceber}
                onChange={(e) => setAReceber(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none placeholder:text-zinc-500"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">2. Serviços, preço e custo</h2>
            <button
              onClick={() => setServicos([...servicos, { nome: "", preco: "", custo: "" }])}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold hover:bg-emerald-500"
            >
              + Serviço
            </button>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            A margem de cada serviço é calculada sozinha (preço − custo).
          </p>
          {servicos.map((s, i) => (
            <div key={i} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Nome do serviço"
                value={s.nome}
                onChange={(e) => setServico(i, "nome", e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none placeholder:text-zinc-500"
              />
              <input
                type="number"
                min="0"
                placeholder="R$"
                value={s.preco}
                onChange={(e) => setServico(i, "preco", e.target.value)}
                className="w-24 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 outline-none placeholder:text-zinc-500"
              />
              <input
                type="number"
                min="0"
                placeholder="Custo"
                value={s.custo}
                onChange={(e) => setServico(i, "custo", e.target.value)}
                className="w-24 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 outline-none placeholder:text-zinc-500"
              />
              {servicos.length > 1 && (
                <button
                  onClick={() => setServicos(servicos.filter((_, j) => j !== i))}
                  className="rounded-lg bg-zinc-800 px-3 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">3. Despesas mensais</h2>
            <button
              onClick={() => setDespesas([...despesas, { nome: "", valor: "" }])}
              className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-500"
            >
              + Despesa
            </button>
          </div>
          {despesas.map((d, i) => (
            <div key={i} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Nome da despesa"
                value={d.nome}
                onChange={(e) => setDespesa(i, "nome", e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none placeholder:text-zinc-500"
              />
              <input
                type="number"
                min="0"
                placeholder="R$"
                value={d.valor}
                onChange={(e) => setDespesa(i, "valor", e.target.value)}
                className="w-28 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none placeholder:text-zinc-500"
              />
              {despesas.length > 1 && (
                <button
                  onClick={() => setDespesas(despesas.filter((_, j) => j !== i))}
                  className="rounded-lg bg-zinc-800 px-3 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Quanto entra por mês</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {brl(entrada)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Quanto falta receber</p>
            <p className="mt-2 text-2xl font-bold text-amber-400">
              {brl(pendente)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Serviço com melhor margem</p>
            <p className="mt-2 text-2xl font-bold text-sky-400">
              {melhorMargem?.nome.trim() || "—"}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {melhorMargem
                ? `margem ${brl(margem(melhorMargem))} (${margemPct(melhorMargem)}%)`
                : "preencha preço e custo"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Caixa aperta?</p>
            <p
              className={`mt-2 text-2xl font-bold ${
                aperta ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {aperta ? "SIM — aperta" : "OK — equilibrado"}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-sm text-zinc-400">
            Seus dados ficam apenas no seu navegador nesta página.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={copiarResumo}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-zinc-900 hover:bg-zinc-200"
            >
              Copiar resumo
            </button>
            <button
              onClick={baixarResumo}
              className="rounded-lg border border-zinc-600 px-6 py-3 font-semibold hover:bg-zinc-800"
            >
              Baixar resumo
            </button>
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-zinc-500">
          caixa4n versão 0.4 — diagnóstico em construção
        </p>
      </div>
    </main>
  );
}