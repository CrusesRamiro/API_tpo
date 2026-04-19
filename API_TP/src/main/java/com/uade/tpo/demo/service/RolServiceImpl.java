package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.uade.tpo.demo.entity.Rol;
import com.uade.tpo.demo.exception.BadRequestException;
import com.uade.tpo.demo.exception.ConflictException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.repository.RolRepository;
import com.uade.tpo.demo.repository.UsuarioRepository;

@Service
@Transactional
public class RolServiceImpl implements RolService {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;

    public RolServiceImpl(RolRepository rolRepository, UsuarioRepository usuarioRepository) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Rol> getAll() {
        return rolRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Rol getById(Long id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rol no encontrado con id: " + id));
    }

    @Override
    public Rol create(String nombre) {
        String nombreNormalizado = normalizeRoleName(nombre);
        validarNombreUnico(nombreNormalizado, null);

        Rol rol = Rol.builder()
                .nombre(nombreNormalizado)
                .build();

        return rolRepository.save(rol);
    }

    @Override
    public Rol update(Long id, String nombre) {
        Rol rol = getById(id);
        String nombreNormalizado = normalizeRoleName(nombre);

        if (isDefaultRole(rol.getNombre()) && !rol.getNombre().equals(nombreNormalizado)) {
            throw new BadRequestException("No se puede renombrar un rol base del sistema");
        }

        validarNombreUnico(nombreNormalizado, id);
        rol.setNombre(nombreNormalizado);

        return rolRepository.save(rol);
    }

    @Override
    public void delete(Long id) {
        Rol rol = getById(id);

        if (isDefaultRole(rol.getNombre())) {
            throw new BadRequestException("No se puede eliminar un rol base del sistema");
        }

        if (usuarioRepository.existsByRolId(id)) {
            throw new BadRequestException("No se puede eliminar el rol porque tiene usuarios asociados");
        }

        rolRepository.delete(rol);
    }

    private void validarNombreUnico(String nombre, Long rolId) {
        boolean duplicado = rolRepository.findAll()
                .stream()
                .anyMatch(rol -> rol.getNombre() != null
                        && rol.getNombre().equalsIgnoreCase(nombre)
                        && (rolId == null || !rol.getId().equals(rolId)));

        if (duplicado) {
            throw new ConflictException("Ya existe un rol con ese nombre");
        }
    }

    private String normalizeRoleName(String nombre) {
        if (!StringUtils.hasText(nombre)) {
            throw new BadRequestException("El nombre del rol es obligatorio");
        }

        String normalized = nombre.trim().toUpperCase();
        return normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
    }

    private boolean isDefaultRole(String nombre) {
        return "ROLE_ADMIN".equalsIgnoreCase(nombre) || "ROLE_CLIENTE".equalsIgnoreCase(nombre);
    }
}
