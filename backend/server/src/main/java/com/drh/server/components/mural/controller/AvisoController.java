package com.drh.server.components.mural.controller;

import com.drh.server.components.mural.dto.AvisoResponseDTO;
import com.drh.server.components.mural.service.AvisoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avisos")
@CrossOrigin(origins = "http://localhost:4200")
public class AvisoController {

    @Autowired
    private AvisoService service;

    @GetMapping
    public ResponseEntity<List<AvisoResponseDTO>> listar() {
        List<AvisoResponseDTO> lista = service.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<AvisoResponseDTO> criar(@RequestBody AvisoResponseDTO dto) {
        AvisoResponseDTO novoAviso = service.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAviso);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}