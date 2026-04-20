package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.demo.entity.Pedido;

import com.uade.tpo.demo.entity.EstadoPedido;

public interface PedidoService {
    List<Pedido> getAll();
    Optional<Pedido> getById(Long id);
    List<Pedido> getByUsuarioId(Long usuarioId);
    Pedido crearDesdeCarrito(Long usuarioId);
    Pedido actualizarEstado(Long id, EstadoPedido estado);
}
