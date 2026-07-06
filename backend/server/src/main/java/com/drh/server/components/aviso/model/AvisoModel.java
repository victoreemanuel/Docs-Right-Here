package com.drh.server.components.aviso.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_avisos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AvisoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título é obrigatório")
    @Size(min = 1, max = 100, message = "O título deve ter entre 1 e 100 caracteres.")
    private String titulo;

    @NotBlank(message = "A descrição é obrigatória")
    @Size(max = 500, message = "A descrição não pode ser maior que 500 caracteres")
    private String descricao;

    @Future(message = "A expiração só pode ser uma data futura")
    private LocalDate exp;

    private AvisoVisibilidade visibilidade;
    private String criadoPor;
    private LocalDate criadoEm;
    private boolean naLixeira;

    public AvisoModel(String titulo, String descricao, LocalDate exp, AvisoVisibilidade visibilidade, String criadoPor, LocalDate criadoEm, boolean naLixeira) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.exp = exp;
        this.visibilidade = visibilidade;
        this.criadoPor = criadoPor;
        this.criadoEm = criadoEm;
        this.naLixeira = naLixeira;
    }
}
