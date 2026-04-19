package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.uade.tpo.demo.entity.Categoria;
import com.uade.tpo.demo.exception.BadRequestException;
import com.uade.tpo.demo.exception.ConflictException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.repository.CategoriaRepository;
import com.uade.tpo.demo.repository.ItemRepository;

@Service
@Transactional
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ItemRepository itemRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository, ItemRepository itemRepository) {
        this.categoriaRepository = categoriaRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> getAll() {
        return categoriaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Categoria getById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoria no encontrada con id: " + id));
    }

    @Override
    public Categoria create(String nombre, String descripcion) {
        String nombreNormalizado = normalizeRequired(nombre, "El nombre de la categoria es obligatorio");

        validarNombreUnico(nombreNormalizado, null);

        Categoria categoria = Categoria.builder()
                .nombre(nombreNormalizado)
                .descripcion(normalizeOptional(descripcion))
                .build();

        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria update(Long id, String nombre, String descripcion) {
        Categoria categoria = getById(id);
        String nombreNormalizado = normalizeRequired(nombre, "El nombre de la categoria es obligatorio");

        validarNombreUnico(nombreNormalizado, id);

        categoria.setNombre(nombreNormalizado);
        categoria.setDescripcion(normalizeOptional(descripcion));

        return categoriaRepository.save(categoria);
    }

    @Override
    public void delete(Long id) {
        Categoria categoria = getById(id);

        if (itemRepository.existsByCategoriaId(id)) {
            throw new BadRequestException("No se puede eliminar la categoria porque tiene items asociados");
        }

        categoriaRepository.delete(categoria);
    }

    private void validarNombreUnico(String nombre, Long categoriaId) {
        boolean duplicado = categoriaRepository.findAll()
                .stream()
                .anyMatch(categoria -> categoria.getNombre() != null
                        && categoria.getNombre().equalsIgnoreCase(nombre)
                        && (categoriaId == null || !categoria.getId().equals(categoriaId)));

        if (duplicado) {
            throw new ConflictException("Ya existe una categoria con ese nombre");
        }
    }

    private String normalizeRequired(String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new BadRequestException(message);
        }

        return value.trim();
    }

    private String normalizeOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
