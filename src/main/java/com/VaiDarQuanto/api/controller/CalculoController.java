package com.VaiDarQuanto.api.controller;

import com.VaiDarQuanto.api.dto.CalculoRequest;
import com.VaiDarQuanto.api.dto.CalculoResponse;
import com.VaiDarQuanto.api.service.CalculoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculo")
@CrossOrigin(origins = "*")
public class CalculoController {

    private final CalculoService calculoService;

    public CalculoController(CalculoService calculoService) {
        this.calculoService = calculoService;
    }

    @PostMapping
    public CalculoResponse calcular(@RequestBody CalculoRequest request) {
        return calculoService.calcularCusto(request);
    }
    @GetMapping("/teste")
    public String testar() {
        return "O backend do Vai Dar Quanto está online!";
    }
}