package com.uade.tpo.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.Requests.ItemCarritoRequest;
import com.uade.tpo.demo.api.ApiResponse;
import com.uade.tpo.demo.dto.CarritoResponse;
import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.mapper.ResponseMapper;
import com.uade.tpo.demo.security.CurrentUserService;
import com.uade.tpo.demo.service.CarritoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/carrito")
public class CarritoController {

    private final CarritoService carritoService;
    private final ResponseMapper responseMapper;
    private final CurrentUserService currentUserService;

    public CarritoController(CarritoService carritoService, ResponseMapper responseMapper,
            CurrentUserService currentUserService) {
        this.carritoService = carritoService;
        this.responseMapper = responseMapper;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<ApiResponse<CarritoResponse>> getCarritoByUsuarioId(@PathVariable Long usuarioId) {
        currentUserService.requireSameUserOrAdmin(usuarioId);

        Carrito carrito = carritoService.getCarritoByUsuarioId(usuarioId);
        return ResponseEntity.ok(ApiResponse.success("Carrito obtenido correctamente",
                responseMapper.toCarritoResponse(carrito)));
    }

    @PostMapping("/{usuarioId}/items")
    public ResponseEntity<ApiResponse<CarritoResponse>> agregarItem(
            @PathVariable Long usuarioId,
            @Valid @RequestBody ItemCarritoRequest body) {
        currentUserService.requireSameUserOrAdmin(usuarioId);

        Carrito carrito = carritoService.agregarItem(usuarioId, body.getIdItem(), body.getCant());
        return ResponseEntity.ok(ApiResponse.success("Item agregado al carrito correctamente",
                responseMapper.toCarritoResponse(carrito)));
    }

    @PutMapping({ "/{usuarioId}/items", "/{usuarioId}/itemsMod" })
    public ResponseEntity<ApiResponse<CarritoResponse>> actualizarCantidad(
            @PathVariable Long usuarioId,
            @Valid @RequestBody ItemCarritoRequest body) {
        currentUserService.requireSameUserOrAdmin(usuarioId);

        Carrito carrito = carritoService.actualizarCantidad(usuarioId, body.getIdItem(), body.getCant());
        return ResponseEntity.ok(ApiResponse.success("Cantidad actualizada correctamente",
                responseMapper.toCarritoResponse(carrito)));
    }

    @DeleteMapping({ "/{usuarioId}/{itemId}", "/{usuarioId}/items/{itemId}" })
    public ResponseEntity<ApiResponse<CarritoResponse>> eliminarItem(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId) {
        currentUserService.requireSameUserOrAdmin(usuarioId);

        Carrito carrito = carritoService.eliminarItem(usuarioId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item eliminado del carrito correctamente",
                responseMapper.toCarritoResponse(carrito)));
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<ApiResponse<CarritoResponse>> vaciarCarrito(@PathVariable Long usuarioId) {
        currentUserService.requireSameUserOrAdmin(usuarioId);

        Carrito carrito = carritoService.vaciarCarrito(usuarioId);
        return ResponseEntity.ok(ApiResponse.success("Carrito vaciado correctamente",
                responseMapper.toCarritoResponse(carrito)));
    }

    @GetMapping("/{usuarioId}/total")
    public ResponseEntity<ApiResponse<Double>> calcularTotal(@PathVariable Long usuarioId) {
        currentUserService.requireSameUserOrAdmin(usuarioId);
        return ResponseEntity.ok(ApiResponse.success("Total del carrito obtenido correctamente",
                carritoService.calcularTotal(usuarioId)));
    }
}
