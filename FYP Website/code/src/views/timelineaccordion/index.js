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
  const getInitialAbilityCardContent = () => {
    // if userProficiency is -1 then set to the lowest proficiency
    // else set to the lowest proficiency level in the list
    const userProficiency = item.userAcquiredProficiency
    if (userProficiency > 0) {
      const abilityDesc = item['proficiencyDetails'].find(item => item['proficiencyLevel'] === userProficiency)
        ?.filteredAbility || ['Description not available']
      return abilityDesc
    } else {
      return item.proficiencyDetails[0].filteredAbility
    }
  }
  const getInitialKnowCardContent = () => {
    // if userProficiency is -1 then set to the lowest proficiency
    // else set to the lowest proficiency level in the list
    const userProficiency = item.userAcquiredProficiency
    if (userProficiency > 0) {
      const knowDesc = item['proficiencyDetails'].find(item => item['proficiencyLevel'] === userProficiency)
      ?.filteredKnowledge || ['Description not available']
      return knowDesc
    } else {
      return item.proficiencyDetails[0].filteredKnowledge
    }
  }
  // State to track which button is clicked and its associated content
  const [abilityCardContent, setAbilityCardContent] = React.useState(getInitialAbilityCardContent())
  const [knowCardContent, setKnowCardContent] = React.useState(getInitialKnowCardContent())
  const [expanded, setExpanded] = React.useState(false)

  const handleAccordionToggle = () => {
    setExpanded(!expanded)
  }
  // Find index for that proficiency level
  const findProficiencyLevel = proficiencyLevel => {
    const levels = item.proficiencyDetails.map(item => item.proficiencyLevel)
    const index = levels.findIndex(item => item === proficiencyLevel)
    return index // TODO: adds error handing: return -1 if prof level not inside
  }

  // Event handler for the TimelineDot click event
  const handleDotClick = (index, proficiencyLevel) => {
    // TODO: maybe you want to set the proficiency level here
    const abilityDesc = item['proficiencyDetails'].find(item => item['proficiencyLevel'] === proficiencyLevel)
      ?.filteredAbility || ['Description not available']
      const knowDesc = item['proficiencyDetails'].find(item => item['proficiencyLevel'] === proficiencyLevel)
      ?.filteredKnowledge || ['Description not available']
    setKnowCardContent(knowDesc)
    setAbilityCardContent(abilityDesc)
  }

  // TODO: make further improvements to the colour of the dots
  // Base on certain conditions return the dot colour
  const getDotColour = index => {
    console.log('item', item)
    const userProficiency = item.userAcquiredProficiency
    const userProficiencyIndex = findProficiencyLevel(userProficiency)
    const jobProficiency = item.jobRequiredProficiency
    const jobRequiredProficiencyIndex = findProficiencyLevel(jobProficiency)
    if (userProficiency === -1) {
      // Make all dots till job required proficiency level red
      if (index <= jobRequiredProficiencyIndex) {
        return 'error'
      }
    }
    if (userProficiency < jobProficiency) {
      if (index <= userProficiencyIndex) {
        return 'success'
      }
      if (userProficiencyIndex < index && index <= jobRequiredProficiencyIndex) {
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
              {item.proficiencyDetails.map((event, index) => (
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
                  <TimelineContent>
                    <Typography variant='body2'>{event.filteredDescription}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
          <CardContent style={{ flex: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ul>
               <Typography variant='h6'>Ability Required</Typography>
              <Typography variant='body2'>
                {abilityCardContent.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
        
              </Typography>
              <Typography variant='h6' style={{ marginTop: '20px' }}>Knowledge Required</Typography>
              <Typography variant='body2'>
                {knowCardContent.map((item, index) => (
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
