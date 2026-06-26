package com.klef.demo.tracker.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException exception) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody("NOT_FOUND", exception.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException exception) {
    String message = exception.getBindingResult().getFieldErrors().stream()
      .findFirst()
      .map(fieldError -> fieldError.getField() + " " + fieldError.getDefaultMessage())
      .orElse("Invalid request payload");
    return ResponseEntity.badRequest().body(errorBody("VALIDATION_ERROR", message));
  }

  @ExceptionHandler(GeocodeServiceException.class)
  public ResponseEntity<Map<String, Object>> handleGeocode(GeocodeServiceException exception) {
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorBody("GEOCODE_UNAVAILABLE", exception.getMessage()));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException exception) {
    return ResponseEntity.badRequest().body(errorBody("VALIDATION_ERROR", exception.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneric(Exception exception) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody("INTERNAL_ERROR", exception.getMessage()));
  }

  private Map<String, Object> errorBody(String code, String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("code", code);
    body.put("message", message);
    return body;
  }
}
