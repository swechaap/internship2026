package com.klef.demo.tracker.service;

import com.klef.demo.tracker.dto.GeocodeResult;
import com.klef.demo.tracker.exception.GeocodeServiceException;
import com.klef.demo.tracker.exception.NotFoundException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GeocodeService {
  private final RestClient restClient = RestClient.builder()
    .baseUrl("https://nominatim.openstreetmap.org")
    .defaultHeader("User-Agent", "AmbulanceTrackerPortal/1.0")
    .defaultHeader("Accept", "application/json")
    .build();

  private final Map<String, GeocodeResult> forwardCache = new ConcurrentHashMap<>();
  private final Map<String, GeocodeResult> reverseCache = new ConcurrentHashMap<>();
  private long lastNominatimCallMs = 0;

  public GeocodeResult forwardGeocode(String address) {
    String trimmed = address == null ? "" : address.trim();
    if (trimmed.isEmpty()) {
      throw new IllegalArgumentException("Address is required");
    }

    String cacheKey = trimmed.toLowerCase(Locale.ROOT);
    GeocodeResult cached = forwardCache.get(cacheKey);
    if (cached != null) {
      return cached;
    }

    JsonNode[] results = callNominatim(() -> restClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/search")
        .queryParam("format", "jsonv2")
        .queryParam("q", trimmed)
        .queryParam("limit", 1)
        .queryParam("countrycodes", "in")
        .build())
      .retrieve()
      .body(JsonNode[].class));

    if (results == null || results.length == 0) {
      throw new NotFoundException("No location found for \"" + trimmed + "\"");
    }

    JsonNode hit = results[0];
    GeocodeResult result = new GeocodeResult();
    result.latitude = hit.get("lat").asDouble();
    result.longitude = hit.get("lon").asDouble();
    result.displayName = hit.has("display_name") ? hit.get("display_name").asText() : trimmed;
    forwardCache.put(cacheKey, result);
    return result;
  }

  public GeocodeResult reverseGeocode(double latitude, double longitude) {
    String cacheKey = String.format(Locale.ROOT, "%.4f,%.4f", latitude, longitude);
    GeocodeResult cached = reverseCache.get(cacheKey);
    if (cached != null) {
      return cached;
    }

    JsonNode data = callNominatim(() -> restClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/reverse")
        .queryParam("format", "jsonv2")
        .queryParam("lat", latitude)
        .queryParam("lon", longitude)
        .build())
      .retrieve()
      .body(JsonNode.class));

    GeocodeResult result = new GeocodeResult();
    result.latitude = latitude;
    result.longitude = longitude;
    result.displayName = data != null && data.has("display_name")
      ? data.get("display_name").asText()
      : "Live GPS location";
    reverseCache.put(cacheKey, result);
    return result;
  }

  private <T> T callNominatim(NominatimCall<T> call) {
    try {
      throttle();
      return call.execute();
    } catch (RestClientException exception) {
      if (isRateLimited(exception)) {
        sleep(1500);
        try {
          throttle();
          return call.execute();
        } catch (RestClientException retryException) {
          throw toGeocodeException(retryException);
        }
      }
      throw toGeocodeException(exception);
    }
  }

  private GeocodeServiceException toGeocodeException(RestClientException exception) {
    if (isRateLimited(exception)) {
      return new GeocodeServiceException("Geocoding is temporarily busy. Wait a few seconds and try again.");
    }
    return new GeocodeServiceException("Unable to look up that address right now. Please try again.");
  }

  private boolean isRateLimited(RestClientException exception) {
    String message = exception.getMessage();
    return message != null && message.contains("429");
  }

  private synchronized void throttle() {
    long now = System.currentTimeMillis();
    long waitMs = 1100 - (now - lastNominatimCallMs);
    if (waitMs > 0) {
      sleep(waitMs);
    }
    lastNominatimCallMs = System.currentTimeMillis();
  }

  private void sleep(long waitMs) {
    try {
      Thread.sleep(waitMs);
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
    }
  }

  @FunctionalInterface
  private interface NominatimCall<T> {
    T execute();
  }
}
