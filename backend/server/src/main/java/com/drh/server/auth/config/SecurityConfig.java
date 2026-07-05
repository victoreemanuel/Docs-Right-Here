package com.drh.server.auth.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Value("${JWT_PUBLIC_KEY}")
    private RSAPublicKey rsaPublicKey;
    @Value("${JWT_PRIVATE_KEY}")
    private RSAPrivateKey rsaPrivateKey;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;
    @Value("${cors.allowed-methods}")
    private String allowedMethods;
    @Value("${cors.allowed-headers}")
    private String allowedHeaders;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity,
            CorsConfigurationSource corsConfigurationSource) throws Exception {
        httpSecurity.authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/users").permitAll()
                        .requestMatchers(HttpMethod.GET, "/auth/users").hasAuthority("SCOPE_admin")
                        .requestMatchers("/ws/**").permitAll()
                        .anyRequest().authenticated())
                .csrf( csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .oauth2ResourceServer(auth -> auth.jwt(Customizer.withDefaults()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return httpSecurity.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {return NimbusJwtDecoder.withPublicKey(rsaPublicKey).build();}

    @Bean
    public JwtEncoder jwtEncoder(){
        JWK jwk = new RSAKey.Builder(this.rsaPublicKey).privateKey(rsaPrivateKey).build();

        var jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){return new BCryptPasswordEncoder();}

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration cors = new CorsConfiguration();

        cors.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        cors.setAllowedMethods(List.of(allowedMethods.split(",")));
        cors.setAllowedHeaders(List.of(allowedHeaders.split(",")));
        cors.setAllowCredentials(true);
        cors.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }

}
