import React, { useEffect, useState } from 'react'
import Calendar from './Calendar'
import serviceService from '../services/services'
import bookingService from '../services/bookings'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'


const Booking = () => {
  const [step, setStep] = useState(0)
  const [serviceType, setServiceType] = useState(null)
  const [service, setService] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [time, setTime] = useState(null)
  const [worker, setWorker] = useState('anyone')
  const [workers, setWorkers] = useState([])
  const [totalDuration, setTotalDuration] = useState(0)

  const handleServiceTypeSelection = selectedServiceType => {
    setServiceType(selectedServiceType)
    setStep(1)
  }
  /*
  const handleServiceSelection = selectedService => {
    setService(selectedService)
    setStep(2)
  }
*/
  const handleServiceSelection = (service) => {
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

  // Choosing the worker, setting time and ONLY THE FIRST SERVICE OF SERVICESELECTION
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

  // TO DO: save to DB bookings
  // TO DO: if saving to DB succeeds:
  // TO DO: send email to customer and worker
  const handleCustomerInfoSubmission = () => {
    // Handle the submission of the customer's information
    console.log('Booking completed:', { service, time, worker })
    setStep(4)
  }

  return (
    <div className="App-header">
      {step === 0 && <ServiceTypeSelection onSelect={handleServiceTypeSelection} />}
      {step === 1 && <ServiceSelection onSelect={handleServiceSelection} serviceType={serviceType} onBack={handleBack} selectedServices={selectedServices} />}
      {(step === 0 || step === 1) && <Summary selectedServices={selectedServices} onSelect={handleChooseTime} onRemoveService={handleServiceSelection} totalPrice={totalPrice} />}
      {step === 2 && <Calendar onSelect={handleSlotSelection} onWorkerSelect={handleWorkerSelection} workers={workers} onBackTwo={handleBackTwo} totalDuration={totalDuration} worker={worker} />}
      {step === 3 && <CustomerInfo onSubmit={handleCustomerInfoSubmission} onBack={handleBack} onBackThree={handleBackThree} />}
      {step === 4 && <BookingCompleted onBackThree={handleBackThree} />}
    </div>
  )
}

const Summary = ({ selectedServices, onSelect, onRemoveService, totalPrice }) => {

  return (
    <div>
      <h1>Summary</h1>
      {selectedServices.length === 0 ? (
        <p>Choose service</p>
      ) : (
        <>
          {selectedServices.map((service, index) => (
            <p key={index} onClick={() => onRemoveService(service)} style={{
              cursor: 'pointer'
            }}>
            Service: {service.name} Alkaen {service.minPrice} €
              <CancelIcon />
            </p>
          ))}
          <p>Total: {totalPrice} €</p>
        </>
      )}
      <div onClick={selectedServices.length > 0 ? onSelect : null} style={{ cursor: selectedServices.length > 0 ? 'pointer' : 'default' }}>
        Select time
      </div>
    </div>
  )
}

const ServiceTypeSelection = ({ onSelect }) => {
  const [serviceTypes, setServiceTypes] = useState([])
  //const serviceTypes = ['Fysioterapia', 'Klassinen hieronta', 'Kuumakivihieronta']

  useEffect(() => {
    serviceService.getAllTypes()
      .then(initialServiceTypes => {
        setServiceTypes(initialServiceTypes)
      })
  }, [])
  // DO: Aika button not disabled if at least one service selected
  // DO: Move links to booking?
  return (
    <div>
      <button>Palvelu</button>
      <button disabled>Aika</button>
      <button disabled>Tiedot</button>
      <button disabled>Valmis</button>
      <h1>Select a Service Type</h1>
      <div>
        {serviceTypes.map((type, index) => (
          <div
            key={index}
            onClick={() => onSelect(type)}
            style={{
              border: '1px solid #000',
              borderRadius: '5px',
              padding: '10px',
              margin: '10px',
              cursor: 'pointer'
            }}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  )
}

const ServiceSelection = ({ onSelect, serviceType, onBack, selectedServices }) => {
  const [servicesByType, setServicesByType] = useState([])
  /*
  let services = []
  if (serviceType === 'Fysioterapia') {
    services = ['Fysioterapia 60 min']
  } else if (serviceType === 'Klassinen hieronta') {
    services = ['Klassinen hieronta 30 min', 'Klassinen hieronta 60 min', 'Klassinen hieronta 90 min']
  } else if (serviceType === 'Kuumakivihieronta') {
    services = ['Kuumakivihieronta 60 min']
  }
  */
  useEffect(() => {
    serviceService.getServicesByType(serviceType)
      .then(service => {
        console.log(service)
        setServicesByType(service)
      })
  }, [serviceType])

  const handleSelect = (service) => {
    onSelect(service)
  }
  // DO: Aika button not disabled if at least one service selected
  return (
    <div>
      <button>Palvelu</button>
      <button disabled>Aika</button>
      <button disabled>Tiedot</button>
      <button disabled>Valmis</button>
      <h1>Select a Service</h1>
      <div>
        <button onClick={onBack}>Valitse lisää palveluita</button>
      </div>
      <div>
        {servicesByType.map((service, index) => (
          <div
            key={index}
            onClick={() => handleSelect(service)}
            style={{
              border: '1px solid #000',
              borderRadius: '5px',
              padding: '10px',
              margin: '10px',
              cursor: 'pointer'
            }}
          >
            {service.name} {service.minPrice} €
            {selectedServices.some(selectedService => selectedService.name === service.name) && <CheckCircleIcon onClick={() => onSelect(service)} />}
            {service.description && <p style={{ fontSize: '13px' }}>{service.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

const CustomerInfo = ({ onSubmit, onBack, onBackThree }) => {
  return (
    <div>
      <button onClick={onBackThree}>Palvelu</button>
      <button onClick={onBack}>Aika</button>
      <button>Tiedot</button>
      <button disabled>Valmis</button>
      <h1>Enter Your Information</h1>
      <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

const BookingCompleted = ({ onBackThree }) => {
  return (
    <div>
      <button disabled>Palvelu</button>
      <button disabled>Aika</button>
      <button disabled>Tiedot</button>
      <button>Valmis</button>
      <h1>Booking completed!</h1>
    </div>
  )
}

export default Booking