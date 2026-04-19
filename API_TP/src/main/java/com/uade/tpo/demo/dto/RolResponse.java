package com.uade.tpo.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RolResponse {
    private Long id;
    private String nombre;
}
