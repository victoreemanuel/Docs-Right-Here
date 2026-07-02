package com.drh.server.auth.controller;

import com.drh.server.auth.dto.UserCreateDTO;
import com.drh.server.auth.model.UserModel;
import com.drh.server.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/users")
    public ResponseEntity<Void> newUser(@Valid @RequestBody UserCreateDTO userCreateDTO){
        this.userService.createUser(userCreateDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserModel>> listUsers(){
        var users = userService.findAll();
        return ResponseEntity.ok(users);
    }
}
