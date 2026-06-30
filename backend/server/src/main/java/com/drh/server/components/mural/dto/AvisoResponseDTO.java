package com.drh.server.components.mural.dto;

import com.drh.server.components.mural.model.Aviso;

import java.time.LocalDate;

public record AvisoResponseDTO(
        String id,
        String titulo,
        String criador,
        String cargo,
        String descricao,
        String data,
        LocalDate dataValidade,
        String visibilidade,
        boolean visualizado
) {

    public AvisoResponseDTO(Aviso aviso) {
        this(
                aviso.getId().toString(),
                aviso.getTitulo(),
                aviso.getCriador(),
                aviso.getCargo(),
                aviso.getDescricao(),
                aviso.getData(),
                aviso.getDataValidade(),
                aviso.getVisibilidade(),
                aviso.isVisualizado()
        );
    }
}