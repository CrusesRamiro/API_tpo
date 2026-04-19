package com.uade.tpo.demo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uade.tpo.demo.entity.Rol;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.exception.ConflictException;
import com.uade.tpo.demo.repository.PedidoRepository;
import com.uade.tpo.demo.repository.RolRepository;
import com.uade.tpo.demo.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PedidoRepository pedidoRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    @Test
    void create_shouldUseDefaultClientRoleWhenRoleIdIsNull() {
        Rol rolCliente = Rol.builder().id(2L).nombre("ROLE_CLIENTE").build();

        when(usuarioRepository.findByUsername("ramiro")).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail("ramiro@mail.com")).thenReturn(Optional.empty());
        when(rolRepository.findByNombre("ROLE_CLIENTE")).thenReturn(Optional.of(rolCliente));
        when(passwordEncoder.encode("secreta123")).thenReturn("hash-123");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(1L);
            return usuario;
        });

        Usuario usuario = usuarioService.create("ramiro", "secreta123", "Ramiro", "Perez", "ramiro@mail.com", null);

        assertThat(usuario.getId()).isEqualTo(1L);
        assertThat(usuario.getRol().getNombre()).isEqualTo("ROLE_CLIENTE");
        assertThat(usuario.getPassword()).isEqualTo("hash-123");
    }

    @Test
    void create_shouldFailWhenUsernameAlreadyExists() {
        when(usuarioRepository.findByUsername("ramiro")).thenReturn(Optional.of(Usuario.builder().id(1L).build()));

        assertThatThrownBy(
                () -> usuarioService.create("ramiro", "secreta123", "Ramiro", "Perez", "ramiro@mail.com", null))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("username");
    }
}
