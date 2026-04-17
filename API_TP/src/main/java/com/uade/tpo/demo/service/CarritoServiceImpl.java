package com.uade.tpo.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.entity.ItemCarrito;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.repository.CarritoRepository;
import com.uade.tpo.demo.repository.ItemRepository;
import com.uade.tpo.demo.repository.UsuarioRepository;

@Service
public class CarritoServiceImpl implements CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Override
    public Carrito getCarritoByUsuarioId(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> crearCarritoParaUsuario(usuarioId));
    }

    @Override
    public Carrito agregarItem(Long usuarioId, Long itemId, Integer cantidad) {
        Carrito carrito = getCarritoByUsuarioId(usuarioId);
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado: " + itemId));

        carrito.getItems().stream()
                .filter(ic -> ic.getItem().getId().equals(itemId))
                .findFirst()
                .ifPresentOrElse(
                        ic -> ic.setCantidad(ic.getCantidad() + cantidad),
                        () -> carrito.getItems().add(ItemCarrito.builder()
                                .carrito(carrito)
                                .item(item)
                                .cantidad(cantidad)
                                .build()));

        return carritoRepository.save(carrito);
    }

    @Override
    public Carrito actualizarCantidad(Long usuarioId, Long itemId, Integer cantidad) {
        //No tiene sentido, no deberia tener llamadas, a no ser que hardcodees la llamada api.
        //Si lo haces desde el front, es imposible, Porque siempre estas viendo el carrito.
        Carrito carrito = getCarritoByUsuarioId(usuarioId);

        ItemCarrito itemCarrito = carrito.getItems().stream()
                .filter(ic -> ic.getItem().getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item no encontrado en el carrito"));

        if (cantidad <= 0) {
            carrito.getItems().remove(itemCarrito);
        } else {
            itemCarrito.setCantidad(cantidad);
        }

        return carritoRepository.save(carrito);
    }

    @Override
    public void eliminarItem(Long usuarioId, Long itemId) {
        //No tiene sentido, no deberia tener llamadas, a no ser que hardcodees la llamada api.
        //Si lo haces desde el front, es imposible, Porque siempre estas viendo el carrito.
        Carrito carrito = getCarritoByUsuarioId(usuarioId);
        
        carrito.getItems().removeIf(ic -> ic.getItem().getId().equals(itemId));
        carritoRepository.save(carrito);
    }

    @Override
    public void vaciarCarrito(Long usuarioId) {
        //No tiene sentido, no deberia tener llamadas, a no ser que hardcodees la llamada api.
        //Si lo haces desde el front, es imposible, Porque siempre estas viendo el carrito.
        Carrito carrito = getCarritoByUsuarioId(usuarioId);
        
        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }

    @Override
    public double calcularTotal(Long usuarioId) {
        //No tiene sentido, no deberia tener llamadas, a no ser que hardcodees la llamada api.
        //Si lo haces desde el front, es imposible, Porque siempre estas viendo el carrito.
        Carrito carrito = getCarritoByUsuarioId(usuarioId);
        
        return carrito.getItems().stream()
                .mapToDouble(ic -> ic.getItem().getPrecio() * ic.getCantidad())
                .sum();
    }

    private Carrito crearCarritoParaUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + usuarioId));
        return carritoRepository.save(Carrito.builder().usuario(usuario).build());
    }
}
