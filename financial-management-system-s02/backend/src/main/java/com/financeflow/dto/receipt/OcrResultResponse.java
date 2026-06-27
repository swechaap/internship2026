package com.financeflow.dto.receipt;

public record OcrResultResponse(String extractedText, String vendorName, String invoiceNumber, String amount, String date) {
}