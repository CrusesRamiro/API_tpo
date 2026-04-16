package com.uade.tpo.demo.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.entity.FotoProducto;

public interface FotoProductoService {
    FotoProducto agregarFoto(Long itemId, MultipartFile archivo) throws IOException;
    List<FotoProducto> getFotosByItem(Long itemId);
}
