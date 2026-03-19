import { styled } from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  useDisclosure,
} from '@nextui-org/react'
import PortfolioModal from '@/components/modal/PortfolioModal'
import { DELETE_PORTFOLIO_MUTATION } from '@/graphql/mutations'
import { useMutation } from '@apollo/client'
import { SEARCH_SM_QUERY } from '@/graphql/queries'
// import useUserLogsMutation from '@/utils/userLogs'

const PortfolioFigure = styled.figure`
  width: 100%;
  height: 140px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const PortfolioBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem;
  width: 100%;
`

export default function PortfolioItem({ item, index, portfolioId }) {
  // const { userLogs } = useUserLogsMutation()
  const [deletePortfolio] = useMutation(DELETE_PORTFOLIO_MUTATION)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const getFileNameFromUrl = url => {
    return url.substring(url.lastIndexOf('/') + 1)
  }

  const deleteImg = () => {
    const isDelete = confirm(
      '해당 포트폴리오를 삭제하시겠습니까? \n삭제 후 되돌릴 수 없습니다.',
    )
    if (isDelete) {
      deletePortfolio({
        variables: {
          deleteFileNameSpId: portfolioId,
          fileUrl: item,
          folderName: 'portfolios',
        },
        refetchQueries: [SEARCH_SM_QUERY],
        onCompleted: result => {
          // userLogs(
          //   `${portfolioId}의 ${getFileNameFromUrl(item)} 포트폴리오 삭제 `,
          //   `ok: ${result.deleteFileNameSp.ok}`,
          // )
          if (result.deleteFileNameSp.ok) {
            alert(`${getFileNameFromUrl(item)} 포트폴리오 삭제되었습니다.`)
          } else {
            if (
              result.deleteFileNameSp.error ===
              'Error:파일이 1개 남아있는 상태에서는 삭제가 되지 않습니다. 먼저 포트폴리오를 등록하고 삭제하세요.'
            ) {
              alert(
                '파일이 1개 남아있는 상태에서는 삭제가 되지 않습니다. 먼저 포트폴리오를 등록하고 삭제하세요.',
              )
            }
          }
        },
      })
    }
  }
  return (
    <>
      <Card shadow="sm">
        <CardBody className="p-0">
          <Button type="button" className="w-full h-full p-0" onClick={onOpen}>
            <PortfolioFigure>
              <img
                alt={getFileNameFromUrl(item)}
                className="w-full object-cover h-[140px]"
                src={item}
              />
            </PortfolioFigure>
          </Button>
        </CardBody>
        <CardFooter className="p-0">
          <PortfolioBtn>
            <a href={item} download={getFileNameFromUrl(item)}>
              <Button
                type="button"
                size="sm"
                variant={'bordered'}
                color="primary"
                className="text-[1.1rem]"
              >
                <i className="xi-download" />
              </Button>
            </a>

            <Button
              type="button"
              size="sm"
              variant={'bordered'}
              className="text-[1rem] border-accent text-accent"
              onClick={deleteImg}
            >
              <i className="xi-trash" />
            </Button>
          </PortfolioBtn>
        </CardFooter>
      </Card>
      <PortfolioModal isOpen={isOpen} onClose={onClose} item={item} />
    </>
  )
}
