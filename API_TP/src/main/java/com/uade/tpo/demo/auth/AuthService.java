package com.uade.tpo.demo.auth;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(AuthRequest request) {
        if (request == null || !StringUtils.hasText(request.getUsername()) || !StringUtils.hasText(request.getPassword())) {
            throw new BadCredentialsException("Username o password invalidos");
        }

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Username o password invalidos"));

        if (!passwordMatches(request.getPassword(), usuario.getPassword())) {
            throw new BadCredentialsException("Username o password invalidos");
        }

        return AuthResponse.builder()
                .token(jwtService.generateToken(usuario))
                .tokenType("Bearer")
                .userId(usuario.getId())
                .username(usuario.getUsername())
                .rol(usuario.getRol() != null ? usuario.getRol().getNombre() : null)
                .build();
    }

    private boolean passwordMatches(String rawPassword, String storedPassword) {
        if (!StringUtils.hasText(storedPassword)) {
            return false;
        }

        if (isBcryptHash(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        return storedPassword.equals(rawPassword);
    }

    private boolean isBcryptHash(String password) {
        return password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$");
    }
}
