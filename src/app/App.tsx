import { useState, useMemo } from "react";
import {
  Search, ShoppingCart, X, Plus, Minus, FileText,
  MessageCircle, Package, Shield, Activity, Zap, Award,
  ArrowRight, Trash2, Check, ChevronRight, Download,
  Globe, MapPin,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "landing" | "catalog" | "whatsapp";
type Category = "all" | "injection" | "hygiene" | "diagnostics" | "sterilization";

interface Product {
  id: string; name: string; description: string;
  category: Exclude<Category, "all">;
  packaging: string; unitPrice: number; ref: string; image: string;
}
interface QuoteItem { product: Product; qty: number; }

// ─── Currency ─────────────────────────────────────────────────────────────────
function eurToFCFA(eur: number): number {
  const raw = eur * 655.957;
  return raw < 10000 ? Math.round(raw / 50) * 50 : Math.round(raw / 100) * 100;
}
function formatFCFA(amount: number): string {
  return amount.toLocaleString("fr-FR") + " FCFA";
}
const WA_PHONE = "221778807231";

// ─── Products ─────────────────────────────────────────────────────────────────
const Q = "?auto=format&fit=crop&w=600&h=400&q=80";
const FREE = "https://images.unsplash.com/photo-";
const PREM = "https://plus.unsplash.com/premium_photo-";

const PRODUCTS: Product[] = [
  {
    id: "inj-001", ref: "IES-INJ-001", category: "injection",
    name: "Seringue 5 mL avec Aiguille",
    description: "Seringue stérile à usage unique avec aiguille 21G×1,5\". Raccord Luer-lock, graduation 0,2 mL. Conforme ISO 7886-1.",
    packaging: "Boîte de 100 unités", unitPrice: 12.50,
    image: `${FREE}1666887360785-aaab9931af45${Q}`,
  },
  {
    id: "inj-002", ref: "IES-INJ-002", category: "injection",
    name: "Cathéter IV 20G (Sécurité)",
    description: "Cathéter veineux périphérique avec aiguille rétractable de sécurité. Cathéter PTFE, débit 61 mL/min. Embout coloré.",
    packaging: "Boîte de 50 unités", unitPrice: 28.00,
    image: `${PREM}1661497589526-2f4017b6c2f2${Q}`,
  },
  {
    id: "inj-003", ref: "IES-INJ-003", category: "injection",
    name: "Perfuseur Standard Gravité",
    description: "Chambre compte-gouttes 15 gtt/mL. Pince roulante, tubulure PVC 150 cm, raccord Luer-lock. Stérile à usage unique.",
    packaging: "Boîte de 50 unités", unitPrice: 18.75,
    image: `${FREE}1746806942787-947eebe640d6${Q}`,
  },
  {
    id: "inj-004", ref: "IES-INJ-004", category: "injection",
    name: "Aiguille Épicrânienne 21G",
    description: "Ensemble ailé 21G×0,75\". Tubulure PVC souple 30 cm. Idéal pour ponction veineuse de courte durée. Protège-aiguille inclus.",
    packaging: "Boîte de 100 unités", unitPrice: 22.00,
    image: `${PREM}1668487826892-bf471b01e5ed${Q}`,
  },
  {
    id: "hyg-001", ref: "IES-HYG-001", category: "hygiene",
    name: "Gants d'Examen Latex (Taille M)",
    description: "Latex sans poudre, taille M. NQA 1,5, embouts texturés. Certifiés EN 455-1/2/3/4. Ambidextres.",
    packaging: "Boîte de 100 unités", unitPrice: 8.90,
    image: `${FREE}1588160546938-8001045695ca${Q}`,
  },
  {
    id: "hyg-002", ref: "IES-HYG-002", category: "hygiene",
    name: "Gants en Nitrile (Taille L) Bleus",
    description: "Nitrile sans poudre, sans latex. NQA 1,0, longueur 240 mm, épaisseur 0,12 mm. Taille L.",
    packaging: "Boîte de 100 unités", unitPrice: 11.20,
    image: `${PREM}1683147713962-36b290586177${Q}`,
  },
  {
    id: "hyg-003", ref: "IES-HYG-003", category: "hygiene",
    name: "Masque Chirurgical Type IIR",
    description: "3 couches résistant aux fluides. BFE ≥98 %, PFE ≥98 %. Barrette nasale aluminium réglable. Liens auriculaires.",
    packaging: "Boîte de 50 unités", unitPrice: 6.40,
    image: `${FREE}1674049406176-021807a2802e${Q}`,
  },
  {
    id: "hyg-004", ref: "IES-HYG-004", category: "hygiene",
    name: "Blouse d'Isolement Jetable",
    description: "SMS niveau 2, résistante aux fluides. Dos ouvert, poignets élastiques. Taille universelle, 45 g/m².",
    packaging: "Sachet de 10 unités", unitPrice: 19.50,
    image: `${PREM}1664373622163-db4f001d1782${Q}`,
  },
  {
    id: "diag-001", ref: "IES-DIAG-001", category: "diagnostics",
    name: "Bandelettes Glycémiques",
    description: "Sans codage, échantillon 0,5 µL, résultat en 5 secondes. Compatibilité large glucomètres. Contrôles qualité inclus.",
    packaging: "Boîte de 50 bandelettes", unitPrice: 24.80,
    image: `${FREE}1683727186226-910f31a9da45${Q}`,
  },
  {
    id: "diag-002", ref: "IES-DIAG-002", category: "diagnostics",
    name: "Test de Grossesse Rapide hCG",
    description: "Test urinaire hCG, sensibilité 25 mUI/mL. Sachets aluminium individuels scellés. Résultat en 3 à 5 minutes.",
    packaging: "Boîte de 25 tests", unitPrice: 31.00,
    image: `${FREE}1633518009802-724bf2605637${Q}`,
  },
  {
    id: "diag-003", ref: "IES-DIAG-003", category: "diagnostics",
    name: "Bandelettes Urinaires 10 Paramètres",
    description: "Analyse simultanée de 10 paramètres : glucose, protéines, pH, sang, cétones, bilirubine, nitrites, urobilinogène, densité, leucocytes.",
    packaging: "Boîte de 100 bandelettes", unitPrice: 16.60,
    image: `${FREE}1591185157283-b09682a23728${Q}`,
  },
  {
    id: "diag-004", ref: "IES-DIAG-004", category: "diagnostics",
    name: "Oxymètre de Pouls Digital",
    description: "Mesure SpO₂ et fréquence cardiaque. Grand écran OLED 6 directions. Arrêt automatique. Cordon de poignet inclus.",
    packaging: "Unité + pochette de transport", unitPrice: 45.00,
    image: `${PREM}1723914040223-1bbb19681f9c${Q}`,
  },
  {
    id: "ster-001", ref: "IES-STER-001", category: "sterilization",
    name: "Sachets de Stérilisation 200×350 mm",
    description: "Sachets auto-scellants vapeur. Indicateurs chimiques doubles (interne/externe). Face avant transparente.",
    packaging: "Rouleau de 200 sachets", unitPrice: 34.00,
    image: `${PREM}1661507183946-559d65a5ad5e${Q}`,
  },
  {
    id: "ster-002", ref: "IES-STER-002", category: "sterilization",
    name: "Alcool Isopropylique 70 % IPA",
    description: "Solution IPA 70 % qualité USP. Antimicrobien large spectre pour désinfection des surfaces et instruments.",
    packaging: "Flacon 1 L × 12 (caisse)", unitPrice: 42.00,
    image: `${PREM}1663011286699-6eda34acf249${Q}`,
  },
  {
    id: "ster-003", ref: "IES-STER-003", category: "sterilization",
    name: "Compresses Stériles 10×10 cm",
    description: "Compresses tissées 8 couches, stériles individuellement. Conformes USP. Haute absorbance pour soins de plaies.",
    packaging: "Boîte de 100 × 2 compresses", unitPrice: 14.20,
    image: `${PREM}1722643214888-1ca110672e6a${Q}`,
  },
  {
    id: "ster-004", ref: "IES-STER-004", category: "sterilization",
    name: "Désinfectant de Surface en Spray",
    description: "À base d'ammonium quaternaire. Virucide EN 14476, bactéricide EN 1276. Prêt à l'emploi, sans dilution.",
    packaging: "Spray 500 mL × 6", unitPrice: 38.50,
    image: `${FREE}1563453392212-326f5e854473${Q}`,
  },
];

// ─── Category config ───────────────────────────────────────────────────────────
const CAT: Record<Category, { label: string; Icon: any; color: string; light: string; pill: string; grad: string }> = {
  all:           { label: "Tous les produits",   Icon: Package,  color: "#334155", light: "#F1F5F9", pill: "bg-slate-100 text-slate-700",    grad: "from-slate-400 to-slate-600" },
  injection:     { label: "Injection & Soins",    Icon: Activity, color: "#0369A1", light: "#EFF6FF", pill: "bg-blue-100 text-blue-700",      grad: "from-blue-400 to-blue-600" },
  hygiene:       { label: "Hygiène & Protection", Icon: Shield,   color: "#059669", light: "#ECFDF5", pill: "bg-emerald-100 text-emerald-700", grad: "from-emerald-400 to-emerald-600" },
  diagnostics:   { label: "Diagnostics",          Icon: Zap,      color: "#D97706", light: "#FFFBEB", pill: "bg-amber-100 text-amber-700",    grad: "from-amber-400 to-amber-500" },
  sterilization: { label: "Stérilisation",        Icon: Award,    color: "#7C3AED", light: "#F5F3FF", pill: "bg-violet-100 text-violet-700",  grad: "from-violet-400 to-violet-600" },
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
function IESLogo({ size = 36 }: { size?: number }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img src="/images/logo.jpg" alt="IES" width={size} height={size}
      className="rounded-lg object-contain" onError={() => setOk(false)} />
  ) : (
    <div className="rounded-xl flex items-center justify-center font-black text-white"
      style={{ width: size, height: size, background: "linear-gradient(135deg,#173A73,#0F2850)", fontSize: size * 0.3 }}>
      IES
    </div>
  );
}

// ─── Product image with gradient fallback ─────────────────────────────────────
function ProductImg({ product, className = "" }: { product: Product; className?: string }) {
  const [err, setErr] = useState(false);
  const c = CAT[product.category];
  return err ? (
    <div className={`flex items-center justify-center bg-gradient-to-br ${c.grad} ${className}`}>
      <c.Icon size={54} className="text-white opacity-35" />
    </div>
  ) : (
    <img src={product.image} alt={product.name}
      className={`object-cover ${className}`}
      onError={() => setErr(true)} loading="lazy" />
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ quoteCount, totalEUR, onLogo, onCatalog, onQuoteOpen }: {
  quoteCount: number; totalEUR: number; onLogo: () => void;
  onCatalog: () => void; onQuoteOpen: () => void;
}) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[96px] flex items-center justify-between gap-4">
        <button onClick={onLogo} className="flex items-center gap-3 flex-shrink-0">
          <IESLogo size={80} />
          <div className="hidden sm:block text-left">
            <div className="font-extrabold text-[#173A73] text-sm tracking-wide">I.E.S</div>
            <div className="text-gray-400 text-[9px] tracking-[0.25em] uppercase leading-none">International</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1 text-sm">
          <button onClick={onCatalog}
            className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-[#173A73] hover:bg-blue-50 transition-colors">
            Catalogue
          </button>
          <span className="text-gray-200 mx-1">·</span>
          <span className="text-gray-400 text-xs flex items-center gap-1 px-2">
            <MapPin size={10} /> Dakar, Sénégal
          </span>
        </div>

        <button onClick={onQuoteOpen}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg hover:shadow-[#173A73]/25 hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#173A73,#1E4A8F)" }}>
          <ShoppingCart size={16} />
          <span className="hidden sm:inline">Mon Devis</span>
          {quoteCount > 0 && (
            <>
              <span className="hidden sm:inline font-semibold text-[#D4AF37] text-sm">
                {formatFCFA(eurToFCFA(totalEUR))}
              </span>
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0C1B3A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {quoteCount}
              </span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="bg-white pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-7">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-blue-700 text-xs font-semibold tracking-widest uppercase">Fournisseur Médical Certifié</span>
              </div>

              <h1 className="ies-heading font-extrabold text-[#0F1F3D] leading-[1.1] mb-5"
                style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)" }}>
                International<br />
                <span className="text-[#173A73]">Équipements</span>{" "}
                <span style={{ color: "#D4AF37" }}>&</span>{" "}
                <span className="text-[#173A73]">Services</span>
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                Fournitures médicales certifiées pour hôpitaux, cliniques et laboratoires en Afrique et dans le monde. Qualité ISO, livraison fiable, tarification B2B compétitive.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <button onClick={onBrowse}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#173A73]/25"
                  style={{ background: "linear-gradient(135deg,#173A73,#1E4A8F)" }}>
                  Voir le Catalogue <ArrowRight size={17} />
                </button>
                <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                  style={{ background: "#25D366" }}>
                  <MessageCircle size={17} /> Nous Contacter
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                {[
                  { n: "40+",       l: "Pays desservis" },
                  { n: "2 500+",    l: "Références produits" },
                  { n: "ISO 13485", l: "Qualité certifiée" },
                ].map(s => (
                  <div key={s.l}>
                    <div className="ies-heading font-extrabold text-[#173A73] text-xl">{s.n}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product image grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {PRODUCTS.slice(0, 4).map(p => (
                <div key={p.id} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <ProductImg product={p} className="w-full h-full hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16" style={{ background: "linear-gradient(135deg,#0F1F3D,#173A73)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="ies-heading text-2xl font-bold text-white mb-2">Comment passer une commande ?</h2>
            <p className="text-gray-300 text-sm">Processus simple en 3 étapes — réponse sous 2 heures ouvrées</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { Icon: Package,     title: "Sélectionnez vos produits", desc: "Parcourez le catalogue, ajustez les quantités et cliquez sur « Ajouter au devis » pour chaque produit souhaité." },
              { Icon: FileText,    title: "Générez votre devis PDF",    desc: "Obtenez un récapitulatif complet en FCFA avec numéro de référence et validité 30 jours, téléchargeable en PDF." },
              { Icon: MessageCircle, title: "Confirmez sur WhatsApp",   desc: "Un seul clic pour envoyer votre commande. Notre équipe commerciale à Dakar vous confirme sous 2 heures ouvrées." },
            ].map((s, i) => (
              <div key={i} className="bg-white/8 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/12 transition-colors">
                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg,#D4AF37,#F5D060)" }}>
                  <s.Icon size={28} className="text-[#0C1B3A]" />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#173A73] border-2 border-[#0F1F3D] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{s.title}</h3>
                <p className="text-gray-300 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={onBrowse}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[#0C1B3A] transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg,#D4AF37,#F5D060)" }}>
              Commencer ma sélection <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Why IES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="ies-heading text-2xl font-bold text-gray-900 mb-2">Pourquoi choisir I.E.S ?</h2>
            <p className="text-gray-500 text-sm">La confiance des responsables achats médicaux sur 4 continents</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { Icon: Award,  color: "#173A73", bg: "bg-blue-50",    title: "Qualité Certifiée",    desc: "Produits certifiés ISO 13485, CE et FDA issus de fabricants vérifiés. Documentation de traçabilité complète fournie à chaque commande." },
              { Icon: Globe,  color: "#059669", bg: "bg-emerald-50", title: "Sourcing Mondial",      desc: "Partenariats avec des fabricants en Europe, Asie et Amériques. Prix compétitifs grâce à des volumes d'achat consolidés." },
              { Icon: Shield, color: "#D97706", bg: "bg-amber-50",   title: "Livraison Fiable",     desc: "Stocks de sécurité maintenus. Expédition express disponible. Suivi en temps réel et gestionnaire de compte dédié." },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`} style={{ color: f.color }}>
                  <f.Icon size={20} />
                </div>
                <h3 className="ies-heading font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="ies-heading text-2xl font-bold text-gray-900 mb-1">Catégories de Produits</h2>
              <p className="text-gray-500 text-sm">Gamme complète pour votre établissement de soins</p>
            </div>
            <button onClick={onBrowse}
              className="text-[#173A73] font-semibold text-sm flex items-center gap-1 hover:underline">
              Voir tout <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["injection", "hygiene", "diagnostics", "sterilization"] as const).map(cat => {
              const c = CAT[cat];
              const count = PRODUCTS.filter(p => p.category === cat).length;
              const preview = PRODUCTS.find(p => p.category === cat)!;
              return (
                <button key={cat} onClick={onBrowse}
                  className="group text-left rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  <div className="h-40 overflow-hidden relative">
                    <ProductImg product={preview} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white font-bold text-sm">{c.label}</div>
                      <div className="text-white/75 text-xs">{count} références</div>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: c.color }}>
                      <c.Icon size={13} /> {count} produits
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1F3D] border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <IESLogo size={64} />
            <div>
              <div className="text-white font-semibold text-sm">International Équipements & Services</div>
              <div className="text-gray-500 text-xs mt-0.5">© {new Date().getFullYear()} I.E.S — Dakar, Sénégal</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
            {["ISO 13485", "Marqué CE", "Préqualifié OMS", "Enregistré FDA"].map(b => (
              <span key={b} className="text-gray-500 text-xs flex items-center gap-1.5">
                <Check size={10} className="text-[#D4AF37]" /> {b}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, qty, onAdd }: {
  product: Product; qty: number; onAdd: (p: Product, q: number) => void;
}) {
  const [localQty, setLocalQty] = useState(1);
  const c = CAT[product.category];
  const inQuote = qty > 0;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden flex flex-col border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl group ${
      inQuote ? "border-[#173A73]/30 shadow-md shadow-blue-100/50" : "border-gray-100 shadow-sm"
    }`}>
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <ProductImg product={product} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        {/* Ref */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-600 text-[9px] font-mono px-2 py-0.5 rounded-md border border-white/50">
          {product.ref}
        </div>
        {/* In-quote badge */}
        {inQuote && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#173A73] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
            <Check size={9} /> Au devis ×{qty}
          </div>
        )}
        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className={`${c.pill} text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm border border-white/30`}>
            {c.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="ies-heading font-bold text-gray-900 text-sm leading-snug mb-1.5">{product.name}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
          <Package size={10} className="flex-shrink-0" />
          <span className="truncate">{product.packaging}</span>
        </div>

        {/* Price block */}
        <div className="rounded-xl px-3 py-2.5 mb-3 border" style={{ background: c.light, borderColor: `${c.color}15` }}>
          <div className="flex items-baseline gap-1.5">
            <span className="ies-heading font-extrabold text-lg leading-none" style={{ color: c.color }}>
              {formatFCFA(eurToFCFA(product.unitPrice))}
            </span>
            <span className="text-gray-400 text-xs">/ unité HT</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setLocalQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
              <Minus size={12} />
            </button>
            <span className="w-9 text-center text-sm font-bold text-gray-800">{localQty}</span>
            <button onClick={() => setLocalQty(q => q + 1)}
              className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={() => { onAdd(product, localQty); setLocalQty(1); }}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 hover:shadow-md active:scale-95"
            style={inQuote
              ? { background: "#ECFDF5", color: "#059669" }
              : { background: "linear-gradient(135deg,#173A73,#1E4A8F)", color: "white" }}>
            {inQuote ? <><Check size={12} /> Ajouter encore</> : <><Plus size={12} /> Ajouter au devis</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quote Panel ──────────────────────────────────────────────────────────────
function QuotePanel({ items, onUpdateQty, onRemove, onGenerate, onClose, asDrawer }: {
  items: QuoteItem[]; onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void; onGenerate: () => void;
  onClose?: () => void; asDrawer?: boolean;
}) {
  const subtotalEUR  = items.reduce((s, i) => s + i.product.unitPrice * i.qty, 0);
  const subtotalFCFA = eurToFCFA(subtotalEUR);
  const tvaFCFA      = Math.round(subtotalFCFA * 0.18 / 100) * 100;
  const totalFCFA    = subtotalFCFA + tvaFCFA;

  return (
    <div className={`flex flex-col bg-white ${asDrawer ? "h-full" : "rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#173A73,#1E4A8F)" }}>
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-[#D4AF37]" />
          <span className="font-bold text-white text-sm">Votre Devis</span>
          {items.length > 0 && (
            <span className="bg-[#D4AF37] text-[#0C1B3A] text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5">
              {items.length}
            </span>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Items or empty state */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <ShoppingCart size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700 text-sm mb-1">Panier vide</p>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">Ajoutez des produits depuis le catalogue pour créer votre devis.</p>

            <div className="text-left space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">Comment ça marche ?</p>
              {[
                { n: "1", t: "Parcourez le catalogue",   d: "Filtrez par catégorie ou recherchez" },
                { n: "2", t: "Ajoutez au devis",          d: "Choisissez la quantité souhaitée" },
                { n: "3", t: "Générez le PDF + WhatsApp", d: "Réponse garantie sous 2h ouvrées" },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-black mt-0.5"
                    style={{ background: "#173A73" }}>
                    {s.n}
                  </div>
                  <div>
                    <div className="text-gray-700 text-xs font-semibold">{s.t}</div>
                    <div className="text-gray-400 text-[10px] mt-0.5">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {items.map(item => (
              <div key={item.product.id} className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-colors border border-transparent hover:border-gray-200">
                <div className="flex gap-3 mb-2.5">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <ProductImg product={item.product} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-gray-800 text-xs font-semibold leading-snug line-clamp-2 flex-1">{item.product.name}</p>
                      <button onClick={() => onRemove(item.product.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5 ml-1">
                        <Trash2 size={11} />
                      </button>
                    </div>
                    <p className="text-gray-400 text-[10px] font-mono mt-0.5">{item.product.ref}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 bg-white rounded-lg overflow-hidden">
                    <button onClick={() => onUpdateQty(item.product.id, item.qty - 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                      <Minus size={9} />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-gray-700">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.product.id, item.qty + 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                      <Plus size={9} />
                    </button>
                  </div>
                  <span className="ies-heading font-bold text-sm" style={{ color: "#173A73" }}>
                    {formatFCFA(eurToFCFA(item.product.unitPrice * item.qty))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals + CTA */}
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="space-y-1.5 mb-4 bg-white rounded-xl p-3 border border-gray-100">
            {[
              { l: "Sous-total HT", v: formatFCFA(subtotalFCFA) },
              { l: "TVA 18 %",     v: formatFCFA(tvaFCFA) },
            ].map(r => (
              <div key={r.l} className="flex justify-between text-xs">
                <span className="text-gray-500">{r.l}</span>
                <span className="text-gray-700 font-medium">{r.v}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900 text-sm">Total TTC estimé</span>
              <span className="ies-heading font-extrabold text-[#173A73]">{formatFCFA(totalFCFA)}</span>
            </div>
          </div>
          <button onClick={onGenerate}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
            style={{ background: "linear-gradient(135deg,#D4AF37,#F5D060)", color: "#0C1B3A" }}>
            <FileText size={16} /> Générer mon devis
          </button>
          <p className="text-center text-gray-400 text-[10px] mt-2">PDF professionnel + envoi WhatsApp inclus</p>
        </div>
      )}
    </div>
  );
}

// ─── Catalog Page ─────────────────────────────────────────────────────────────
function CatalogPage({ quoteItems, onAdd, onUpdateQty, onRemove, onGenerate }: {
  quoteItems: QuoteItem[]; onAdd: (p: Product, q: number) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void; onGenerate: () => void;
}) {
  const [activeCat, setActiveCat] = useState<Category>("all");
  const [query, setQuery]         = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    const okCat = activeCat === "all" || p.category === activeCat;
    const q = query.toLowerCase();
    return okCat && (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q));
  }), [activeCat, query]);

  const getQty  = (id: string) => quoteItems.find(i => i.product.id === id)?.qty ?? 0;
  const nbItems = quoteItems.reduce((s, i) => s + i.qty, 0);
  const totalEUR = quoteItems.reduce((s, i) => s + i.product.unitPrice * i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Page header */}
      <div style={{ background: "linear-gradient(135deg,#173A73,#0F2850)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Breadcrumb steps */}
          <div className="flex items-center gap-1.5 text-xs mb-3">
            {[
              { label: "① Sélection produits", active: true },
              { label: "② Génération devis",   active: false },
              { label: "③ Envoi WhatsApp",     active: false },
            ].map((s, i) => (
              <span key={i} className={`flex items-center gap-1.5 ${s.active ? "text-[#D4AF37] font-semibold" : "text-white/40"}`}>
                {i > 0 && <ChevronRight size={10} className="text-white/20" />}
                {s.label}
              </span>
            ))}
          </div>
          <h1 className="ies-heading text-xl font-bold text-white">Catalogue Produits</h1>
          <p className="text-white/70 text-sm mt-0.5">{PRODUCTS.length} références médicales certifiées</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex gap-5 items-start">
          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-4">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher un produit, description ou référence…"
                className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#173A73] focus:ring-2 focus:ring-[#173A73]/10 shadow-sm" />
              {query && (
                <button onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              {(Object.keys(CAT) as Category[]).map(cat => {
                const c = CAT[cat];
                const count = cat === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat).length;
                const active = activeCat === cat;
                return (
                  <button key={cat} onClick={() => setActiveCat(cat)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      active
                        ? "text-white border-transparent shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    style={active ? { background: "linear-gradient(135deg,#173A73,#1E4A8F)" } : {}}>
                    <c.Icon size={12} />
                    {c.label}
                    <span className={`text-[9px] font-mono rounded-full px-1.5 py-0.5 ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Result count */}
            <p className="text-gray-400 text-xs mb-3">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
              {activeCat !== "all" && <> — <span className="text-gray-600 font-medium">{CAT[activeCat].label}</span></>}
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-28 lg:pb-8">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} qty={getQty(p.id)} onAdd={onAdd} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Search size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-bold text-gray-700 mb-1">Aucun produit trouvé</p>
                <p className="text-gray-400 text-sm mb-5">Essayez un autre terme de recherche ou parcourez toutes les catégories</p>
                <button onClick={() => { setQuery(""); setActiveCat("all"); }}
                  className="inline-flex items-center gap-1.5 text-[#173A73] font-semibold text-sm hover:underline">
                  <X size={13} /> Effacer les filtres
                </button>
              </div>
            )}
          </div>

          {/* ── Quote panel — ALWAYS visible on desktop ── */}
          <aside className="hidden lg:flex flex-col w-[300px] xl:w-[320px] flex-shrink-0">
            <div className="sticky top-[76px]" style={{ height: "calc(100vh - 90px)" }}>
              <QuotePanel items={quoteItems} onUpdateQty={onUpdateQty} onRemove={onRemove} onGenerate={onGenerate} />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      {quoteItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 p-3 shadow-2xl">
          <button onClick={() => setDrawerOpen(true)}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#173A73,#1E4A8F)" }}>
            <div className="flex items-center gap-2.5">
              <ShoppingCart size={18} />
              <span>{nbItems} article{nbItems > 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: "#D4AF37" }}>{formatFCFA(eurToFCFA(totalEUR))}</span>
              <ChevronRight size={16} className="text-white/60" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl overflow-hidden flex flex-col bg-white"
            style={{ maxHeight: "88vh" }}>
            <QuotePanel items={quoteItems} onUpdateQty={onUpdateQty} onRemove={onRemove}
              onGenerate={() => { setDrawerOpen(false); onGenerate(); }}
              onClose={() => setDrawerOpen(false)} asDrawer />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quote Modal ──────────────────────────────────────────────────────────────
function QuoteModal({ items, quoteRef, onClose, onWhatsApp }: {
  items: QuoteItem[]; quoteRef: string; onClose: () => void; onWhatsApp: () => void;
}) {
  const totalEUR      = items.reduce((s, i) => s + i.product.unitPrice * i.qty, 0);
  const subtotalFCFA  = eurToFCFA(totalEUR);
  const tvaFCFA       = Math.round(subtotalFCFA * 0.18 / 100) * 100;
  const totalFCFA     = subtotalFCFA + tvaFCFA;
  const today         = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const validUntil    = new Date(Date.now() + 30 * 86400000).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const [{ pdf }, { QuotePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./components/QuotePDF"),
      ]);
      const blob = await pdf(QuotePDF({ items, quoteRef, today, validUntil })).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${quoteRef}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); window.print(); }
    finally { setPdfLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style={{ maxHeight: "92vh" }}>
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText size={17} className="text-[#173A73]" />
            <span className="ies-heading font-bold text-gray-900">Aperçu du Devis</span>
            <span className="bg-gray-100 text-gray-500 font-mono text-xs px-2 py-0.5 rounded">{quoteRef}</span>
          </div>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Quote header */}
            <div className="px-7 py-5 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#173A73 0%,#0F2850 100%)" }}>
              <div className="flex items-center gap-3">
                <IESLogo size={120} />
                <div>
                  <div className="text-white font-bold text-base">International Équipements & Services</div>
                  <div className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase mt-0.5">Solutions Mondiales & Partenariat</div>
                </div>
              </div>
              <div className="text-right">
                <div className="ies-heading text-white font-extrabold text-2xl">DEVIS</div>
                <div className="text-[#D4AF37] font-mono text-xs mt-0.5">{quoteRef}</div>
              </div>
            </div>

            <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#D4AF37,#F5D060,#D4AF37)" }} />

            {/* Meta row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-7 py-4 bg-gray-50 border-b border-gray-100">
              {[
                { label: "Date d'émission", value: today },
                { label: "Valide jusqu'au", value: validUntil },
                { label: "Incotermes",       value: "EXW / DDP" },
                { label: "Devise",           value: "FCFA (XOF)" },
              ].map(m => (
                <div key={m.label}>
                  <div className="text-gray-400 text-[9px] uppercase tracking-widest font-semibold mb-0.5">{m.label}</div>
                  <div className="text-gray-800 font-semibold text-xs">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Product table */}
            <div className="px-7 py-5">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    {["Désignation", "Réf.", "P.U. HT", "Qté", "Total FCFA"].map((h, i) => (
                      <th key={h} className={`pb-3 text-gray-400 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap ${i === 0 ? "text-left" : "text-right"} ${i > 0 ? "pl-3" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item, idx) => (
                    <tr key={item.product.id} className={idx % 2 === 1 ? "bg-gray-50/70" : ""}>
                      <td className="py-3 pr-3">
                        <div className="font-semibold text-gray-800 text-xs leading-snug">{item.product.name}</div>
                        <div className="text-gray-400 text-[10px] mt-0.5">{item.product.packaging}</div>
                      </td>
                      <td className="py-3 pl-3 pr-2 text-right font-mono text-[10px] text-gray-400 whitespace-nowrap">{item.product.ref}</td>
                      <td className="py-3 pl-2 pr-2 text-right text-xs text-gray-600 whitespace-nowrap">{formatFCFA(eurToFCFA(item.product.unitPrice))}</td>
                      <td className="py-3 pl-2 pr-2 text-right font-bold text-gray-800 text-xs">{item.qty}</td>
                      <td className="py-3 pl-2 text-right font-bold text-[#173A73] whitespace-nowrap">{formatFCFA(eurToFCFA(item.product.unitPrice * item.qty))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mt-5">
                <div className="w-64 space-y-1.5 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {[
                    { l: "Sous-total HT",  v: formatFCFA(subtotalFCFA) },
                    { l: "Transport",       v: "À définir" },
                    { l: "TVA 18 %",       v: formatFCFA(tvaFCFA) },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between text-xs">
                      <span className="text-gray-500">{r.l}</span>
                      <span className="text-gray-700 font-medium">{r.v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 mt-1">
                    <span className="font-bold text-gray-900 text-sm">Total TTC estimé</span>
                    <span className="ies-heading font-extrabold text-[#173A73] text-lg">{formatFCFA(totalFCFA)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer badges */}
            <div className="px-7 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-x-5 gap-y-1">
              {["Certifié ISO 13485", "Produits Marqués CE", "Valable 30 jours", "Prix EXW sauf mention"].map(b => (
                <span key={b} className="text-gray-400 text-[10px] flex items-center gap-1">
                  <Check size={9} className="text-green-500" /> {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 flex-shrink-0">
          <button onClick={downloadPDF} disabled={pdfLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-60 shadow-sm">
            {pdfLoading
              ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              : <Download size={15} />}
            {pdfLoading ? "Génération…" : "Télécharger le PDF"}
          </button>
          <button onClick={onWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:shadow-lg shadow-md"
            style={{ background: "#25D366" }}>
            <MessageCircle size={15} /> Envoyer sur WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WhatsApp Screen ──────────────────────────────────────────────────────────
function WhatsAppScreen({ items, quoteRef, onBack }: {
  items: QuoteItem[]; quoteRef: string; onBack: () => void;
}) {
  const totalEUR     = items.reduce((s, i) => s + i.product.unitPrice * i.qty, 0);
  const subtotalFCFA = eurToFCFA(totalEUR);
  const tvaFCFA      = Math.round(subtotalFCFA * 0.18 / 100) * 100;
  const totalFCFA    = subtotalFCFA + tvaFCFA;
  const today        = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const msgText =
    `*Demande de Devis — I.E.S*\n` +
    `Référence : ${quoteRef}\nDate : ${today}\n\n` +
    `*Produits sélectionnés :*\n` +
    items.map(i => `• ${i.product.name} (${i.product.ref}) × ${i.qty} = ${formatFCFA(eurToFCFA(i.product.unitPrice * i.qty))}`).join("\n") +
    `\n\n*Total TTC estimé : ${formatFCFA(totalFCFA)}*\n\n` +
    `Merci de bien vouloir traiter cette commande dans les meilleurs délais.\n` +
    `_International Équipements & Services — Dakar, Sénégal_`;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Success indicator */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(37,211,102,0.12)" }}>
            <Check size={36} className="text-[#25D366]" />
          </div>
          <h1 className="ies-heading text-2xl font-bold text-gray-900 mb-2">Devis Prêt !</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            Votre devis est généré. Envoyez-le sur WhatsApp pour recevoir une confirmation sous 2 heures ouvrées.
          </p>
        </div>

        {/* Order recap */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <FileText size={15} className="text-[#173A73]" />
            <span className="ies-heading font-bold text-gray-900 text-sm">Récapitulatif</span>
            <span className="ml-auto text-gray-400 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded">{quoteRef}</span>
          </div>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  <ProductImg product={item.product} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-xs font-semibold truncate">{item.product.name}</p>
                  <p className="text-gray-400 text-[10px]">× {item.qty} unité{item.qty > 1 ? "s" : ""}</p>
                </div>
                <span className="text-gray-800 text-xs font-bold flex-shrink-0">
                  {formatFCFA(eurToFCFA(item.product.unitPrice * item.qty))}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total TTC estimé</span>
            <span className="ies-heading font-extrabold text-[#173A73] text-xl">{formatFCFA(totalFCFA)}</span>
          </div>
        </div>

        {/* Message preview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={13} className="text-[#25D366]" />
            <span className="text-xs font-semibold text-gray-700">Aperçu du message</span>
          </div>
          <div className="bg-[#ECF8EF] rounded-xl p-3 text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-line">
            {`*Demande de Devis — I.E.S*\nRéf. : ${quoteRef}\n\n${items.map(i => `• ${i.product.name} ×${i.qty} = ${formatFCFA(eurToFCFA(i.product.unitPrice * i.qty))}`).join("\n")}\n\nTotal TTC : ${formatFCFA(totalFCFA)}`}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msgText)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 py-4 rounded-xl font-bold text-base text-white mb-3 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25"
          style={{ background: "#25D366" }}>
          <MessageCircle size={20} /> Envoyer le Devis via WhatsApp
        </a>
        <p className="text-center text-gray-400 text-xs mb-8">
          Ouvre WhatsApp avec votre devis pré-rempli — réponse sous 2 heures ouvrées.
        </p>

        <button onClick={onBack}
          className="w-full border border-gray-200 text-gray-500 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 hover:text-gray-700 transition-colors">
          ← Retour au catalogue
        </button>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]           = useState<View>("landing");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [quoteRef, setQuoteRef]   = useState("");

  const go = (v: View) => { setView(v); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const addItem = (product: Product, qty: number) =>
    setQuoteItems(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      return ex
        ? prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { product, qty }];
    });

  const updateQty = (id: string, qty: number) =>
    qty <= 0
      ? setQuoteItems(prev => prev.filter(i => i.product.id !== id))
      : setQuoteItems(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));

  const removeItem = (id: string) =>
    setQuoteItems(prev => prev.filter(i => i.product.id !== id));

  const handleGenerate = () => {
    setQuoteRef(`IES-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setModalOpen(true);
  };

  const totalEUR = quoteItems.reduce((s, i) => s + i.product.unitPrice * i.qty, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        quoteCount={quoteItems.length}
        totalEUR={totalEUR}
        onLogo={() => go("landing")}
        onCatalog={() => go("catalog")}
        onQuoteOpen={() => quoteItems.length === 0 ? go("catalog") : go("catalog")}
      />

      {view === "landing"   && <LandingPage onBrowse={() => go("catalog")} />}
      {view === "catalog"   && <CatalogPage quoteItems={quoteItems} onAdd={addItem} onUpdateQty={updateQty} onRemove={removeItem} onGenerate={handleGenerate} />}
      {view === "whatsapp"  && <WhatsAppScreen items={quoteItems} quoteRef={quoteRef} onBack={() => go("catalog")} />}

      {modalOpen && (
        <QuoteModal items={quoteItems} quoteRef={quoteRef}
          onClose={() => setModalOpen(false)}
          onWhatsApp={() => { setModalOpen(false); go("whatsapp"); }} />
      )}
    </div>
  );
}
