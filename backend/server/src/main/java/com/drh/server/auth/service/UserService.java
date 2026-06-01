package com.drh.server.auth.service;

import com.drh.server.auth.dto.CreateuserDTO;
import com.drh.server.auth.model.RoleModel;
import com.drh.server.auth.model.UserModel;
import com.drh.server.auth.repository.RoleRepository;
import com.drh.server.auth.repository.UserRepository;
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



    public void createUser(CreateuserDTO createuserDTO){

        var userRole = roleRepository.findByName(RoleModel.Values.USER.name());

        var userExists = userRepository.findByUsername(createuserDTO.username());
        if (userExists.isPresent()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        var user = new UserModel();
        user.setUsername(createuserDTO.username());
        user.setPassword(passwordEncoder.encode(createuserDTO.password()));
        user.setRoles(Set.of(userRole));
        userRepository.save(user);
    }

    public List<UserModel> findAll(){
        return this.userRepository.findAll();
    }

}
