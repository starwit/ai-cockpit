package de.starwit.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.starwit.aic.model.Decision;
import de.starwit.persistence.entity.DecisionEntity;
import de.starwit.service.impl.DecisionService;
import de.starwit.service.mapper.DecisionMapper;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping(path = "${rest.base-path}/aic")
public class AicContoller {

    @Autowired
    private DecisionService decisionService;

    DecisionMapper decisionMapper = new DecisionMapper();

    @Operation(summary = "Create decision")
    @PostMapping("decision")
    public DecisionEntity save(@Valid @RequestBody Decision dto) {
        DecisionEntity entity = decisionMapper.toEntity(dto);
        return decisionService.createDecisionEntitywithAction(entity);
    }

}
