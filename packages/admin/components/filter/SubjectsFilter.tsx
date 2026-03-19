import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useResetRecoilState } from 'recoil'
import { subjectPageState } from '@/lib/recoilAtoms'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
registerLocale('ko', ko)
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdviceSelect from '@/components/common/select/AdviceSelect'

const FilterBox = styled(motion.div)`
  z-index: 2;
  position: relative;
`
const FilterForm = styled.form`
  display: flex;
  width: 100%;
  gap: 1.5rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  flex-direction: column;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const BoxTop = styled.div`
  display: flex;
  flex: 1;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`
const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const BtnBox = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
`
const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  padding-bottom: 0.1rem;
  display: block;
`

const FilterVariants = {
  hidden: {
    scaleY: 0,
    transformOrigin: 'top',
    height: 0,
  },
  visible: {
    scaleY: 1,
    transformOrigin: 'top',
    height: 'auto',
    transition: {
      duration: 0.3,
    },
  },
}

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

export default function SubjectsFilter({
  isActive,
  onFilterSearch,
  setSubjectFilter,
  subjectFilter,
}) {
  const router = useRouter()
  const subjectPage = useResetRecoilState(subjectPageState)
  const [sub, setSub] = useState('-')
  const [exposure, setExposure] = useState('-')
  const [sbjName, setSbjName] = useState('')
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      exposure: '-',
      subDiv: '-',
      subjectName: '',
    },
  })
  useEffect(() => {
    if (
      Object.keys(subjectFilter).length === 0 ||
      subjectFilter?.subDiv === null
    ) {
      setSub('-')
    } else {
      setSub(subjectFilter?.subDiv)
    }
    if (
      Object.keys(subjectFilter).length === 0 ||
      subjectFilter?.exposure === null
    ) {
      setExposure('-')
    } else {
      setExposure(subjectFilter?.exposure ? '노출' : '미노출')
    }
    if (
      Object.keys(subjectFilter).length === 0 ||
      subjectFilter?.subjectName === null
    ) {
      setSbjName('')
    } else {
      setSbjName(subjectFilter?.subjectName)
    }
  }, [router, subjectFilter])

  const handleSubChange = e => {
    setSub(e.target.value)
  }

  const handleExposureChange = e => {
    setExposure(e.target.value)
  }
  const onSubmit = data => {
    if (isDirty) {
      const filter = {
        subjectName: data.subjectName === '' ? null : data.subjectName,
        subDiv: data.subDiv === '-' ? null : data.subDiv,
        exposure:
          data.exposure === '-'
            ? null
            : data.exposure === '노출'
            ? true
            : false,
      }
      setSubjectFilter(filter)
      onFilterSearch(true)
      subjectPage()
    }
  }

  const handleReset = () => {
    setSub('-')
    setExposure('-')
    reset()
  }

  return (
    <>
      <FilterBox
        variants={FilterVariants}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
        <FilterForm onSubmit={handleSubmit(onSubmit)}>
          <BoxTop>
            <ItemBox>
              <Controller
                control={control}
                name="subDiv"
                defaultValue={'-'}
                render={({ field }) => (
                  <Suspense
                    fallback={
                      <LodingDiv>
                        <i className="xi-spinner-2" />
                      </LodingDiv>
                    }
                  >
                    <AdviceSelect
                      selectedKey={sub}
                      field={field}
                      label={'수강구분'}
                      handleChange={handleSubChange}
                      optionDefault={{
                        type: '-',
                      }}
                      category={'수강구분'}
                    />
                  </Suspense>
                )}
              />
            </ItemBox>
            <ItemBox>
              <Controller
                control={control}
                name="exposure"
                defaultValue={'-'}
                render={({ field }) => (
                  <Select
                    labelPlacement="outside"
                    label={<FilterLabel>노출여부</FilterLabel>}
                    placeholder=" "
                    defaultValue={'-'}
                    className="w-full"
                    variant="bordered"
                    selectedKeys={[exposure]}
                    onChange={value => {
                      if (value.target.value !== '') {
                        field.onChange(value)
                        handleExposureChange(value)
                      }
                    }}
                  >
                    <SelectItem value="-" key={'-'}>
                      -
                    </SelectItem>
                    <SelectItem value="노출" key={'노출'}>
                      노출
                    </SelectItem>
                    <SelectItem value="미노출" key={'미노출'}>
                      미노출
                    </SelectItem>
                  </Select>
                )}
              />
            </ItemBox>
            <ItemBox>
              <Input
                labelPlacement="outside"
                placeholder=" "
                type="text"
                variant="bordered"
                label="과목명"
                value={sbjName}
                onValueChange={setSbjName}
                {...register('subjectName')}
              />
            </ItemBox>
          </BoxTop>
          <BtnBox>
            <Button
              type="submit"
              color="primary"
              className="w-[50%] text-white"
            >
              검색
            </Button>
            <Button
              color="primary"
              variant="bordered"
              className="w-[50%] text-primary"
              onClick={handleReset}
            >
              초기화
            </Button>
          </BtnBox>
        </FilterForm>
      </FilterBox>
    </>
  )
}
