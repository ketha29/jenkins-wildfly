package com.avtra.pilot_project.service;

import com.avtra.pilot_project.model.Flight;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FlightService {

    private final List<Flight> flights = new ArrayList<>();

    public FlightService() {
        // Initialize with some mock data
        flights.add(new Flight("AV101", "Avtra Airlines", "New York (JFK)", "London (LHR)",
                LocalDateTime.now().plusHours(2), LocalDateTime.now().plusHours(9), "On Time"));
        flights.add(new Flight("AV102", "Avtra Airlines", "Los Angeles (LAX)", "Tokyo (HND)",
                LocalDateTime.now().plusHours(5), LocalDateTime.now().plusHours(16), "Delayed"));
        flights.add(new Flight("AV103", "Avtra Airlines", "Chicago (ORD)", "Paris (CDG)",
                LocalDateTime.now().minusHours(1), LocalDateTime.now().plusHours(7), "In Air"));
        flights.add(new Flight("BA204", "British Airways", "London (LHR)", "Dubai (DXB)",
                LocalDateTime.now().plusHours(1), LocalDateTime.now().plusHours(8), "Boarding"));
        flights.add(new Flight("DL405", "Delta Air Lines", "Atlanta (ATL)", "Miami (MIA)",
                LocalDateTime.now().plusMinutes(30), LocalDateTime.now().plusHours(2).plusMinutes(15), "On Time"));
        flights.add(new Flight("EK500", "Emirates", "Dubai (DXB)", "Singapore (SIN)",
                LocalDateTime.now().plusHours(4), LocalDateTime.now().plusHours(11), "Scheduled"));
    }

    public List<Flight> getAllFlights() {
        return flights;
    }

    public Optional<Flight> getFlightByNumber(String flightNumber) {
        return flights.stream()
                .filter(f -> f.getFlightNumber().equalsIgnoreCase(flightNumber))
                .findFirst();
    }
}
