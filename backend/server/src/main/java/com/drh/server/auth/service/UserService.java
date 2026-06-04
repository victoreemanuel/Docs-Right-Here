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

        var userRole = roleRepository.findByName(RoleModel.Values.USER.name());

        var userExists = userRepository.findByEmail(userCreateDTO.email());
        if (userExists.isPresent()){
            throw new EmailAlreadyExistsException();
        }

        var user = new UserModel();
        user.setEmail(userCreateDTO.email());
        user.setPassword(passwordEncoder.encode(userCreateDTO.password()));
        user.setRoles(Set.of(userRole));
        userRepository.save(user);
    }

    public List<UserModel> findAll(){
        return this.userRepository.findAll();
    }

}
