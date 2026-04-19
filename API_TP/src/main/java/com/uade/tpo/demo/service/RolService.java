package com.uade.tpo.demo.service;

import java.util.List;

import com.uade.tpo.demo.entity.Rol;

public interface RolService {
    List<Rol> getAll();
    Rol getById(Long id);
    Rol create(String nombre);
    Rol update(Long id, String nombre);
    void delete(Long id);
}
