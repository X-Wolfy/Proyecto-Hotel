package com.proyecto.usuarios.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.usuarios.entities.Rol;

public interface RolRepository extends JpaRepository<Rol, Long>{
	boolean existsByNombre(String nombre);

    Optional<Rol> findByNombre(String nombre);
}
