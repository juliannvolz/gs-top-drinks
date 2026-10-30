import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Phone, Clock, CheckCircle, XCircle, Menu, Search } from "lucide-react";
import { Btn, EASE, TextLink } from "../components/ui";
import { listComandas, updateComandaStatus } from "../lib/supabase";

const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || "gstropdrinks1").trim();

type Status = "pendente" | "contatado" | "fechado";

interface ComandaRow {
  id: string;
  nome_cliente: string | null;
  telefone: string;
  segmento: string;
  convidados: number;
  pacote: string;
  drinks: string;
  valor_por_pessoa: number;
  valor_total_evento: number;
  status: Status;
  criado_em: string;
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [comandas, setComandas] = useState<ComandaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "todos">("todos");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/admin") {
      const saved = localStorage.getItem("gs_admin_auth");
      if (saved === "1") {
        setAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError("");
      localStorage.setItem("gs_admin_auth", "1");
    } else {
      setLoginError("Senha incorreta. Tente novamente.");
    }
  };

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("gs_admin_auth");
  };

  const loadComandas = async () => {
    setLoading(true);
    const data = await listComandas();
    setComandas(
      data.map((c: any) => ({
        id: c.id,
        nome_cliente: c.nome_cliente,
        telefone: c.telefone,
        segmento: c.segmento,
        convidados: c.convidados,
        pacote: c.pacote,
        drinks: c.drinks,
        valor_por_pessoa: Number(c.valor_por_pessoa),
        valor_total_evento: Number(c.valor_total_evento),
        status: c.status,
        criado_em: c.criado_em,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      loadComandas();
    }
  }, [authenticated]);

  const filtradas = comandas.filter((c) => {
    const matchSearch =
      c.telefone.includes(search) ||
      (c.nome_cliente && c.nome_cliente.toLowerCase().includes(search.toLowerCase())) ||
      c.segmento.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusLabel = (s: Status) => {
    if (s === "pendente") return "Pendente";
    if (s === "contatado") return "Contatado";
    if (s === "fechado") return "Fechado";
    return s;
  };

  const statusColor = (s: Status) => {
    if (s === "pendente") return "text-[#e2412f] border-[#e2412f]/30 bg-[#e2412f]/10";
    if (s === "contatado") return "text-[#fdb500] border-[#fdb500]/30 bg-[#fdb500]/10";
    if (s === "fechado") return "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10";
    return "text-fg";
  };

  const fmtMoeda = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const waLink = (tel: string) => `https://wa.me/${tel.replace(/\D/g, "")}`;

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-fg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md px-6"
        >
          <div className="border border-fg/15 rounded-2xl p-8 bg-bg/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <LogIn className="h-6 w-6 text-acc" />
              <h1 className="text-xl font-semibold tracking-tight">GS Top Drinks — Admin</h1>
            </div>
            <p className="text-fg/60 text-sm mb-6">Acesso restrito ao dono da empresa. Digite a senha para visualizar as comandas geradas pelos clientes.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-fg/50 mb-2">Senha de admin</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-fg/20 bg-fg/5 px-4 py-3 rounded-lg text-fg focus:outline-none focus:border-acc transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {loginError && <p className="text-xs text-[#e2412f]">{loginError}</p>}
              <Btn type="submit" full>
                Entrar
              </Btn>
            </form>
            <p className="text-[11px] text-fg/40 mt-6">Se esqueceu a senha, solicite a redefinição ao desenvolvedor.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b border-fg/10 bg-bg/85 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-acc flex items-center justify-center text-onacc font-bold text-xs">GS</div>
            <div>
              <h1 className="font-semibold tracking-tight">GS Top Drinks — Admin</h1>
              <p className="text-xs text-fg/50">Controle de comandas geradas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TextLink onClick={logout} className="text-fg/50 hover:text-fg">
              Sair
            </TextLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Comandas geradas</h2>
            <p className="text-fg/50 text-sm">Lista de clientes que simularam orçamento no site</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar telefone, nome ou segmento…"
                className="pl-9 pr-4 py-2 border border-fg/20 bg-fg/5 rounded-lg text-sm text-fg focus:outline-none focus:border-acc transition-colors w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-fg/20 bg-fg/5 px-3 py-2 rounded-lg text-sm text-fg focus:outline-none focus:border-acc"
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="contatado">Contatado</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-fg/50 text-sm">Carregando comandas…</div>
        ) : filtradas.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-fg/50 text-sm">Nenhuma comanda encontrada.</div>
        ) : (
          <div className="rounded-xl border border-fg/15 bg-fg/3 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fg/10 bg-fg/10">
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold">Telefone</th>
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold">Nome</th>
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold">Evento</th>
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold">Convidados</th>
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold">Pacote</th>
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold text-right">Valor total</th>
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold">Data</th>
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold">Status</th>
                  <th className="px-4 py-3 text-fg/50 uppercase text-[10px] tracking-wider font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((c) => (
                  <tr key={c.id} className="border-b border-fg/5 hover:bg-fg/5 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-fg/40" />
                        <span className="font-mono text-fg">{c.telefone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-fg">{c.nome_cliente || "Não informado"}</td>
                    <td className="px-4 py-3 text-fg/75">{c.segmento}</td>
                    <td className="px-4 py-3 text-fg/75">{c.convidados}</td>
                    <td className="px-4 py-3 text-fg/75 capitalize">{c.pacote}</td>
                    <td className="px-4 py-3 text-right font-mono text-fg">{fmtMoeda(c.valor_total_evento)}</td>
                    <td className="px-4 py-3 text-fg/50 font-mono text-xs">{new Date(c.criado_em).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-semibold uppercase ${statusColor(c.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s => (s === "pendente" ? "bg-[#e2412f]" : s === "contatado" ? "bg-[#fdb500]" : "bg-[#10b981]")(c.status)}`} />
                        {statusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Btn
                          onClick={() => window.open(waLink(c.telefone), "_blank")}
                          variant="line"
                          arrow={false}
                          icon={<Phone className="h-3 w-3" />}
                          className="px-3 py-1.5 text-[11px] min-w-[auto]"
                        >
                          WhatsApp
                        </Btn>
                        <select
                          value={c.status}
                          onChange={(e) => {
                            updateComandaStatus(c.id, e.target.value as Status).then(() => {
                              loadComandas();
                            });
                          }}
                          className="border border-fg/15 bg-fg/5 px-2 py-1 rounded text-[10px] text-fg focus:outline-none focus:border-acc"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="contatado">Contatado</option>
                          <option value="fechado">Fechado</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
