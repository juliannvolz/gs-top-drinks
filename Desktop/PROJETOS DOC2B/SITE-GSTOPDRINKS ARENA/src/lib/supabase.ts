import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ComandaLead {
  nome_cliente?: string | null;
  telefone: string;
  segmento: string;
  convidados: number;
  pacote: string;
  drinks: string;
  valor_por_pessoa: number;
  valor_total_evento: number;
}

export async function saveComanda(data: ComandaLead): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("comandas").insert([
      {
        nome_cliente: data.nome_cliente ?? null,
        telefone: data.telefone,
        segmento: data.segmento,
        convidados: data.convidados,
        pacote: data.pacote,
        drinks: data.drinks,
        valor_por_pessoa: data.valor_por_pessoa,
        valor_total_evento: data.valor_total_evento,
        status: "pendente",
      },
    ]);

    if (error) {
      console.error("Erro ao salvar comanda no Supabase:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("Erro inesperado ao salvar comanda:", err);
    return { ok: false, error: err?.message || "Erro desconhecido" };
  }
}

export async function listComandas(): Promise<any[]> {
  const { data, error } = await supabase
    .from("comandas")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao listar comandas:", error);
    return [];
  }

  return data || [];
}

export async function updateComandaStatus(id: string, status: "pendente" | "contatado" | "fechado"): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("comandas").update({ status }).eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Erro desconhecido" };
  }
}
