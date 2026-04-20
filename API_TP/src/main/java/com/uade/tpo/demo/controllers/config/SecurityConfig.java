package com.uade.tpo.demo.controllers.config;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uade.tpo.demo.api.ApiResponse;
import com.uade.tpo.demo.auth.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final ObjectMapper objectMapper;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, ObjectMapper objectMapper) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.objectMapper = objectMapper;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((request, response, authException) -> writeErrorResponse(
                                                                response,
                                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                                "No autorizado"))
                                                .accessDeniedHandler((request, response, accessDeniedException) -> writeErrorResponse(
                                                                response,
                                                                HttpServletResponse.SC_FORBIDDEN,
                                                                "No tenes permisos para acceder a este recurso")))
                                .authorizeHttpRequests(req -> req
                                                // Recursos tecnicos y utilidades locales
                                                .requestMatchers("/error", "/actuator/**", "/h2-console/**").permitAll()

                                                // Acceso publico para navegar el catalogo sin autenticacion
                                                .requestMatchers(HttpMethod.GET, "/items", "/items/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/categorias", "/categorias/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/items/*/fotos", "/items/*/fotos/**")
                                                .permitAll()

                                                // Acceso publico para registro y login
                                                .requestMatchers(HttpMethod.POST, "/auth/login", "/usuarios").permitAll()

                                                // Solo administradores pueden administrar catalogo y roles
                                                .requestMatchers("/roles/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/usuarios").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/usuarios/email/**", "/usuarios/Email/**",
                                                                "/usuarios/username/**", "/usuarios/Username/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/pedidos").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/categorias/**", "/items/**", "/items/*/fotos")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/categorias/**", "/items/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/categorias/**", "/items/**",
                                                                "/items/*/fotos/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/pedidos/*/estado").hasRole("ADMIN")

                                                // El resto requiere usuario autenticado
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        private void writeErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
                response.setStatus(status);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                objectMapper.writeValue(response.getWriter(), ApiResponse.error(message));
        }
}
