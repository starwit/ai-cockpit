import {useTranslation} from 'react-i18next';

import {
    Paper,
    Typography,
    Box,
    Container,
    Stack,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

import {formatDateShort} from '../../commons/formatter/DateFormatter';

function DecisionResultPanel(props) {
    const {show, decisions} = props;
    const {t, i18n} = useTranslation();

    return (
        show && (
            <Box sx={{right: 10, position: 'fixed', top: 60, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto'}}>
                <Stack direction="row">
                    <Paper sx={{width: 300, padding: 1}}>
                        <Typography variant="h6" gutterBottom>
                            {t('decision.list.title')}
                        </Typography>
                        {decisions ? (
                            <Stack direction="column">
                                <Typography variant="subtitle1" gutterBottom>
                                    {t('decision.found', {count: decisions.length})}
                                </Typography>
                                {decisions.map((decision, index) => (
                                    <Container
                                        key={decision.id}
                                    >
                                        <Typography variant="h6">
                                            {decision.decisionType?.name}
                                        </Typography>
                                        <Typography>
                                            {t('decision.acquisitionTime')}: {
                                                decision.acquisitionTime
                                                    ? formatDateShort(decision.acquisitionTime, i18n) // Check validity of date
                                                    : t('Invalid Date')
                                            }
                                        </Typography>
                                        <Typography>
                                            {t('decision.state')}: {decision.state || t('decision.decisionType.new')}
                                        </Typography>
                                        {decision.description && (
                                            <Typography>
                                                {t('decision.description')}: {decision.description}
                                            </Typography>
                                        )}
                                        <Divider />
                                    </Container>
                                ))}
                            </Stack>) : (
                            <Typography>
                                {t('decision.list.hover')}
                            </Typography>
                        )
                        }
                    </Paper>
                </Stack>
            </Box>
        )
    );
}

export default DecisionResultPanel;