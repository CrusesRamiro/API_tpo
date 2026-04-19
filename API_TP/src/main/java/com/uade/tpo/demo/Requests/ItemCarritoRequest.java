package com.uade.tpo.demo.Requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class ItemCarritoRequest {

    @NotNull(message = "El id del item es obligatorio")
    private Long idItem;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a cero")
    private Integer cant;

}

