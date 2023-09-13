import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ButtonBase from '@mui/material/ButtonBase'

const buttonBaseStyles = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
}



export default function TimelineAccordion(props) {
  const item = props.data

    // Find proficiency level to set intial card conten
  const getInitialCardContent = () => {
      // if userProficiency is -1 then set to the lowest proficiency 
      // else set to the lowest proficiency level in the list
      const userProficiency = item.userAcquiredProficiency
      if (userProficiency > 0) {
      const abilityDesc = item['proficiencyLevel'].find(item => item['proficiencyLevel'] === userProficiency)
        ?.filteredAbility || ['Description not available']
        return abilityDesc
      } else {
        return item.proficiencyLevel[0].filteredAbility
      }
    }
  // State to track which button is clicked and its associated content
  const [activeButtonIndex, setActiveButtonIndex] = React.useState(null)
  const [activeCardContent, setActiveCardContent] = React.useState(getInitialCardContent())
  const [expanded, setExpanded] = React.useState(false)

  const handleAccordionToggle = () => {
    setExpanded(!expanded)
  }
  // Find index for that proficiency level
  const findProficiencyLevel = proficiencyLevel => {
    const levels = item.proficiencyLevel.map(item => item.proficiencyLevel)
    const index = levels.findIndex(item => item === proficiencyLevel)
    return index // TODO: adds error handing: return -1 if prof level not inside
  }

  // Event handler for the TimelineDot click event
  const handleDotClick = (index, proficiencyLevel) => {
    setActiveButtonIndex(index)
    // TODO: maybe you want to set the proficiency level here
    const abilityDesc = item['proficiencyLevel'].find(item => item['proficiencyLevel'] === proficiencyLevel)
      ?.filteredAbility || ['Description not available']
    setActiveCardContent(abilityDesc)
  }

  // TODO: make further improvements to the colour of the dots
  // Base on certain conditions return the dot colour
  const getDotColour = index => {
    console.log("item", item)
    const userProficiency = item.userAcquiredProficiency
    const userProficiencyIndex = findProficiencyLevel(userProficiency)
    const jobProficiency = item.jobRequiredProficiency
    const jobRequiredProficiencyIndex = findProficiencyLevel(jobProficiency)
    if (userProficiency === -1){
      // Make all dots till job required proficiency level red
      if (index <= jobRequiredProficiencyIndex) {
        return 'error'
      }
    }
    if (userProficiency < jobProficiency) {
      if (index <= userProficiencyIndex) {
        return 'success'
      }
      if (userProficiencyIndex < index && index <= jobRequiredProficiencyIndex){
        return 'error'
      }
    }
    if (userProficiency > jobProficiency) {
      if (index <= userProficiencyIndex) {
        return 'success'
      }
    }
    if (userProficiency == jobProficiency) {
      if (index <= jobRequiredProficiencyIndex) {
      return 'success'
      }
    }
    
    return 'secondary'
  }


  return (
    <Accordion expanded={expanded} onChange={handleAccordionToggle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant='h6'>{item.tscTitle}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Card style={{ display: 'flex', width: '100%' }}>
          <CardContent style={{ flex: 1 }}>
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2
                }
              }}
            >
              {item.proficiencyLevel.map((event, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color='textSecondary'>
                    Level {event.proficiencyLevel}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <ButtonBase
                      onClick={() => handleDotClick(index, event.proficiencyLevel)}
                      style={buttonBaseStyles} // Apply the custom styles
                    >
                      <TimelineDot color={getDotColour(index)} />
                    </ButtonBase>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>Change to Prof Decript</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
          <CardContent style={{ flex: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ul>
              <Typography variant='body2'>
                {activeCardContent.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </Typography>
            </ul>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  )
}
