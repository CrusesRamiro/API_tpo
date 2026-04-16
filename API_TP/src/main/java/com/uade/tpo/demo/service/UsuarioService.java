package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.demo.entity.Usuario;

public interface UsuarioService {
    List<Usuario> getAll();
    Optional<Usuario> getByEmail(String Email);
    Optional<Usuario> getByUsername(String Username);
    Usuario create(String username, String password, String nombre, String apellido, String email, Long rolId);
}
