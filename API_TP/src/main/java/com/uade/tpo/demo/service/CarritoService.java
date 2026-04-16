package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.Carrito;

public interface CarritoService {

    Carrito getCarritoByUsuarioId(Long usuarioId);

    Carrito agregarItem(Long usuarioId, Long itemId, Integer cantidad);

    Carrito actualizarCantidad(Long usuarioId, Long itemId, Integer cantidad);

    void eliminarItem(Long usuarioId, Long itemId);

    void vaciarCarrito(Long usuarioId);

    double calcularTotal(Long usuarioId);
}