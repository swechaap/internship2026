package com.financeflow.dto.receipt;

public record ReceiptResponse(Long id, String fileName, String contentType, long fileSize, String extractedText, String vendorName, String invoiceNumber) {
}