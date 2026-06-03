package com.drh.server.exception;

import com.drh.server.dto.ErrorDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDTO> handleValidationErrors(MethodArgumentNotValidException exception){
        Map<String, String> fields = new LinkedHashMap<>();

        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach(
                        er -> fields.put(er.getField(), er.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorDTO.of(fields));
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorDTO> handleEmailAlreadyExists(EmailAlreadyExistsException exception){
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorDTO.of(exception.getMessage()));
    }

    @ExceptionHandler(IncorrectCredentialsException.class)
    public ResponseEntity<ErrorDTO> handleIncorrectCredentials(IncorrectCredentialsException exception){
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ErrorDTO.of(exception.getMessage()));
    }

}
