package com.drh.server.card.dto;

import com.drh.server.card.model.CardArquivo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CardArquivoDTO {
    private String nome;
    private String tipo;
    private String url;

    public CardArquivoDTO(CardArquivo entity) {
        this.nome = entity.getNome();
        this.tipo = entity.getTipo();
        this.url = entity.getUrl();
    }
}