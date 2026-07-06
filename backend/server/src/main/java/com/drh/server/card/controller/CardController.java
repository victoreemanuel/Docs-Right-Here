package com.drh.server.card.controller;

import com.drh.server.card.dto.CardDTO;
import com.drh.server.card.Service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/cards")
public class CardController {

    @Autowired
    private CardService service;

    @GetMapping
    public ResponseEntity<List<CardDTO>> findAll() {
        List<CardDTO> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/excluidos")
    public ResponseEntity<List<CardDTO>> findExcluidos() {
        List<CardDTO> list = service.findExcluidos();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<CardDTO> findById(@PathVariable Long id) {
        CardDTO dto = service.findById(id);
        return ResponseEntity.ok().body(dto);
    }

    @PostMapping
    public ResponseEntity<CardDTO> insert(@RequestBody CardDTO dto) {
        dto = service.insert(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<CardDTO> update(@PathVariable Long id, @RequestBody CardDTO dto) {
        dto = service.update(id, dto);
        return ResponseEntity.ok().body(dto);
    }

    @PutMapping(value = "/{id}/lixeira")
    public ResponseEntity<Void> moverParaLixeira(@PathVariable Long id) {
        service.moverParaLixeira(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/{id}/restaurar")
    public ResponseEntity<Void> restaurar(@PathVariable Long id) {
        service.restaurar(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/arquivos")
    public ResponseEntity<CardDTO> anexarArquivo(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {

        CardDTO dto = service.anexarArquivo(id, file);
        return ResponseEntity.ok().body(dto);
    }

}