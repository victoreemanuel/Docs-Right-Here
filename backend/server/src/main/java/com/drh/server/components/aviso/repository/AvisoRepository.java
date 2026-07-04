package com.drh.server.components.aviso.repository;

import com.drh.server.components.aviso.model.AvisoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface AvisoRepository extends JpaRepository<AvisoModel, Long> {

    List<AvisoModel> findByNaLixeira(boolean naLixeira);

    @Query("SELECT a FROM AvisoModel a WHERE YEAR(a.dataHoraEvento) = :ano AND MONTH(a.dataHoraEvento) = :mes AND a.naLixeira = false")
    List<AvisoModel> buscarPorMesEAno(@Param("mes") int mes, @Param("ano") int ano);

    @Query("SELECT a FROM AvisoModel a WHERE YEAR(a.dataHoraEvento) = :ano AND MONTH(a.dataHoraEvento) = :mes AND DAY(a.dataHoraEvento) = :dia AND a.naLixeira = false ORDER BY a.dataHoraEvento ASC")
    List<AvisoModel> buscarPorDiaExato(@Param("dia") int dia, @Param("mes") int mes, @Param("ano") int ano);
}
