package com.uade.tpo.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.DetallePedido;
import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.entity.ItemCarrito;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.repository.CarritoRepository;
import com.uade.tpo.demo.repository.PedidoRepository;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Override
    public List<Pedido> getAll() {
        return pedidoRepository.findAll();
    }

    @Override
    public Optional<Pedido> getById(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public List<Pedido> getByUsuarioId(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public Pedido crearDesdeCarrito(Long usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado para el usuario: " + usuarioId));

        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new RuntimeException("No se puede generar un pedido con el carrito vacio");
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
                throw new RuntimeException(
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

    private void validarItemCarrito(ItemCarrito itemCarrito) {
        if (itemCarrito.getItem() == null) {
            throw new RuntimeException("El carrito contiene un item invalido");
        }

        if (itemCarrito.getCantidad() == null || itemCarrito.getCantidad() <= 0) {
            throw new RuntimeException("La cantidad del item " + itemCarrito.getItem().getId() + " es invalida");
        }

        if (itemCarrito.getItem().getPrecio() == null) {
            throw new RuntimeException("El item " + itemCarrito.getItem().getId() + " no tiene precio configurado");
        }

        if (itemCarrito.getItem().getStock() == null) {
            throw new RuntimeException("El item " + itemCarrito.getItem().getId() + " no tiene stock configurado");
        }
    }
}
