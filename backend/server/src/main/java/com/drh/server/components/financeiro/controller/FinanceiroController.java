package com.drh.server.components.financeiro.controller;

import com.drh.server.components.financeiro.service.FinanceiroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/financeiro")
@CrossOrigin(origins = "http://localhost:4200")
public class FinanceiroController {

    private final FinanceiroService financeiroService;

    public FinanceiroController(FinanceiroService financeiroService) {
        this.financeiroService = financeiroService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> criarCheckout(@RequestBody Map<String, String> payload) {
        String planoId = payload.get("planoId");

        UUID usuarioId = UUID.randomUUID();

        String urlCheckout = financeiroService.iniciarProcessoPagamento(usuarioId, planoId);

        return ResponseEntity.ok(Map.of("urlCheckout", urlCheckout));
    }
}