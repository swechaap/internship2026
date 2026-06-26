package com.klef.demo.tracker.service;

import com.klef.demo.tracker.config.HospitalSearchProperties;
import com.klef.demo.tracker.exception.NotFoundException;
import com.klef.demo.tracker.model.Hospital;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class HospitalSearchService {
  private final RestTemplate restTemplate;
  private final HospitalSearchProperties properties;

  public HospitalSearchService(HospitalSearchProperties properties, RestTemplateBuilder restTemplateBuilder) {
    this.properties = properties;
    this.restTemplate = restTemplateBuilder
      .setConnectTimeout(Duration.ofSeconds(properties.getTimeoutSeconds()))
      .setReadTimeout(Duration.ofSeconds(properties.getTimeoutSeconds()))
      .defaultHeader(HttpHeaders.USER_AGENT, "AmbulanceTrackerPortal/1.0")
      .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
      .build();
  }

  public Hospital findNearestHospital(double latitude, double longitude) {
    List<Hospital> hospitals = queryOverpassForHospitals(latitude, longitude, properties.getRadiusKm());
    if (hospitals.isEmpty()) {
      throw new NotFoundException("No hospitals were found within " + properties.getRadiusKm() + " km of the provided location.");
    }
    return hospitals.stream()
      .min(Comparator.comparingDouble(hospital -> haversineKm(latitude, longitude, hospital.latitude, hospital.longitude)))
      .orElseThrow(() -> new NotFoundException("Unable to select a nearest hospital."));
  }

  private List<Hospital> queryOverpassForHospitals(double latitude, double longitude, double radiusKm) {
    String query = buildOverpassQuery(latitude, longitude, radiusKm);
    URI uri = UriComponentsBuilder.fromHttpUrl(properties.getOverpassUrl())
      .path("/interpreter")
      .queryParam("data", query)
      .build()
      .encode()
      .toUri();

    try {
      System.out.println("=================================");
System.out.println("Overpass URI = " + uri);

JsonNode response = restTemplate.getForObject(uri, JsonNode.class);

System.out.println("Overpass Response = " + response);
System.out.println("=================================");

return parseOverpassResponse(response);
    } catch (Exception exception) {
    exception.printStackTrace();

    throw new NotFoundException(
        "Hospital search failed: " + exception.getMessage()
    );
  }
  }

  private String buildOverpassQuery(double latitude, double longitude, double radiusKm) {
    int radiusMeters = (int) Math.round(radiusKm * 1000);
    return String.format(Locale.ROOT,
      "[out:json][timeout:%d];"
        + "(node[\"amenity\"=\"hospital\"](around:%d,%.6f,%.6f);"
        + "way[\"amenity\"=\"hospital\"](around:%d,%.6f,%.6f);"
        + "relation[\"amenity\"=\"hospital\"](around:%d,%.6f,%.6f););"
        + "out center;",
      properties.getTimeoutSeconds(), radiusMeters, latitude, longitude,
      radiusMeters, latitude, longitude,
      radiusMeters, latitude, longitude);
  }

  private List<Hospital> parseOverpassResponse(JsonNode response) {
    if (response == null || !response.has("elements")) {
      return List.of();
    }

    List<Hospital> hospitals = new ArrayList<>();
    for (JsonNode element : response.get("elements")) {
      String id = element.has("id") ? element.get("id").asText() : null;
      if (id == null) {
        continue;
      }

      JsonNode tags = element.get("tags");
      if (tags == null || !tags.has("name")) {
        continue;
      }

      String name = tags.get("name").asText();
      if (name == null || name.isBlank()) {
        continue;
      }

      Double elementLat = null;
      Double elementLon = null;
      if (element.has("lat") && element.has("lon")) {
        elementLat = element.get("lat").asDouble();
        elementLon = element.get("lon").asDouble();
      } else if (element.has("center") && element.get("center").has("lat") && element.get("center").has("lon")) {
        elementLat = element.get("center").get("lat").asDouble();
        elementLon = element.get("center").get("lon").asDouble();
      }

      if (elementLat == null || elementLon == null) {
        continue;
      }

      Hospital hospital = new Hospital();
      hospital.hospitalId = "OSM-" + id;
      hospital.hospitalName = name;
      hospital.latitude = elementLat;
      hospital.longitude = elementLon;
      hospitals.add(hospital);
    }
    System.out.println("=================================");
System.out.println("Hospitals Found = " + hospitals.size());

for (Hospital hospital : hospitals) {
    System.out.println(
        "Hospital: " + hospital.hospitalName +
        " | Lat: " + hospital.latitude +
        " | Lon: " + hospital.longitude
    );
}

System.out.println("=================================");
    return hospitals;
  }

  private double haversineKm(double startLatitude, double startLongitude, double endLatitude, double endLongitude) {
    final double earthRadiusKm = 6371.0;
    double latitudeDelta = Math.toRadians(endLatitude - startLatitude);
    double longitudeDelta = Math.toRadians(endLongitude - startLongitude);
    double a = Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2)
      + Math.cos(Math.toRadians(startLatitude)) * Math.cos(Math.toRadians(endLatitude))
      * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);
    return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
