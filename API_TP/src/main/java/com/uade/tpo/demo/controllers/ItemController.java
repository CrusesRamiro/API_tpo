package com.uade.tpo.demo.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.Requests.ItemRequest;
import com.uade.tpo.demo.api.ApiResponse;
import com.uade.tpo.demo.dto.ItemResponse;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.mapper.ResponseMapper;
import com.uade.tpo.demo.service.ItemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemService itemService;
    private final ResponseMapper responseMapper;

    public ItemController(ItemService itemService, ResponseMapper responseMapper) {
        this.itemService = itemService;
        this.responseMapper = responseMapper;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ItemResponse>>> getAll() {
        List<ItemResponse> items = itemService.getAll().stream()
                .map(responseMapper::toItemResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Items obtenidos correctamente", items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponse>> getById(@PathVariable Long id) {
        Item item = itemService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Item obtenido correctamente", responseMapper.toItemResponse(item)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ItemResponse>> create(@Valid @RequestBody ItemRequest request) {
        Item nuevo = itemService.create(
                request.getNombre(),
                request.getDescripcion(),
                request.getPrecio(),
                request.getStock(),
                request.getCategoriaId());

        return ResponseEntity.created(URI.create("/items/" + nuevo.getId()))
                .body(ApiResponse.success("Item creado correctamente", responseMapper.toItemResponse(nuevo)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponse>> update(@PathVariable Long id,
            @Valid @RequestBody ItemRequest request) {
        Item item = itemService.update(
                id,
                request.getNombre(),
                request.getDescripcion(),
                request.getPrecio(),
                request.getStock(),
                request.getCategoriaId());

        return ResponseEntity.ok(ApiResponse.success("Item actualizado correctamente",
                responseMapper.toItemResponse(item)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        itemService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Item eliminado correctamente"));
    }
}
