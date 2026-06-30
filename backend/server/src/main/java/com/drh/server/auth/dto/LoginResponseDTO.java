package com.drh.server.auth.dto;

public record LoginResponseDTO(
        String accesToken,
        Long expiresIn,
        String role
) {}