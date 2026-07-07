package com.drh.server;

import com.drh.server.infra.mail.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;

import static org.mockito.Mockito.*;

public class EmailServiceTest {
    private JavaMailSender javaMailSender;
    private TemplateEngine templateEngine;
    private EmailService emailService;

    @BeforeEach
    void setup(){
        javaMailSender = mock(JavaMailSender.class);
        templateEngine = mock(TemplateEngine.class);

        emailService = new EmailService(
                javaMailSender,
                templateEngine,
                "destino@drh.com",
                "backend@drh.com"
        );
    }

    @Test
    void enviarEmailAoCriarAviso(){
        MimeMessage mimeMessageFake = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessageFake);
        when(templateEngine.process(anyString(), any())).thenReturn("<html>corpo</html>");

        emailService.sendHtmlEmail("Titulo Teste", "Hugo", "Desc Teste");

        verify(javaMailSender, times(1)).send(mimeMessageFake);
    }

}
