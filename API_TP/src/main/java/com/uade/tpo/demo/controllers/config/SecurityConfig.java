package com.uade.tpo.demo.controllers.config;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.uade.tpo.demo.auth.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(ex -> ex.authenticationEntryPoint(
                                                (request, response, authException) -> response.sendError(
                                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                                "No autorizado")))
                                .authorizeHttpRequests(req -> req
                                                // Públicos
                                                .requestMatchers("/error", "/actuator/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/auth/login", "/usuarios").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/items/**", "/categorias/**", "/items/*/fotos").permitAll()
                                                // Flujo de compras (USER y ADMIN)
                                                .requestMatchers("/carrito/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/pedidos/checkout/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/pedidos/usuario/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                                // Solo ADMIN
                                                .requestMatchers(HttpMethod.POST, "/items/**", "/categorias/**").hasAuthority("ROLE_ADMIN")
                                                .requestMatchers("/usuarios/**").hasAuthority("ROLE_ADMIN")
                                                .requestMatchers("/roles/**").hasAuthority("ROLE_ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/pedidos", "/pedidos/{id}").hasAuthority("ROLE_ADMIN")
                                                .anyRequest().hasAuthority("ROLE_ADMIN"))
                                .addFilterBefore(jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
