package com.drh.server.card.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descricao;
    private String icone;
    private String cor;

    private boolean excluido = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tb_card_arquivos", joinColumns = @JoinColumn(name = "card_id"))
    private List<CardArquivo> arquivos = new ArrayList<>();
}