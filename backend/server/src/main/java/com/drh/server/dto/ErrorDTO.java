package com.drh.server.dto;

import java.util.Map;

public record ErrorDTO(
        String message,
        Map<String, String> fields) {

    public static ErrorDTO of(String message){
        return new ErrorDTO(message, null);
    }

    public static ErrorDTO of(Map<String, String> fields){
        return new ErrorDTO(null, fields);
    }

}
