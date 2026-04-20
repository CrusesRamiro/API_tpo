package com.uade.tpo.demo.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.Requests.UsuarioRequest;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.service.UsuarioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> getAll() {
        return ResponseEntity.ok(usuarioService.getAll());
    }

    @GetMapping("/Email/{mail}")
    public ResponseEntity<Usuario> getByEmail(@PathVariable String mail){
        return usuarioService.getByEmail(mail)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/Username/{username}")
    public ResponseEntity<Usuario> getByUsername(@PathVariable String username){
        return usuarioService.getByUsername(username)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

     @PostMapping
     public ResponseEntity<Usuario> create(@RequestBody UsuarioRequest request) {
        Usuario nuevo = usuarioService.create(request.getUsername(), request.getPassword(), request.getNombre(), request.getApellido(), request.getEmail(), request.getRolId());
        return ResponseEntity.created(URI.create("/usuarios/" + nuevo.getId())).body(nuevo);
     }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Long id, @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.update(id, request.getNombre(), request.getApellido(), request.getEmail()));
    }
}
