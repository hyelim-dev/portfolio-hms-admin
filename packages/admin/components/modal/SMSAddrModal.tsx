import styled from 'styled-components'
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Tab,
  Tabs,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import SMSAddrTeacher from '@/components/form/SMSAddrTeacher'
import SMSAddrStudent from '@/components/form/SMSAddrStudent'
import SMSAddrEmployee from '@/components/form/SMSAddrEmployee'
import SMSAddrInput from '@/components/form/SMSAddrInput'

const ChipBox = styled.div`
  display: flex;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    max-height: 20vh;
  }
`

export default function SMSAddrModal({
  isOpen,
  onClose,
  sendGruop,
  setSendGruop,
  setValue,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(5)
  const [groupSelected, setGroupSelected] = useState([])
  const [selected, setSelected] = useState('input')
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (sendGruop) {
      setGroupSelected(sendGruop)
    }
  }, [sendGruop])

  const clickAdd = () => {
    setSendGruop(groupSelected)
    setValue('receiver', groupSelected, { shouldDirty: true })
    setGroupSelected([])
    onClose()
  }

  const deleteType = index => {
    const updatedGroup = [...groupSelected]
    updatedGroup.splice(index, 1)
    setGroupSelected(updatedGroup)
    setValue('receiver', updatedGroup, { shouldDirty: true })
  }

  return (
    <>
      <Modal size={'xl'} isOpen={isOpen} onClose={onClose} placement={'center'}>
        <ModalContent>
          {sbjClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                전화번호 검색
              </ModalHeader>
              <ModalBody>
                <Tabs
                  variant="underlined"
                  aria-label="Options"
                  color="primary"
                  classNames={{
                    tabList: 'flex-wrap',
                    tab: 'w-auto',
                  }}
                  selectedKey={selected}
                  onSelectionChange={e => setSelected(String(e))}
                >
                  <Tab key="student" title="수강생">
                    <SMSAddrStudent
                      groupSelected={groupSelected}
                      setGroupSelected={setGroupSelected}
                    />
                  </Tab>
                  <Tab key="employee" title="직원">
                    <SMSAddrEmployee
                      groupSelected={groupSelected}
                      setGroupSelected={setGroupSelected}
                    />
                  </Tab>
                  <Tab key="teacher" title="강사">
                    <SMSAddrTeacher
                      groupSelected={groupSelected}
                      setGroupSelected={setGroupSelected}
                    />
                  </Tab>
                  <Tab key="input" title="직접입력">
                    <SMSAddrInput
                      groupSelected={groupSelected}
                      setGroupSelected={setGroupSelected}
                    />
                  </Tab>
                </Tabs>
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
                        <span>
                          {item.mPhoneNum
                            ? `[${item.mPhoneNum}]`
                            : item.phoneNum1
                            ? `[${item.phoneNum1}]`
                            : item.phoneNumber}
                        </span>
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
