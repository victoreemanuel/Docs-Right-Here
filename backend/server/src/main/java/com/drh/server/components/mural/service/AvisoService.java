package com.drh.server.components.mural.service;


import com.drh.server.components.mural.dto.AvisoResponseDTO;
import com.drh.server.components.mural.model.Aviso;
import com.drh.server.components.mural.repository.AvisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository repository;

    public List<AvisoResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(AvisoResponseDTO::new) // Usa o construtor do record
                .collect(Collectors.toList());
    }

    public AvisoResponseDTO salvar(AvisoResponseDTO dto) {
        Aviso aviso = new Aviso();
        aviso.setTitulo(dto.titulo());
        aviso.setCriador(dto.criador());
        aviso.setCargo(dto.cargo());
        aviso.setDescricao(dto.descricao());
        aviso.setData(dto.data());
        aviso.setDataValidade(dto.dataValidade());
        aviso.setVisibilidade(dto.visibilidade());
        aviso.setVisualizado(dto.visualizado());

        Aviso avisoSalvo = repository.save(aviso);
        return new AvisoResponseDTO(avisoSalvo);
    }


    public void deletar(String id) {
        Long idBanco = Long.parseLong(id);
        repository.deleteById(idBanco);
    }
}