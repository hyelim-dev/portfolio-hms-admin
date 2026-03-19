import { SEARCH_MANAGEUSER_QUERY } from '@/graphql/queries'
import { SearchManageUserResult } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type searchManageUserQuery = {
  searchManageUser: SearchManageUserResult
}

export default function ManagerSelect({
  defaultValue = null,
  selectedKey,
  field,
  label,
  handleChange,
  optionDefault,
  filter,
  isId,
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
      searchManageUserId: filter.id,
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
      searchManageUserId: filter.id,
      resign: 'N',
    })
  }, [router])

  return (
    <>
      <Select
        labelPlacement="outside"
        label={label}
        placeholder=" "
        className="w-full"
        defaultValue={defaultValue}
        variant="bordered"
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
