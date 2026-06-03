package com.drh.server.auth.config;

import com.drh.server.auth.model.RoleModel;
import com.drh.server.auth.model.UserModel;
import com.drh.server.auth.repository.RoleRepository;
import com.drh.server.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;

@Configuration
public class AdminUserConfig implements CommandLineRunner {

    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;


    public AdminUserConfig(
            RoleRepository roleRepository,
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        var roleAdmin = roleRepository.findByName(RoleModel.Values.ADMIN.name());
        System.out.println(roleAdmin.getName());
        var userAdmin = userRepository.findByEmail("admin@drh.com");

        userAdmin.ifPresentOrElse(
                userModel -> {
                    System.out.println("Admin já criado");
                },
                () ->{
                    var user = new UserModel();
                    user.setEmail("admin@drh.com");
                    user.setPassword(passwordEncoder.encode("admin"));
                    user.setRoles(Set.of(roleAdmin));
                    userRepository.save(user);
                    System.out.println("Admin criado");
                }
        );
    }
}
