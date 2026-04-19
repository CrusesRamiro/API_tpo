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

import com.uade.tpo.demo.Requests.RolRequest;
import com.uade.tpo.demo.api.ApiResponse;
import com.uade.tpo.demo.dto.RolResponse;
import com.uade.tpo.demo.entity.Rol;
import com.uade.tpo.demo.mapper.ResponseMapper;
import com.uade.tpo.demo.service.RolService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/roles")
public class RolController {

    private final RolService rolService;
    private final ResponseMapper responseMapper;

    public RolController(RolService rolService, ResponseMapper responseMapper) {
        this.rolService = rolService;
        this.responseMapper = responseMapper;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RolResponse>>> getAll() {
        List<RolResponse> roles = rolService.getAll().stream()
                .map(responseMapper::toRolResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Roles obtenidos correctamente", roles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RolResponse>> getById(@PathVariable Long id) {
        Rol rol = rolService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Rol obtenido correctamente",
                responseMapper.toRolResponse(rol)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RolResponse>> create(@Valid @RequestBody RolRequest request) {
        Rol rol = rolService.create(request.getNombre());
        return ResponseEntity.created(URI.create("/roles/" + rol.getId()))
                .body(ApiResponse.success("Rol creado correctamente", responseMapper.toRolResponse(rol)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RolResponse>> update(@PathVariable Long id,
            @Valid @RequestBody RolRequest request) {
        Rol rol = rolService.update(id, request.getNombre());
        return ResponseEntity.ok(ApiResponse.success("Rol actualizado correctamente",
                responseMapper.toRolResponse(rol)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        rolService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Rol eliminado correctamente"));
    }
}
