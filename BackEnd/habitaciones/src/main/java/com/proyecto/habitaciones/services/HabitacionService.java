package com.proyecto.habitaciones.services;

import com.proyecto.commons.dto.HabitacionRequest;
import com.proyecto.commons.dto.HabitacionResponse;
import com.proyecto.commons.services.CrudService;

public interface HabitacionService extends CrudService<HabitacionRequest, HabitacionResponse>{

	HabitacionResponse obtenerHabitacionPorIdSinEstado(Long id);

	HabitacionResponse cambiarEstadoHabitacion(Long idHabitacion, Long idEstadoHabitacion);

	HabitacionResponse cambiarEstadoHabitacionManual(Long idHabitacion, Long idEstadoHabitacion);
}
