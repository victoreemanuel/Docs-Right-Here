package com.drh.server.components.aviso.dto;

import com.drh.server.components.aviso.model.AvisoVisibilidade;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.UUID;

public record RequestAvisoDTO(
        Long id,
        String titulo,
        String desc,
        LocalDate exp,
        boolean visualizado,
        AvisoVisibilidade visibilidade,
        String nome_criador,
        boolean na_lixeira
) {
}
