package com.drh.server.auth.service;

import com.drh.server.auth.dto.UserCreateDTO;
import com.drh.server.auth.model.RoleModel;
import com.drh.server.auth.model.UserModel;
import com.drh.server.auth.repository.RoleRepository;
import com.drh.server.auth.repository.UserRepository;
import com.drh.server.exception.EmailAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public void createUser(UserCreateDTO userCreateDTO){

        var userExists = userRepository.findByEmail(userCreateDTO.email());
        if (userExists.isPresent()){
            throw new EmailAlreadyExistsException();
        }

        var user = new UserModel();
        user.setEmail(userCreateDTO.email());
        user.setPassword(passwordEncoder.encode(userCreateDTO.password()));

        String roleName = (userCreateDTO.role() != null && !userCreateDTO.role().isBlank())
                ? userCreateDTO.role().toUpperCase()
                : RoleModel.Values.USER.name();

        var targetRole = roleRepository.findByName(roleName);
        if (targetRole == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role inválida ou não encontrada: " + roleName);
        }

        user.setRoles(Set.of(targetRole));
        userRepository.save(user);
    }

    public List<UserModel> findAll(){
        return this.userRepository.findAll();
    }
}