package com.uade.tpo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.demo.entity.FotoProducto;

public interface FotoProductoRepository extends JpaRepository<FotoProducto, Long> {
    List<FotoProducto> findByItemId(Long itemId);
    java.util.Optional<FotoProducto> findByIdAndItemId(Long id, Long itemId);
}
