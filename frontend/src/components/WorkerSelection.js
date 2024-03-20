// TO DO: names/photos of workers from DB according to the selected service
const WorkerSelection = ({ onSelect, workers }) => {
  //const workers = ['Kuka tahansa', 'Laura', 'Mikko']
  const allWorkers = [...workers, { username: 'anyone', firstName: 'Kuka tahansa' }]
  return (
    <div>
      {workers.length > 0 ? (
        allWorkers.map((worker, i) => (
          worker.firstName ? (
            <button key={i} onClick={() => onSelect(worker)}>
              {worker.firstName}
            </button>
          ) : null
        ))
      ) : (
        <p>No workers available</p>
      )}
    </div>
  )
}

export default WorkerSelection