package com.drh.server.exception;

public class IncorrectCredentialsException extends RuntimeException {
    public IncorrectCredentialsException() {
        super("Credenciais inválidas");
    }
}
