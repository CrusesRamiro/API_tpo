package com.uade.tpo.demo.controllers;
import com.uade.tpo.demo.entity.Rol;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String username;
    private String password;
    private String email;
    private String nombre;
    private String apellido;
    private Rol rol;    
}
