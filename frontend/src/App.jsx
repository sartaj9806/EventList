import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import axios from 'axios'

const App = () => {

  const [events, setEvents] = useState([])
  const [isEmail, setIsEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [isOtp, setIsOtp] = useState(false)
  const [OtpBox, setOtpBox] = useState(false)
  const [isVerify, setIsVerify] = useState(false)
  const [ticketLink, setTicketLink] = useState('')
  const [otp, setOtp] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/event')

        if (data.success) {
          setEvents(data.data)
        } else {
          console.error('Failed to fetch events:', data.message)
        }

      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()

  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isOtp) {
      try {
        const { data } = await axios.post('http://localhost:3000/verify-otp', { email, otp })

        if (data.success) {
          setIsEmail(false)
          window.open(ticketLink, '_blank')
          setIsVerify(true)
          alert('OTP verified successfully')
        } else {
          alert('Invalid OTP')
        }

      } catch (error) {
        console.error('Error verifying OTP:', error)
      }
    } else {
      try {
        const { data } = await axios.post('http://localhost:3000/get-otp', { email })

        if (data.success) {
          setIsOtp(true)
          setOtpBox(true)
          alert('OTP sent successfully')
        } else {
          alert('Failed to send OTP')
        }

      } catch (error) {
        console.error('Error sending OTP:', error)
      }
    }

  }

  const handleEmailBox = (link) => {
    setIsEmail(true)
    setTicketLink(link)
  }

  return (
    <div>

      <Navbar />



      <div className="container mx-auto mt-10 relative ">

        {
          isEmail && <div className='fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
            <form onSubmit={handleSubmit} className='w-[500px] p-4 rounded-md shadow-md bg-white'>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded-md text-base px-4 py-2 w-full mb-4' type="text" placeholder='Enter Your Email' />
              {OtpBox && <input onChange={(e) => setOtp(e.target.value)} value={otp} className='border rounded-md text-base px-4 py-2 w-full mb-4' type="text" placeholder='Enter Your OTP' />}
              <button className='bg-blue-500 text-white px-4 py-2 rounded-md w-full'>{!isOtp ? 'Get Otp' : 'Verify Otp'}</button>

            </form>
          </div>
        }

        <h1 className='text-center text-red-500 font-bold text-2xl'>All listed Event</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>


          {
            events.map((event, index) => (
              <div key={index} className='bg-white shadow-md rounded-lg p-4 h-fit'>
                <img className='w-full h-full mb-2' src={event.image} alt="" />
                <h2 className='text-xl font-bold mb-2'>{event.title}</h2>
                <p className='text-gray-600'>{event.data}</p>

                <button onClick={() => handleEmailBox(event.link)} className='bg-blue-500 text-white px-4 py-2 rounded mt-2'>Get Ticket</button>

              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default App
