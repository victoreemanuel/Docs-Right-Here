package com.drh.server.infra.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender javaMailSender;

//    MANTIDO APENAS UM EMAIL DE DESTINO POR CONTA DO DESENVILVIMETO,
//    O GOOGLE PODE BLOQUEAR O ENVIO! -Hugo
   private final String from;
   private final  String emailDestino;

    public EmailService(
            JavaMailSender javaMailSender,
            @Value("${email.destino}") String emailDestino,
            @Value("spring.mail.username") String from) {
        this.javaMailSender = javaMailSender;
        this.emailDestino = emailDestino;
        this.from = from;
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
