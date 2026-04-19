package com.uade.tpo.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FotoProductoResponse {
    private Long id;
    private String imagenBase64;
}
