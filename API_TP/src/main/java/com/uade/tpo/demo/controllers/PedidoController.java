package com.uade.tpo.demo.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.uade.tpo.demo.Requests.PedidoEstadoRequest;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.service.PedidoService;

import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<Pedido>> getAll() {
        return ResponseEntity.ok(pedidoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getById(@PathVariable Long id) {
        return pedidoService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> getByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoService.getByUsuarioId(usuarioId));
    }

    @PostMapping("/checkout/{usuarioId}")
    public ResponseEntity<Pedido> checkout(@PathVariable Long usuarioId) {
        try {
            Pedido pedido = pedidoService.crearDesdeCarrito(usuarioId);
            return ResponseEntity.created(URI.create("/pedidos/" + pedido.getId())).body(pedido);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Long id, @RequestBody PedidoEstadoRequest request) {
        try {
            return ResponseEntity.ok(pedidoService.actualizarEstado(id, request.getEstado()));
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }
}
