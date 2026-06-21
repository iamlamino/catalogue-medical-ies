import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const BLUE = "#173A73";
const GOLD = "#D4AF37";
const GREEN = "#2E8B57";
const DARK = "#0C1B3A";
const GREY = "#6B7A99";
const LIGHT = "#F5F7FB";

function eurToFCFA(eur: number): number {
  const raw = eur * 655.957;
  return raw < 10000 ? Math.round(raw / 50) * 50 : Math.round(raw / 100) * 100;
}

function formatFCFA(amount: number): string {
  return amount.toLocaleString("fr-FR") + " FCFA";
}

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: DARK, paddingBottom: 55 },
  header: {
    backgroundColor: BLUE,
    paddingTop: 12, paddingBottom: 12, paddingLeft: 30, paddingRight: 30,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerLogo: { width: 120, height: 120, marginRight: 18 },
  headerCompanyName: { color: "#FFFFFF", fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  headerTagline: { color: GOLD, fontSize: 7 },
  headerRight: { alignItems: "flex-end" },
  headerQuoteLabel: { color: "#FFFFFF", fontSize: 20, fontFamily: "Helvetica-Bold" },
  headerQuoteRef: { color: GOLD, fontSize: 8, fontFamily: "Courier", marginTop: 3 },
  goldBar: { height: 3, backgroundColor: GOLD },
  metaRow: {
    flexDirection: "row", backgroundColor: LIGHT,
    borderBottomWidth: 1, borderBottomColor: "#E2E8F0",
    paddingTop: 12, paddingBottom: 12, paddingLeft: 30, paddingRight: 30,
  },
  metaCell: { flex: 1 },
  metaLabel: { color: GREY, fontSize: 7, textTransform: "uppercase", marginBottom: 3 },
  metaValue: { color: DARK, fontSize: 9, fontFamily: "Helvetica-Bold" },
  body: { paddingTop: 16, paddingLeft: 30, paddingRight: 30 },
  tableHeader: {
    flexDirection: "row", borderBottomWidth: 2,
    borderBottomColor: "#D1DCF0", paddingBottom: 6, marginBottom: 2,
  },
  colDesignation: { flex: 3 },
  colRef: { flex: 1.2 },
  colPrice: { flex: 1.4 },
  colQty: { flex: 0.6 },
  colTotal: { flex: 1.4 },
  thLeft: { color: GREY, fontSize: 7, fontFamily: "Helvetica-Bold" },
  thRight: { color: GREY, fontSize: 7, fontFamily: "Helvetica-Bold", textAlign: "right" },
  tableRow: { flexDirection: "row", paddingTop: 5, paddingBottom: 5 },
  tableRowAlt: { backgroundColor: "#F9FAFB" },
  productName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: DARK, marginBottom: 2 },
  productPackaging: { fontSize: 7, color: GREY },
  refText: { fontSize: 7, color: GREY, fontFamily: "Courier" },
  cellRight: { fontSize: 9, color: DARK, textAlign: "right" },
  cellRightBold: { fontSize: 9, color: DARK, fontFamily: "Helvetica-Bold", textAlign: "right" },
  totalCell: { fontSize: 10, color: BLUE, fontFamily: "Helvetica-Bold", textAlign: "right" },
  divider: { borderTopWidth: 2, borderTopColor: "#D1DCF0", marginTop: 12, marginBottom: 8 },
  totalsSection: { alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", width: 230, marginBottom: 4 },
  totalsLabel: { color: GREY, fontSize: 8, flex: 1 },
  totalsValue: { color: DARK, fontSize: 8, textAlign: "right" },
  grandTotalRow: {
    flexDirection: "row", width: 230,
    borderTopWidth: 1, borderTopColor: "#D1DCF0",
    paddingTop: 6, marginTop: 4,
  },
  grandTotalLabel: { color: DARK, fontSize: 10, fontFamily: "Helvetica-Bold", flex: 1 },
  grandTotalValue: { color: BLUE, fontSize: 13, fontFamily: "Helvetica-Bold", textAlign: "right" },
  footer: {
    position: "absolute", bottom: 16, left: 30, right: 30,
    borderTopWidth: 1, borderTopColor: "#E2E8F0",
    paddingTop: 8, flexDirection: "row", flexWrap: "wrap",
  },
  footerItem: { flexDirection: "row", alignItems: "center", marginRight: 16, marginBottom: 4 },
  footerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: GREEN, marginRight: 4 },
  footerText: { color: GREY, fontSize: 7 },
  pageNumber: { position: "absolute", bottom: 16, right: 30, color: GREY, fontSize: 7 },
});

export interface QuotePDFProps {
  items: Array<{ product: { id: string; name: string; ref: string; packaging: string; unitPrice: number }; qty: number }>;
  quoteRef: string;
  today: string;
  validUntil: string;
}

export function QuotePDF({ items, quoteRef, today, validUntil }: QuotePDFProps) {
  const subtotalFCFA = eurToFCFA(items.reduce((s, i) => s + i.product.unitPrice * i.qty, 0));
  const tva = Math.round(subtotalFCFA * 0.18 / 100) * 100;
  const totalTTC = subtotalFCFA + tva;

  return (
    <Document title={`Devis ${quoteRef} — I.E.S`} author="International Équipements & Services">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src="/images/logo.jpg" style={styles.headerLogo} />
            <View>
              <Text style={styles.headerCompanyName}>International Équipements & Services</Text>
              <Text style={styles.headerTagline}>SOLUTIONS MONDIALES & PARTENARIAT</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerQuoteLabel}>DEVIS</Text>
            <Text style={styles.headerQuoteRef}>{quoteRef}</Text>
          </View>
        </View>

        <View style={styles.goldBar} />

        <View style={styles.metaRow}>
          {[
            { label: "Date d'émission", value: today },
            { label: "Valide jusqu'au", value: validUntil },
            { label: "Incotermes", value: "EXW / DDP" },
            { label: "Devise", value: "FCFA (XOF)" },
          ].map(m => (
            <View key={m.label} style={styles.metaCell}>
              <Text style={styles.metaLabel}>{m.label}</Text>
              <Text style={styles.metaValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.body}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesignation}><Text style={styles.thLeft}>Désignation</Text></View>
            <View style={styles.colRef}><Text style={styles.thLeft}>Réf.</Text></View>
            <View style={styles.colPrice}><Text style={styles.thRight}>Prix Unitaire</Text></View>
            <View style={styles.colQty}><Text style={styles.thRight}>Qté</Text></View>
            <View style={styles.colTotal}><Text style={styles.thRight}>Total FCFA</Text></View>
          </View>

          {items.map((item, i) => (
            <View key={item.product.id} style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowAlt] : [])]}>
              <View style={styles.colDesignation}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productPackaging}>{item.product.packaging}</Text>
              </View>
              <View style={styles.colRef}>
                <Text style={styles.refText}>{item.product.ref}</Text>
              </View>
              <View style={styles.colPrice}>
                <Text style={styles.cellRight}>{formatFCFA(eurToFCFA(item.product.unitPrice))}</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.cellRightBold}>{item.qty}</Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={styles.totalCell}>{formatFCFA(eurToFCFA(item.product.unitPrice * item.qty))}</Text>
              </View>
            </View>
          ))}

          <View style={styles.divider} />
          <View style={styles.totalsSection}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Sous-total HT</Text>
              <Text style={styles.totalsValue}>{formatFCFA(subtotalFCFA)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Transport (estimé)</Text>
              <Text style={styles.totalsValue}>À définir</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>TVA 18 %</Text>
              <Text style={styles.totalsValue}>{formatFCFA(tva)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total TTC estimé</Text>
              <Text style={styles.grandTotalValue}>{formatFCFA(totalTTC)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          {["Certifié ISO 13485", "Produits Marqués CE", "Valable 30 jours", "Prix EXW sauf mention"].map(b => (
            <View key={b} style={styles.footerItem}>
              <View style={styles.footerDot} />
              <Text style={styles.footerText}>{b}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
