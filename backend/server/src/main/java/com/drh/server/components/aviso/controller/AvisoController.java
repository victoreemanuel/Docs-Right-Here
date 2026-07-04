package com.drh.server.components.aviso.controller;

import com.drh.server.components.aviso.dto.CreateAvisoDTO;
import com.drh.server.components.aviso.dto.ResponseAvisoDTO;
import com.drh.server.components.aviso.dto.UpdateAvisoDTO;
import com.drh.server.components.aviso.service.AvisoService;
import com.nimbusds.jwt.JWT;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AvisoController {

    @Autowired
    private AvisoService avisoService;

    @GetMapping("/avisos")
    public ResponseEntity<List<ResponseAvisoDTO>> listarAvisos(
            @RequestParam(value = "lixeira", required = false) Boolean naLixeira){

        List<ResponseAvisoDTO> response = this.avisoService.listarAvisos(naLixeira);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/aviso")
    public ResponseEntity<ResponseAvisoDTO> criarAviso(
            @Valid @RequestBody CreateAvisoDTO avisoDTO,
            @AuthenticationPrincipal Jwt jwt){

        UUID userId = UUID.fromString(jwt.getSubject());
        ResponseAvisoDTO response = this.avisoService.criarAviso(avisoDTO, userId);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/aviso/{id}")
    public ResponseEntity<ResponseAvisoDTO> deletarAviso(
            @PathVariable("id") Long idAviso,
            @AuthenticationPrincipal Jwt jwt){

        ResponseAvisoDTO response = this.avisoService.deletarAviso(idAviso, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.ok(response);
    }
//
//    @PutMapping("/aviso/visto")
//    public ResponseEntity<ResponseAvisoDTO> marcarComoVisto(@RequestBody UpdateAvisoDTO updateAvisoDTO){
//
//    }
//
    @PutMapping("/aviso/restaurar")
    public ResponseEntity<ResponseAvisoDTO> restaurarAviso(
            @RequestBody UpdateAvisoDTO updateAvisoDTO,
            @AuthenticationPrincipal Jwt jwt){
        ResponseAvisoDTO response = this.avisoService.restaurarAviso(updateAvisoDTO, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.ok(response);

    }

}
