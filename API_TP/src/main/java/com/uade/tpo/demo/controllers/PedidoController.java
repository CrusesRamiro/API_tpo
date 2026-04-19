package com.uade.tpo.demo.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.Requests.PedidoEstadoRequest;
import com.uade.tpo.demo.api.ApiResponse;
import com.uade.tpo.demo.dto.PedidoResponse;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.mapper.ResponseMapper;
import com.uade.tpo.demo.security.CurrentUserService;
import com.uade.tpo.demo.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;
    private final ResponseMapper responseMapper;
    private final CurrentUserService currentUserService;

    public PedidoController(PedidoService pedidoService, ResponseMapper responseMapper,
            CurrentUserService currentUserService) {
        this.pedidoService = pedidoService;
        this.responseMapper = responseMapper;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PedidoResponse>>> getAll() {
        List<PedidoResponse> pedidos = pedidoService.getAll().stream()
                .map(responseMapper::toPedidoResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Pedidos obtenidos correctamente", pedidos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PedidoResponse>> getById(@PathVariable Long id) {
        Pedido pedido = pedidoService.getById(id);
        currentUserService.requireSameUserOrAdmin(pedido.getUsuario().getId());

        return ResponseEntity.ok(ApiResponse.success("Pedido obtenido correctamente",
                responseMapper.toPedidoResponse(pedido)));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ApiResponse<List<PedidoResponse>>> getByUsuarioId(@PathVariable Long usuarioId) {
        currentUserService.requireSameUserOrAdmin(usuarioId);

        List<PedidoResponse> pedidos = pedidoService.getByUsuarioId(usuarioId).stream()
                .map(responseMapper::toPedidoResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Pedidos del usuario obtenidos correctamente", pedidos));
    }

    @GetMapping("/mios")
    public ResponseEntity<ApiResponse<List<PedidoResponse>>> getMyOrders() {
        Long usuarioId = currentUserService.getCurrentUser().getId();

        List<PedidoResponse> pedidos = pedidoService.getByUsuarioId(usuarioId).stream()
                .map(responseMapper::toPedidoResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Tus pedidos fueron obtenidos correctamente", pedidos));
    }

    @PostMapping("/checkout/{usuarioId}")
    public ResponseEntity<ApiResponse<PedidoResponse>> checkout(@PathVariable Long usuarioId) {
        currentUserService.requireSameUserOrAdmin(usuarioId);

        Pedido pedido = pedidoService.crearDesdeCarrito(usuarioId);
        return ResponseEntity.created(URI.create("/pedidos/" + pedido.getId()))
                .body(ApiResponse.success("Checkout realizado correctamente",
                        responseMapper.toPedidoResponse(pedido)));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<PedidoResponse>> updateEstado(@PathVariable Long id,
            @Valid @RequestBody PedidoEstadoRequest request) {
        Pedido pedido = pedidoService.updateEstado(id, request.getEstado());
        return ResponseEntity.ok(ApiResponse.success("Estado del pedido actualizado correctamente",
                responseMapper.toPedidoResponse(pedido)));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<ApiResponse<PedidoResponse>> cancelar(@PathVariable Long id) {
        Pedido pedido = pedidoService.getById(id);
        currentUserService.requireSameUserOrAdmin(pedido.getUsuario().getId());

        Pedido pedidoCancelado = pedidoService.cancelar(id);
        return ResponseEntity.ok(ApiResponse.success("Pedido cancelado correctamente",
                responseMapper.toPedidoResponse(pedidoCancelado)));
    }
}
