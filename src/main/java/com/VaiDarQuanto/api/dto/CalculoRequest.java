package com.VaiDarQuanto.api.dto;

import lombok.Data;

@Data
public class CalculoRequest {
    private String origem;
    private String destino;
    private String combustivel;
    private double consumo;
    private double distancia; // Verifique se o nome está idêntico a este
    private double precoCombustivel;
}