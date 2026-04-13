package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.demo.entity.Rol;
import com.uade.tpo.demo.entity.Usuario;

public interface UsuarioService {
    List<Usuario> getAll();
    Optional<Usuario> getByEmail(String Email);
    Optional<Usuario> getByUsername(String Username);
    Usuario create (String Username, String Password, String Nombre, String Apellido, String Email, Rol rol);
}
