import { SEE_ADVICE_TYPE_QUERY } from '@/graphql/queries'
import { ResultAdviceType } from '@/src/generated/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type seeAdviceTypeQuery = {
  seeAdviceType: ResultAdviceType
}

export default function AdviceSelect({
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

  const adviceList = optionDefault
    ? [optionDefault, ...adviceData?.seeAdviceType.adviceType]
    : adviceData?.seeAdviceType.adviceType

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
        {adviceList?.map(item => (
          <SelectItem key={item.type} value={item.type}>
            {item.type}
          </SelectItem>
        ))}
      </Select>
    </>
  )
}
