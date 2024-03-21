import React, { useState } from 'react'

const CustomerInfo = ({ onSubmit, onBack, onBackThree }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(firstName, lastName, phone, email, additionalInfo)
  }

  return (
    <div>
      <button onClick={onBackThree}>Palvelu</button>
      <button onClick={onBack}>Aika</button>
      <button>Tiedot</button>
      <button disabled>Valmis</button>
      <h1>Lisää tietosi</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Etunimi" required onChange={e => setFirstName(e.target.value)} />
        <input type="text" placeholder="Sukunimi" required onChange={e => setLastName(e.target.value)} />
        <input type="text" placeholder="Puhelin" required onChange={e => setPhone(e.target.value)} />
        <input type="email" placeholder="Sähköpostiosoite" required onChange={e => setEmail(e.target.value)} />
        <input type="text" placeholder="Lisätiedot/erityistoiveet" onChange={e => setAdditionalInfo(e.target.value)} />

        <button type="submit">Vahvista varaus</button>
      </form>
    </div>
  )
}

export default CustomerInfo