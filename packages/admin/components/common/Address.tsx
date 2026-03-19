import { Button, Input } from '@nextui-org/react'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'

const AddrBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
  align-items: end;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
`
const AreaSmallBox = styled.div`
  display: flex;
  gap: 1rem;
  align-items: end;
  width: 30%;
  @media (max-width: 768px) {
    width: 100% !important;
  }
`
const FilterLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};

  span {
    color: ${({ theme }) => theme.colors.red};
  }
`

export default function Address({
  setValue,
  codeValueName,
  valueName,
  detailValueName,
  defaultPostcode = '',
  defaultAddress = '',
  defaultDetails = '',
}) {
  const [postcode, setPostcode] = useState('')
  const [roadAddress, setRoadAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')

  useEffect(() => {
    if (defaultPostcode !== '' || defaultPostcode !== null) {
      setPostcode(defaultPostcode)
    } else {
      setPostcode('')
    }
    if (defaultAddress !== '' || defaultAddress !== null) {
      setRoadAddress(defaultAddress)
    } else {
      setRoadAddress('')
    }
    if (defaultDetails !== '' || defaultDetails !== null) {
      setDetailAddress(defaultDetails)
    } else {
      setDetailAddress('')
    }
  }, [defaultPostcode, defaultAddress, defaultDetails])

  const handleClick = () => {
    const isMobile = window.innerWidth <= 768
    const width = isMobile ? window.innerWidth * 0.9 : 500
    const height = isMobile ? window.innerHeight * 0.7 : 500

    const windowLeft = window.screenX || window.screenLeft
    const windowTop = window.screenY || window.screenTop
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const left = windowLeft + (windowWidth - width) / 2
    const top = windowTop + (windowHeight - height) / 2

    new (window as any).daum.Postcode({
      width: width,
      height: height,
      oncomplete: (data: any) => {
        const roadAddr = data.roadAddress
        let extraRoadAddr = ''

        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr +=
            extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName
        }
        if (extraRoadAddr !== '') {
          extraRoadAddr = ' (' + extraRoadAddr + ')'
        }

        setPostcode(data.zonecode)
        setRoadAddress(roadAddr)
        setDetailAddress('')
        setValue(codeValueName, data.zonecode, { shouldDirty: true })
        setValue(valueName, roadAddr, { shouldDirty: true })
      },
    }).open({
      popupTitle: '우편번호 검색 팝업',
      popupKey: 'addressPopup1',
      left: left,
      top: top,
    })
  }
  const handleChange = event => {
    setDetailAddress(event.target.value)
    setValue(detailValueName, event.target.value, { shouldDirty: true })
  }
  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></Script>
      <AddrBox>
        <FlexBox>
          <AreaSmallBox>
            <Input
              type="text"
              id="sample4_postcode"
              label={<FilterLabel>주소</FilterLabel>}
              placeholder="우편번호"
              labelPlacement="outside"
              variant="flat"
              radius="md"
              className="w-full"
              value={postcode || ''}
              readOnly
            />
            <Button
              onClick={handleClick}
              className="text-white w-[10rem]"
              size="md"
              radius="md"
              variant="solid"
              color="primary"
            >
              주소 검색
            </Button>
          </AreaSmallBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Input
              type="text"
              id="sample4_roadAddress"
              placeholder="주소"
              labelPlacement="outside"
              variant="flat"
              radius="md"
              value={roadAddress || ''}
              className="w-full"
              readOnly
            />
          </AreaBox>
        </FlexBox>
        <FlexBox>
          <AreaBox>
            <Input
              type="text"
              value={detailAddress || ''}
              id="sample4_detailAddress"
              placeholder="상세주소"
              labelPlacement="outside"
              radius="md"
              variant="bordered"
              className="w-full"
              onChange={e => handleChange(e)}
            />
          </AreaBox>
        </FlexBox>
      </AddrBox>
    </>
  )
}
