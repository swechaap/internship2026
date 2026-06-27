package com.financeflow.service;

import java.util.List;

import com.financeflow.dto.department.DepartmentRequest;
import com.financeflow.dto.department.DepartmentResponse;
import com.financeflow.entity.DepartmentEntity;
import com.financeflow.exception.ResourceNotFoundException;
import com.financeflow.repository.DepartmentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> list() {
        return departmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public DepartmentResponse save(DepartmentRequest request) {
        DepartmentEntity entity = departmentRepository.findByNameIgnoreCase(request.name())
                .orElse(DepartmentEntity.builder().name(request.name()).build());
        entity.setDescription(request.description());
        entity.setActive(request.active());
        return toResponse(departmentRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        DepartmentEntity entity = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        departmentRepository.delete(entity);
    }

    private DepartmentResponse toResponse(DepartmentEntity entity) {
        return new DepartmentResponse(entity.getId(), entity.getName(), entity.getDescription(), entity.isActive());
    }
}