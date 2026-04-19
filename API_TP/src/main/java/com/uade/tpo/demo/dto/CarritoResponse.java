package com.uade.tpo.demo.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CarritoResponse {
    private Long id;
    private Long usuarioId;
    private List<ItemCarritoResponse> items;
    private Double total;
}
