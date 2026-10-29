/* ================================================================== */
/*  GS TOP DRINKS — PDF Generator (html2canvas + jsPDF)                */
/*  Gera comanda em PDF client-side, offline                           */
/* ================================================================== */

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { fmt } from "../data/drinks";
import type { Segment, PackageId, Pkg, Drink, GuestsOption } from "../data/catalog";

interface ComandaData {
  segment: Segment;
  guests: GuestsOption;
  packageId: PackageId;
  pkg: Pkg;
  selectedDrinks: Drink[];
  perPerson: number;
  totalEvent: number;
  number: number;
  date: string;
}

/**
 * Gera PDF da comanda usando html2canvas + jsPDF
 * Funciona offline, sem dependência de servidor
 */
export async function generateComandaPDF(data: ComandaData): Promise<void> {
  const { segment, guests, pkg, selectedDrinks, perPerson, totalEvent, number, date } = data;

  // Criar elemento temporário para renderizar
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "400px";
  container.style.fontFamily = "'Jost', sans-serif";
  container.style.background = "#f7f1e6";
  container.style.color = "#1b1410";
  container.style.padding = "40px 36px";
  container.style.fontSize = "15px";
  container.style.lineHeight = "1.6";
  document.body.appendChild(container);

  // HTML da comanda (estilo receipt térmico)
  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 3.2rem; font-weight: 800; letter-spacing: -0.06em; font-family: 'Jost', sans-serif;">GS</div>
      <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.42em; text-transform: uppercase; margin-top: 8px;">Top Drinks</div>
      <div style="font-size: 13px; opacity: 0.6; margin-top: 12px;">Open bar premium · Blumenau — SC</div>
    </div>
    <hr style="border: none; border-top: 1px dashed rgba(27,20,16,0.35); margin: 16px 0;" />
    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 16px;">
      <span>COMANDA Nº ${number}</span>
      <span>${date}</span>
    </div>
    <hr style="border: none; border-top: 1px dashed rgba(27,20,16,0.35); margin: 16px 0;" />
    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Evento</span><span>${segment.name}</span></div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Convidados</span><span>${guests.short}</span></div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Pacote</span><span>${pkg.name}</span></div>
    </div>
    <hr style="border: none; border-top: 1px dashed rgba(27,20,16,0.35); margin: 16px 0;" />
    <div style="margin-bottom: 16px;">
      ${selectedDrinks.map((d) => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>${d.name}</span>
          <span>${fmt.format(d.cost)}</span>
        </div>
      `).join("")}
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Estrutura & equipe</span><span>${fmt.format(pkg.base)}</span></div>
    </div>
    <hr style="border: none; border-top: 3px double rgba(27,20,16,0.35); margin: 16px 0;" />
    <div style="display: flex; justify-content: space-between; font-family: 'Jost', sans-serif; margin-bottom: 8px;">
      <span style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em;">Total / pessoa</span>
      <span style="font-size: 1.75rem; font-weight: 800;">${fmt.format(perPerson)}</span>
    </div>
    <p style="text-align: right; font-size: 13px; opacity: 0.6; margin-bottom: 12px;">para cerca de ${guests.estimate} convidados</p>
    <div style="display: flex; justify-content: space-between; font-family: 'Jost', sans-serif;">
      <span style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em;">Total estimado</span>
      <span style="font-size: 1.25rem; font-weight: 700;">≈ ${fmt.format(totalEvent)}</span>
    </div>
    <hr style="border: none; border-top: 1px dashed rgba(27,20,16,0.35); margin: 16px 0;" />
    <div style="background: repeating-linear-gradient(90deg, #1b1410 0 2px, transparent 2px 4px, #1b1410 4px 5px, transparent 5px 8px, #1b1410 8px 11px, transparent 11px 12px); height: 12px; margin: 16px 0;"></div>
    <p style="text-align: center; font-size: 13px;">obrigado pela preferência!</p>
    <p style="text-align: center; font-size: 13px; opacity: 0.6;">@gstopdrinks · gstopdrinks.com.br</p>
  `;

  try {
    // Renderizar com html2canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#f7f1e6",
    });

    // Criar PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF({
      orientation: imgHeight > 297 ? "p" : "p",
      unit: "mm",
      format: imgHeight > 297 ? [imgWidth, imgHeight + 20] : "a4",
    });

    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, imgWidth, imgHeight);
    
    // Salvar
    pdf.save(`comanda-gs-top-drinks-${number}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Gera PDF simples (sem html2canvas) para fallback
 */
export function generateSimplePDF(data: ComandaData): void {
  const { segment, guests, pkg, selectedDrinks, perPerson, totalEvent, number, date } = data;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  
  let y = 20;
  const line = (text: string, size = 10, weight = "normal", align: "left" | "center" | "right" = "left") => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", weight);
    const x = align === "center" ? 105 : align === "right" ? 195 : 15;
    pdf.text(text, x, y, { align });
    y += size * 0.5 + 2;
  };
  
  const hr = () => {
    pdf.setDrawColor(200);
    pdf.line(15, y, 195, y);
    y += 4;
  };

  line("GS TOP DRINKS", 28, "bold", "center");
  line("Open bar premium · Blumenau — SC", 10, "normal", "center");
  y += 4;
  hr();
  line(`COMANDA Nº ${number}`, 10, "normal", "left");
  line(date, 10, "normal", "right");
  y = 20; // reset y after header
  // Actually let's do proper layout
  y = 50;
  
  line(`Evento: ${segment.name}`, 11);
  line(`Convidados: ${guests.short}`, 11);
  line(`Pacote: ${pkg.name}`, 11);
  hr();
  
  selectedDrinks.forEach((d) => {
    line(`${d.name} .......................................... ${fmt.format(d.cost)}`, 10);
  });
  line(`Estrutura & equipe .......................................... ${fmt.format(pkg.base)}`, 10);
  hr();
  line(`Total / pessoa: ${fmt.format(perPerson)}`, 14, "bold");
  line(`para cerca de ${guests.estimate} convidados`, 10, "normal", "right");
  y += 4;
  line(`Total estimado: ≈ ${fmt.format(totalEvent)}`, 16, "bold");
  hr();
  line("obrigado pela preferência!", 11, "normal", "center");
  line("@gstopdrinks · gstopdrinks.com.br", 9, "normal", "center");

  pdf.save(`comanda-gs-top-drinks-${number}.pdf`);
}