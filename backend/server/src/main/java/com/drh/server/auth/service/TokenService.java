package com.drh.server.auth.service;

import com.drh.server.auth.dto.LoginRequestDTO;
import com.drh.server.auth.dto.LoginResponseDTO;
import com.drh.server.auth.model.RoleModel;
import com.drh.server.auth.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
public class TokenService {
    private final JwtEncoder jwtEncoder;
    private final UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    public TokenService(
            JwtEncoder jwtEncoder,
            UserRepository userRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.jwtEncoder = jwtEncoder;
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public LoginResponseDTO createToken(LoginRequestDTO loginRequestDTO){

        var user = userRepository.findByUsername(loginRequestDTO.username());
        if (user.isEmpty() || !user.get().isLoginCorrect(loginRequestDTO, bCryptPasswordEncoder)){
            throw  new BadCredentialsException("usuário ou senha invalida");
        }

        var scopes = user.get().getRoles()
                .stream()
                .map(RoleModel::getName)
                .collect(Collectors.joining(" "));

        var now = Instant.now();
        var oneHourInSeconds = 3600L;
        var claims = JwtClaimsSet.builder()
                .issuer("DocsRightHereAuth")
                .subject(user.get().getUserId().toString())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(oneHourInSeconds))
                .claim("scope", scopes)
                .build();

        var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        return new LoginResponseDTO(jwtValue, oneHourInSeconds);

    }
}
