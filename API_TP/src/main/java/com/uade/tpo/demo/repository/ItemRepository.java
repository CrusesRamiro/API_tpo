package com.uade.tpo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.uade.tpo.demo.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {

    // Trae los items con su categoría y sus fotos en UNA sola query (evita el N+1
    // que se daba al cargar categoría y fotos por separado para cada item).
    @Query("SELECT DISTINCT i FROM Item i LEFT JOIN FETCH i.categoria LEFT JOIN FETCH i.fotos")
    List<Item> findAllWithDetails();
}
