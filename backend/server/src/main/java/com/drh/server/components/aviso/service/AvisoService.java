package com.drh.server.components.aviso.service;

import com.drh.server.auth.repository.UserRepository;
import com.drh.server.auth.service.UserService;
import com.drh.server.components.aviso.dto.CreateAvisoDTO;
import com.drh.server.components.aviso.dto.ResponseAvisoDTO;
import com.drh.server.components.aviso.model.AvisoModel;
import com.drh.server.components.aviso.repository.AvisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository avisoRepository;
    @Autowired
    private UserRepository userRepository;

    public List<AvisoModel> listarAvisos(Boolean naLixeira){
        if (naLixeira != null) {
            return this.avisoRepository.findByNaLixeira(naLixeira);
        }
        return this.avisoRepository.findByNaLixeira(false);
    }

    public ResponseAvisoDTO criarAviso(CreateAvisoDTO avisoDTO, UUID idUser){
        String username = this.userRepository.findById(idUser).get().getEmail();

        AvisoModel newAviso = new AvisoModel(
                avisoDTO.titulo(),
                avisoDTO.descricao(),
                avisoDTO.exp(),
                avisoDTO.visibilidade(),
                username,
                LocalDate.now(),
                false
        );

        AvisoModel saved = this.avisoRepository.save(newAviso);
        return ResponseAvisoDTO.of(saved);
    }

}
