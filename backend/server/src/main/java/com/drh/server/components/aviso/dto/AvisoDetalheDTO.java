package com.drh.server.components.aviso.dto;

import com.drh.server.components.aviso.model.AvisoModel;
import com.drh.server.components.aviso.model.AvisoVisibilidade;

import java.time.format.DateTimeFormatter;

public record AvisoDetalheDTO(
        Long id,
        String horario,
        String titulo,
        String descricao,
        AvisoVisibilidade visibilidade
) {
    public static AvisoDetalheDTO of(AvisoModel avisoModel){
        DateTimeFormatter formatodorHora = DateTimeFormatter.ofPattern("HH:mm");

        return new AvisoDetalheDTO(
                avisoModel.getId(),
                avisoModel.getDataHoraEvento().format(formatodorHora),
                avisoModel.getDescricao(),
                avisoModel.getTitulo(),
                avisoModel.getVisibilidade()
        );
    }
}
