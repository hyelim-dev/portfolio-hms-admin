import { SEARCH_MANAGEUSER_QUERY } from '@/graphql/queries'
import { SearchManageUserResult } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type searchManageUserQuery = {
  searchManageUser: SearchManageUserResult
}

export default function ManagerMultiSelectID({
  defaultSelectedKeys = null,
  selectedKey,
  field,
  label,
  handleChange,
  filter,
  labelPlace = null,
  optionDefault = null,
}) {
  const router = useRouter()
  const {
    error: searchManagerError,
    data: searchManagerData,
    refetch,
  } = useSuspenseQuery<searchManageUserQuery>(SEARCH_MANAGEUSER_QUERY, {
    variables: {
      mGrade: filter.mGrade,
      mRank: filter.mRank,
      mPart: filter.mPart,
      resign: 'N',
    },
  })
  const managerList = optionDefault
    ? [optionDefault, ...searchManagerData?.searchManageUser.data]
    : searchManagerData?.searchManageUser.data

  if (searchManagerError) {
    console.log(searchManagerError)
  }

  useEffect(() => {
    refetch({
      mGrade: filter.mGrade,
      mRank: filter.mRank,
      mPart: filter.mPart,
      resign: 'N',
    })
  }, [router])

  return (
    <>
      <Select
        labelPlacement={labelPlace ? labelPlace : 'outside'}
        label={label}
        placeholder=" "
        className={`w-full ${labelPlace === 'outside-left' && 'items-center'}`}
        isMultiline={true}
        selectionMode="multiple"
        defaultSelectedKeys={defaultSelectedKeys}
        variant="bordered"
        selectedKeys={selectedKey}
        onChange={value => {
          if (value.target.value !== '') {
            field.onChange(value)
          }
        }}
        onSelectionChange={handleChange}
      >
        {managerList.map(item => (
          <SelectItem key={item.id} value={item.id}>
            {item.mUsername}
          </SelectItem>
        ))}
      </Select>
    </>
  )
}
