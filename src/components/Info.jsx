import React from 'react'
import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Image,
  Modal,
} from 'semantic-ui-react'

const ModalExampleScrollingContent = (prop) => {
  const [open, setOpen] = React.useState(false)

  return (
    <span  id="leave-button" >
   
                <Button basic inverted  color="grey" size='mini' style={{position:'relative',marginBottom:10,textAlign:'left'}} icon labelPosition='left'>
                <Icon name='users' />Online <span id="gameId" style={{float:'right'}}>{prop.online}</span></Button>
   
    </span>
  )
}

export default ModalExampleScrollingContent