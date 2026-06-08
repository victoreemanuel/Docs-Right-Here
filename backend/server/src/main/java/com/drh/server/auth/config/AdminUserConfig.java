package com.drh.server.auth.config;

import com.drh.server.auth.model.RoleModel;
import com.drh.server.auth.model.UserModel;
import com.drh.server.auth.repository.RoleRepository;
import com.drh.server.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;

@Configuration
public class AdminUserConfig implements CommandLineRunner {

    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;
    @Value("${admin.password}")
    private String adminPassword;


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
        var userAdmin = userRepository.findByEmail(adminEmail);

        userAdmin.ifPresentOrElse(
                userModel -> {
                    System.out.println("Admin já criado");
                },
                () ->{
                    var user = new UserModel();
                    user.setEmail(adminEmail);
                    user.setPassword(passwordEncoder.encode(adminPassword));
                    user.setRoles(Set.of(roleAdmin));
                    userRepository.save(user);
                    System.out.println("Admin criado");
                }
        );
    }
}
