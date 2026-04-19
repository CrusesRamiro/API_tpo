package com.uade.tpo.demo.Requests;

import com.uade.tpo.demo.entity.EstadoPedido;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PedidoEstadoRequest {
    @NotNull(message = "El estado es obligatorio")
    private EstadoPedido estado;
}
