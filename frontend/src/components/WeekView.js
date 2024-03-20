import Day from './Day'

const WeekView = ({ startDate, worktimes, bookings, onSelect, totalDuration, worker }) => {
  // Generate an array of dates for the week
  const dates = Array.from({ length: 7 }, (v, i) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    return date
  })

  const weekdays = ['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU']
  //const times = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']

  return (
    <div>
      <table>
        <thead>
          <tr>
            {weekdays.map((weekday, i) => (
              <th key={i}>{weekday}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {dates.map(date => (
              <td key={date.toString()}>
                <Day date={date} worktimes={worktimes} bookings={bookings} totalDuration={totalDuration} onSelect={onSelect} worker={worker} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default WeekView