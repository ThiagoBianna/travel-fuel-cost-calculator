package com.VaiDarQuanto.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CalculoResponse {
    private double custo;
    private double distancia;
    private boolean horarioPico;
    
    public CalculoResponse(double custo, double distancia, boolean horarioPico) {
        this.custo = custo;
        this.distancia = distancia;
        this.horarioPico = horarioPico;
    }
}