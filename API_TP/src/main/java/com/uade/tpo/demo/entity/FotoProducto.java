package com.uade.tpo.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fotos_producto")
public class FotoProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "imagen64bits", nullable = false, columnDefinition = "text")
    private String imagen;

    // Columna legacy del schema actual. Ya no la usamos para leer/escribir imágenes,
    // pero la mantenemos para satisfacer la restricción NOT NULL existente en la base.
    @JsonIgnore
    @Column(name = "imagen", nullable = false)
    private Long imagenLegacyOid;
}
