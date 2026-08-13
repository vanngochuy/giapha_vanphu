/**
 * Gia Phả Họ Văn Phú - PDF Export Module
 */
class PDFExporter {
    static async exportTreeToPDF(elementId = "treeContainer", filename = "GiaPha_VanPhu_Tree.pdf") {
        const container = document.getElementById(elementId);
        if (!container) return;

        try {
            // Show notification/feedback
            const btnExport = document.getElementById("btnExportPDF");
            const originalText = btnExport ? btnExport.innerHTML : "";
            if (btnExport) btnExport.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang xuất PDF...`;

            // Capture SVG element using html2canvas
            const canvas = await html2canvas(container, {
                scale: 2, // High resolution rendering
                useCORS: true,
                backgroundColor: "#080D0C" // Vintage dark obsidian background
            });

            const imgData = canvas.toDataURL("image/png");
            
            // Create A4 Landscape PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = (pdfHeight - imgHeight * ratio) / 2;

            pdf.setFillColor(8, 13, 12);
            pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

            pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

            // Add Header & Footer text to PDF
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.setTextColor(212, 175, 55); // Antique Gold
            pdf.text("SƠ ĐỒ CÂY GIA PHẢ HỌ VĂN PHÚ", pdfWidth / 2, 12, { align: "center" });

            pdf.setFontSize(9);
            pdf.setFont("helvetica", "italic");
            pdf.setTextColor(184, 172, 142);
            pdf.text(`Truy cập trực tuyến: https://gia-pha-van-phu.vercel.app | Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, pdfWidth / 2, pdfHeight - 6, { align: "center" });

            pdf.save(filename);

            if (btnExport) btnExport.innerHTML = originalText;
        } catch (error) {
            console.error("Error exporting PDF:", error);
            alert("Có lỗi xảy ra khi xuất file PDF. Vui lòng thử lại.");
            const btnExport = document.getElementById("btnExportPDF");
            if (btnExport) btnExport.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Xuất PDF`;
        }
    }
}
