package com.drh.server.auth.controller;

import com.drh.server.auth.dto.LoginRequestDTO;
import com.drh.server.auth.dto.LoginResponseDTO;
import com.drh.server.auth.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class TokenController {

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO){

        LoginResponseDTO responseDTO = tokenService.createToken(loginRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

}
