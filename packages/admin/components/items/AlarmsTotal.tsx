import { styled } from 'styled-components'
import { useRecoilState } from 'recoil'
import { alarmsTotalState } from '@/lib/recoilAtoms'

const NotiNum = styled.span`
  display: flex;
  align-items: center;
  padding: 0 0.3rem;
  min-width: 1.2rem;
  height: 1.2rem;
  border-radius: 1rem;
  position: absolute;
  left: 50%;
  top: -0.2rem;
  background: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  color: #fff;
  line-height: 1rem;
  justify-content: center;
  z-index: 2;

  @media screen and (max-width: 1024px) {
    min-width: 1rem;
    height: 1rem;
    left: 40%;
    top: 0;
    font-size: 0.7rem;
  }
`

export default function AlarmsTotal() {
  const [alarmsTotal, setAlarmsTotal] = useRecoilState(alarmsTotalState)

  return <NotiNum>{alarmsTotal > 100 ? '100+' : alarmsTotal}</NotiNum>
}
