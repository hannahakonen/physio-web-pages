import React, { useEffect, useState } from 'react'
import Calendar from './Calendar'
import serviceService from '../services/services'

const Booking = () => {
  const [step, setStep] = useState(0)
  const [serviceType, setServiceType] = useState(null)
  const [serviceTypes, setServiceTypes] = useState([])
  const [service, setService] = useState(null)
  const [time, setTime] = useState(null)
  const [worker, setWorker] = useState(null)

  useEffect(() => {
    serviceService.getAllTypes()
      .then(initialServiceTypes => {
        setServiceTypes(initialServiceTypes)
      })
  }, [])

  const handleServiceTypeSelection = selectedServiceType => {
    setServiceType(selectedServiceType)
    setStep(1)
  }

  const handleServiceSelection = selectedService => {
    setService(selectedService)
    setStep(2)
  }

  const handleTimeSelection = selectedTime => {
    setTime(selectedTime)
    setStep(3)
  }

  const handleWorkerSelection = selectedWorker => {
    setWorker(selectedWorker)
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
      {step === 0 && <ServiceTypeSelection serviceTypes={serviceTypes} onSelect={handleServiceTypeSelection} />}
      {step === 1 && <ServiceSelection onSelect={handleServiceSelection} serviceType={serviceType} onBack={handleBack} />}
      {step === 2 && <Calendar onSelect={handleTimeSelection} onWorkerSelect={handleWorkerSelection} onBackTwo={handleBackTwo} />}
      {step === 3 && <CustomerInfo onSubmit={handleCustomerInfoSubmission} onBack={handleBack} onBackThree={handleBackThree} />}
      {step === 4 && <BookingCompleted onBackThree={handleBackThree} />}
    </div>
  )
}

const ServiceTypeSelection = ({ serviceTypes, onSelect }) => {
  //const serviceTypes = ['Fysioterapia', 'Klassinen hieronta', 'Kuumakivihieronta']

  // DO: Aika button not disabled if at least one service selected
  // DO: Move links to booking?
  return (
    <div>
      <button>Palvelu</button>
      <button disabled>Aika</button>
      <button disabled>Tiedot</button>
      <button disabled>Valmis</button>
      <h1>Select a Service Type</h1>
      {serviceTypes.map(serviceType => (
        <button key={serviceType} onClick={() => onSelect(serviceType)}>
          {serviceType}
        </button>
      ))}
    </div>
  )
}

const ServiceSelection = ({ onSelect, serviceType, onBack }) => {
  const [serviceNames, setServiceNames] = useState([])
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
      .then(initialServiceNames => {
        setServiceNames(initialServiceNames)
      })
  }, [serviceType])

  const handleSelect = (name) => {
    onSelect(name)
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
      {serviceNames.map(name => (
        <button key={name} onClick={() => handleSelect(name)}>
          {name}
        </button>
      ))}
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