import React, { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Card, CardContent, ButtonBase } from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses
} from '@mui/lab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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
  const { userAcquiredProficiency, jobRequiredProficiency, tscTitle } = item


  const getDescription = (proficiencyLevel, key) => {
    return (
      item.proficiencyDetails.find(details => details.proficiencyLevel === proficiencyLevel)?.[key] || [
        'Description not available'
      ]
    )
  }

  const getInitialContent = (data, key) => {
    if (userAcquiredProficiency > 0) {
      return getDescription(userAcquiredProficiency, key);
    }
    
return data.proficiencyDetails[0][key]
  }

  // State to track which button is clicked and its associated content
  const [abilityCardContent, setAbilityCardContent] = useState(() => getInitialContent(item, 'filteredAbility'))
  const [knowCardContent, setKnowCardContent] = useState(() => getInitialContent(item, 'filteredKnowledge'))
  const [expanded, setExpanded] = useState(false)

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
    setAbilityCardContent(getDescription(proficiencyLevel, 'filteredAbility'))
    setKnowCardContent(getDescription(proficiencyLevel, 'filteredKnowledge'))
  }


  const getDotColour = index => {
    const userProficiencyIndex = findProficiencyLevel(userAcquiredProficiency)
    const jobRequiredProficiencyIndex = findProficiencyLevel(jobRequiredProficiency)
    if (userAcquiredProficiency === -1) {
      // Make all dots till job required proficiency level red
      if (index <= jobRequiredProficiencyIndex) {
        return 'error'
      }
    }
    if (userAcquiredProficiency < jobRequiredProficiency) {
      if (index <= userProficiencyIndex) {
        return 'success'
      }
      if (userProficiencyIndex < index && index <= jobRequiredProficiencyIndex) {
        return 'error'
      }
    }
    if (userAcquiredProficiency > jobRequiredProficiency) {
      if (index <= userProficiencyIndex) {
        return 'success'
      }
    }
    if (userAcquiredProficiency == jobRequiredProficiency) {
      if (index <= jobRequiredProficiencyIndex) {
        return 'success'
      }
    }

    return 'secondary'
  }

  return (
    <Accordion expanded={expanded} onChange={handleAccordionToggle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant='h6'>{tscTitle}</Typography>
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
              <Typography variant='h6' style={{ marginTop: '20px' }}>
                Knowledge Required
              </Typography>
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
