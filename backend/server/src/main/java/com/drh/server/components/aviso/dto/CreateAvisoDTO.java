package com.drh.server.components.aviso.dto;

import com.drh.server.components.aviso.model.AvisoVisibilidade;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateAvisoDTO(
        @NotBlank(message = "O título é obrigatório")
        @Size(min = 1, max = 100, message = "O título deve ter entre 1 e 100 caracteres.")
        String titulo,

        @NotBlank(message = "A descrição é obrigatória")
        @Size(max = 500, message = "A descrição não pode ser maior que 500 caracteres")
        String descricao,

        @Future(message = "A expiração só pode ser uma data futura")
        LocalDate exp,
        AvisoVisibilidade visibilidade
) {
}
