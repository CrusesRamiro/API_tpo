package com.uade.tpo.demo.Requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioUpdateRequest {
    @Email(message = "El email no es valido")
    private String email;

    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String nombre;

    @Size(max = 100, message = "El apellido no puede superar los 100 caracteres")
    private String apellido;

    @Size(min = 6, message = "La password debe tener al menos 6 caracteres")
    private String password;

    private Long rolId;
}
