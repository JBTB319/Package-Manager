import { useState } from 'react'

function PackageForm() {
  const [name, setName] = useState('')
  const [version, setVersion] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, version })
      })

      if (!response.ok) throw new Error('Failed to submit')
      
      setSuccess(true)
      setName('')
      setVersion('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Package name"
      />
      <input
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        placeholder="Version"
      />
      <button type="submit">Submit</button>
      {success && <p>Package submitted!</p>}
      {error && <p>Error: {error}</p>}
    </form>
  )
}

export default PackageForm