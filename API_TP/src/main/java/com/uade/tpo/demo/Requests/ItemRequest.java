package com.uade.tpo.demo.Requests;

import lombok.Data;

@Data
public class ItemRequest {
    private String nombre;
    //private String autor;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Long categoriaId;
}
