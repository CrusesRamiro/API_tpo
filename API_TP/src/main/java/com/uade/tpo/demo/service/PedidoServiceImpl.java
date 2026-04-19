package com.uade.tpo.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.DetallePedido;
import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.entity.ItemCarrito;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.exception.BadRequestException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.repository.CarritoRepository;
import com.uade.tpo.demo.repository.PedidoRepository;

@Service
@Transactional
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CarritoRepository carritoRepository;

    public PedidoServiceImpl(PedidoRepository pedidoRepository, CarritoRepository carritoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.carritoRepository = carritoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> getAll() {
        return pedidoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Pedido getById(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pedido no encontrado con id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> getByUsuarioId(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public Pedido crearDesdeCarrito(Long usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new NotFoundException("Carrito no encontrado para el usuario: " + usuarioId));

        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new BadRequestException("No se puede generar un pedido con el carrito vacio");
        }

        Pedido pedido = Pedido.builder()
                .usuario(carrito.getUsuario())
                .carrito(carrito)
                .fecha(LocalDate.now())
                .estado(EstadoPedido.PENDIENTE)
                .total(0.0)
                .build();

        double total = 0.0;

        for (ItemCarrito itemCarrito : carrito.getItems()) {
            validarItemCarrito(itemCarrito);

            Item item = itemCarrito.getItem();
            Integer cantidad = itemCarrito.getCantidad();

            if (item.getStock() < cantidad) {
                throw new BadRequestException(
                        "Stock insuficiente para el item " + item.getId() + ". Disponible: "
                                + item.getStock() + ", solicitado: " + cantidad);
            }

            item.setStock(item.getStock() - cantidad);

            DetallePedido detalle = DetallePedido.builder()
                    .pedido(pedido)
                    .item(item)
                    .cantidad(cantidad)
                    .precioUnidad(item.getPrecio())
                    .build();

            pedido.getDetalle().add(detalle);
            total += item.getPrecio() * cantidad;
        }

        pedido.setTotal(total);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        carrito.getItems().clear();
        carritoRepository.save(carrito);

        return pedidoGuardado;
    }

    @Override
    public Pedido updateEstado(Long id, EstadoPedido estado) {
        if (estado == null) {
            throw new BadRequestException("El estado es obligatorio");
        }

        if (estado == EstadoPedido.CANCELADO) {
            return cancelar(id);
        }

        Pedido pedido = getById(id);

        if (pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new BadRequestException("No se puede modificar un pedido cancelado");
        }

        if (pedido.getEstado() == EstadoPedido.ENTREGADO) {
            throw new BadRequestException("No se puede modificar un pedido entregado");
        }

        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido cancelar(Long id) {
        Pedido pedido = getById(id);

        if (pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new BadRequestException("El pedido ya esta cancelado");
        }

        if (pedido.getEstado() == EstadoPedido.ENTREGADO) {
            throw new BadRequestException("No se puede cancelar un pedido entregado");
        }

        for (DetallePedido detallePedido : pedido.getDetalle()) {
            Item item = detallePedido.getItem();
            item.setStock(item.getStock() + detallePedido.getCantidad());
        }

        pedido.setEstado(EstadoPedido.CANCELADO);
        return pedidoRepository.save(pedido);
    }

    private void validarItemCarrito(ItemCarrito itemCarrito) {
        if (itemCarrito.getItem() == null) {
            throw new BadRequestException("El carrito contiene un item invalido");
        }

        if (itemCarrito.getCantidad() == null || itemCarrito.getCantidad() <= 0) {
            throw new BadRequestException("La cantidad del item " + itemCarrito.getItem().getId() + " es invalida");
        }

        if (itemCarrito.getItem().getPrecio() == null) {
            throw new BadRequestException(
                    "El item " + itemCarrito.getItem().getId() + " no tiene precio configurado");
        }

        if (itemCarrito.getItem().getStock() == null) {
            throw new BadRequestException(
                    "El item " + itemCarrito.getItem().getId() + " no tiene stock configurado");
        }
    }
}
