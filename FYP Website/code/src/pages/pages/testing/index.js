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
import ButtonBase from '@mui/material/ButtonBase';

// Custom CSS for expanding the clickable area of the ButtonBase
const buttonBaseStyles = {
  width: '24px', // Fixed width for the clickable area
  height: '24px', // Fixed height for the clickable area
  borderRadius: '50%', // Makes it circular
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

export default function TimelineAccordion() {
  // State to track which button is clicked and its associated content
  const [activeButtonIndex, setActiveButtonIndex] = React.useState(null);
  const [activeCardContent, setActiveCardContent] = React.useState('');

  // Event handler for the TimelineDot click event
  const handleDotClick = (index, content) => {
    console.log(`Dot clicked on item ${index}`);
    setActiveButtonIndex(index);
    setActiveCardContent(content);
  };

  // Define an array of events with additional data, including cardInfo
  const events = [
    { time: '09:30 am', content: 'Eat', cardInfo: 'Breakfast' },
    { time: '10:00 am', content: 'Code', cardInfo: 'Work on a project' },
    // Add more events as needed with additional properties
  ];

  return (
    <Accordion expanded={true}>
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
              {events.map((event, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="textSecondary">
                    {event.time}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <ButtonBase
                      onClick={() => handleDotClick(index, event.cardInfo)}
                      style={buttonBaseStyles} // Apply the custom styles
                    >
                      <TimelineDot />
                    </ButtonBase>
                    {index !== events.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>{event.content}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
          <CardContent style={{ flex: 0.5 }}>
            <Typography variant="body2">
              {activeCardContent || 'Additional information about the timeline events can go here.'}
            </Typography>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
}
