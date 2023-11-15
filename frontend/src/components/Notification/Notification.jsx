import { useUser } from '../../UserContext'
import './Notification.scss'
import {IoMdNotificationsOutline} from 'react-icons/io'

export default function Notification() {
  const {user} = useUser()
  return (
    <div className='notification'>
        <IoMdNotificationsOutline color={user.theme === 'light' ? 'color: rgb(75, 75, 75)' : 'white'} size={30}/>
        <div className='notification__number'><span>1</span></div>
    </div>
  )
}
