package com.uade.tpo.demo.security;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.exception.ForbiddenException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.repository.UsuarioRepository;

@Service
public class CurrentUserService {

    private final UsuarioRepository usuarioRepository;

    public CurrentUserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new ForbiddenException("No hay un usuario autenticado");
        }

        String username = authentication.getName();

        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Usuario autenticado no encontrado"));
    }

    public boolean isAdmin() {
        return getCurrentUser().getRol() != null
                && "ROLE_ADMIN".equals(getCurrentUser().getRol().getNombre());
    }

    public void requireSameUserOrAdmin(Long userId) {
        Usuario usuarioActual = getCurrentUser();
        boolean isAdmin = usuarioActual.getRol() != null && "ROLE_ADMIN".equals(usuarioActual.getRol().getNombre());

        if (!isAdmin && !usuarioActual.getId().equals(userId)) {
            throw new ForbiddenException("No tenes permisos para acceder a este recurso");
        }
    }
}
