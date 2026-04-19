package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.Carrito;

public interface CarritoService {

    Carrito getCarritoByUsuarioId(Long usuarioId);

    // Trae el carrito, o lo crea si no existe

    Carrito agregarItem(Long usuarioId, Long itemId, Integer cantidad);

    // Agrega un item o suma cantidad ya existe

    Carrito actualizarCantidad(Long usuarioId, Long itemId, Integer cantidad);

    // Actualiza la cantidad de un item, si es 0 lo borra

    Carrito eliminarItem(Long usuarioId, Long itemId);

    // Elimina un item del carrito

    Carrito vaciarCarrito(Long usuarioId);

    //Elimina todos ! los items del carrito

    double calcularTotal(Long usuarioId);

    // Calcula el total de los items del carrito
}
