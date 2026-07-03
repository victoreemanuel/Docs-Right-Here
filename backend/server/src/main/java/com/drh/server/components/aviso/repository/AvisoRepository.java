package com.drh.server.components.aviso.repository;

import com.drh.server.components.aviso.model.AvisoModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface AvisoRepository extends JpaRepository<AvisoModel, Long> {

    List<AvisoModel> findByNaLixeira(boolean naLixeira);
}
