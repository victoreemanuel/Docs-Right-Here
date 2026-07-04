package com.drh.server.infra.mail;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

//    MANTIDO APENAS UM EMAIL DE DESTINO POR CONTA DO DESENVILVIMETO,
//    O GOOGLE PODE BLOQUEAR O ENVIO! -Hugo
   private final String from;
   private final  String emailDestino;

    public EmailService(
            JavaMailSender javaMailSender,
            TemplateEngine templateEngine,
            @Value("${email.destino}") String emailDestino,
            @Value("${spring.mail.username}") String from) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
        this.emailDestino = emailDestino;
        this.from = from;
    }

    public void sendHtmlEmail(String titulo, String criadoPor, String descricao){
        try {
            Context context = new Context();
            context.setVariable("titulo", titulo);
            context.setVariable("criadoPor", criadoPor);
            context.setVariable("descricao", descricao);

            String html = templateEngine.process("email/aviso-criado", context);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(this.from);
            helper.setTo(emailDestino);
            helper.setSubject("Novo Aviso: "+ titulo);
            helper.setText(html, true);

            ClassPathResource logo = new ClassPathResource("static/images/logo.png");
            helper.addInline("logoAviso", logo);

            javaMailSender.send(mimeMessage);
        } catch (Exception e){
            System.out.println("ERRO: " + e.getMessage());
        }

    }


    public void sendTextEmail(String assunto, String corpo){
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(this.from);
            message.setTo(emailDestino);
            message.setSubject(assunto);
            message.setText(corpo);

            javaMailSender.send(message);
        } catch (Exception e){
            System.out.println("ERRO AO ENVIAR EMAIL: " + e.getMessage());
        }

    }
}
