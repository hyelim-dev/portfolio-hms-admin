import { Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { styled } from 'styled-components'
import Layout from '@/pages/students/layout'
import { useRecoilState } from 'recoil'
import { navOpenState } from '@/lib/recoilAtoms'
import { useMutation } from '@apollo/client'
import {
  REQ_REFUND_MUTATION,
  SEARCH_PAYMENT_MUTATION,
} from '@/graphql/mutations'
// import useUserLogsMutation from '@/utils/userLogs'
import SuspenseWrap from '@/components/wrappers/SuspenseWrap'
import PermissionBtn from '@/components/common/PermissionBtn'

const FlexCardBox = styled.div<{ $IsRefund: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 2px solid hsl(240 6% 90%);
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${props => (props.$IsRefund ? 'hsl(240 5% 96%)' : 'transparent')};
`
const FlexBox = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const FlexCol = styled.div<{ $navOpen: boolean }>`
  display: flex;
  width: 100%;
  gap: 1rem;

  @media (max-width: 1400px) {
    flex-direction: ${props => (props.$navOpen ? 'column' : 'row')};
  }
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`
const Flex = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const AreaBox = styled.div`
  flex: 1;
  width: 100%;
`
const AreaBoxL = styled.div`
  flex: 1;
  min-width: 25%;
  width: 100%;
`
const FilterLabel = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.black};
  display: block;
  padding-bottom: 0.375rem;
  span {
    color: red;
  }
`
const BtnBox = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`
const FlatBox = styled.div`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background: hsl(240 5% 96%);
  height: 40px;
  line-height: 40px;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`

export default function PaymentDetailItem({
  detailtData,
  paymentId,
  setStudentPaymentDetailData,
}) {
  const router = useRouter()
  const [navOpen, setNavOpen] = useRecoilState(navOpenState)
  // const { userLogs } = useUserLogsMutation()
  const [reqRefoundMutation] = useMutation(REQ_REFUND_MUTATION)
  const [searchStudentPayment] = useMutation(SEARCH_PAYMENT_MUTATION)

  const clickReqRefund = () => {
    if (detailtData.reqRefund) {
      const isAssignment = confirm('결제를 취소요청을 철회 하시겠습니까?')
      if (isAssignment) {
        reqRefoundMutation({
          variables: {
            reqRefundId: detailtData.id,
            reqRefund: false,
            reqRefundDate: '',
          },
          onCompleted: result => {
            if (result.reqRefund.ok) {
              searchStudentPayment({
                variables: {
                  searchStudentPaymentId: parseInt(paymentId),
                },
                onCompleted: data => {
                  if (data.searchStudentPayment.ok) {
                    setStudentPaymentDetailData(
                      data.searchStudentPayment?.data[0]?.paymentDetail,
                    )
                  }
                },
              })
            }
          },
        })
      }
    } else {
      const isAssignment = confirm('결제를 취소 요청 하시겠습니까?')
      if (isAssignment) {
        reqRefoundMutation({
          variables: {
            reqRefundId: detailtData.id,
            reqRefund: true,
            reqRefundDate: new Date(),
          },
          onCompleted: result => {
            // userLogs(
            //   `paymentDetail ID : ${detailtData.id} / 결제취소 요청`,
            //   `ok: ${result.reqRefund.ok}`,
            // )
            if (result.reqRefund.ok) {
              searchStudentPayment({
                variables: {
                  searchStudentPaymentId: parseInt(paymentId),
                },
                onCompleted: data => {
                  if (data.searchStudentPayment.ok) {
                    setStudentPaymentDetailData(
                      data.searchStudentPayment?.data[0]?.paymentDetail,
                    )
                    alert('결제 취소요청 되었습니다.')
                  }
                },
              })
            }
          },
        })
      }
    }
  }

  const formatDate = (data, isTime) => {
    const timestamp = parseInt(data, 10)
    const date = new Date(timestamp)
    if (isTime) {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}`
      return formatted
    } else {
      const formatted =
        `${date.getFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} `
      return formatted
    }
  }

  const feeFormet = fee => {
    const result = fee
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    return result
  }

  return (
    <>
      {detailtData?.cashOrCard === '현금' && (
        <>
          <FlexCardBox $IsRefund={detailtData.reqRefund}>
            <FlexBox>
              <AreaBoxL>
                <div>
                  <FilterLabel>결제일시</FilterLabel>
                  <FlatBox>
                    {detailtData?.paymentDate
                      ? formatDate(detailtData?.paymentDate, true)
                      : '-'}
                  </FlatBox>
                </div>
              </AreaBoxL>
              <AreaBox>
                <div>
                  <FilterLabel>은행명</FilterLabel>
                  <FlatBox>{detailtData?.bankName}</FlatBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>입금자명</FilterLabel>
                  <FlatBox>{detailtData?.depositorName}</FlatBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>결제금액</FilterLabel>
                  <FlatBox>
                    {detailtData?.depositAmount === null
                      ? ''
                      : feeFormet(detailtData?.depositAmount)}
                    원
                  </FlatBox>
                </div>
              </AreaBox>
              <AreaBox>
                <div>
                  <FilterLabel>회계담당자</FilterLabel>
                  <FlatBox>
                    {detailtData?.accountingManager
                      ? detailtData?.accountingManager
                      : '-'}
                  </FlatBox>
                </div>
              </AreaBox>
            </FlexBox>
            {detailtData.refundApproval ? (
              <BtnBox>
                <Button
                  isDisabled={true}
                  size="md"
                  radius="md"
                  variant="solid"
                  className="w-full"
                >
                  환불 완료
                </Button>
              </BtnBox>
            ) : (
              <BtnBox>
                {/* <Button
                        size="md"
                        radius="md"
                        variant="bordered"
                        color="primary"
                        className="w-full"
                      >
                        영수증 인쇄
                      </Button> */}
                <SuspenseWrap>
                  <PermissionBtn
                    btnName={'결제 변경'}
                    style={{
                      size: 'md',
                      variant: 'solid',
                      css: 'w-full text-white',
                    }}
                    permissionName={'결제관리'}
                    handleClick={() => {
                      router.push(`/students/edit/payment/${detailtData.id}`)
                    }}
                  />
                </SuspenseWrap>
                {detailtData.reqRefund ? (
                  <>
                    <Button
                      size="md"
                      radius="md"
                      className="w-full md:max-w-[50%] text-white bg-accent"
                      onClick={() => clickReqRefund()}
                    >
                      결제 취소요청 철회
                    </Button>
                  </>
                ) : (
                  <Button
                    size="md"
                    radius="md"
                    variant="bordered"
                    className="w-full md:max-w-[50%] text-accent border-accent"
                    onClick={() => clickReqRefund()}
                  >
                    결제 취소 요청
                  </Button>
                )}
              </BtnBox>
            )}
          </FlexCardBox>
        </>
      )}
      {detailtData?.cashOrCard === '카드' && (
        <>
          <FlexCardBox $IsRefund={detailtData.reqRefund}>
            <FlexBox>
              <FlexCol $navOpen={navOpen}>
                <Flex>
                  <AreaBoxL>
                    <div>
                      <FilterLabel>결제일시</FilterLabel>
                      <FlatBox>
                        {detailtData?.paymentDate
                          ? formatDate(detailtData?.paymentDate, true)
                          : '-'}
                      </FlatBox>
                    </div>
                  </AreaBoxL>
                  <AreaBox>
                    <div>
                      <FilterLabel>승인번호</FilterLabel>
                      <FlatBox>{detailtData?.ApprovalNum}</FlatBox>
                    </div>
                  </AreaBox>
                  <AreaBox>
                    <div>
                      <FilterLabel>카드회사명</FilterLabel>
                      <FlatBox>{detailtData?.cardCompany}</FlatBox>
                    </div>
                  </AreaBox>
                </Flex>
                <Flex>
                  <AreaBox>
                    <div>
                      <FilterLabel>할부개월</FilterLabel>
                      <FlatBox>
                        {detailtData?.installment === 0
                          ? '1'
                          : detailtData?.installment}
                        개월
                      </FlatBox>
                    </div>
                  </AreaBox>
                  <AreaBox>
                    <div>
                      <FilterLabel>결제금액</FilterLabel>
                      <FlatBox>
                        {detailtData?.amountPayment === null
                          ? ''
                          : feeFormet(detailtData?.amountPayment)}
                        원
                      </FlatBox>
                    </div>
                  </AreaBox>
                  <AreaBox>
                    <div>
                      <FilterLabel>회계담당자</FilterLabel>
                      <FlatBox>
                        {detailtData?.accountingManager
                          ? detailtData?.accountingManager
                          : '-'}
                      </FlatBox>
                    </div>
                  </AreaBox>
                </Flex>
              </FlexCol>
              {/* <AreaBox>
                <div>
                  <FilterLabel>영수구분</FilterLabel>
                  <FlatBox>{detailtData?.ReceiptClassification}</FlatBox>
                </div>
              </AreaBox> */}
            </FlexBox>
            {detailtData.refundApproval ? (
              <BtnBox>
                <Button
                  isDisabled={true}
                  size="md"
                  radius="md"
                  variant="solid"
                  className="w-full"
                >
                  환불 완료
                </Button>
              </BtnBox>
            ) : (
              <BtnBox>
                {/* <Button
                size="md"
                radius="md"
                variant="bordered"
                color="primary"
                className="w-full"
              >
                영수증 인쇄
              </Button> */}
                <SuspenseWrap>
                  <PermissionBtn
                    btnName={'결제 변경'}
                    style={{
                      size: 'md',
                      variant: 'solid',
                      css: 'w-full text-white',
                    }}
                    permissionName={'결제관리'}
                    handleClick={() => {
                      router.push(`/students/edit/payment/${detailtData.id}`)
                    }}
                  />
                </SuspenseWrap>
                {detailtData.reqRefund ? (
                  <Button
                    isDisabled={detailtData.refundApproval ? true : false}
                    size="md"
                    radius="md"
                    className="w-full md:max-w-[50%] text-white bg-accent"
                    onClick={() => clickReqRefund()}
                  >
                    결제 취소요청 철회
                  </Button>
                ) : (
                  <Button
                    size="md"
                    radius="md"
                    variant="bordered"
                    className="w-full md:max-w-[50%] text-accent border-accent"
                    onClick={() => clickReqRefund()}
                  >
                    결제 취소 요청
                  </Button>
                )}
              </BtnBox>
            )}
          </FlexCardBox>
        </>
      )}
    </>
  )
}
PaymentDetailItem.getLayout = page => <Layout>{page}</Layout>
