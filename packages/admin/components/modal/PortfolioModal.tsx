import styled from 'styled-components'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from '@nextui-org/react'

const PortfoiloFigure = styled.figure`
  width: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
export default function PortfolioModal({ isOpen, onClose, item }) {
  return (
    <>
      <Modal
        size={'3xl'}
        isOpen={isOpen}
        onClose={onClose}
        placement={'center'}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                포트폴리오
              </ModalHeader>
              <ModalBody>
                <ScrollShadow className="scrollbar min-h-[50vh] max-h-[70vh]">
                  <PortfoiloFigure>
                    <img src={item} />
                  </PortfoiloFigure>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  variant="bordered"
                  className="text-accent border-accent"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
