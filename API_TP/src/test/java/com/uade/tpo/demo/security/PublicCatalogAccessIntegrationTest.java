package com.uade.tpo.demo.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PublicCatalogAccessIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void deberiaPermitirConsultarItemsSinAutenticacion() throws Exception {
        mockMvc.perform(get("/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void deberiaPermitirConsultarCategoriasSinAutenticacion() throws Exception {
        mockMvc.perform(get("/categorias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void deberiaPermitirCrearUsuarioSinAutenticacion() throws Exception {
        String suffix = String.valueOf(System.nanoTime());
        String body = """
                {
                  "username": "visitante_%s",
                  "password": "cliente123",
                  "email": "visitante_%s@test.com",
                  "nombre": "Visitante",
                  "apellido": "Publico"
                }
                """.formatted(suffix, suffix);

        mockMvc.perform(post("/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("visitante_" + suffix));
    }

    @Test
    void deberiaRechazarCrearItemSinAutenticacion() throws Exception {
        String body = """
                {
                  "nombre": "Item privado",
                  "descripcion": "No deberia crearse sin login",
                  "precio": 1000,
                  "stock": 5,
                  "categoriaId": 1
                }
                """;

        mockMvc.perform(post("/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("No autorizado"));
    }
}
