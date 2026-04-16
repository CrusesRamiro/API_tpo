package com.uade.tpo.demo.controllers;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String username;
    private String password;
    private String email;
    private String nombre;
    private String apellido;
    private Long rolId;
}
