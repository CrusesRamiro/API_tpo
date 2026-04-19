package com.uade.tpo.demo.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.entity.FotoProducto;
import com.uade.tpo.demo.entity.Item;
import com.uade.tpo.demo.exception.BadRequestException;
import com.uade.tpo.demo.exception.NotFoundException;
import com.uade.tpo.demo.repository.FotoProductoRepository;
import com.uade.tpo.demo.repository.ItemRepository;

@Service
@Transactional
public class FotoProductoServiceImpl implements FotoProductoService {

    private final FotoProductoRepository fotoProductoRepository;
    private final ItemRepository itemRepository;

    public FotoProductoServiceImpl(FotoProductoRepository fotoProductoRepository, ItemRepository itemRepository) {
        this.fotoProductoRepository = fotoProductoRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    public FotoProducto agregarFoto(Long itemId, MultipartFile archivo) throws IOException {
        Item item = getItem(itemId);

        if (archivo == null || archivo.isEmpty()) {
            throw new BadRequestException("El archivo de imagen es obligatorio");
        }

        FotoProducto foto = FotoProducto.builder()
                .item(item)
                .imagen(archivo.getBytes())
                .build();

        return fotoProductoRepository.save(foto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FotoProducto> getFotosByItem(Long itemId) {
        getItem(itemId);
        return fotoProductoRepository.findByItemId(itemId);
    }

    @Override
    public void eliminarFoto(Long itemId, Long fotoId) {
        getItem(itemId);

        FotoProducto fotoProducto = fotoProductoRepository.findByIdAndItemId(fotoId, itemId)
                .orElseThrow(() -> new NotFoundException("Foto no encontrada con id: " + fotoId));

        fotoProductoRepository.delete(fotoProducto);
    }

    private Item getItem(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Item no encontrado con id: " + itemId));
    }
}
