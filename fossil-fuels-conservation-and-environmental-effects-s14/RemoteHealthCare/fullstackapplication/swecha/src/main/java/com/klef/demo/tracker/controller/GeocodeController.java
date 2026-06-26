package com.klef.demo.tracker.controller;

import com.klef.demo.tracker.dto.GeocodeResult;
import com.klef.demo.tracker.service.GeocodeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/geocode")
public class GeocodeController {
  private final GeocodeService geocodeService;

  public GeocodeController(GeocodeService geocodeService) {
    this.geocodeService = geocodeService;
  }

  @GetMapping("/forward")
  public GeocodeResult forward(@RequestParam String address) {
    return geocodeService.forwardGeocode(address);
  }

  @GetMapping("/reverse")
  public GeocodeResult reverse(@RequestParam double latitude, @RequestParam double longitude) {
    return geocodeService.reverseGeocode(latitude, longitude);
  }
}
