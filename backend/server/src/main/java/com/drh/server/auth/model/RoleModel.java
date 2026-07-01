package com.drh.server.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
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


    public enum Values {
        ADMIN(1L),
        USER(2L);

        Long roleId;

        Values(Long roleId){this.roleId = roleId;}
        public Long getRoleId(){return roleId; }
    }

}
