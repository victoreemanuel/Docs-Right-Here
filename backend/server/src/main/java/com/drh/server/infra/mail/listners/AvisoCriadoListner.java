package com.drh.server.infra.mail.listners;

import com.drh.server.components.aviso.events.AvisoCriadoEvent;
import com.drh.server.infra.mail.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class AvisoCriadoListner {

    @Autowired
    private EmailService emailService;

    @Async
    @EventListener
    public void handleAvisoCriado(AvisoCriadoEvent event){
        String assunto = String.format(
                "Novo aviso: %s", event.aviso().getTitulo()
        );
        String texto = String.format(
                "Um novo aviso criado por: %s\n\nDescrição: %s",
                event.aviso().getCriadoPor(),
                event.aviso().getDescricao()
        );

        emailService.sendTextEmail(assunto, texto);
    }
}
