package com.drh.server.auth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_roles")
@Getter
@Setter
public class RoleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;
    private String name;

    public RoleModel() {}

    public RoleModel(String name) {
        this.name = name;
    }

    public enum Values {
        ADMIN(1L),
        USER(2L),
        PROFESSOR(3L),  // <-- NOVO
        DIRETOR(4L);    // <-- NOVO

        Long roleId;

        Values(Long roleId){this.roleId = roleId;}
        public Long getRoleId(){return roleId; }
    }
}