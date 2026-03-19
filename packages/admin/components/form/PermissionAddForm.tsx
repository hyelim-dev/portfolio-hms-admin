import styled from 'styled-components'
import { Controller, useForm } from 'react-hook-form'
import { Button, Textarea, useDisclosure } from '@nextui-org/react'
import { useMutation } from '@apollo/client'
import { EDIT_PERMISSIONMS_GRANTED_MUTATION } from '@/graphql/mutations'
import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'
import { Suspense, useState } from 'react'
import ManagersModal from '@/components/modal/ManagersModal'

const FilterForm = styled.form`
  display: flex;
  width: 100%;
  gap: 1rem;
`

const LodingDiv = styled.div`
  padding: 1.5rem;
  width: 100%;
  min-width: 20rem;
  position: relative;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const FlexBox = styled.div`
  display: flex;
  flex: 1;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    gap: 1rem;
  }
`

const ItemBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`
const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`
const FilterLabel = styled.div`
  width: max-content;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;
`

export default function PermissionAddForm({ permission }) {
  // const { userLogs } = useUserLogsMutation()
  const [editPermissionGranted] = useMutation(
    EDIT_PERMISSIONMS_GRANTED_MUTATION,
  )
  const [managers, setManagers] = useState([])
  const [managersName, setManagersName] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    control,
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      manageUserIds: '',
    },
  })

  const onSubmit = async data => {
    if (isDirty) {
      const isModify = confirm('권한을 부여하시겠습니까?')
      if (isModify) {
        try {
          const managersID = managers.map(manager => manager.id)
          const result = await editPermissionGranted({
            variables: {
              editPermissionsGrantedId: permission.id,
              permissionName: permission.permissionName,
              topic: permission.topic,
              manageUserIdsToConnect: managersID,
              lastModifiedTime: new Date(),
            },
            refetchQueries: [SEARCH_PERMISSIONS_GRANTED_QUERY],
          })
          // userLogs(
          //   `${permission.permissionName} 권한 수정`,
          //   `ok: ${result.data.editPermissionsGranted.ok} , managers: ${managersName}`,
          // )
          if (!result.data.editPermissionsGranted.ok) {
            throw new Error(`${permission.permissionName} 권한 수정 실패`)
          }

          alert(`${permission.permissionName} 권한이 수정되었습니다.`)
          setManagers([])
          setManagersName([])
          reset()
        } catch (error) {
          console.error(
            `${permission.permissionName} 권한 수정 중 에러 발생:`,
            error,
          )
        }
      }
    }
  }

  return (
    <FilterForm onSubmit={handleSubmit(onSubmit)}>
      <ItemBox>
        <InputBox>
          <Controller
            control={control}
            name="manageUserIds"
            rules={{
              required: {
                value: true,
                message: '대상을 선택해주세요.',
              },
            }}
            render={({ field }) => (
              <>
                <Textarea
                  readOnly
                  value={String(managersName)}
                  label={<FilterLabel>{permission.permissionName}</FilterLabel>}
                  labelPlacement="outside-left"
                  className="max-w-full"
                  variant="bordered"
                  minRows={1}
                  onClick={onOpen}
                  {...register('manageUserIds')}
                />
                <Suspense
                  fallback={
                    <LodingDiv>
                      <i className="xi-spinner-2" />
                    </LodingDiv>
                  }
                >
                  <ManagersModal
                    isOpen={isOpen}
                    onClose={onClose}
                    managers={managers}
                    setManagers={setManagers}
                    setValue={setValue}
                    setManagersName={setManagersName}
                  />
                </Suspense>
              </>
            )}
          />
          {errors.manageUserIds && (
            <p className="px-2 pt-2 text-xs text-red">
              {String(errors.manageUserIds.message)}
            </p>
          )}
        </InputBox>
        <FlexBox>
          <Button type="submit" color="primary" size="md" className="w-full">
            추가
          </Button>
        </FlexBox>
      </ItemBox>
    </FilterForm>
  )
}
