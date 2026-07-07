package com.drh.server.card.dto;

import com.drh.server.card.model.Card;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class CardDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String icone;
    private String cor;
    private boolean excluido;

    private List<CardArquivoDTO> arquivos = new ArrayList<>();

    public CardDTO(Card entity) {
        this.id = entity.getId();
        this.titulo = entity.getTitulo();
        this.descricao = entity.getDescricao();
        this.icone = entity.getIcone();
        this.cor = entity.getCor();
        this.excluido = entity.isExcluido();

        if (entity.getArquivos() != null) {
            this.arquivos = entity.getArquivos().stream()
                    .map(CardArquivoDTO::new)
                    .collect(Collectors.toList());
        }
    }
}