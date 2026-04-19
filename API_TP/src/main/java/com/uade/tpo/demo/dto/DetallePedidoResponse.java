package com.uade.tpo.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DetallePedidoResponse {
    private Long id;
    private ItemSummaryResponse item;
    private Integer cantidad;
    private Double precioUnidad;
    private Double subtotal;
}
