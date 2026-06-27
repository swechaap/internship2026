package com.financeflow.service;

import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.financeflow.dto.receipt.OcrResultResponse;
import com.financeflow.entity.ReceiptEntity;
import com.financeflow.repository.ReceiptRepository;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;

    public ReceiptService(ReceiptRepository receiptRepository) {
        this.receiptRepository = receiptRepository;
    }

    public ReceiptEntity save(MultipartFile file) throws IOException {
        String text = extractText(file);
        String vendor = guessVendor(text);
        String invoice = guessInvoice(text);
        ReceiptEntity receipt = ReceiptEntity.builder()
                .fileName(file.getOriginalFilename())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .fileData(file.getBytes())
                .extractedText(text)
                .vendorName(vendor)
                .invoiceNumber(invoice)
                .build();
        return receiptRepository.save(receipt);
    }

    public OcrResultResponse ocr(MultipartFile file) throws IOException {
        String text = extractText(file);
        String vendor = guessVendor(text);
        String invoice = guessInvoice(text);
        String amount = text.replaceAll("(?s).*?(?:₹|Rs\\.?|INR)\\s?([0-9,]+(?:\\.[0-9]{2})?).*", "$1");
        String date = text.replaceAll("(?s).*?(\\d{2}[/-]\\d{2}[/-]\\d{4}).*", "$1");
        return new OcrResultResponse(text, vendor, invoice, amount, date);
    }

    public List<ReceiptEntity> list() {
        return receiptRepository.findAll();
    }

    private String extractText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename() == null ? "receipt" : file.getOriginalFilename().toLowerCase();
        if (filename.endsWith(".pdf")) {
            try (PDDocument document = PDDocument.load(file.getInputStream())) {
                return new PDFTextStripper().getText(document);
            }
        }
        return new String(file.getBytes());
    }

    private String guessVendor(String text) {
        return text.lines().findFirst().orElse("Unknown Vendor").trim();
    }

    private String guessInvoice(String text) {
        Matcher matcher = Pattern.compile("(INV[- ]?[A-Z0-9-]+)", Pattern.CASE_INSENSITIVE).matcher(text);
        return matcher.find() ? matcher.group(1) : "";
    }
}