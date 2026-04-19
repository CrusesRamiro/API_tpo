package com.uade.tpo.demo.service;

import java.util.List;

import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.entity.Pedido;

public interface PedidoService {
    List<Pedido> getAll();
    Pedido getById(Long id);
    List<Pedido> getByUsuarioId(Long usuarioId);
    Pedido crearDesdeCarrito(Long usuarioId);
    Pedido updateEstado(Long id, EstadoPedido estado);
    Pedido cancelar(Long id);
}
