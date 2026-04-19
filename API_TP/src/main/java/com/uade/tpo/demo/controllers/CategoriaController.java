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

import com.uade.tpo.demo.Requests.CategoriaRequest;
import com.uade.tpo.demo.api.ApiResponse;
import com.uade.tpo.demo.dto.CategoriaResponse;
import com.uade.tpo.demo.entity.Categoria;
import com.uade.tpo.demo.mapper.ResponseMapper;
import com.uade.tpo.demo.service.CategoriaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final ResponseMapper responseMapper;

    public CategoriaController(CategoriaService categoriaService, ResponseMapper responseMapper) {
        this.categoriaService = categoriaService;
        this.responseMapper = responseMapper;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoriaResponse>>> getAll() {
        List<CategoriaResponse> categorias = categoriaService.getAll().stream()
                .map(responseMapper::toCategoriaResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Categorias obtenidas correctamente", categorias));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoriaResponse>> getById(@PathVariable Long id) {
        Categoria categoria = categoriaService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Categoria obtenida correctamente",
                responseMapper.toCategoriaResponse(categoria)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoriaResponse>> create(@Valid @RequestBody CategoriaRequest request) {
        Categoria nueva = categoriaService.create(request.getNombre(), request.getDescripcion());
        CategoriaResponse response = responseMapper.toCategoriaResponse(nueva);

        return ResponseEntity.created(URI.create("/categorias/" + nueva.getId()))
                .body(ApiResponse.success("Categoria creada correctamente", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoriaResponse>> update(@PathVariable Long id,
            @Valid @RequestBody CategoriaRequest request) {
        Categoria categoria = categoriaService.update(id, request.getNombre(), request.getDescripcion());
        return ResponseEntity.ok(ApiResponse.success("Categoria actualizada correctamente",
                responseMapper.toCategoriaResponse(categoria)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoriaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Categoria eliminada correctamente"));
    }
}
