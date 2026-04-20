package com.uade.tpo.demo.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.uade.tpo.demo.entity.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    public String generateToken(Usuario usuario) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + jwtExpirationMs);

        String rol = usuario.getRol() != null ? usuario.getRol().getNombre() : "ROLE_USER";

        return Jwts.builder()
                .subject(usuario.getUsername())
                .claim("userId", usuario.getId())
                .claim("rol", rol)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claimsResolver.apply(claims);
    }

    private SecretKey getSigningKey() {
        if (!StringUtils.hasText(jwtSecret)) {
            throw new IllegalStateException("La configuracion jwt.secret es obligatoria");
        }

        byte[] keyBytes = decodeSecret(jwtSecret);

        try {
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException(
                    "La configuracion jwt.secret no tiene un formato o longitud validos para firmar tokens",
                    ex);
        }
    }

    private byte[] decodeSecret(String secret) {
        try {
            return Decoders.BASE64.decode(secret);
        } catch (DecodingException ex) {
            log.warn("jwt.secret no es Base64 valido; se usara como texto plano UTF-8");
            return secret.getBytes(StandardCharsets.UTF_8);
        }
    }
}
