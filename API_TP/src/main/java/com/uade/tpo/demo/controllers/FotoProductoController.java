package com.uade.tpo.demo.controllers;

import java.io.IOException;
import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.api.ApiResponse;
import com.uade.tpo.demo.dto.FotoProductoResponse;
import com.uade.tpo.demo.entity.FotoProducto;
import com.uade.tpo.demo.mapper.ResponseMapper;
import com.uade.tpo.demo.service.FotoProductoService;

@RestController
@RequestMapping("/items/{itemId}/fotos")
public class FotoProductoController {

    private final FotoProductoService fotoProductoService;
    private final ResponseMapper responseMapper;

    public FotoProductoController(FotoProductoService fotoProductoService, ResponseMapper responseMapper) {
        this.fotoProductoService = fotoProductoService;
        this.responseMapper = responseMapper;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<FotoProductoResponse>> agregarFoto(
            @PathVariable Long itemId,
            @RequestParam("archivo") MultipartFile archivo) throws IOException {
        FotoProducto fotoProducto = fotoProductoService.agregarFoto(itemId, archivo);

        return ResponseEntity.created(URI.create("/items/" + itemId + "/fotos/" + fotoProducto.getId()))
                .body(ApiResponse.success("Foto agregada correctamente",
                        responseMapper.toFotoProductoResponse(fotoProducto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FotoProductoResponse>>> getFotos(@PathVariable Long itemId) {
        List<FotoProductoResponse> fotos = fotoProductoService.getFotosByItem(itemId)
                .stream()
                .map(responseMapper::toFotoProductoResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Fotos obtenidas correctamente", fotos));
    }

    @DeleteMapping("/{fotoId}")
    public ResponseEntity<ApiResponse<Void>> eliminarFoto(@PathVariable Long itemId, @PathVariable Long fotoId) {
        fotoProductoService.eliminarFoto(itemId, fotoId);
        return ResponseEntity.ok(ApiResponse.success("Foto eliminada correctamente"));
    }
}
