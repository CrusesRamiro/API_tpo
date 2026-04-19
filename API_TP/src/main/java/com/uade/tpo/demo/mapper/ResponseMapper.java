package com.uade.tpo.demo.mapper;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.uade.tpo.demo.dto.CarritoResponse;
import com.uade.tpo.demo.dto.CategoriaResponse;
import com.uade.tpo.demo.dto.DetallePedidoResponse;
import com.uade.tpo.demo.dto.FotoProductoResponse;
import com.uade.tpo.demo.dto.ItemCarritoResponse;
import com.uade.tpo.demo.dto.ItemResponse;
import com.uade.tpo.demo.dto.ItemSummaryResponse;
import com.uade.tpo.demo.dto.PedidoResponse;
import com.uade.tpo.demo.dto.RolResponse;
import com.uade.tpo.demo.dto.UsuarioResponse;
import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.Categoria;
import com.uade.tpo.demo.entity.DetallePedido;
import com.uade.tpo.demo.entity.FotoProducto;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.entity.ItemCarrito;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.entity.Rol;
import com.uade.tpo.demo.entity.Usuario;

@Component
public class ResponseMapper {

    public UsuarioResponse toUsuarioResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .rol(toRolResponse(usuario.getRol()))
                .build();
    }

    public RolResponse toRolResponse(Rol rol) {
        if (rol == null) {
            return null;
        }

        return RolResponse.builder()
                .id(rol.getId())
                .nombre(rol.getNombre())
                .build();
    }

    public CategoriaResponse toCategoriaResponse(Categoria categoria) {
        if (categoria == null) {
            return null;
        }

        return CategoriaResponse.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .descripcion(categoria.getDescripcion())
                .build();
    }

    public ItemSummaryResponse toItemSummaryResponse(Item item) {
        if (item == null) {
            return null;
        }

        return ItemSummaryResponse.builder()
                .id(item.getId())
                .nombre(item.getNombre())
                .precio(item.getPrecio())
                .build();
    }

    public ItemResponse toItemResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .nombre(item.getNombre())
                .descripcion(item.getDescripcion())
                .precio(item.getPrecio())
                .stock(item.getStock())
                .categoria(toCategoriaResponse(item.getCategoria()))
                .build();
    }

    public FotoProductoResponse toFotoProductoResponse(FotoProducto fotoProducto) {
        return FotoProductoResponse.builder()
                .id(fotoProducto.getId())
                .imagenBase64(Base64.getEncoder().encodeToString(fotoProducto.getImagen()))
                .build();
    }

    public ItemCarritoResponse toItemCarritoResponse(ItemCarrito itemCarrito) {
        double subtotal = itemCarrito.getItem().getPrecio() * itemCarrito.getCantidad();

        return ItemCarritoResponse.builder()
                .id(itemCarrito.getId())
                .item(toItemSummaryResponse(itemCarrito.getItem()))
                .cantidad(itemCarrito.getCantidad())
                .subtotal(subtotal)
                .build();
    }

    public CarritoResponse toCarritoResponse(Carrito carrito) {
        List<ItemCarritoResponse> items = carrito.getItems()
                .stream()
                .map(this::toItemCarritoResponse)
                .collect(Collectors.toList());

        double total = carrito.getItems()
                .stream()
                .mapToDouble(item -> item.getItem().getPrecio() * item.getCantidad())
                .sum();

        return CarritoResponse.builder()
                .id(carrito.getId())
                .usuarioId(carrito.getUsuario().getId())
                .items(items)
                .total(total)
                .build();
    }

    public DetallePedidoResponse toDetallePedidoResponse(DetallePedido detallePedido) {
        return DetallePedidoResponse.builder()
                .id(detallePedido.getId())
                .item(toItemSummaryResponse(detallePedido.getItem()))
                .cantidad(detallePedido.getCantidad())
                .precioUnidad(detallePedido.getPrecioUnidad())
                .subtotal(detallePedido.getPrecioUnidad() * detallePedido.getCantidad())
                .build();
    }

    public PedidoResponse toPedidoResponse(Pedido pedido) {
        List<DetallePedidoResponse> detalle = pedido.getDetalle()
                .stream()
                .map(this::toDetallePedidoResponse)
                .collect(Collectors.toList());

        return PedidoResponse.builder()
                .id(pedido.getId())
                .usuarioId(pedido.getUsuario().getId())
                .carritoId(pedido.getCarrito().getId())
                .total(pedido.getTotal())
                .fecha(pedido.getFecha())
                .estado(pedido.getEstado())
                .detalle(detalle)
                .build();
    }
}
