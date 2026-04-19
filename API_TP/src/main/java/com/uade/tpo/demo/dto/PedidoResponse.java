package com.uade.tpo.demo.dto;

import java.time.LocalDate;
import java.util.List;

import com.uade.tpo.demo.entity.EstadoPedido;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PedidoResponse {
    private Long id;
    private Long usuarioId;
    private Long carritoId;
    private Double total;
    private LocalDate fecha;
    private EstadoPedido estado;
    private List<DetallePedidoResponse> detalle;
}
