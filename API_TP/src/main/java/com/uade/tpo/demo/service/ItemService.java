package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.demo.entity.Item;

public interface ItemService {
    List<Item> getAll();
    Optional<Item> getById(Long id);
    Item create(String nombre, String descripcion, Double precio, Integer stock, Long categoriaId);
    Item update(Long id, String nombre, String descripcion, Double precio, Integer stock, Long categoriaId);
    void delete(Long id);
}
