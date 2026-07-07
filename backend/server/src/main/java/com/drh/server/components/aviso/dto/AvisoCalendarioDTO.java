package com.drh.server.components.aviso.dto;

import com.drh.server.components.aviso.model.AvisoVisibilidade;

import java.time.LocalDate;
import java.util.List;

public record AvisoCalendarioDTO(
        LocalDate date,
        List<AvisoVisibilidade> visibilidades
) {
}
