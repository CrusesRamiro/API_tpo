package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.demo.entity.Categoria;

public interface CategoriaService {
    List<Categoria> getAll();
    Optional<Categoria> getById(Long id);
    Categoria create(String nombre, String descripcion);
    Categoria update(Long id, String nombre, String descripcion);
}
