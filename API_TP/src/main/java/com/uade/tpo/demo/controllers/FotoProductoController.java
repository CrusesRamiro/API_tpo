package com.uade.tpo.demo.controllers;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.service.FotoProductoService;

@RestController
@RequestMapping("/items/{itemId}/fotos")
public class FotoProductoController {

    @Autowired
    private FotoProductoService fotoProductoService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> agregarFoto(
            @PathVariable Long itemId,
            @RequestParam("archivo") MultipartFile archivo) throws IOException {

        fotoProductoService.agregarFoto(itemId, archivo);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<String>> getFotos(@PathVariable Long itemId) {
        List<String> fotos = fotoProductoService.getFotosByItem(itemId)
                .stream()
                .map(foto -> Base64.getEncoder().encodeToString(foto.getImagen()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(fotos);
    }
}
