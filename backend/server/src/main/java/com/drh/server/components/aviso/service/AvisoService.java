package com.drh.server.components.aviso.service;

import com.drh.server.auth.repository.UserRepository;
import com.drh.server.auth.service.UserService;
import com.drh.server.components.aviso.dto.CreateAvisoDTO;
import com.drh.server.components.aviso.dto.ResponseAvisoDTO;
import com.drh.server.components.aviso.dto.UpdateAvisoDTO;
import com.drh.server.components.aviso.events.AvisoCriadoEvent;
import com.drh.server.components.aviso.model.AvisoModel;
import com.drh.server.components.aviso.repository.AvisoRepository;
import com.drh.server.exception.GenericException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository avisoRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    public List<ResponseAvisoDTO> listarAvisos(Boolean naLixeira){
        if (naLixeira == null) naLixeira = false;
        List<AvisoModel> response = this.avisoRepository.findByNaLixeira(naLixeira);

        return response.stream()
                .map(ResponseAvisoDTO::of)
                .toList();
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
        applicationEventPublisher.publishEvent(new AvisoCriadoEvent(saved));
        return ResponseAvisoDTO.of(saved);
    }

    public ResponseAvisoDTO deletarAviso(Long avisoDTO, UUID idUser){
        String subject = this.userRepository.findById(idUser).get().getEmail();
        AvisoModel aviso = this.avisoRepository.findById(avisoDTO)
                .orElseThrow( ()-> new GenericException("Aviso não encontrado", HttpStatus.BAD_REQUEST) );

        if (!Objects.equals(aviso.getCriadoPor(), subject)){
            throw new GenericException("Apenas o autor tem esta permissão", HttpStatus.FORBIDDEN);
        }

        if (aviso.isNaLixeira()) {
            this.avisoRepository.delete(aviso);
        }else {
            aviso.setNaLixeira(true);
            this.avisoRepository.save(aviso);
        }

        return ResponseAvisoDTO.of(aviso);
    }

    public ResponseAvisoDTO restaurarAviso(UpdateAvisoDTO avisoDTO, UUID idUser){
        String subject = this.userRepository.findById(idUser).get().getEmail();

        AvisoModel aviso = this.avisoRepository.findById(avisoDTO.aviso_id())
                .orElseThrow( ()-> new GenericException("Aviso não encontrado", HttpStatus.BAD_REQUEST) );

        if (!Objects.equals(aviso.getCriadoPor(), subject)){
            throw new GenericException("Apenas o autor tem esta permissão", HttpStatus.FORBIDDEN);
        }

        if (aviso.isNaLixeira()){
            aviso.setNaLixeira(false);
            this.avisoRepository.save(aviso);
        }
        else {
            throw new GenericException("O aviso não está na lixeira", HttpStatus.BAD_REQUEST);
        }

        return ResponseAvisoDTO.of(aviso);

    }

}
