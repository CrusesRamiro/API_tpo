package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.uade.tpo.demo.entity.Rol;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.exception.BadRequestException;
import com.uade.tpo.demo.exception.ConflictException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.repository.RolRepository;
import com.uade.tpo.demo.repository.PedidoRepository;
import com.uade.tpo.demo.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final PedidoRepository pedidoRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, RolRepository rolRepository,
            PasswordEncoder passwordEncoder, PedidoRepository pedidoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario getById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> getByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> getByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    @Override
    public Usuario create(String username, String password, String nombre, String apellido, String email, Long rolId) {
        validarDatosObligatorios(username, password, email, nombre, apellido);
        validarDuplicados(null, username, email);

        Rol rol = resolveRol(rolId);

        Usuario usuario = Usuario.builder()
                .username(username.trim())
                .password(passwordEncoder.encode(password))
                .nombre(nombre.trim())
                .apellido(apellido.trim())
                .email(email.trim())
                .rol(rol)
                .build();

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario update(Long id, String email, String nombre, String apellido, String password, Long rolId) {
        Usuario usuario = getById(id);

        if (StringUtils.hasText(email)) {
            String normalizedEmail = email.trim();
            validarDuplicados(id, usuario.getUsername(), normalizedEmail);
            usuario.setEmail(normalizedEmail);
        }

        if (StringUtils.hasText(nombre)) {
            usuario.setNombre(nombre.trim());
        }

        if (StringUtils.hasText(apellido)) {
            usuario.setApellido(apellido.trim());
        }

        if (StringUtils.hasText(password)) {
            usuario.setPassword(passwordEncoder.encode(password));
        }

        if (rolId != null) {
            usuario.setRol(resolveRol(rolId));
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public void delete(Long id) {
        Usuario usuario = getById(id);

        if (pedidoRepository.existsByUsuarioId(id)) {
            throw new BadRequestException("No se puede eliminar el usuario porque tiene pedidos asociados");
        }

        usuarioRepository.delete(usuario);
    }

    private Rol resolveRol(Long rolId) {
        if (rolId != null) {
            return rolRepository.findById(rolId)
                    .orElseThrow(() -> new NotFoundException("Rol no encontrado con id: " + rolId));
        }

        return rolRepository.findByNombre("ROLE_CLIENTE")
                .orElseThrow(() -> new NotFoundException("No existe el rol por defecto ROLE_CLIENTE"));
    }

    private void validarDatosObligatorios(String username, String password, String email, String nombre,
            String apellido) {
        if (!StringUtils.hasText(username)) {
            throw new BadRequestException("El username es obligatorio");
        }

        if (!StringUtils.hasText(password)) {
            throw new BadRequestException("La password es obligatoria");
        }

        if (!StringUtils.hasText(email)) {
            throw new BadRequestException("El email es obligatorio");
        }

        if (!StringUtils.hasText(nombre)) {
            throw new BadRequestException("El nombre es obligatorio");
        }

        if (!StringUtils.hasText(apellido)) {
            throw new BadRequestException("El apellido es obligatorio");
        }
    }

    private void validarDuplicados(Long usuarioId, String username, String email) {
        boolean usernameDuplicado = usuarioRepository.findByUsername(username.trim())
                .filter(usuario -> usuarioId == null || !usuario.getId().equals(usuarioId))
                .isPresent();

        if (usernameDuplicado) {
            throw new ConflictException("Ya existe un usuario con ese username");
        }

        boolean emailDuplicado = usuarioRepository.findByEmail(email.trim())
                .filter(usuario -> usuarioId == null || !usuario.getId().equals(usuarioId))
                .isPresent();

        if (emailDuplicado) {
            throw new ConflictException("Ya existe un usuario con ese email");
        }
    }
}
