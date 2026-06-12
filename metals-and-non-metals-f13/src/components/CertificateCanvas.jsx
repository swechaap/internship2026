import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, Award, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { audio } from '../utils/audio';

export default function CertificateCanvas({ playerName, totalScore, averageAccuracy, completionDate }) {
  const canvasRef = useRef(null);
  const [downloadedPng, setDownloadedPng] = useState(false);
  const [downloadedPdf, setDownloadedPdf] = useState(false);
  const [shared, setShared] = useState(false);

  // Dynamic input for name customization directly on the certificate
  const [customName, setCustomName] = useState(playerName || 'Star Student');

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Dimensions
    const width = 1000;
    const height = 700;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background Gradient (Lab Theme)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0F172A'); // Slate 900
    bgGrad.addColorStop(0.5, '#1E1B4B'); // Indigo 950
    bgGrad.addColorStop(1, '#0A2540'); // Dark Deep Blue
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Decorative Atomic Background Watermark
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)'; // Light Indigo
    ctx.lineWidth = 2;
    
    // Atom Orbit 1
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, 280, 100, Math.PI / 6, 0, 2 * Math.PI);
    ctx.stroke();

    // Atom Orbit 2
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, 280, 100, -Math.PI / 6, 0, 2 * Math.PI);
    ctx.stroke();

    // Atom Orbit 3
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, 320, 120, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Center Glow
    const glowGrad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, 200);
    glowGrad.addColorStop(0, 'rgba(124, 58, 237, 0.12)'); // Purple
    glowGrad.addColorStop(1, 'rgba(124, 58, 237, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Draw Outer Borders (Double neon borders)
    ctx.strokeStyle = '#7C3AED'; // Purple theme
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#06B6D4'; // Cyan theme
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Border Corner Science Ornaments
    const drawCornerOrnament = (cx, cy) => {
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#7C3AED';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
      ctx.stroke();
    };

    drawCornerOrnament(50, 50);
    drawCornerOrnament(width - 50, 50);
    drawCornerOrnament(50, height - 50);
    drawCornerOrnament(width - 50, height - 50);

    // 4. Certificate Header
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Subtitle
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillStyle = '#22C55E'; // Success green
    ctx.letterSpacing = '5px';
    ctx.fillText('SCIENCE LABORATORY ACADEMY', width / 2, 100);

    // Title
    ctx.font = '900 48px "Arial", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    // Add text shadow
    ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
    ctx.shadowBlur = 15;
    ctx.fillText('CERTIFICATE OF EXCELLENCE', width / 2, 150);
    ctx.shadowBlur = 0; // Reset shadow

    // Decorative line
    const lineGrad = ctx.createLinearGradient(width/2 - 200, 0, width/2 + 200, 0);
    lineGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
    lineGrad.addColorStop(0.5, '#06B6D4');
    lineGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(width/2 - 200, 185, 400, 3);

    // 5. Awarded to text
    ctx.font = 'italic 18px "Georgia", serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('This certificate is proudly presented to', width / 2, 235);

    // Student Name
    ctx.font = 'bold 36px "Courier New", Courier, monospace';
    ctx.fillStyle = '#F59E0B'; // Amber / Gold
    ctx.fillText(customName.toUpperCase(), width / 2, 285);

    // Underline name
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width/2 - 150, 310);
    ctx.lineTo(width/2 + 150, 310);
    ctx.stroke();

    // 6. Award Statement
    ctx.font = '16px "Arial", sans-serif';
    ctx.fillStyle = '#E2E8F0';
    
    const statement = 'for successfully completing the Metal vs Non-Metal Challenge';
    const statement2 = 'and demonstrating excellent understanding of material classification, chemical symbols, and properties.';
    
    ctx.fillText(statement, width / 2, 350);
    ctx.fillText(statement2, width / 2, 380);

    // 7. Stats Panel
    const panelX = width / 2 - 275;
    const panelY = 430;
    const panelW = 550;
    const panelH = 90;

    // Draw Panel glass background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // Draw Stats Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#E2E8F0';
    
    // Score
    ctx.font = 'bold 14px "Arial", sans-serif';
    ctx.fillText('TOTAL SCORE:', panelX + 30, panelY + 30);
    ctx.font = 'bold 22px "Arial", sans-serif';
    ctx.fillStyle = '#06B6D4'; // Cyan
    ctx.fillText(`${totalScore} PTS`, panelX + 30, panelY + 58);

    // Accuracy
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 14px "Arial", sans-serif';
    ctx.fillText('ACCURACY RATE:', panelX + 220, panelY + 30);
    ctx.font = 'bold 22px "Arial", sans-serif';
    ctx.fillStyle = '#22C55E'; // Green
    ctx.fillText(`${averageAccuracy}%`, panelX + 220, panelY + 58);

    // Date
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 14px "Arial", sans-serif';
    ctx.fillText('COMPLETED ON:', panelX + 400, panelY + 30);
    ctx.font = 'bold 18px "Arial", sans-serif';
    ctx.fillStyle = '#F59E0B'; // Gold
    ctx.fillText(completionDate, panelX + 400, panelY + 58);

    // 8. Signatures & Seals
    ctx.textAlign = 'center';
    
    // Left signature line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(150, 600);
    ctx.lineTo(330, 600);
    ctx.stroke();

    ctx.font = 'italic 16px "Brush Script MT", cursive, Georgia, serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('Dr. Atom Flask', 240, 580);
    ctx.font = 'bold 12px "Arial", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Lab Supervisor', 240, 620);

    // Right signature line
    ctx.beginPath();
    ctx.moveTo(670, 600);
    ctx.lineTo(850, 600);
    ctx.stroke();

    ctx.font = 'italic 16px "Brush Script MT", cursive, Georgia, serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('Professor Carbon', 760, 580);
    ctx.font = 'bold 12px "Arial", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Science Evaluator', 760, 620);

    // Center Seal (Gold Lab Badge)
    const sealX = width / 2;
    const sealY = 590;

    // Draw Seal Outlines
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)'; // Gold tint
    ctx.beginPath();
    ctx.arc(sealX, sealY, 40, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 32, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 36, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.font = '10px "Arial", sans-serif';
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('SEAL OF', sealX, sealY - 8);
    ctx.font = 'bold 11px "Arial", sans-serif';
    ctx.fillText('SCIENCE', sealX, sealY + 8);
  };

  useEffect(() => {
    drawCertificate();
  }, [customName, totalScore, averageAccuracy, completionDate]);

  const handleDownloadPng = () => {
    audio.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `certificate_${customName.replace(/\s+/g, '_').toLowerCase()}.png`;
    link.href = image;
    link.click();
    
    setDownloadedPng(true);
    setTimeout(() => setDownloadedPng(false), 2000);
  };

  const handleDownloadPdf = () => {
    audio.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/png');
    
    // Create landscape A4 PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1000, 700]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 1000, 700);
    pdf.save(`certificate_${customName.replace(/\s+/g, '_').toLowerCase()}.pdf`);

    setDownloadedPdf(true);
    setTimeout(() => setDownloadedPdf(false), 2000);
  };

  const handleShare = async () => {
    audio.playClick();
    const text = `🏆 I completed the Metal vs Non-Metal Challenge with a score of ${totalScore} and ${averageAccuracy}% accuracy! Check out my certificate! 🧪⚛️`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Metal vs Non-Metal Challenge Certificate',
          text: text,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        alert('Could not copy to clipboard.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      
      {/* Name editor on top */}
      <div className="w-full max-w-md p-4 glass-panel rounded-2xl border border-white/10 flex flex-col gap-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">
          Customize Student Name on Certificate:
        </label>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          maxLength={30}
          className="px-4 py-2 bg-slate-900 border border-white/10 rounded-xl font-bold text-slate-100 text-center focus:border-cyan-400 focus:outline-none transition-all duration-300"
          placeholder="Enter custom name..."
        />
      </div>

      {/* Canvas container for scaling/responsiveness */}
      <div className="w-full overflow-hidden rounded-2xl border-2 border-white/10 glow-shadow-purple bg-indigo-950/20 max-w-[850px] aspect-[10/7]">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain block"
          style={{ maxWidth: '1000px', maxHeight: '700px' }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        
        <button
          onClick={handleDownloadPng}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-theme to-pink-600 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all duration-300 hover:scale-105 glow-shadow-purple cursor-pointer"
        >
          {downloadedPng ? (
            <>
              <Check className="w-4 h-4 text-green-300" /> Downloaded PNG!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download PNG
            </>
          )}
        </button>

        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-primary-blue text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all duration-300 hover:scale-105 glow-shadow-cyan cursor-pointer"
        >
          {downloadedPdf ? (
            <>
              <Check className="w-4 h-4 text-green-300" /> Saved PDF!
            </>
          ) : (
            <>
              <Award className="w-4 h-4" /> Download PDF
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-200 hover:text-white font-black text-sm uppercase tracking-wider rounded-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-slate-700 cursor-pointer"
        >
          <Share2 className="w-4 h-4" /> 
          {shared ? 'Copied Stats to Clipboard!' : 'Share Stats'}
        </button>
        
      </div>
    </div>
  );
}
