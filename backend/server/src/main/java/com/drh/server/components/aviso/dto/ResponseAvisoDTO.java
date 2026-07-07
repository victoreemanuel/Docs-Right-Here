package com.drh.server.components.aviso.dto;

import com.drh.server.components.aviso.model.AvisoModel;
import com.drh.server.components.aviso.model.AvisoVisibilidade;

import java.time.LocalDate;

public record ResponseAvisoDTO(
        Long id,
        String titulo,
        String descricao,
        LocalDate exp,
        boolean visualizado,
        AvisoVisibilidade visibilidade,
        String nome_criador,
        boolean na_lixeira
) {
    public static ResponseAvisoDTO of(AvisoModel avisoModel){
        return new ResponseAvisoDTO(
                avisoModel.getId(),
                avisoModel.getTitulo(),
                avisoModel.getDescricao(),
                avisoModel.getExp(),
                false,
                avisoModel.getVisibilidade(),
                avisoModel.getCriadoPor(),
                avisoModel.isNaLixeira()
        );
    }
}
