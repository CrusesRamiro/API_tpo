package com.uade.tpo.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioResponse {
    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String apellido;
    private RolResponse rol;
}
