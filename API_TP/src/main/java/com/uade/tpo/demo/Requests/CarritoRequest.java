package com.uade.tpo.demo.Requests;

import com.uade.tpo.demo.entity.ItemCarrito;
import java.util.List;

import lombok.Data;

@Data
public class CarritoRequest {
    private List<ItemCarrito> items;
}


