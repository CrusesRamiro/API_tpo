package com.uade.tpo.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.entity.ItemCarrito;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.exception.BadRequestException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.repository.CarritoRepository;
import com.uade.tpo.demo.repository.ItemRepository;
import com.uade.tpo.demo.repository.UsuarioRepository;

@Service
@Transactional
public class CarritoServiceImpl implements CarritoService {

    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ItemRepository itemRepository;

    public CarritoServiceImpl(CarritoRepository carritoRepository, UsuarioRepository usuarioRepository,
            ItemRepository itemRepository) {
        this.carritoRepository = carritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    public Carrito getCarritoByUsuarioId(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> crearCarritoParaUsuario(usuarioId));
    }

    @Override
    public Carrito agregarItem(Long usuarioId, Long itemId, Integer cantidad) {
        validarCantidad(cantidad);

        Carrito carrito = getCarritoByUsuarioId(usuarioId);
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Item no encontrado con id: " + itemId));

        if (item.getStock() == null || item.getStock() <= 0) {
            throw new BadRequestException("El item no tiene stock disponible");
        }

        carrito.getItems().stream()
                .filter(ic -> ic.getItem().getId().equals(itemId))
                .findFirst()
                .ifPresentOrElse(
                        ic -> {
                            int nuevaCantidad = ic.getCantidad() + cantidad;
                            validarStockDisponible(item, nuevaCantidad);
                            ic.setCantidad(nuevaCantidad);
                        },
                        () -> carrito.getItems().add(ItemCarrito.builder()
                                .carrito(carrito)
                                .item(item)
                                .cantidad(cantidad)
                                .build()));

        validarStockDisponible(item, carrito.getItems().stream()
                .filter(ic -> ic.getItem().getId().equals(itemId))
                .findFirst()
                .map(ItemCarrito::getCantidad)
                .orElse(cantidad));

        return carritoRepository.save(carrito);
    }

    @Override
    public Carrito actualizarCantidad(Long usuarioId, Long itemId, Integer cantidad) {
        Carrito carrito = getCarritoByUsuarioId(usuarioId);
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Item no encontrado con id: " + itemId));

        ItemCarrito itemCarrito = carrito.getItems().stream()
                .filter(ic -> ic.getItem().getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Item no encontrado en el carrito"));

        if (cantidad <= 0) {
            carrito.getItems().remove(itemCarrito);
        } else {
            validarStockDisponible(item, cantidad);
            itemCarrito.setCantidad(cantidad);
        }

        return carritoRepository.save(carrito);
    }

    @Override
    public Carrito eliminarItem(Long usuarioId, Long itemId) {
        Carrito carrito = getCarritoByUsuarioId(usuarioId);
        boolean removed = carrito.getItems().removeIf(ic -> ic.getItem().getId().equals(itemId));

        if (!removed) {
            throw new NotFoundException("Item no encontrado en el carrito");
        }

        return carritoRepository.save(carrito);
    }

    @Override
    public Carrito vaciarCarrito(Long usuarioId) {
        Carrito carrito = getCarritoByUsuarioId(usuarioId);
        carrito.getItems().clear();
        return carritoRepository.save(carrito);
    }

    @Override
    public double calcularTotal(Long usuarioId) {
        Carrito carrito = getCarritoByUsuarioId(usuarioId);

        return carrito.getItems().stream()
                .mapToDouble(ic -> ic.getItem().getPrecio() * ic.getCantidad())
                .sum();
    }

    private Carrito crearCarritoParaUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con id: " + usuarioId));
        return carritoRepository.save(Carrito.builder().usuario(usuario).build());
    }

    private void validarCantidad(Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new BadRequestException("La cantidad debe ser mayor a cero");
        }
    }

    private void validarStockDisponible(Item item, Integer cantidad) {
        if (item.getStock() == null) {
            throw new BadRequestException("El item no tiene stock configurado");
        }

        if (cantidad > item.getStock()) {
            throw new BadRequestException(
                    "Stock insuficiente para el item " + item.getId() + ". Disponible: " + item.getStock());
        }
    }
}
