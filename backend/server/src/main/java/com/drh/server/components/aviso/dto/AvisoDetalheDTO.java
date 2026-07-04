package com.drh.server.components.aviso.dto;

import com.drh.server.components.aviso.model.AvisoVisibilidade;

public record AvisoDetalheDTO(
        Long id,
        String horario,
        String titulo,
        String descricao,
        AvisoVisibilidade visibilidade
) {
}
