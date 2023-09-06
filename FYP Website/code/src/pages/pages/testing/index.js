import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ButtonBase from '@mui/material/ButtonBase'; // Added this line

export default function TimelineAccordion() {
  // Event handler for the TimelineDot click event
  const handleDotClick = () => {
    console.log('Dot clicked');
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Timeline</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Card style={{ display: 'flex', width: '100%' }}>
          <CardContent style={{ flex: 1 }}>
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                  09:30 am
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <ButtonBase onClick={handleDotClick}> {/* Wrapped TimelineDot */}
                    <TimelineDot />
                  </ButtonBase>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Eat</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                  10:00 am
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <ButtonBase onClick={handleDotClick}> {/* Wrapped TimelineDot */}
                    <TimelineDot />
                  </ButtonBase>
                </TimelineSeparator>
                <TimelineContent>Code</TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
          <CardContent style={{ flex: 0.5 }}>
            <Typography variant="body2">
              Additional information about the timeline events can go here.
            </Typography>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
}
