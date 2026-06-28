import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaDownload, FaShareAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';

const MOCK_REPORTS = [
  {
    id: 1,
    title: 'Blood Test Results',
    doctor: 'Dr. Sarah Connor',
    hospital: 'Apollo Hospitals',
    date: '2023-10-15',
    status: 'Reviewed',
    isNew: false,
    patientName: 'John Doe',
    patientAge: 35,
    patientGender: 'Male',
    diagnosis: 'Mild anemia detected. Iron levels below normal range.',
    labResults: [
      { test: 'Hemoglobin', value: '11.2 g/dL', range: '13.5 - 17.5 g/dL', status: 'Low' },
      { test: 'RBC Count', value: '4.2 M/uL', range: '4.5 - 5.5 M/uL', status: 'Low' },
      { test: 'WBC Count', value: '7,500 /uL', range: '4,500 - 11,000 /uL', status: 'Normal' },
      { test: 'Platelet Count', value: '250,000 /uL', range: '150,000 - 400,000 /uL', status: 'Normal' },
      { test: 'Iron', value: '40 ug/dL', range: '60 - 170 ug/dL', status: 'Low' },
    ],
    remarks: 'Patient advised to increase iron-rich food intake. Follow-up in 4 weeks.',
    prescriptions: [
      { medicine: 'Ferrous Sulfate 325mg', dosage: '1 tablet daily', duration: '30 days' },
      { medicine: 'Vitamin C 500mg', dosage: '1 tablet daily', duration: '30 days' },
    ],
  },
  {
    id: 2,
    title: 'Chest X-Ray',
    doctor: 'Dr. James Smith',
    hospital: 'Max Healthcare',
    date: '2023-10-20',
    status: 'Pending',
    isNew: true,
    patientName: 'John Doe',
    patientAge: 35,
    patientGender: 'Male',
    diagnosis: 'No significant abnormality detected. Lungs appear clear.',
    labResults: [
      { test: 'Heart Size', value: 'Normal', range: 'N/A', status: 'Normal' },
      { test: 'Lung Fields', value: 'Clear', range: 'N/A', status: 'Normal' },
      { test: 'Pleural Space', value: 'Normal', range: 'N/A', status: 'Normal' },
    ],
    remarks: 'Chest X-Ray is normal. No active disease process seen. Routine follow-up recommended.',
    prescriptions: [],
  },
];

function generatePDF(report) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header bar
  doc.setFillColor(10, 25, 47); // #0A192F
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(0, 229, 255); // Cyan
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MedPro', 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text('Healthcare Management System', 14, 26);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`Report ID: RPT-${String(report.id).padStart(5, '0')}`, pageWidth - 14, 18, { align: 'right' });
  doc.text(`Date: ${report.date}`, pageWidth - 14, 26, { align: 'right' });

  y = 50;

  // Report Title
  doc.setTextColor(10, 25, 47);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(report.title, 14, y);
  y += 10;

  // Divider
  doc.setDrawColor(0, 229, 255);
  doc.setLineWidth(0.8);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  // Patient Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 25, 47);
  doc.text('Patient Information', 14, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${report.patientName}`, 14, y);
  doc.text(`Age: ${report.patientAge}`, 100, y);
  doc.text(`Gender: ${report.patientGender}`, 150, y);
  y += 7;
  doc.text(`Doctor: ${report.doctor}`, 14, y);
  doc.text(`Hospital: ${report.hospital}`, 100, y);
  y += 12;

  // Diagnosis
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 25, 47);
  doc.text('Diagnosis', 14, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const diagLines = doc.splitTextToSize(report.diagnosis, pageWidth - 28);
  doc.text(diagLines, 14, y);
  y += diagLines.length * 6 + 8;

  // Lab Results Table
  if (report.labResults && report.labResults.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 25, 47);
    doc.text('Lab Results', 14, y);
    y += 8;

    // Table header
    doc.setFillColor(10, 25, 47);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Test', 18, y + 6);
    doc.text('Value', 80, y + 6);
    doc.text('Reference Range', 120, y + 6);
    doc.text('Status', 172, y + 6);
    y += 10;

    // Table rows
    report.labResults.forEach((row, i) => {
      const bgColor = i % 2 === 0 ? [245, 247, 250] : [255, 255, 255];
      doc.setFillColor(...bgColor);
      doc.rect(14, y - 1, pageWidth - 28, 8, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(row.test, 18, y + 5);
      doc.text(row.value, 80, y + 5);
      doc.text(row.range, 120, y + 5);

      if (row.status === 'Normal') {
        doc.setTextColor(16, 185, 129);
      } else {
        doc.setTextColor(239, 68, 68);
      }
      doc.setFont('helvetica', 'bold');
      doc.text(row.status, 172, y + 5);
      y += 8;
    });
    y += 8;
  }

  // Doctor Remarks
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 25, 47);
  doc.text('Doctor Remarks', 14, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const remarkLines = doc.splitTextToSize(report.remarks, pageWidth - 28);
  doc.text(remarkLines, 14, y);
  y += remarkLines.length * 6 + 8;

  // Prescriptions
  if (report.prescriptions && report.prescriptions.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 25, 47);
    doc.text('Prescriptions', 14, y);
    y += 8;

    doc.setFillColor(10, 25, 47);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Medicine', 18, y + 6);
    doc.text('Dosage', 100, y + 6);
    doc.text('Duration', 160, y + 6);
    y += 10;

    report.prescriptions.forEach((rx, i) => {
      const bgColor = i % 2 === 0 ? [245, 247, 250] : [255, 255, 255];
      doc.setFillColor(...bgColor);
      doc.rect(14, y - 1, pageWidth - 28, 8, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(rx.medicine, 18, y + 5);
      doc.text(rx.dosage, 100, y + 5);
      doc.text(rx.duration, 160, y + 5);
      y += 8;
    });
    y += 8;
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This is a computer-generated report from MedPro Healthcare Management System.', 14, footerY);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 14, footerY, { align: 'right' });

  // Save
  const fileName = `${report.title.replace(/\s+/g, '_')}_${report.date}.pdf`;
  doc.save(fileName);
}

export default function MedicalReports() {
  const [reports] = useState(MOCK_REPORTS);

  return (
    <div className="flex flex-col gap-8 h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan/20 to-transparent p-8 rounded-2xl border border-cyan/20"
      >
        <h1 className="text-4xl font-bold mb-4">Medical Reports</h1>
        <p className="text-gray-300 text-lg">Access your past reports, prescriptions, and lab results.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-2xl p-6 relative group hover:border-cyan/50 transition-all"
          >
            {report.isNew && (
              <span className="absolute top-4 right-4 bg-cyan/20 text-cyan px-3 py-1 rounded-full text-xs font-bold border border-cyan/30 animate-pulse">
                NEW
              </span>
            )}
            
            <div className="flex items-center gap-4 mb-6">
               <div className="p-4 bg-red-500/10 text-red-500 rounded-xl">
                 <FaFilePdf className="text-3xl" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white">{report.title}</h3>
                 <p className="text-gray-400 text-sm">{report.date}</p>
               </div>
            </div>

            <div className="space-y-2 mb-6 text-sm text-gray-300">
              <p><span className="text-gray-500">Doctor:</span> {report.doctor}</p>
              <p><span className="text-gray-500">Hospital:</span> {report.hospital}</p>
              <p><span className="text-gray-500">Status:</span> <span className={report.status === 'Reviewed' ? 'text-green-400' : 'text-yellow-400'}>{report.status}</span></p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => generatePDF(report)}
                className="flex-1 bg-cyan/10 hover:bg-cyan text-cyan hover:text-black border border-cyan py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
              >
                <FaDownload /> Download
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all">
                <FaShareAlt />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
