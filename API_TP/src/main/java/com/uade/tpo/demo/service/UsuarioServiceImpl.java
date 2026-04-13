package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Rol;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Override
    public List<Usuario> getAll(){
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> getByEmail(String Email){
        return usuarioRepository.findByEmail(Email);
    }

    
    @Override
    public Optional<Usuario> getByUsername(String Username){
        return usuarioRepository.findByUsername(Username);
    }

    @Override
    public Usuario create(String username, String password, String nombre, String apellido, String email, Rol rol){
        Usuario usuario = Usuario.builder()
            .username(username)
            .password(password)
            .nombre(nombre)
            .apellido(apellido)
            .email(email)
            .rol(rol)
            .build();
        return usuarioRepository.save(usuario);    
    }

}
