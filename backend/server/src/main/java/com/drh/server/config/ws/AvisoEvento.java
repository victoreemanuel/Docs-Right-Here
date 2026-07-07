package com.drh.server.config.ws;

import com.drh.server.components.aviso.dto.ResponseAvisoDTO;

public record AvisoEvento(TipoEvento tipo, Long avisoId, ResponseAvisoDTO aviso) {

    public enum TipoEvento{
        CRIADO,
        MOVIDO_PARA_LIXEIRA,
        RESTAURADO,
        EXCLUIDO
    }

    public static AvisoEvento manter(TipoEvento tipo, Long avisoId){
        return new AvisoEvento(tipo, avisoId, null);
    }

    public static AvisoEvento criado(ResponseAvisoDTO aviso){
        return new AvisoEvento(TipoEvento.CRIADO, aviso.id(), aviso);
    }
}
