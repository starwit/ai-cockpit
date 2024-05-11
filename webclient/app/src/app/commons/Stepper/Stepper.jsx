import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router";

const steps = ['Autonomielevel 1', 'Autonomielevel 2', 'Autonomielevel 3'];

export default function HorizontalNonLinearStepper(props) {
  const {activeStep, setActiveStep} = props;
  const navigate = useNavigate();

  const handleStep = (step) => () => {
    setActiveStep(step);
    const nav = step + 1;
    navigate("/" + nav)
  };

  return (
    <Box sx={{ width: '100%', marginBottom: '1em', marginTop: '1em'}}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
