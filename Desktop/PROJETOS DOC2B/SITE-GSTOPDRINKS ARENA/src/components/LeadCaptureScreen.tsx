import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, User, ArrowRight } from "lucide-react";
import { EASE, Btn, Label, Reveal, TextLink } from "./ui";

interface Props {
  onNext: (lead: { nome?: string; telefone: string }) => void;
  onBack: () => void;
}

export default function LeadCaptureScreen({ onNext, onBack }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");

  const apenasNumeros = (v: string) => v.replace(/\D/g, "");

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = apenasNumeros(e.target.value);
    if (valor.length > 11) valor = valor.slice(0, 11);

    let formatado = valor;
    if (valor.length > 2) formatado = `(${valor.slice(0, 2)}) ` + valor.slice(2);
    if (valor.length > 7) formatado = formatado.slice(0, 10) + " " + formatado.slice(10);
    if (valor.length > 11) formatado = formatado.slice(0, 15) + "-" + formatado.slice(15);

    setTelefone(formatado);
    setError("");
  };

  const telefoneLimpo = apenasNumeros(telefone);
  const telefoneValido = telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefoneValido) {
      setError("Informe um telefone válido com DDD (ex: (47) 99999-9999)");
      return;
    }
    onNext({ nome: nome.trim() || undefined, telefone });
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
      <form onSubmit={handleSubmit} className="grid gap-6 border-b border-fg/15 pb-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Reveal>
            <Label index="08">Cadastro rápido</Label>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.6vw,4.9rem)] font-medium leading-[0.95] tracking-[-0.02em]">
              Antes de ver sua comanda,<span className="font-normal italic"> deixe seu contato.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-6 text-[15px] leading-relaxed text-fg/60 max-w-md">
            Isso ajuda a GS Top Drinks a entrar em contato com você se houver qualquer dúvida sobre o orçamento. Seu contato fica registrado com segurança.
          </Reveal>
        </div>

        <div className="md:col-span-4">
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] uppercase tracking-[0.16em] text-fg/50 mb-2">Seu nome (opcional)</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => { setNome(e.target.value); setError(""); }}
                placeholder="João Silva"
                className="w-full border border-fg/20 bg-fg/5 px-4 py-3 rounded-lg text-fg focus:outline-none focus:border-acc transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-[0.16em] text-fg/50 mb-2">WhatsApp / Telefone <span className="text-acc">*</span></label>
              <input
                type="tel"
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="(47) 99999-9999"
                maxLength="15"
                className="w-full border border-fg/20 bg-fg/5 px-4 py-3 rounded-lg text-fg focus:outline-none focus:border-acc transition-colors"
              />
            </div>
            {error && (
              <p className="text-[13px] text-[#e2412f] mt-2">{error}</p>
            )}
          </div>
        </div>
      </form>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
        <Btn
          type="button"
          onClick={handleSubmit}
          disabled={!telefoneValido}
          className={`group relative inline-flex items-center gap-3 px-7 py-[17px] text-[12.5px] font-semibold uppercase tracking-[0.18em] transition-[transform,box-shadow,background-color,border-color,color] duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acc ${
            telefoneValido
              ? "bg-acc text-onacc shadow-[-5px_5px_0_0_var(--acc2)] hover:-translate-x-[2px] hover:translate-y-[2px] hover:shadow-[-3px_3px_0_0_var(--acc2)]"
              : "cursor-not-allowed bg-fg/10 text-fg/35"
          }`}
        >
          <ArrowRight className="h-4 w-4" />
          <span>Ver minha comanda</span>
        </Btn>
        <TextLink onClick={onBack} back>
          Voltar
        </TextLink>
      </div>
    </section>
  );
}
