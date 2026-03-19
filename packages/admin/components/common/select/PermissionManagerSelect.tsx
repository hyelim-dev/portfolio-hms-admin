import { SEARCH_PERMISSIONS_GRANTED_QUERY } from '@/graphql/queries'
import { ResultSearchPermissionsGranted } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type SearchPermissionsGrantedQeury = {
  searchPermissionsGranted: ResultSearchPermissionsGranted
}

export default function PermissionManagerSelect({
  defaultValue = null,
  disabled = false,
  selectedKey,
  field,
  label,
  handleChange,
  optionDefault,
  parmissionName,
  isId,
}) {
  const router = useRouter()
  const {
    error: searchManagerError,
    data: searchManagerData,
    refetch,
  } = useSuspenseQuery<SearchPermissionsGrantedQeury>(
    SEARCH_PERMISSIONS_GRANTED_QUERY,
    {
      variables: {
        permissionName: parmissionName,
      },
    },
  )
  const managerList = [
    optionDefault,
    ...searchManagerData?.searchPermissionsGranted.data[0].ManageUser,
  ]

  if (searchManagerError) {
    console.log(searchManagerError)
  }

  useEffect(() => {
    refetch({
      permissionName: parmissionName,
    })
  }, [router])

  return (
    <>
      <Select
        isDisabled={disabled}
        labelPlacement="outside"
        label={label}
        placeholder=" "
        className="w-full"
        defaultValue={defaultValue}
        variant={disabled ? 'faded' : 'bordered'}
        selectedKeys={[selectedKey]}
        onChange={value => {
          if (value.target.value !== '') {
            field.onChange(value)
            handleChange(value)
          }
        }}
      >
        {managerList.map(item => (
          <SelectItem
            key={isId ? item.id : item.mUsername}
            value={isId ? item.id : item.mUsername}
          >
            {item.mUsername}
          </SelectItem>
        ))}
      </Select>
    </>
  )
}
