package com.drh.server.components.card.dto;

import com.drh.server.components.card.model.Card;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class CardDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private String icone;
    private String cor;

    public CardDTO(Card entity) {
        this.id = entity.getId();
        this.titulo = entity.getTitulo();
        this.descricao = entity.getDescricao();
        this.icone = entity.getIcone();
        this.cor = entity.getCor();
    }
}