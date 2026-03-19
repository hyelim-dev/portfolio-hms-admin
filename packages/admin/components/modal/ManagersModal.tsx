import styled from 'styled-components'
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import SearchEmployeeTable from '@/components/table/SearchEmployeeTable'

const ChipBox = styled.div`
  display: flex;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    max-height: 20vh;
  }
`

export default function ManagersModal({
  isOpen,
  onClose,
  managers,
  setManagers,
  setValue,
  setManagersName,
}) {
  const [groupSelected, setGroupSelected] = useState([])

  useEffect(() => {
    if (managers) {
      setGroupSelected(managers)
    }
  }, [managers])

  const clickAdd = () => {
    setManagers(groupSelected)
    setManagersName(groupSelected.map(user => user.mUsername))
    setValue('manageUserIds', groupSelected, { shouldDirty: true })
    setGroupSelected([])
    onClose()
  }

  const deleteType = index => {
    const updatedGroup = [...groupSelected]
    updatedGroup.splice(index, 1)
    setGroupSelected(updatedGroup)
    setManagersName(updatedGroup.map(user => user.mUsername))
    setValue('manageUserIds', updatedGroup, { shouldDirty: true })
  }

  return (
    <>
      <Modal size={'xl'} isOpen={isOpen} onClose={onClose} placement={'center'}>
        <ModalContent>
          {sbjClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                직원 검색
              </ModalHeader>
              <ModalBody>
                <SearchEmployeeTable
                  groupSelected={groupSelected}
                  setGroupSelected={setGroupSelected}
                />
                <ScrollShadow orientation="vertical" className="scrollbar">
                  <ChipBox>
                    {groupSelected?.map((item, index) => (
                      <Chip
                        key={index}
                        variant="bordered"
                        onClose={index => deleteType(index)}
                        className={'hover:border-primary'}
                      >
                        {item.mUsername
                          ? item.mUsername
                          : item.name
                          ? item.name
                          : null}
                      </Chip>
                    ))}
                  </ChipBox>
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
                <Button size="sm" color="primary" onPress={clickAdd}>
                  선택
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
