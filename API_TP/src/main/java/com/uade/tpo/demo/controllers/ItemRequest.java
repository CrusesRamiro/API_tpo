package com.uade.tpo.demo.controllers;

import lombok.Data;

@Data
public class ItemRequest {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Long categoriaId;
}
