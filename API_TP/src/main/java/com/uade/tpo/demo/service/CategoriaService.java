package com.uade.tpo.demo.service;

import java.util.List;
import com.uade.tpo.demo.entity.Categoria;

public interface CategoriaService {
    List<Categoria> getAll();
    Categoria getById(Long id);
    Categoria create(String nombre, String descripcion);
    Categoria update(Long id, String nombre, String descripcion);
    void delete(Long id);
}
