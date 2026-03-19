import {
  Button,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from '@nextui-org/react'
import AdviceTypeModalChip from '@/components/modal/AdviceTypeModalChip'
import { ResultAdviceType } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { SEE_ADVICE_TYPE_QUERY } from '@/graphql/queries'

type seeAdviceTypeQuery = {
  seeAdviceType: ResultAdviceType
}
export default function AdviceTypeModal({
  isOpen,
  onClose,
  setValue,
  adviceTypeSelected,
  setAdviceTypeSelected,
  setAdviceTypeSelectedName,
}) {
  const { error, data } = useSuspenseQuery<seeAdviceTypeQuery>(
    SEE_ADVICE_TYPE_QUERY,
    {
      variables: {
        page: 1,
        category: '상담분야',
        limit: 100,
      },
    },
  )
  const adviceList = data?.seeAdviceType.adviceType

  if (error) {
    console.log(error)
  }
  const handleAdviceChange = values => {
    setAdviceTypeSelected(values)
  }
  const clickAdviceSubmit = () => {
    setValue('adviceTypes', adviceTypeSelected, { shouldDirty: true })
    const typesArray = adviceTypeSelected
      .map(id => {
        const foundObject = adviceList.find(obj => obj.id === id)
        return foundObject ? foundObject.type : null
      })
      .filter(type => type !== null)
    setAdviceTypeSelectedName(typesArray)
    onClose()
  }

  return (
    <>
      <Modal
        size={'2xl'}
        isOpen={isOpen}
        onClose={onClose}
        placement={'center'}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                상담 분야 선택
              </ModalHeader>
              <ModalBody className="min-h-[10rem] max-h-[70vh] md:max-h-[50vh]">
                <ScrollShadow className="overflow-x-hidden scrollbar">
                  <CheckboxGroup
                    orientation="horizontal"
                    className="gap-1 radioBox pb-[1rem]"
                    color="secondary"
                    value={adviceTypeSelected}
                    onChange={handleAdviceChange}
                  >
                    <AdviceTypeModalChip adviceList={adviceList} />
                  </CheckboxGroup>
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
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => {
                    clickAdviceSubmit()
                  }}
                >
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
