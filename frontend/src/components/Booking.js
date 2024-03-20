import React, { useEffect, useState } from 'react'
import Calendar from './Calendar'
import serviceService from '../services/services'
import bookingService from '../services/bookings'
import Summary from './Summary'
import ServiceTypeSelection from './ServiceTypeSelection'
import ServiceSelection from './ServiceSelection'
import CustomerInfo from './CustomerInfo'
import BookingCompleted from './BookingCompleted'

const Booking = () => {
  const [step, setStep] = useState(0)
  const [serviceType, setServiceType] = useState(null)
  const [service, setService] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [time, setTime] = useState(null)
  const [worker, setWorker] = useState({ username: 'anyone', firstName: 'Kuka tahansa' })
  const [workers, setWorkers] = useState([])
  const [totalDuration, setTotalDuration] = useState(0)

  const handleServiceTypeSelection = selectedServiceType => {
    setServiceType(selectedServiceType)
    setStep(1)
  }

  const handleServiceSelection = (service) => {
    //console.log('Worker in Booking component:', worker)
    let newTotalPrice = totalPrice
    let newTotalDuration = totalDuration
    let workers = service.priceByWorker.map(p => p.worker)

    if (!selectedServices.includes(service)) {
      setSelectedServices([...selectedServices, service])
      setWorkers(workers)
      console.log('Workers:', workers)
      newTotalPrice += service.minPrice
      setTotalPrice(newTotalPrice)
      newTotalDuration += service.duration
      setTotalDuration(newTotalDuration)
      console.log('Total duration:', totalDuration)
    } else {
      setSelectedServices(selectedServices.filter(s => s !== service))
      newTotalPrice -= service.minPrice
      setTotalPrice(newTotalPrice)
      newTotalDuration -= service.duration
      setTotalDuration(newTotalDuration)
      console.log('Total duration:', totalDuration)
    }
  }

  const handleRemoveService = (service) => {
    setSelectedServices(selectedServices.filter(s => s !== service))
  }

  const handleChooseTime = () => {
    setStep(2)
  }

  const handleTimeSelection = selectedTime => {
    setTime(selectedTime)
    setStep(3)
  }

  // what type is selectedWorker?
  const handleWorkerSelection = selectedWorker => {
    setWorker(selectedWorker)
  }

  // Choosing the worker, setting time and ONLY THE FIRST SERVICE OF SERVICESELECTION (totalDuration not ok?)
  const handleSlotSelection = async (slot) => {
    if (slot.workers.length === 1) {
      handleWorkerSelection(slot.workers[0])
    } else {
      //how to select the worker?
      const worker = await bookingService.getWorkerWithLeastBookings(slot.workers)
      handleWorkerSelection(worker.username)
    }
    handleTimeSelection(slot.date)
    setService(selectedServices[0].name)
  }

  const handleWorkersSelection = (selectedWorkers) => {
    setWorkers(selectedWorkers)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleBackTwo = () => {
    setStep(step - 2)
  }

  const handleBackThree = () => {
    setStep(step - 3)
  }

  const handleBookingSubmission = (firstName, lastName, phone, email, additionalInfo) => {
    const endTime = new Date(time)
    endTime.setMinutes(endTime.getMinutes() + totalDuration)
    console.log('Booking completed:', { serviceType, service, time, endTime, totalDuration, totalPrice, worker, firstName, lastName, phone, email, additionalInfo  })
    bookingService.createBooking({ serviceType, service, time, endTime, totalDuration, totalPrice, worker, firstName, lastName, phone, email, additionalInfo })
    setStep(4)
  }

  return (
    <div className="App-header">
      {step === 0 && <ServiceTypeSelection onSelect={handleServiceTypeSelection} />}
      {step === 1 && <ServiceSelection onSelect={handleServiceSelection} serviceType={serviceType} onBack={handleBack} selectedServices={selectedServices} />}
      {(step === 0 || step === 1) && <Summary selectedServices={selectedServices} onSelect={handleChooseTime} onRemoveService={handleServiceSelection} totalPrice={totalPrice} />}
      {step === 2 && <Calendar onSelect={handleSlotSelection} onWorkerSelect={handleWorkerSelection} workers={workers} onBackTwo={handleBackTwo} totalDuration={totalDuration} worker={worker} />}
      {step === 3 && <CustomerInfo onSubmit={handleBookingSubmission} onBack={handleBack} onBackThree={handleBackThree} />}
      {step === 4 && <BookingCompleted onBackThree={handleBackThree} />}
    </div>
  )
}

export default Booking