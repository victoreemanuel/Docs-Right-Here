package com.drh.server.components.mural.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb_avisos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aviso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String criador;
    private String cargo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String data;
    private LocalDate dataValidade;
    private String visibilidade;
    private boolean visualizado;
}