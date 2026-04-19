package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.uade.tpo.demo.entity.Categoria;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.exception.BadRequestException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.repository.CategoriaRepository;
import com.uade.tpo.demo.repository.ItemRepository;

@Service
@Transactional
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoriaRepository categoriaRepository;

    public ItemServiceImpl(ItemRepository itemRepository, CategoriaRepository categoriaRepository) {
        this.itemRepository = itemRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Item> getAll() {
        return itemRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Item getById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Item no encontrado con id: " + id));
    }

    @Override
    public Item create(String nombre, String descripcion, Double precio, Integer stock, Long categoriaId) {
        Categoria categoria = getCategoria(categoriaId);

        validarDatos(nombre, precio, stock);

        Item item = Item.builder()
                .nombre(nombre.trim())
                .descripcion(normalizeOptional(descripcion))
                .precio(precio)
                .stock(stock)
                .categoria(categoria)
                .build();

        return itemRepository.save(item);
    }

    @Override
    public Item update(Long id, String nombre, String descripcion, Double precio, Integer stock, Long categoriaId) {
        Item item = getById(id);
        Categoria categoria = getCategoria(categoriaId);

        validarDatos(nombre, precio, stock);

        item.setNombre(nombre.trim());
        item.setDescripcion(normalizeOptional(descripcion));
        item.setPrecio(precio);
        item.setStock(stock);
        item.setCategoria(categoria);

        return itemRepository.save(item);
    }

    @Override
    public void delete(Long id) {
        Item item = getById(id);
        itemRepository.delete(item);
    }

    private Categoria getCategoria(Long categoriaId) {
        if (categoriaId == null) {
            throw new BadRequestException("La categoria es obligatoria");
        }

        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new NotFoundException("Categoria no encontrada con id: " + categoriaId));
    }

    private void validarDatos(String nombre, Double precio, Integer stock) {
        if (!StringUtils.hasText(nombre)) {
            throw new BadRequestException("El nombre del item es obligatorio");
        }

        if (precio == null || precio <= 0) {
            throw new BadRequestException("El precio debe ser mayor a cero");
        }

        if (stock == null || stock < 0) {
            throw new BadRequestException("El stock no puede ser negativo");
        }
    }

    private String normalizeOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
