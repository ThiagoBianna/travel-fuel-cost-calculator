package com.VaiDarQuanto.api.service;

import com.VaiDarQuanto.api.dto.CalculoRequest;
import com.VaiDarQuanto.api.dto.CalculoResponse;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Service
public class CalculoService {

    public CalculoResponse calcularCusto(CalculoRequest request) {
        double distanciaKm = request.getDistancia();
        if (distanciaKm <= 0) distanciaKm = 1.0;

        double precoCombustivel = buscarPrecoPorTipo(request.getCombustivel());
        double custoBase = (distanciaKm / request.getConsumo()) * precoCombustivel;

        // Calcular horarioPico e custo final
        LocalDateTime agora = LocalDateTime.now();
        DayOfWeek diaDaSemana = agora.getDayOfWeek();
        LocalTime horaAtual = agora.toLocalTime();
        
        boolean diaUtilOuSabado = diaDaSemana != DayOfWeek.SUNDAY;
        boolean horarioPico = !horaAtual.isBefore(LocalTime.of(7, 0)) &&
                horaAtual.isBefore(LocalTime.of(20, 0));
        
        double custoFinal = (diaUtilOuSabado && horarioPico) ? custoBase * 1.15 : custoBase;

        return new CalculoResponse(custoFinal, distanciaKm, horarioPico);
    }

    private double aplicarTaxaCongestionamento(double custoBase) {
        LocalDateTime agora = LocalDateTime.now();
        DayOfWeek diaDaSemana = agora.getDayOfWeek();
        LocalTime horaAtual = agora.toLocalTime();

        // Regra: Segunda a Sábado
        boolean diaUtilOuSabado = diaDaSemana != DayOfWeek.SUNDAY;

        // Regra: Das 07:00 às 20:00
        boolean horarioPico = !horaAtual.isBefore(LocalTime.of(7, 0)) &&
                horaAtual.isBefore(LocalTime.of(20, 0));

        if (diaUtilOuSabado && horarioPico) {
            return custoBase * 1.15;
        }

        return custoBase;
    }

    // O método que estava faltando no seu print:
    private double buscarPrecoPorTipo(String tipo) {
        if (tipo == null) return 5.85;
        return switch (tipo.toUpperCase()) {
            case "GASOLINA" -> 5.85;
            case "GASOLINA_ADITIVADA" -> 6.10;
            case "ETANOL" -> 3.90;
            case "DIESEL" -> 6.00;
            case "GNV" -> 4.50;
            default -> 5.85;
        };
    }
}