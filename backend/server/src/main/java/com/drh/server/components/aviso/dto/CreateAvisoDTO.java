package com.drh.server.components.aviso.dto;

import com.drh.server.components.aviso.model.AvisoVisibilidade;

import java.time.LocalDate;

public record CreateAvisoDTO(
        String titulo,
        String desc,
        LocalDate exp,
        AvisoVisibilidade visibilidade
) {
}
