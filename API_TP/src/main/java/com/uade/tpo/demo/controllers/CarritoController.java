package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.Requests.ItemCarritoRequest;
import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.service.CarritoService;

import io.micrometer.core.ipc.http.HttpSender.Response;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

   @GetMapping("/{usuarioId}")
    public ResponseEntity<Carrito> getCarritoByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(carritoService.getCarritoByUsuarioId(usuarioId));
    }

    @PostMapping("/{usuarioId}/items")
    public ResponseEntity<Carrito> agregarItem(
            @PathVariable Long usuarioId,
            @RequestBody ItemCarritoRequest body) {
        return ResponseEntity.ok(carritoService.agregarItem(usuarioId, body.getIdItem(), body.getCant()));
    }

    @PutMapping("/{usuarioId}/itemsMod")
    public ResponseEntity<Carrito> actualizarCantidad(
        @PathVariable Long usuarioId,
        @RequestBody ItemCarritoRequest body){
            return ResponseEntity.ok(carritoService.actualizarCantidad(usuarioId, body.getIdItem(), body.getCant()));
        }

    @DeleteMapping("/{usuarioId}/{itemId}")
    public ResponseEntity<Carrito> eliminarItem(
        @PathVariable Long usuarioId,
        @PathVariable Long itemId) {
            carritoService.eliminarItem(usuarioId, itemId);
            return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{usuarioId}")
        public ResponseEntity<Carrito> vaciarCarrito(
            @PathVariable Long usuarioId){
                carritoService.vaciarCarrito(usuarioId);
                return ResponseEntity.ok().build();
            }
    
    @GetMapping("/{usuarioId}/total")
        public ResponseEntity<Double> calcularTotal(
            @PathVariable Long usuarioId){
                return ResponseEntity.ok(carritoService.calcularTotal(usuarioId));
            }
}
