import React, { useState, useEffect } from 'react'
import serviceService from '../services/services'

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

export default ServiceTypeSelection