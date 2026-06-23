import React, { useState, useMemo } from "react";
import {
  Package, Users, Building2, ChevronsUpDown, PanelLeft, Plus,
  Table2, Search, ArrowUpDown, X, Pencil, Trash2, Check,
  User, Hash, Tag, Tags, Mail, Link2, MapPin, Image, Share2, Truck,
  LogIn, LogOut, Ruler, UserCheck, UserMinus, Inbox, Box,
  ChevronLeft, ChevronRight, ChevronDown,
} from "lucide-react";

const TEAL = "#15876b";
const TEAL_DARK = "#0f6e56";
const TEAL_TINT = "#eef8f4";
const GOLD = "#b3a369";
const NAVY = "#003057";
const SITE_NAME = "GTHR Package Manager";
const SITES = ["Site 1", "Site 2"];
const CURRENT_USER = "Bibek Bhattarai"; // hardcoded until auth lands

const seedRecipients = [
  { id: 1, name: "Bibek Bhattarai", recipId: "", alias: "", email: "bbhattarai6@gatech.edu", site: "Site 1", type: "Internal", location: "Room 5" },
  { id: 2, name: "Bibek1 Bhattarai1", recipId: "", alias: "Bb", email: "bibekbhattarai5th@gmail.com", site: "Site 2", type: "Internal", location: "Here" },
];

const PARCEL_SORT_FIELDS = [
  { key: "recipient", label: "Recipient", icon: User },
  { key: "identifier", label: "Identifier", icon: Share2 },
  { key: "site", label: "Site", icon: Building2 },
  { key: "courier", label: "Courier", icon: Truck },
  { key: "tracking", label: "Tracking Number", icon: Hash },
  { key: "checkedIn", label: "Checked-in", icon: LogIn },
  { key: "checkedOut", label: "Checked-out", icon: LogOut },
  { key: "dimensions", label: "Dimensions", icon: Ruler },
  { key: "location", label: "Location", icon: MapPin },
  { key: "loggedInBy", label: "Logged in by", icon: UserCheck },
  { key: "loggedOutBy", label: "Logged out by", icon: UserMinus },
];

const RECIPIENT_SORT_FIELDS = [
  { key: "name", label: "Name", icon: User },
  { key: "alias", label: "Alias", icon: Tag },
  { key: "email", label: "Email", icon: Mail },
  { key: "site", label: "Site", icon: Building2 },
  { key: "type", label: "Type", icon: Link2 },
  { key: "location", label: "Location", icon: MapPin },
];

const now = () =>
  new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
      style={active ? { background: "#eceae6", color: "#1f2937", fontWeight: 500 } : { color: "#4b5563" }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f1efec"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon size={18} strokeWidth={1.75} />
      {label}
    </button>
  );
}

function ToolbarButton({ icon: Icon, label, badge, active, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
      style={{ borderColor: active ? TEAL : "#e5e7eb", color: active ? TEAL_DARK : "#374151" }}>
      <Icon size={16} strokeWidth={1.75} style={{ color: active ? TEAL : "#6b7280" }} />
      <span>{label}</span>
      {badge != null && <span className="font-medium text-gray-900">{badge}</span>}
    </button>
  );
}

function Th({ icon: Icon, label, w }) {
  return (
    <th className="whitespace-nowrap border-r border-gray-100 px-4 py-2.5 text-left font-medium text-gray-500" style={w ? { minWidth: w } : undefined}>
      <div className="flex items-center gap-1.5">
        <Icon size={15} strokeWidth={1.75} className="text-gray-400" />
        {label}
      </div>
    </th>
  );
}

function Sidebar({ page, setPage }) {
  return (
    <aside className="flex w-64 flex-col border-r border-gray-200" style={{ background: "#faf9f7" }}>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 flex-col items-center justify-center rounded-md leading-none" style={{ background: GOLD }}>
            <span className="text-xs font-bold" style={{ color: NAVY }}>GT</span>
            <span style={{ color: NAVY, fontSize: 5, letterSpacing: 0.3 }}>HUMAN RESOURCES</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">GTHR</span>
        </div>
        <PanelLeft size={18} className="text-gray-400" />
      </div>

      <div className="px-3 pb-3">
        <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium">
          <span className="flex items-center gap-2">
            <Building2 size={16} className="text-gray-500" />
            {SITE_NAME}
          </span>
          <ChevronsUpDown size={15} className="text-gray-400" />
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        <NavItem icon={Package} label="Parcels" active={page === "parcels"} onClick={() => setPage("parcels")} />
        <NavItem icon={Users} label="Recipients" active={page === "recipients"} onClick={() => setPage("recipients")} />
      </nav>

      <div className="mt-auto border-t border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
        {CURRENT_USER}
      </div>
    </aside>
  );
}

function TopBar({ title, page, onAdd }) {
  return (
    <div className="flex items-center justify-between px-8 pt-6 pb-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-white"
        style={{ background: TEAL }}
        onMouseEnter={(e) => (e.currentTarget.style.background = TEAL_DARK)}
        onMouseLeave={(e) => (e.currentTarget.style.background = TEAL)}
      >
        <Plus size={16} /> {page === "parcels" ? "Add Parcel" : "Add Recipient"}
      </button>
    </div>
  );
}

function SortMenu({ fields, sortField, sortDir, pickSort, toggleDir, search, setSearch, onClose }) {
  const list = fields.filter((f) => f.label.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute left-0 top-full z-30 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
        <button onClick={toggleDir} className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50">
          {sortDir === "desc" ? "Sort Descending" : "Sort Ascending"}
          <ArrowUpDown size={15} className="text-gray-400" />
        </button>
        <div className="my-1.5 flex items-center gap-2 rounded-lg bg-gray-100 px-2.5 py-1.5">
          <Search size={15} className="text-gray-400" />
          <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full bg-transparent text-sm outline-none" />
        </div>
        <div className="max-h-64 overflow-auto">
          {list.map((f) => (
            <button key={f.key} onClick={() => pickSort(f.key)} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-gray-50">
              <span className="flex items-center gap-2.5 text-gray-700"><f.icon size={16} className="text-gray-400" />{f.label}</span>
              {sortField === f.key && <Check size={16} style={{ color: TEAL }} />}
            </button>
          ))}
          {list.length === 0 && <div className="px-2 py-3 text-sm text-gray-400">No matching fields</div>}
        </div>
      </div>
    </>
  );
}

function Toolbar({ query, setQuery, searchOpen, setSearchOpen, sortFields, sortField, sortDir, sortOpen, setSortOpen, pickSort, toggleDir, sortSearch, setSortSearch }) {
  return (
    <div className="flex items-center gap-2 px-8 py-2">
      {searchOpen ? (
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm">
          <Search size={16} className="text-gray-500" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-40 outline-none" />
          <button onClick={() => { setQuery(""); setSearchOpen(false); }} className="text-gray-400 hover:text-gray-700"><X size={14} /></button>
        </div>
      ) : (
        <ToolbarButton icon={Search} label="Search" onClick={() => setSearchOpen(true)} />
      )}
      <div className="relative">
        <ToolbarButton
          icon={ArrowUpDown}
          label={sortField ? `Sort: ${sortFields.find((f) => f.key === sortField)?.label ?? ""}` : "Sort"}
          active={!!sortField}
          onClick={() => setSortOpen((o) => !o)}
        />
        {sortOpen && (
          <SortMenu fields={sortFields} sortField={sortField} sortDir={sortDir} pickSort={pickSort} toggleDir={toggleDir} search={sortSearch} setSearch={setSortSearch} onClose={() => setSortOpen(false)} />
        )}
      </div>
    </div>
  );
}

function ActionBar({ count, onEdit, onDelete, onClear, confirming, setConfirming }) {
  return (
    <div className="mx-8 my-1 flex items-center gap-3 rounded-lg border px-4 py-2 text-sm" style={{ borderColor: TEAL, background: TEAL_TINT }}>
      <span className="font-medium" style={{ color: TEAL_DARK }}>{count} selected</span>
      {count === 1 && (
        <button onClick={onEdit} className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-50">
          <Pencil size={14} /> Edit
        </button>
      )}
      {!confirming ? (
        <button onClick={() => setConfirming(true)} className="flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-1 font-medium text-red-600 hover:bg-red-50">
          <Trash2 size={14} /> Delete
        </button>
      ) : (
        <span className="flex items-center gap-2">
          <span className="text-gray-700">Delete {count}?</span>
          <button onClick={onDelete} className="rounded-md bg-red-600 px-2.5 py-1 font-medium text-white">Confirm</button>
          <button onClick={() => setConfirming(false)} className="rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700">Cancel</button>
        </span>
      )}
      <button onClick={onClear} className="ml-auto text-gray-500 hover:text-gray-800">Deselect</button>
    </div>
  );
}

function Footer({ count }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-8 py-3 text-sm text-gray-500">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
          Show <span className="font-medium text-gray-800">30</span> <ChevronDown size={14} />
        </button>
        <span>Item 1 to {Math.max(count, 0)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">{count > 0 ? "1/1" : "0/0"}</span>
        <button className="rounded-md border border-gray-200 p-1.5 text-gray-400"><ChevronLeft size={16} /></button>
        <button className="rounded-md border border-gray-200 p-1.5 text-gray-400"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

const emptyR = { name: "", alias: "", email: "", type: "Internal", location: "" };
const emptyP = { recipient: "", site: "", identifier: "", courier: "USPS", tracking: "", dimensions: "", location: "", tags: "" };

export default function App() {
  const [page, setPage] = useState("parcels");
  const [recipients, setRecipients] = useState(seedRecipients);
  const [parcels, setParcels] = useState([]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [confirming, setConfirming] = useState(false);
  const [modal, setModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [rForm, setRForm] = useState(emptyR);
  const [pForm, setPForm] = useState(emptyP);
  const [pErrors, setPErrors] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortSearch, setSortSearch] = useState("");

  const isParcels = page === "parcels";

  const switchPage = (p) => {
    setPage(p); setQuery(""); setSearchOpen(false); setSelected(new Set()); setConfirming(false);
    setSortField(null); setSortOpen(false); setSortSearch("");
  };
  const clearSelection = () => { setSelected(new Set()); setConfirming(false); };

  const filteredRecipients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || isParcels) return recipients;
    return recipients.filter((r) => [r.name, r.alias, r.email, r.location].some((v) => v.toLowerCase().includes(q)));
  }, [recipients, query, isParcels]);

  const filteredParcels = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !isParcels) return parcels;
    return parcels.filter((p) => [p.recipient, p.identifier, p.courier, p.tracking, p.location].some((v) => (v || "").toLowerCase().includes(q)));
  }, [parcels, query, isParcels]);

  const sorted = useMemo(() => {
    const base = isParcels ? filteredParcels : filteredRecipients;
    if (!sortField) return base;
    const arr = [...base].sort((a, b) => {
      const av = (a[sortField] ?? "").toString().toLowerCase();
      const bv = (b[sortField] ?? "").toString().toLowerCase();
      return av.localeCompare(bv);
    });
    return sortDir === "desc" ? arr.reverse() : arr;
  }, [isParcels, filteredParcels, filteredRecipients, sortField, sortDir]);

  const pickSort = (key) => setSortField((f) => (f === key ? null : key));
  const toggleDir = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  const toggleRow = (id) => {
    setConfirming(false);
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const openAdd = () => {
    if (isParcels) { setPForm(emptyP); setPErrors({}); setModal({ type: "parcel", mode: "add" }); }
    else { setRForm(emptyR); setModal({ type: "recipient", mode: "add" }); }
  };

  const openEdit = () => {
    const id = [...selected][0];
    if (isParcels) {
      const p = parcels.find((x) => x.id === id);
      setPForm({ recipient: p.recipient, site: p.site, identifier: p.identifier, courier: p.courier, tracking: p.tracking, dimensions: p.dimensions, location: p.location, tags: p.tags.join(", ") });
      setPErrors({});
      setEditingId(id);
      setModal({ type: "parcel", mode: "edit" });
    } else {
      const r = recipients.find((x) => x.id === id);
      setRForm({ name: r.name, alias: r.alias, email: r.email, type: r.type, location: r.location });
      setEditingId(id);
      setModal({ type: "recipient", mode: "edit" });
    }
  };

  const deleteSelected = () => {
    if (isParcels) setParcels((prev) => prev.filter((p) => !selected.has(p.id)));
    else setRecipients((prev) => prev.filter((r) => !selected.has(r.id)));
    clearSelection();
  };

  const submitRecipient = () => {
    if (!rForm.name.trim()) return;
    if (modal.mode === "add") setRecipients((prev) => [...prev, { id: Date.now(), recipId: "", site: SITES[0], ...rForm }]);
    else setRecipients((prev) => prev.map((r) => r.id === editingId ? { ...r, ...rForm } : r));
    setModal(null); clearSelection();
  };

  const submitParcel = () => {
    const errs = {};
    if (!pForm.recipient) errs.recipient = true;
    if (!pForm.site) errs.site = true;
    if (Object.keys(errs).length) { setPErrors(errs); return; }
    const tags = pForm.tags ? pForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    if (modal.mode === "add") {
      setParcels((prev) => [...prev, {
        id: Date.now(), recipient: pForm.recipient, identifier: pForm.identifier || `PKG-${prev.length + 1}`,
        site: pForm.site, courier: pForm.courier, tracking: pForm.tracking, checkedIn: now(), checkedOut: "",
        dimensions: pForm.dimensions, location: pForm.location, tags, loggedInBy: CURRENT_USER, loggedOutBy: "",
      }]);
    } else {
      setParcels((prev) => prev.map((p) => p.id === editingId
        ? { ...p, recipient: pForm.recipient, site: pForm.site, identifier: pForm.identifier, courier: pForm.courier, tracking: pForm.tracking, dimensions: pForm.dimensions, location: pForm.location, tags }
        : p));
    }
    setPErrors({});
    setModal(null); clearSelection();
  };

  const checkOut = (id) => setParcels((prev) => prev.map((p) => p.id === id ? { ...p, checkedOut: now(), loggedOutBy: CURRENT_USER } : p));

  const visibleCount = sorted.length;
  const totalCount = isParcels ? parcels.length : recipients.length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-gray-900" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar page={page} setPage={switchPage} />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <TopBar title={isParcels ? "Inbound Parcels" : "Recipients"} page={page} onAdd={openAdd} />
        <Toolbar
          query={query} setQuery={setQuery} searchOpen={searchOpen} setSearchOpen={setSearchOpen}
          sortFields={isParcels ? PARCEL_SORT_FIELDS : RECIPIENT_SORT_FIELDS}
          sortField={sortField} sortDir={sortDir} sortOpen={sortOpen} setSortOpen={setSortOpen}
          pickSort={pickSort} toggleDir={toggleDir} sortSearch={sortSearch} setSortSearch={setSortSearch}
        />

        {selected.size > 0 ? (
          <ActionBar count={selected.size} onEdit={openEdit} onDelete={deleteSelected} onClear={clearSelection} confirming={confirming} setConfirming={setConfirming} />
        ) : (
          <div className="px-8 py-1 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{visibleCount}/{totalCount} {isParcels ? "Parcels" : "Recipients"}</span>
            <span className="mx-1.5">·</span>from 1 selected site
          </div>
        )}

        <div className="flex-1 overflow-auto px-8 pt-2">
          {isParcels ? (
            <table className="w-full border-collapse text-sm" style={{ minWidth: 1560 }}>
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50">
                  <th className="w-10 border-r border-gray-100 px-4 py-2.5">
                    <input type="checkbox"
                      checked={sorted.length > 0 && sorted.every((p) => selected.has(p.id))}
                      onChange={() => setSelected((prev) => { const n = new Set(prev); const all = sorted.every((p) => n.has(p.id)); sorted.forEach((p) => all ? n.delete(p.id) : n.add(p.id)); return n; })}
                      className="h-4 w-4 rounded border-gray-300" />
                  </th>
                  <th className="w-12 border-r border-gray-100 px-4 py-2.5"><Image size={15} className="text-gray-400" /></th>
                  <Th icon={User} label="Recipient" w={160} />
                  <Th icon={Share2} label="Identifier" w={140} />
                  <Th icon={Building2} label="Site" w={180} />
                  <Th icon={Truck} label="Courier" w={120} />
                  <Th icon={Hash} label="Tracking Number" w={180} />
                  <Th icon={LogIn} label="Checked-in" w={150} />
                  <Th icon={LogOut} label="Checked-out" w={150} />
                  <Th icon={Ruler} label="Dimensions" w={130} />
                  <Th icon={MapPin} label="Location" w={120} />
                  <Th icon={Tags} label="Tags" w={140} />
                  <Th icon={UserCheck} label="Logged in by" w={150} />
                  <Th icon={UserMinus} label="Logged out by" w={150} />
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={14}>
                      <div className="flex flex-col items-center justify-center gap-3 py-28 text-center">
                        <Inbox size={56} strokeWidth={1} className="text-gray-300" />
                        <p className="text-lg font-medium text-gray-600">We can't find any parcels</p>
                        <p className="text-sm text-gray-400">Click on "Add Parcel" to start filling up</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sorted.map((p) => {
                    const sel = selected.has(p.id);
                    return (
                      <tr key={p.id} onClick={() => toggleRow(p.id)} className="cursor-pointer border-b border-gray-100" style={{ background: sel ? TEAL_TINT : undefined }}>
                        <td className="border-r border-gray-100 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={sel} onChange={() => toggleRow(p.id)} className="h-4 w-4 rounded border-gray-300" />
                        </td>
                        <td className="border-r border-gray-100 px-4 py-3"><div className="h-7 w-7 rounded bg-gray-100" /></td>
                        <td className="border-r border-gray-100 px-4 py-3 font-medium">{p.recipient}</td>
                        <td className="border-r border-gray-100 px-4 py-3 text-gray-600">{p.identifier}</td>
                        <td className="border-r border-gray-100 px-4 py-3"><span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700">{p.site}</span></td>
                        <td className="border-r border-gray-100 px-4 py-3 text-gray-700">{p.courier}</td>
                        <td className="border-r border-gray-100 px-4 py-3 text-gray-700">{p.tracking || "—"}</td>
                        <td className="border-r border-gray-100 px-4 py-3 text-gray-700">{p.checkedIn}</td>
                        <td className="border-r border-gray-100 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {p.checkedOut ? <span className="text-gray-700">{p.checkedOut}</span>
                            : <button onClick={() => checkOut(p.id)} className="rounded-md border px-2 py-1 text-xs font-medium" style={{ borderColor: TEAL, color: TEAL }}>Check out</button>}
                        </td>
                        <td className="border-r border-gray-100 px-4 py-3 text-gray-600">{p.dimensions || "—"}</td>
                        <td className="border-r border-gray-100 px-4 py-3 text-gray-700">{p.location || "—"}</td>
                        <td className="border-r border-gray-100 px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {p.tags.length ? p.tags.map((t) => <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{t}</span>) : <span className="text-gray-400">—</span>}
                          </div>
                        </td>
                        <td className="border-r border-gray-100 px-4 py-3 text-gray-700">{p.loggedInBy}</td>
                        <td className="px-4 py-3 text-gray-700">{p.loggedOutBy || "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50">
                  <th className="w-10 border-r border-gray-100 px-4 py-2.5">
                    <input type="checkbox"
                      checked={sorted.length > 0 && sorted.every((r) => selected.has(r.id))}
                      onChange={() => setSelected((prev) => { const n = new Set(prev); const all = sorted.every((r) => n.has(r.id)); sorted.forEach((r) => all ? n.delete(r.id) : n.add(r.id)); return n; })}
                      className="h-4 w-4 rounded border-gray-300" />
                  </th>
                  <Th icon={User} label="Name" />
                  <Th icon={Hash} label="ID" />
                  <Th icon={Tag} label="Alias" />
                  <Th icon={Mail} label="Email" />
                  <Th icon={Building2} label="Site" />
                  <Th icon={Link2} label="Type" />
                  <Th icon={MapPin} label="Location" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => {
                  const sel = selected.has(r.id);
                  return (
                    <tr key={r.id} onClick={() => toggleRow(r.id)} className="cursor-pointer border-b border-gray-100" style={{ background: sel ? TEAL_TINT : undefined }}>
                      <td className="border-r border-gray-100 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={sel} onChange={() => toggleRow(r.id)} className="h-4 w-4 rounded border-gray-300" />
                      </td>
                      <td className="border-r border-gray-100 px-4 py-3 font-medium">{r.name}</td>
                      <td className="border-r border-gray-100 px-4 py-3 text-gray-500">{r.recipId}</td>
                      <td className="border-r border-gray-100 px-4 py-3 text-gray-600">{r.alias}</td>
                      <td className="border-r border-gray-100 px-4 py-3 text-gray-700">{r.email}</td>
                      <td className="border-r border-gray-100 px-4 py-3"><span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700">{r.site}</span></td>
                      <td className="border-r border-gray-100 px-4 py-3"><span className="inline-flex items-center gap-1.5 text-gray-700"><User size={14} className="text-gray-400" /> {r.type}</span></td>
                      <td className="px-4 py-3 text-gray-700">{r.location}</td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No recipients match your search.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <Footer count={visibleCount} />

        <button className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg" style={{ background: TEAL }}>
          <Box size={22} />
        </button>

        {modal?.type === "recipient" && (
          <Modal title={modal.mode === "add" ? "Add Recipient" : "Edit Recipient"} onClose={() => setModal(null)} onSubmit={submitRecipient} submitLabel={modal.mode === "add" ? "Add Recipient" : "Save changes"}>
            <Field label="Name" value={rForm.name} onChange={(v) => setRForm((s) => ({ ...s, name: v }))} ph="Full name" />
            <Field label="Alias" value={rForm.alias} onChange={(v) => setRForm((s) => ({ ...s, alias: v }))} ph="Short name (optional)" />
            <Field label="Email" value={rForm.email} onChange={(v) => setRForm((s) => ({ ...s, email: v }))} ph="name@gatech.edu" />
            <Field label="Location" value={rForm.location} onChange={(v) => setRForm((s) => ({ ...s, location: v }))} ph="e.g. Room 5" />
            <SelectField label="Type" value={rForm.type} onChange={(v) => setRForm((s) => ({ ...s, type: v }))} options={["Internal", "External"]} />
          </Modal>
        )}

        {modal?.type === "parcel" && (
          <Modal title={modal.mode === "add" ? "Add Parcel" : "Edit Parcel"} onClose={() => setModal(null)} onSubmit={submitParcel} submitLabel={modal.mode === "add" ? "Add Parcel" : "Save changes"}>
            <SelectField label="Recipient" required error={pErrors.recipient} value={pForm.recipient} onChange={(v) => { setPForm((s) => ({ ...s, recipient: v })); setPErrors((e) => ({ ...e, recipient: false })); }} options={["", ...recipients.map((r) => r.name)]} placeholder="Select recipient" />
            <SelectField label="Site" required error={pErrors.site} value={pForm.site} onChange={(v) => { setPForm((s) => ({ ...s, site: v })); setPErrors((e) => ({ ...e, site: false })); }} options={["", ...SITES]} placeholder="Select site" />
            <Field label="Identifier" value={pForm.identifier} onChange={(v) => setPForm((s) => ({ ...s, identifier: v }))} ph="Auto-generated if blank" />
            <SelectField label="Courier" value={pForm.courier} onChange={(v) => setPForm((s) => ({ ...s, courier: v }))} options={["USPS", "UPS", "FedEx", "DHL", "Amazon", "Other"]} />
            <Field label="Tracking Number" value={pForm.tracking} onChange={(v) => setPForm((s) => ({ ...s, tracking: v }))} ph="1Z999..." />
            <Field label="Dimensions" value={pForm.dimensions} onChange={(v) => setPForm((s) => ({ ...s, dimensions: v }))} ph="12 x 8 x 4 in" />
            <Field label="Location" value={pForm.location} onChange={(v) => setPForm((s) => ({ ...s, location: v }))} ph="e.g. Shelf B3" />
            <Field label="Tags" value={pForm.tags} onChange={(v) => setPForm((s) => ({ ...s, tags: v }))} ph="fragile, perishable" />
          </Modal>
        )}
      </main>
    </div>
  );
}

function Modal({ title, onClose, onSubmit, submitLabel, children }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-auto py-8" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-96 rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-3">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onSubmit} className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: TEAL }}>{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, ph, required, error }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={ph}
        className={`rounded-lg border px-3 py-2 outline-none ${error ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-gray-500"}`} />
      {error && <span className="text-xs text-red-500">This field is required</span>}
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder, required, error }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`rounded-lg border px-3 py-2 outline-none ${error ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-gray-500"}`}>
        {options.map((o) => <option key={o} value={o}>{o === "" ? (placeholder || "Select") : o}</option>)}
      </select>
      {error && <span className="text-xs text-red-500">This field is required</span>}
    </label>
  );
}