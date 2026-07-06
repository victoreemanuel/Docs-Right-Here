package com.drh.server.components.aviso.service;

import com.drh.server.auth.model.UserModel;
import com.drh.server.auth.repository.UserRepository;
import com.drh.server.components.aviso.dto.CreateAvisoDTO;
import com.drh.server.components.aviso.dto.ResponseAvisoDTO;
import com.drh.server.components.aviso.model.AvisoModel;
import com.drh.server.components.aviso.model.AvisoVisibilidade;
import com.drh.server.components.aviso.repository.AvisoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AvisoServiceTest {

    @Mock
    private AvisoRepository avisoRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ApplicationEventPublisher applicationEventPublisher;
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private AvisoService avisoService;

    private UUID idUser;
    private UserModel usuaruiMock;
    private AvisoModel avisoExistente;

    @Test
    @DisplayName("Deve retornar uma lista de AvisoDTO")
    void deveRetornarListaDeAvisoDTO(){
        AvisoModel aviso = new AvisoModel(
                1L,
                "Título",
                "Descrição",
                LocalDate.now().plusDays(5),
                AvisoVisibilidade.TODOS,
                "email@teste.com",
                LocalDate.now(),
                false
        );

        when(avisoRepository.findByNaLixeira(false)).thenReturn(List.of(aviso));
        List<ResponseAvisoDTO> result = avisoService.listarAvisos(false);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).titulo()).isEqualTo("Título");

        verify(avisoRepository).findByNaLixeira(false);
    }

    @Test
    @DisplayName("Deve criar aviso, salvar e publicar eventos")
    void deveCriarAvisosComSucesso(){
        UUID idUser = UUID.randomUUID();

        CreateAvisoDTO dto = new CreateAvisoDTO(
                "Novo título",
                "Nova descrição",
                LocalDate.now().plusDays(3),
                AvisoVisibilidade.TODOS
        );

        UserModel usuarioMock = mock(UserModel.class);
        when(usuarioMock.getEmail()).thenReturn("autor@teste.com");
        when(userRepository.findById(idUser)).thenReturn(Optional.of(usuarioMock));

        AvisoModel avisoSalvo = new AvisoModel(
                10L,
                "Novo título",
                "Nova descrição",
                LocalDate.now().plusDays(3),
                AvisoVisibilidade.TODOS,
                "autor@teste.com",
                LocalDate.now(),
                false
        );

        when(avisoRepository.save(any(AvisoModel.class))).thenReturn(avisoSalvo);

        ResponseAvisoDTO result = avisoService.criarAviso(dto, idUser);

        assertThat(result.titulo()).isEqualTo("Novo título");
        assertThat(result.nome_criador()).isEqualTo("autor@teste.com");

        verify(avisoRepository).save(any(AvisoModel.class));
        verify(messagingTemplate).convertAndSend(eq("/topic/avisos"), any(Object.class));
        verify(applicationEventPublisher).publishEvent(any(Object.class));

    }



}