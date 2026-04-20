package com.uade.tpo.demo.Requests;

import com.uade.tpo.demo.entity.EstadoPedido;

import lombok.Data;

@Data
public class PedidoEstadoRequest {
    private EstadoPedido estado;
}
