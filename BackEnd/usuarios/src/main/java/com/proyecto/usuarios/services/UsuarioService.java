package com.proyecto.usuarios.services;

import java.util.Set;

import com.proyecto.usuarios.dto.UsuarioRequest;
import com.proyecto.usuarios.dto.UsuarioResponse;

public interface UsuarioService {
	
	Set<UsuarioResponse> listar();

    UsuarioResponse registrar(UsuarioRequest request);

    UsuarioResponse eliminar(String username);

}
