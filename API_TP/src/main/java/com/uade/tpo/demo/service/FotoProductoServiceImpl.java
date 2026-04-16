package com.uade.tpo.demo.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.entity.FotoProducto;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.repository.FotoProductoRepository;
import com.uade.tpo.demo.repository.ItemRepository;

@Service
public class FotoProductoServiceImpl implements FotoProductoService {

    @Autowired
    private FotoProductoRepository fotoProductoRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Override
    public FotoProducto agregarFoto(Long itemId, MultipartFile archivo) throws IOException {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con id: " + itemId));

        FotoProducto foto = FotoProducto.builder()
                .item(item)
                .imagen(archivo.getBytes())
                .build();

        return fotoProductoRepository.save(foto);
    }

    @Override
    public List<FotoProducto> getFotosByItem(Long itemId) {
        return fotoProductoRepository.findByItemId(itemId);
    }
}
