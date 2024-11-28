import {StepContent} from '@mui/material';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const steps = ['Object Detection', 'Anomaly Detection', 'Anomaly Classifier'];
const activeStep = 3;

export default function HorizontalStepperWithError() {
    const isStepFailed = (step) => {
        return step === 2;
    };

    return (


        <Box >
            <Stepper nonLinear activeStep={activeStep} >
                <Step key="Aquisition">
                    <StepLabel icon=" " sx={{width: "7em", height: "5em", paddingLeft: "1em"}}>Aquisition</StepLabel>
                    <StepContent>asfdasdfasf</StepContent>
                </Step>
                {steps.map((label, index) => {
                    const labelProps = {};
                    if (isStepFailed(index)) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error">
                                12 Open decisions
                            </Typography>
                        );

                        labelProps.error = true;
                    } else {
                        labelProps.optional = (
                            <Typography variant="caption">
                                0 Open decisions
                            </Typography>
                        );
                    }

                    if (index == activeStep - 1) {
                        return (
                            <Step key={label}>
                                <StepLabel {...labelProps} icon=" " sx={{border: '3px solid rgba(200, 0, 0, 1)', backgroundColor: "#fc9", width: "11em", height: "5em", paddingLeft: "1em"}}>{label}</StepLabel>
                                <StepContent sx={{width: "12em", fontSize: "15px"}}>Gets Anomalies and classify them to types</StepContent>
                            </Step>
                        );
                    }
                    return (
                        <Step key={label}>
                            <StepLabel {...labelProps} icon=" " sx={{border: '1px solid rgba(0, 0, 0, 0.5)', width: "11em", height: "5em", backgroundColor: "#cec", paddingLeft: "1em"}}>{label}</StepLabel>
                        </Step>
                    );
                })}
                <Step key="External System">
                    <StepLabel icon=" " sx={{width: "7em", height: "5em", paddingLeft: "1em"}}>External System</StepLabel>
                </Step>
            </Stepper>
        </Box>
    );
}