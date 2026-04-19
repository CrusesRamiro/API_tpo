package com.uade.tpo.demo.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.Requests.UsuarioRequest;
import com.uade.tpo.demo.Requests.UsuarioUpdateRequest;
import com.uade.tpo.demo.api.ApiResponse;
import com.uade.tpo.demo.dto.UsuarioResponse;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.exception.ForbiddenException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.mapper.ResponseMapper;
import com.uade.tpo.demo.security.CurrentUserService;
import com.uade.tpo.demo.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ResponseMapper responseMapper;
    private final CurrentUserService currentUserService;

    public UsuarioController(UsuarioService usuarioService, ResponseMapper responseMapper,
            CurrentUserService currentUserService) {
        this.usuarioService = usuarioService;
        this.responseMapper = responseMapper;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioResponse>>> getAll() {
        List<UsuarioResponse> usuarios = usuarioService.getAll().stream()
                .map(responseMapper::toUsuarioResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Usuarios obtenidos correctamente", usuarios));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UsuarioResponse>> getCurrentUser() {
        Usuario usuario = currentUserService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Usuario autenticado obtenido correctamente",
                responseMapper.toUsuarioResponse(usuario)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponse>> getById(@PathVariable Long id) {
        currentUserService.requireSameUserOrAdmin(id);

        Usuario usuario = usuarioService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario obtenido correctamente",
                responseMapper.toUsuarioResponse(usuario)));
    }

    @GetMapping({ "/email/{mail}", "/Email/{mail}" })
    public ResponseEntity<ApiResponse<UsuarioResponse>> getByEmail(@PathVariable String mail) {
        Usuario usuario = usuarioService.getByEmail(mail)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con email: " + mail));

        return ResponseEntity.ok(ApiResponse.success("Usuario obtenido correctamente",
                responseMapper.toUsuarioResponse(usuario)));
    }

    @GetMapping({ "/username/{username}", "/Username/{username}" })
    public ResponseEntity<ApiResponse<UsuarioResponse>> getByUsername(@PathVariable String username) {
        Usuario usuario = usuarioService.getByUsername(username)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con username: " + username));

        return ResponseEntity.ok(ApiResponse.success("Usuario obtenido correctamente",
                responseMapper.toUsuarioResponse(usuario)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UsuarioResponse>> create(@Valid @RequestBody UsuarioRequest request,
            Authentication authentication) {
        if (request.getRolId() != null && !isAdmin(authentication)) {
            throw new ForbiddenException("Solo un administrador puede asignar roles manualmente");
        }

        Usuario nuevo = usuarioService.create(request.getUsername(), request.getPassword(), request.getNombre(),
                request.getApellido(), request.getEmail(), request.getRolId());

        return ResponseEntity.created(URI.create("/usuarios/" + nuevo.getId()))
                .body(ApiResponse.success("Usuario creado correctamente", responseMapper.toUsuarioResponse(nuevo)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponse>> update(@PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest request, Authentication authentication) {
        currentUserService.requireSameUserOrAdmin(id);

        if (request.getRolId() != null && !isAdmin(authentication)) {
            throw new ForbiddenException("Solo un administrador puede modificar roles");
        }

        Usuario usuario = usuarioService.update(id, request.getEmail(), request.getNombre(), request.getApellido(),
                request.getPassword(), request.getRolId());

        return ResponseEntity.ok(ApiResponse.success("Usuario actualizado correctamente",
                responseMapper.toUsuarioResponse(usuario)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        currentUserService.requireSameUserOrAdmin(id);
        usuarioService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado correctamente"));
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }
}
