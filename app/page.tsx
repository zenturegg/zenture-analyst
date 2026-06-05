"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart3, Upload, Trophy, Users, CalendarDays, LogOut, Plus, Trash2,
  ShieldCheck, Swords, Save, Loader2, Image as ImageIcon, PencilLine, Database
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar
} from "recharts";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);
type Squad = {
  id: string;
  name: string;
  tag: string;
  players: string;
};

type Match = {
  id: string;
  championship: string;
  date: string;
  map: string;
  round: number;
  squad: string;
  placement: number;
  kills: number;
  points: number;
  notes?: string;
};

const STORAGE_AUTH = "zenture-auth";
const STORAGE_SQUADS = "zenture-squads";
const STORAGE_MATCHES = "zenture-matches";

const defaultSquads: Squad[] = [
  { id: "1", name: "Zenture GG", tag: "ZNT", players: "Jhordan7, Caique, Terror, Robert" },
  { id: "2", name: "Line Feminina", tag: "ZNT.FEM", players: "Nabriza, Nabreja, Chilena, Ana" },
];

const defaultMatches: Match[] = [
  { id: "m1", championship: "Treino modo liga", date: "2026-06-03", map: "Bermuda", round: 1, squad: "Zenture GG", placement: 2, kills: 9, points: 18 },
  { id: "m2", championship: "Treino modo liga", date: "2026-06-03", map: "Purgatório", round: 2, squad: "Zenture GG", placement: 1, kills: 11, points: 23 },
  { id: "m3", championship: "Copa Nobru", date: "2026-06-03", map: "Kalahari", round: 3, squad: "Line Feminina", placement: 4, kills: 6, points: 13 },
];

function placementPoints(place: number) {
  if (place === 1) return 12;
  if (place === 2) return 9;
  if (place === 3) return 8;
  if (place === 4) return 7;
  if (place === 5) return 6;
  if (place === 6) return 5;
  if (place === 7) return 4;
  if (place === 8) return 3;
  if (place === 9) return 2;
  if (place === 10) return 1;
  return 0;
}

function safeLoad<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [logged, setLogged] = useState(false);
  const [role, setRole] = useState("");
  const [page, setPage] = useState("dashboard");
  const [squads, setSquads] = useState<Squad[]>(defaultSquads);
  const [matches, setMatches] = useState<Match[]>(defaultMatches);
  const isAdmin = role === "admin";
  useEffect(() => {
  setRole(localStorage.getItem("role") || "");
  setLogged(localStorage.getItem(STORAGE_AUTH) === "true");

  async function loadData() {
    const { data: squadsData } = await supabase
      .from("squads")
      .select("*")
      .order("name", { ascending: true });

    const { data: matchesData } = await supabase
      .from("matches")
      .select("*")
      .order("date", { ascending: true });

    if (squadsData) setSquads(squadsData as Squad[]);
    if (matchesData) setMatches(matchesData as Match[]);
  }

  loadData();
}, []);

function logout() {
  localStorage.removeItem(STORAGE_AUTH);
  localStorage.removeItem("role");
  setRole("");
  setLogged(false);
}
  if (!logged) return <Login onLogin={() => setLogged(true)} />;

const menu = [
  ["dashboard", "Dashboard", BarChart3],
  ...(isAdmin ? [["upload", "Ler Print", Upload] as const] : []),
  ["ranking", "Ranking", Trophy],
  ["squads", "Squads", Users],
  ["partidas", "Partidas", CalendarDays],
  ...(isAdmin ? [["backup", "Backup", Database] as const] : []),
] as const;

  return (
   <main
  className="min-h-screen bg-cover bg-center bg-fixed"
  style={{ backgroundImage: "url('/zenture-bg.png')" }}
>
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 border-r border-zntBlue/20 bg-black/35 p-5 flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-zntBlue flex items-center justify-center glow">
              <ShieldCheck />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-wider">ZENTURE</h1>
              <p className="text-xs text-white/50">Analyst Free Fire</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menu.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                  page === id ? "bg-zntBlue text-white glow" : "text-white/65 hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <button onClick={logout} className="mt-auto flex items-center gap-2 text-white/50 hover:text-white">
            <LogOut size={18} /> Sair
          </button>
        </aside>

        <section className="flex-1 p-4 lg:p-8">
          <header className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-zntBlue font-bold uppercase tracking-[.3em] text-xs">ZNT ANALYST</p>
                <h2 className="text-3xl md:text-5xl font-black">{menu.find(m => m[0] === page)?.[1]}</h2>
                <p className="text-white/55 mt-2">Controle de squads, prints, kills, pontos e ranking da Zenture.</p>
              </div>
              <button onClick={logout} className="lg:hidden bg-zntCard border border-zntBlue/20 px-4 py-3 rounded-xl">Sair</button>
            </div>

            <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-hide">
              {menu.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setPage(id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap ${page === id ? "bg-zntBlue" : "bg-zntCard border border-zntBlue/20"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          {page === "dashboard" && <Dashboard matches={matches} squads={squads} />}
          {page === "upload" && <UploadPage squads={squads} onAdd={(m) => setMatches([m, ...matches])} />}
          {page === "ranking" && <Ranking matches={matches} squads={squads} />}
{page === "squads" && <Squads squads={squads} setSquads={setSquads} isAdmin={isAdmin} />}
          {page === "partidas" && <Matches matches={matches} setMatches={setMatches} squads={squads} isAdmin={isAdmin} />}
          {page === "backup" && <Backup squads={squads} matches={matches} setSquads={setSquads} setMatches={setMatches} />}
        </section>
      </div>
    </main>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
if (user === "Jhordanlhp" && pass === "ZNT@2026!Admin") {
  localStorage.setItem(STORAGE_AUTH, "true");
  localStorage.setItem("role", "admin");
  window.location.reload();
  return;
}
if (user === "membros" && pass === "zenture2026") {
  localStorage.setItem(STORAGE_AUTH, "true");
  localStorage.setItem("role", "member");
  window.location.reload();
  return;
}

const { data } = await supabase
  .from("profiles")
  .select("*")
  .eq("name", user)
  .single();

if (data && data.password === pass) {
  localStorage.setItem(STORAGE_AUTH, "true");
  localStorage.setItem("role", data.role);
  onLogin();
} else {
  setError("Usuário ou senha incorretos.");
}
  }

  return (
    <main
  className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
  style={{ backgroundImage: "url('/zenture-bg.png')" }}
>
      <form onSubmit={submit} className="w-full max-w-md bg-zntCard border border-zntBlue/25 rounded-3xl p-8 glow">
        <div className="w-16 h-16 bg-zntBlue rounded-2xl flex items-center justify-center mb-6 glow">
<img
  src="/logo-zenture.png.png"
  alt="Zenture"
  className="w-10 h-10 object-contain"
/>
        </div>

        <h1 className="text-4xl font-black">Painel Analítico Zenture</h1>
        <p className="text-white/55 mt-2 mb-8">Bem vindo ao Painel da Tropa da Z!.</p>

        <label className="text-sm text-white/60">Usuário</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} className="w-full mt-2 mb-4 bg-black/40 border border-white/10 rounded-xl px-4 py-3" />

        <label className="text-sm text-white/60">Senha</label>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}  className="w-full mt-2 mb-4 bg-black/40 border border-white/10 rounded-xl px-4 py-3" />

        {error && <p className="text-red-300 text-sm mb-4">{error}</p>}

        <button className="w-full bg-zntBlue rounded-xl py-3 font-black glow">Entrar</button>
       
      </form>
    </main>
  );
}
function Dashboard({ matches, squads }: { matches: Match[]; squads: Squad[] }) {
  const [selectedSquad, setSelectedSquad] = useState("GERAL");
const [selectedDate, setSelectedDate] = useState(
  new Date().toISOString().slice(0, 10)
);
const dashboardMatches = matches.filter((m) => {
  const squadOk =
    selectedSquad === "GERAL" || m.squad === selectedSquad;

  const dateOk =
    !selectedDate || m.date === selectedDate;

  return squadOk && dateOk;
});

const totalKills = dashboardMatches.reduce((a, b) => a + Number(b.kills || 0), 0);
const totalPoints = dashboardMatches.reduce((a, b) => a + Number(b.points || 0), 0);
const avgPoints = dashboardMatches.length ? Math.round(totalPoints / dashboardMatches.length) : 0;

const avgKills = dashboardMatches.length
  ? Math.round(totalKills / dashboardMatches.length)
  : 0;

const avgPlacement = dashboardMatches.length
  ? Math.round(dashboardMatches.reduce((a, b) => a + Number(b.placement || 0), 0) / dashboardMatches.length)
  : 0;

const booyahs = dashboardMatches.filter(m => Number(m.placement) === 1).length;
const top3 = dashboardMatches.filter(m => Number(m.placement) <= 3).length;
  const statsPorSquad = squads.map(s => {
  const ms = dashboardMatches.filter(m => m.squad === s.name);
  const pontos = ms.reduce((a,b)=>a + Number(b.points || 0), 0);
  const kills = ms.reduce((a,b)=>a + Number(b.kills || 0), 0);
  const aproveitamento = ms.length
    ? Math.min(100, Math.round(((pontos / ms.length) / 20) * 100))
    : 0;

  return {
    squad: s.name,
    pontos,
    kills,
    partidas: ms.length,
    top1: ms.filter(m => Number(m.placement) === 1).length,
    aproveitamento
  };
});

const melhorLine = statsPorSquad.sort((a,b)=>b.pontos-a.pontos)[0];
const maiorAproveitamento = statsPorSquad.sort((a,b)=>b.aproveitamento-a.aproveitamento)[0];
const maisTop1 = statsPorSquad.sort((a,b)=>b.top1-a.top1)[0];
  const chart = dashboardMatches.slice().reverse().map((m) => ({
  rodada: "R" + m.round,
  pontos: m.points,
  kills: m.kills
}));
  return (
    <div className="space-y-6">
      <div className="mb-4 flex flex-col md:flex-row gap-3">
  <select
    value={selectedSquad}
    onChange={(e) => setSelectedSquad(e.target.value)}
    className="bg-black/40 border border-zntBlue/30 rounded-xl px-4 py-2 text-white"
  >
    <option value="GERAL">📊 Dashboard Geral</option>

    {squads.map((s) => (
      <option key={s.id} value={s.name}>
        {s.name}
      </option>
    ))}
  </select>

  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="bg-black/40 border border-zntBlue/30 rounded-xl px-4 py-2 text-white"
  />

  <button
    onClick={() => setSelectedDate("")}
    className="bg-black/40 border border-zntBlue/30 rounded-xl px-4 py-2 text-white"
  >
    Todas as datas
  </button>
</div>
      <div className="grid md:grid-cols-4 gap-4">
<Card
  title={selectedSquad === "GERAL" ? "Squads cadastrados" : "Squad selecionada"}
  value={selectedSquad === "GERAL" ? squads.length : 1}
/>

<Card
  title="Partidas analisadas"
  value={dashboardMatches.length}
/>
<Card title="Kills totais" value={totalKills} />
<Card title="Média de pontos" value={avgPoints} />

<Card title="Média de kills" value={avgKills} />
<Card title="Média colocação" value={avgPlacement} />
<Card title="Booyahs" value={booyahs} />
<Card title="Top 3" value={top3} />
<Card title="Melhor line" value={melhorLine?.squad ? String(melhorLine.squad) : "-"} />
<Card title="Maior aproveitamento" value={maiorAproveitamento ? maiorAproveitamento.aproveitamento + "%" : "0%"} />
<Card title="Line com mais TOP 1" value={maisTop1?.squad || "-"} />        
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <Panel title="Pontos por rodada">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="rodada" stroke="#8A94A6" />
                <YAxis stroke="#8A94A6" />
                <Tooltip contentStyle={{ background: "#05070D", border: "1px solid #0057FF" }} />
                <Line type="monotone" dataKey="pontos" stroke="#0057FF" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Kills por rodada">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="rodada" stroke="#8A94A6" />
                <YAxis stroke="#8A94A6" />
                <Tooltip contentStyle={{ background: "#05070D", border: "1px solid #0057FF" }} />
                <Bar dataKey="kills" fill="#0057FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function UploadPage({ squads, onAdd }: { squads: Squad[]; onAdd: (m: Match) => void }) {
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({
    championship: "Treino modo liga",
    date: new Date().toISOString().slice(0, 10),
    map: "Bermuda",
    round: 1,
    squad: squads[0]?.name || "",
    placement: 1,
    kills: 0,
    notes: "",
  });

  async function readImage(file?: File) {
    if (!file) return;
    setLoading(true);
    setOcrText("");
    setProgress(0);

    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "eng+por", {
        logger: (m: any) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      const text = result.data.text || "";
      setOcrText(text);

      const lines = text
  .split("\n")
  .map(l => l.trim())
  .filter(Boolean);

let placement = form.placement;
let kills = form.kills;
let squad = form.squad;

const normalizar = (v: string) =>
  v.toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const textoNormal = normalizar(text);

const matchedSquad = squads.find(s =>
  textoNormal.includes(normalizar(s.name))
);

const zentureLine = lines.find(l =>
  normalizar(l).includes("ZENTURE")
);

if (matchedSquad) {
  squad = matchedSquad.name;
}

if (zentureLine) {
  const nums = zentureLine.match(/\d+/g)?.map(Number) || [];

  if (nums.length >= 3) {
    placement = nums[0];
    kills = nums[nums.length - 2];
  } else if (nums.length === 2) {
    placement = nums[0];
  }
}

setForm(f => ({
  ...f,
  squad,
  kills,
  placement,
  notes: text.slice(0, 500)
}));
    } catch (e) {
      setOcrText("Não foi possível ler o print. Você ainda pode preencher manualmente.");
    } finally {
      setLoading(false);
    }
  }

  function save() {
    const points = Number(form.kills) + placementPoints(Number(form.placement));
    onAdd({
      id: String(Date.now()),
      championship: form.championship,
      date: form.date,
      map: form.map,
      round: Number(form.round),
      squad: form.squad,
      placement: Number(form.placement),
      kills: Number(form.kills),
      points,
      notes: form.notes,
    });
    alert("Partida salva no histórico e ranking atualizado.");
  }

  return (
    <div className="grid xl:grid-cols-2 gap-6">
      <Panel title="Upload do print">
        <div className="border-2 border-dashed border-zntBlue/45 rounded-3xl p-8 bg-black/25 text-center">
          <ImageIcon className="mx-auto text-zntBlue mb-4" size={54} />
          <p className="text-white/70 mb-4">Envie um print da tela final da partida para tentar ler automaticamente.</p>
          <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files?.[0])} className="block mx-auto" />
          {loading && (
            <div className="mt-6 text-zntBlue font-bold flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Lendo print... {progress}%
            </div>
          )}
        </div>

        {ocrText && (
          <div className="mt-5 bg-black/35 border border-white/10 rounded-2xl p-4">
            <h4 className="font-bold mb-2">Texto lido pela IA/OCR</h4>
            <pre className="text-xs text-white/60 whitespace-pre-wrap max-h-64 overflow-auto">{ocrText}</pre>
          </div>
        )}
      </Panel>

      <Panel title="Confirmar dados da partida">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Campeonato/Treino" value={form.championship} onChange={(v) => setForm({ ...form, championship: v })} />
          <Input label="Data" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          <Select label="Mapa" value={form.map} onChange={(v) => setForm({ ...form, map: v })} options={["Bermuda", "Purgatório", "Kalahari", "Alpine", "Nexterra"]} />
          <Input label="Rodada" type="number" value={form.round} onChange={(v) => setForm({ ...form, round: Number(v) })} />
          <Select label="Squad" value={form.squad} onChange={(v) => setForm({ ...form, squad: v })} options={squads.map(s => s.name)} />
          <Input label="Colocação" type="number" value={form.placement} onChange={(v) => setForm({ ...form, placement: Number(v) })} />
          <Input label="Kills" type="number" value={form.kills} onChange={(v) => setForm({ ...form, kills: Number(v) })} />
          <div className="bg-black/25 rounded-2xl border border-white/10 p-4">
            <p className="text-white/50 text-sm">Pontos calculados</p>
            <p className="text-3xl font-black text-zntBlue">{Number(form.kills) + placementPoints(Number(form.placement))}</p>
          </div>
        </div>

        <label className="block text-sm text-white/60 mt-4 mb-2">Observações</label>
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full h-28 bg-black/35 border border-white/10 rounded-xl p-3 outline-none focus:border-zntBlue" />

        <button onClick={save} className="mt-5 bg-zntBlue px-6 py-3 rounded-xl font-black glow flex items-center gap-2">
          <Save size={18} /> Salvar partida
        </button>
      </Panel>
    </div>
  );
}

function Ranking({ matches, squads }: { matches: Match[]; squads: Squad[] }) {
  const ranking = squads.map(s => {
    const ms = matches.filter(m => m.squad === s.name);
    return {
      squad: s.name,
      tag: s.tag,
      points: ms.reduce((a,b)=>a+b.points,0),
      kills: ms.reduce((a,b)=>a+b.kills,0),
      matches: ms.length,
      avg: ms.length ? Math.round(ms.reduce((a,b)=>a+b.points,0) / ms.length) : 0,
      aproveitamento: ms.length ?
   Math.min(
      100,
      Math.round(
        ((ms.reduce((a,b)=>a+b.points,0) / ms.length) / 20) * 100
      )
    )
  : 0,
      top1: ms.filter(m => Number(m.placement) === 1).length,
top3: ms.filter(m => Number(m.placement) <= 3).length,
campeonatos: new Set(ms.map(m => m.championship)).size,
    };
  }).sort((a,b)=>b.points-a.points);

return <Table heads={["#", "Squad", "Tag", "Pontos", "Kills", "Partidas", "Média", "Aprov. %", "TOP 1", "TOP 3", "Camp."]} rows={ranking.map((r,i)=>[String(i+1), r.squad, r.tag, String(r.points), String(r.kills), String(r.matches), String(r.avg), String(r.aproveitamento) + "%", String(r.top1), String(r.top3), String(r.campeonatos)])} />
}

function Squads({ squads, setSquads, isAdmin }: { squads: Squad[]; setSquads: (s: Squad[]) => void; isAdmin: boolean }) {
  const [form, setForm] = useState({ name: "", tag: "", players: "" });

async function add() {
  if (!form.name.trim()) return;

  const newSquad = {
    name: form.name,
    tag: form.tag,
    players: form.players,
  };

  const { data, error } = await supabase
    .from("squads")
    .insert(newSquad)
    .select()
    .single();

  if (error) {
    alert("Erro ao salvar squad no Supabase");
    console.log(error);
    return;
  }

  setSquads([...squads, data as Squad]);
  setForm({ name: "", tag: "", players: "" });
}

  async function remove(id: string) {
  if (!confirm("Remover este squad?")) return;

  const { error } = await supabase
    .from("squads")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Erro ao remover squad no Supabase");
    console.log(error);
    return;
  }

  setSquads(squads.filter(s => s.id !== id));
}

  return (
    <div className="space-y-6">
{isAdmin && (
<Panel title="Cadastrar squad">
        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Nome do squad" value={form.name} onChange={(v)=>setForm({...form, name:v})} />
          <Input label="Tag" value={form.tag} onChange={(v)=>setForm({...form, tag:v})} />
          <Input label="Jogadores" value={form.players} onChange={(v)=>setForm({...form, players:v})} />
        </div>
        <button onClick={add} className="mt-5 bg-zntBlue px-5 py-3 rounded-xl font-black flex gap-2 items-center"><Plus size={18}/>Adicionar squad</button>
      </Panel>
)}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {squads.map(s => (
          <div key={s.id} className="bg-zntCard border border-zntBlue/20 rounded-3xl p-5">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="text-xl font-black">{s.name}</h3>
                <p className="text-zntBlue font-bold">{s.tag}</p>
              </div>
              {isAdmin && (
  <button onClick={() => remove(s.id)} className="text-white/40 hover:text-red-300">
    <Trash2 size={18}/>
  </button>
)}
            </div>
            <p className="text-white/55 mt-4">{s.players || "Sem jogadores cadastrados"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Matches({ matches, setMatches, squads, isAdmin }: { matches: Match[]; setMatches: (m: Match[]) => void; squads: Squad[]; isAdmin: boolean }) {
  const [form, setForm] = useState({
    championship: "Treino modo liga",
    date: new Date().toISOString().slice(0, 10),
    map: "Bermuda",
    round: 1,
    squad: squads[0]?.name || "",
    placement: 1,
    kills: 0,
    notes: "",
  });

  async function add() {
  const points = Number(form.kills) + placementPoints(Number(form.placement));

  const newMatch = {
    ...form,
    points,
    round: Number(form.round),
    placement: Number(form.placement),
    kills: Number(form.kills),
  };

  const { data, error } = await supabase
    .from("matches")
    .insert(newMatch)
    .select()
    .single();

  if (error) {
    alert("Erro ao salvar partida no Supabase");
    console.log(error);
    return;
  }

  setMatches([data as Match, ...matches]);
}

 async function remove(id: string) {
  if (!confirm("Apagar esta partida?")) return;

  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Erro ao apagar partida");
    console.log(error);
    return;
  }

  setMatches(matches.filter(m => m.id !== id));
}
  return (
    <div className="space-y-6">
{isAdmin && (      
      <Panel title="Adicionar partida manualmente">
        <div className="grid md:grid-cols-4 gap-4">
          <Input label="Campeonato" value={form.championship} onChange={(v)=>setForm({...form, championship:v})}/>
          <Input label="Data" type="date" value={form.date} onChange={(v)=>setForm({...form, date:v})}/>
          <Select label="Mapa" value={form.map} onChange={(v)=>setForm({...form, map:v})} options={["Bermuda", "Purgatório", "Kalahari", "Alpine", "Nexterra"]}/>
          <Input label="Rodada" type="number" value={form.round} onChange={(v)=>setForm({...form, round:Number(v)})}/>
          <Select label="Squad" value={form.squad} onChange={(v)=>setForm({...form, squad:v})} options={squads.map(s=>s.name)}/>
          <Input label="Colocação" type="number" value={form.placement} onChange={(v)=>setForm({...form, placement:Number(v)})}/>
          <Input label="Kills" type="number" value={form.kills} onChange={(v)=>setForm({...form, kills:Number(v)})}/>
          <div className="bg-black/25 rounded-2xl border border-white/10 p-4">
            <p className="text-white/50 text-sm">Pontos</p>
            <p className="text-2xl font-black text-zntBlue">{Number(form.kills) + placementPoints(Number(form.placement))}</p>
          </div>
        </div>
        <button onClick={add} className="mt-5 bg-zntBlue px-5 py-3 rounded-xl font-black flex gap-2 items-center"><Plus size={18}/>Salvar partida</button>
      </Panel>
)}
      <div className="bg-zntCard border border-zntBlue/20 rounded-3xl overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/55">
              {["Data","Camp.","Mapa","Rodada","Squad","TOP","Kills","Pontos",""].map(h=><th key={h} className="p-4 whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {matches.map(m=>(
              <tr key={m.id} className="border-b border-white/5 hover:bg-zntBlue/10">
                <td className="p-4">{m.date}</td>
                <td className="p-4">{m.championship}</td>
                <td className="p-4">{m.map}</td>
                <td className="p-4">R{m.round}</td>
                <td className="p-4">{m.squad}</td>
                <td className="p-4">TOP {m.placement}</td>
                <td className="p-4">{m.kills}</td>
                <td className="p-4 font-black text-zntBlue">{m.points}</td>
               <td className="p-4">
  {isAdmin && (
    <button onClick={()=>remove(m.id)} className="text-white/40 hover:text-red-300">
      <Trash2 size={18}/>
    </button>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Backup({ squads, matches, setSquads, setMatches }: { squads: Squad[]; matches: Match[]; setSquads: (s: Squad[])=>void; setMatches: (m: Match[])=>void }) {
  const [importText, setImportText] = useState("");

  const data = JSON.stringify({ squads, matches }, null, 2);

  function download() {
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-zenture-analyst.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData() {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.squads) setSquads(parsed.squads);
      if (parsed.matches) setMatches(parsed.matches);
      alert("Backup importado com sucesso.");
    } catch {
      alert("Backup inválido.");
    }
  }

  return (
    <div className="grid xl:grid-cols-2 gap-6">
      <Panel title="Exportar dados">
        <p className="text-white/60 mb-5">Baixe um backup dos squads e partidas salvos.</p>
        <button onClick={download} className="bg-zntBlue px-5 py-3 rounded-xl font-black">Baixar backup</button>
        <pre className="mt-5 bg-black/35 border border-white/10 rounded-2xl p-4 text-xs text-white/50 max-h-96 overflow-auto">{data}</pre>
      </Panel>
      <Panel title="Importar backup">
        <p className="text-white/60 mb-5">Cole aqui um backup antigo para restaurar seus dados.</p>
        <textarea value={importText} onChange={(e)=>setImportText(e.target.value)} className="w-full h-80 bg-black/35 border border-white/10 rounded-2xl p-4 outline-none focus:border-zntBlue" />
        <button onClick={importData} className="mt-5 bg-zntBlue px-5 py-3 rounded-xl font-black">Importar backup</button>
      </Panel>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-zntCard border border-zntBlue/20 rounded-3xl p-5">
      <p className="text-white/50 text-sm">{title}</p>
      <h3 className="text-4xl font-black mt-2">{value}</h3>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-zntCard border border-zntBlue/20 rounded-3xl p-5 glow">
      <h3 className="text-xl font-black mb-5 flex items-center gap-2"><PencilLine size={18} className="text-zntBlue" />{title}</h3>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm text-white/60">{label}</span>
      <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} className="w-full mt-2 bg-black/35 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-zntBlue" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm text-white/60">{label}</span>
      <select value={value} onChange={(e)=>onChange(e.target.value)} className="w-full mt-2 bg-black/35 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-zntBlue">
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Table({ heads, rows }: { heads: string[]; rows: string[][] }) {
  return (
    <div className="overflow-auto bg-zntCard border border-zntBlue/20 rounded-3xl">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10">
            {heads.map(h => <th className="p-4 text-white/55 whitespace-nowrap" key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-zntBlue/10">
              {r.map((c, j) => <td className={`p-4 whitespace-nowrap ${j === 3 ? "text-zntBlue font-black" : ""}`} key={j}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
