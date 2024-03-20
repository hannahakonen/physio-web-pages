import CancelIcon from '@mui/icons-material/Cancel'

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

export default Summary