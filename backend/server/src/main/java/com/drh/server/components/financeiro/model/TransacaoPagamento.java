package com.drh.server.components.financeiro.model;

import com.drh.server.components.financeiro.Enum.StatusPagamento;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_transacoes_pagamento")
@Data
public class TransacaoPagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID usuarioId;

    private String planoId;

    private BigDecimal valor;

    @Column(name = "gateway_billing_id")
    private String gatewayBillingId;

    @Enumerated(EnumType.STRING)
    private StatusPagamento status;

    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}