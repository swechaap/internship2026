package com.financeflow.controller;

import java.io.IOException;
import java.util.List;

import com.financeflow.dto.receipt.OcrResultResponse;
import com.financeflow.entity.ReceiptEntity;
import com.financeflow.service.ReceiptService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReceiptEntity> upload(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(receiptService.save(file));
    }

    @PostMapping(value = "/ocr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OcrResultResponse> ocr(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(receiptService.ocr(file));
    }

    @GetMapping
    public ResponseEntity<List<ReceiptEntity>> list() {
        return ResponseEntity.ok(receiptService.list());
    }
}