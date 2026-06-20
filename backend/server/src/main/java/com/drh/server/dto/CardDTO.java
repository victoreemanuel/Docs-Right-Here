package com.drh.server.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CardDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private String icone;
    private String cor;

}