package com.uade.tpo.demo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.DetallePedido;
import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.entity.ItemCarrito;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.exception.BadRequestException;
import com.uade.tpo.demo.repository.CarritoRepository;
import com.uade.tpo.demo.repository.PedidoRepository;

@ExtendWith(MockitoExtension.class)
class PedidoServiceImplTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private CarritoRepository carritoRepository;

    @InjectMocks
    private PedidoServiceImpl pedidoService;

    @Test
    void crearDesdeCarrito_shouldCreateOrderAndClearCart() {
        Usuario usuario = Usuario.builder().id(10L).build();
        Item item = Item.builder().id(20L).nombre("Libro").precio(100.0).stock(5).build();
        ItemCarrito itemCarrito = ItemCarrito.builder().id(30L).item(item).cantidad(2).build();
        Carrito carrito = Carrito.builder().id(40L).usuario(usuario).items(new ArrayList<>(List.of(itemCarrito))).build();
        itemCarrito.setCarrito(carrito);

        when(carritoRepository.findByUsuarioId(10L)).thenReturn(Optional.of(carrito));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> {
            Pedido pedido = invocation.getArgument(0);
            pedido.setId(50L);
            return pedido;
        });
        when(carritoRepository.save(any(Carrito.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pedido pedido = pedidoService.crearDesdeCarrito(10L);

        assertThat(pedido.getId()).isEqualTo(50L);
        assertThat(pedido.getEstado()).isEqualTo(EstadoPedido.PENDIENTE);
        assertThat(pedido.getTotal()).isEqualTo(200.0);
        assertThat(pedido.getDetalle()).hasSize(1);

        DetallePedido detalle = pedido.getDetalle().getFirst();
        assertThat(detalle.getCantidad()).isEqualTo(2);
        assertThat(detalle.getPrecioUnidad()).isEqualTo(100.0);
        assertThat(item.getStock()).isEqualTo(3);
        assertThat(carrito.getItems()).isEmpty();

        verify(pedidoRepository).save(any(Pedido.class));
        verify(carritoRepository).save(carrito);
    }

    @Test
    void cancelar_shouldRestoreStockAndSetCancelledStatus() {
        Item item = Item.builder().id(1L).stock(2).build();
        Pedido pedido = Pedido.builder()
                .id(99L)
                .estado(EstadoPedido.CONFIRMADO)
                .detalle(List.of(DetallePedido.builder().item(item).cantidad(3).precioUnidad(10.0).build()))
                .build();

        when(pedidoRepository.findById(99L)).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Pedido pedidoCancelado = pedidoService.cancelar(99L);

        assertThat(pedidoCancelado.getEstado()).isEqualTo(EstadoPedido.CANCELADO);
        assertThat(item.getStock()).isEqualTo(5);
    }

    @Test
    void cancelar_shouldFailWhenOrderIsDelivered() {
        Pedido pedido = Pedido.builder()
                .id(88L)
                .estado(EstadoPedido.ENTREGADO)
                .detalle(List.of())
                .build();

        when(pedidoRepository.findById(88L)).thenReturn(Optional.of(pedido));

        assertThatThrownBy(() -> pedidoService.cancelar(88L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("entregado");
    }
}
