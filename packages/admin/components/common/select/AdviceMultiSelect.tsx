import { SEE_ADVICE_TYPE_QUERY } from '@/graphql/queries'
import { ResultAdviceType } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { styled } from 'styled-components'

const Noti = styled.p`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  gap: 0.5rem;
  margin-top: 0.2rem;
  padding-left: 0.3rem;
  color: red;
`

type seeAdviceTypeQuery = {
  seeAdviceType: ResultAdviceType
}

export default function AdviceMultiSelect({
  defaultValue = null,
  selectedKey,
  field,
  label,
  handleChange,
  placeholder = ' ',
  optionDefault = null,
  filter = null,
  category,
}) {
  const router = useRouter()

  const {
    error: adviceError,
    data: adviceData,
    refetch,
  } = useSuspenseQuery<seeAdviceTypeQuery>(SEE_ADVICE_TYPE_QUERY, {
    variables: {
      page: 1,
      category: category,
      limit: 100,
    },
  })

  const adviceList = adviceData?.seeAdviceType.adviceType

  if (adviceError) {
    console.log(adviceError)
  }

  useEffect(() => {
    refetch({
      page: 1,
      category: category,
      limit: 100,
    })
  }, [router])

  return (
    <>
      <Select
        labelPlacement="outside"
        label={label}
        placeholder={placeholder}
        className="w-full"
        classNames={{
          value: 'text-black opacity-1',
        }}
        isMultiline={true}
        selectionMode="multiple"
        defaultValue={defaultValue}
        variant="bordered"
        selectedKeys={selectedKey}
        onChange={value => {
          if (value.target.value !== '') {
            field.onChange(value)
          }
        }}
        onSelectionChange={handleChange}
      >
        {adviceList?.map(item => (
          <SelectItem key={item.type} value={item.type}>
            {item.type}
          </SelectItem>
        ))}
      </Select>
      {adviceList.length === 0 && (
        <Noti>
          {category}이(가) 없습니다.
          <br />
          {category}을(를) 먼저 등록을 해주세요.
        </Noti>
      )}
    </>
  )
}
