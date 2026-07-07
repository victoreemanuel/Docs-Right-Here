package com.drh.server.infrastructure.payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class AbacatePayClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${abacatepay.api.key}")
    private String apiKey;

    @Value("${abacatepay.api.url}")
    private String apiUrl;

    public Map<String, Object> criarPixCobranca(String planoId, double valor, String emailUsuario) {
        if (this.apiUrl == null || this.apiUrl.trim().isEmpty()) {
            throw new IllegalStateException("A propriedade 'abacatepay.api.url' não foi injetada.");
        }

        if (this.apiKey == null || this.apiKey.trim().isEmpty()) {
            throw new IllegalStateException("A propriedade 'abacatepay.api.key' não foi injetada.");
        }

        String url = this.apiUrl.trim() + "/billing/create";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + this.apiKey.trim());

        String nomePlano = planoId.equals("intermediario")
                ? "Plano Intermediário - DocsRightHere"
                : "Plano Profissional - DocsRightHere";

        Map<String, Object> product = new HashMap<>();
        product.put("externalId", planoId);
        product.put("name", nomePlano);
        product.put("description", "Assinatura anual do " + nomePlano);
        product.put("quantity", 1);
        product.put("price", (int) Math.round(valor * 100));

        Map<String, Object> customer = new HashMap<>();
        customer.put("email", emailUsuario);
        customer.put("name", "Cliente DocsRightHere");
        customer.put("cellphone", "11999999999");
        customer.put("taxId", "11144477735");

        Map<String, Object> body = new HashMap<>();
        body.put("frequency", "ONE_TIME");
        body.put("methods", new String[]{"PIX"});
        body.put("products", new Object[]{product});
        body.put("returnUrl", "http://localhost:4200/home/financeiro");
        body.put("completionUrl", "http://localhost:4200/home/financeiro?sucesso=true");
        body.put("customer", customer);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getBody() == null) {
                throw new RuntimeException("O Abacate Pay retornou um corpo vazio.");
            }

            return (Map<String, Object>) response.getBody();
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("======= FALHA CRÍTICA NO GATEWAY =======");
            System.err.println("Status retornado: " + e.getStatusCode());
            System.err.println("Corpo do Erro Oficial: " + e.getResponseBodyAsString());
            System.err.println("========================================");
            throw new RuntimeException("Erro de validação no Abacate Pay: " + e.getResponseBodyAsString());
        }
    }
}