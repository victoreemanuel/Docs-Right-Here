package com.drh.server.components.financeiro.service;

import com.drh.server.components.financeiro.Enum.StatusPagamento;
import com.drh.server.components.financeiro.model.TransacaoPagamento;
import com.drh.server.components.financeiro.repository.TransacaoRepository;
import com.drh.server.infrastructure.payment.AbacatePayClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class FinanceiroService {

    private final TransacaoRepository repository;
    private final AbacatePayClient abacatePayClient;

    public FinanceiroService(TransacaoRepository repository, AbacatePayClient abacatePayClient) {
        this.repository = repository;
        this.abacatePayClient = abacatePayClient;
    }

    public String iniciarProcessoPagamento(UUID usuarioId, String planoId) {
        double valor = planoId.equals("intermediario") ? 1048.00 : 2008.00;

        Map<String, Object> respostaGateway = abacatePayClient.criarPixCobranca(planoId, valor, "usuario@email.com");
        System.out.println("RESPOSTA COMPLETA GATEWAY: " + respostaGateway);

        String billingId = null;
        String urlCheckout = null;

        if (respostaGateway != null && respostaGateway.containsKey("data")) {
            Map<String, Object> dataNode = (Map<String, Object>) respostaGateway.get("data");
            if (dataNode != null) {
                billingId = dataNode.get("id") != null ? dataNode.get("id").toString() : null;
                urlCheckout = dataNode.get("url") != null ? dataNode.get("url").toString() : null;
            }
        }

        if (billingId == null || urlCheckout == null) {
            throw new RuntimeException("Falha crítica: O gateway não retornou a URL do checkout.");
        }

        TransacaoPagamento transacao = new TransacaoPagamento();
        transacao.setUsuarioId(usuarioId);
        transacao.setPlanoId(planoId);
        transacao.setValor(BigDecimal.valueOf(valor));
        transacao.setGatewayBillingId(billingId);
        transacao.setStatus(StatusPagamento.PENDENTE);
        transacao.setDataCriacao(LocalDateTime.now());

        repository.save(transacao);

        return urlCheckout;
    }
}