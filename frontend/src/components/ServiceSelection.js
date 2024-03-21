import React, { useState, useEffect } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import serviceService from '../services/services'
import services from '../services/services'

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

  //sort
  servicesByType.sort((a, b) => a.minPrice - b.minPrice)

  // DO: Aika button not disabled if at least one service selected
  return (
    <div>
      <button>Palvelu</button>
      <button disabled>Aika</button>
      <button disabled>Tiedot</button>
      <button disabled>Valmis</button>
      <h1>Valitse palvelu</h1>
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

export default ServiceSelection