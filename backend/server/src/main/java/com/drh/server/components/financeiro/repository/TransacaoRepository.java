package com.drh.server.components.financeiro.repository;

import com.drh.server.components.financeiro.model.TransacaoPagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransacaoRepository extends JpaRepository <TransacaoPagamento, Long> {
    Optional<TransacaoPagamento> findByGatewayBillingId(String gatewayBillingId);

    Optional<TransacaoPagamento> findFirstByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);
}
