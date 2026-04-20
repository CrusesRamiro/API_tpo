package com.uade.tpo.demo.controllers.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uade.tpo.demo.entity.Rol;
import com.uade.tpo.demo.entity.Usuario;
import com.uade.tpo.demo.repository.RolRepository;
import com.uade.tpo.demo.repository.UsuarioRepository;

@Configuration
public class ApplicationConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner seedInitialData(RolRepository rolRepository, UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            Rol rolAdmin = rolRepository.findByNombre("ROLE_ADMIN")
                    .orElseGet(() -> rolRepository.save(Rol.builder().nombre("ROLE_ADMIN").build()));

            rolRepository.findByNombre("ROLE_CLIENTE")
                    .orElseGet(() -> rolRepository.save(Rol.builder().nombre("ROLE_CLIENTE").build()));

            usuarioRepository.findByUsername("admin").orElseGet(() -> usuarioRepository.save(Usuario.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@local.dev")
                    .nombre("Admin")
                    .apellido("Local")
                    .rol(rolAdmin)
                    .build()));
        };
    }
}
