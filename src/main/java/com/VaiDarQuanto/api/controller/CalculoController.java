package com.VaiDarQuanto.api.controller;

import com.VaiDarQuanto.api.dto.CalculoRequest;
import com.VaiDarQuanto.api.dto.CalculoResponse;
import com.VaiDarQuanto.api.service.CalculoService; // Import do novo Service
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculo")
@CrossOrigin(origins = "*")
public class CalculoController {

    private final CalculoService calculoService;

    // Construtor para injeção de dependência
    public CalculoController(CalculoService calculoService) {
        this.calculoService = calculoService;
    }

    @PostMapping
    public CalculoResponse calcular(@RequestBody CalculoRequest request) {
        // Agora delegamos a lógica para o Service
        return calculoService.calcularCusto(request);
    }
}