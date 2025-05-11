package com.rivals_tracker.backend.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/proxy")
public class ApiProxyController {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String API_BASE_URL = "https://marvelrivalsapi.com/api/v1/";

    @Value("${rivals.api.key}")
    private String apiKey;
    
    private HttpEntity<String> createRequestEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);
        return new HttpEntity<>(headers);
    }

    @GetMapping("/player/{username}")
    public ResponseEntity<?> getPlayer(@PathVariable String username) {
        try {
            String url = API_BASE_URL + "player/" + username;
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, createRequestEntity(), String.class
            );
            return ResponseEntity.ok().body(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/heroes")
    public ResponseEntity<?> getHeroes() {
        try {
            String url = API_BASE_URL + "heroes";
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, createRequestEntity(), String.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/player/{username}/match-history")
    public ResponseEntity<?> getPlayerMatchHistory(@PathVariable String username) {
        String externalMatchHistoryUrl = API_BASE_URL + "find-player/" + username;
        
        HttpEntity<String> entity = createRequestEntity();

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                externalMatchHistoryUrl,
                HttpMethod.GET,
                entity,
                String.class
            );
            
            // parse JSON response before returning it
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(response.getBody());
            
            // return the parsed JSON
            return ResponseEntity.status(response.getStatusCode()).body(jsonNode);

        } catch (HttpClientErrorException e) {
            System.err.println("Client error fetching match history: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (HttpServerErrorException e) {
            System.err.println("Server error fetching match history: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("An unexpected error occurred while proxying match history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred while fetching match history.");
        }
    }
}