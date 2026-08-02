import { jsPDF } from "jspdf";

function ReportButton({
  substance,
  temperature,
  heat,
}) {

  function downloadReport() {

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text("Virtual Phase Change Laboratory", 20, 20);

    doc.setDrawColor(30, 64, 175);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);

    doc.text(`Student : Vamsi Loya`, 20, 40);

    doc.text(
      `Date : ${new Date().toLocaleDateString()}`,
      20,
      50
    );

    doc.text(
      `Substance : ${substance.name}`,
      20,
      65
    );

    doc.text(
      `Current Temperature : ${temperature} °C`,
      20,
      75
    );

    doc.text(
      `Melting Point : ${substance.meltingPoint} °C`,
      20,
      85
    );

    doc.text(
      `Boiling Point : ${substance.boilingPoint} °C`,
      20,
      95
    );

    doc.text(
      `Heat Added : ${heat} J`,
      20,
      105
    );

    doc.text(
      `Latent Heat : ${substance.latentHeat} J/g`,
      20,
      115
    );

    doc.setFontSize(16);
    doc.text("Theory", 20, 135);

    doc.setFontSize(12);
    doc.text(
      doc.splitTextToSize(
        substance.theory,
        170
      ),
      20,
      145
    );

    doc.setFontSize(16);
    doc.text("Conclusion", 20, 190);

    doc.setFontSize(12);

    doc.text(
      "Latent heat is the heat absorbed during a phase change without changing temperature.",
      20,
      200,
      { maxWidth: 170 }
    );

    doc.setFontSize(11);

    doc.text(
      "Generated using Virtual Phase Change Laboratory",
      20,
      270
    );

    doc.save(`${substance.id}-lab-report.pdf`);

  }

  return (

    <div
      style={{
        textAlign: "center",
        margin: "25px",
      }}
    >

      <button
        onClick={downloadReport}
        style={{
          padding: "14px 30px",
          fontSize: "18px",
          borderRadius: "14px",
          cursor: "pointer",
          background: "#2563eb",
          color: "#fff",
          border: "none",
        }}
      >
        📄 Download Lab Report
      </button>

    </div>

  );

}

export default ReportButton;