import { useMemo } from 'react'

const InvitationPage = () => {
  const params = new URLSearchParams(window.location.search)
  const name = params.get('name') || 'Guest'
  const regNumber = params.get('reg') || ''
  const email = params.get('email') || ''

  const subject = useMemo(() => encodeURIComponent(`E-Invitation: ${name} — ${regNumber}`), [name, regNumber])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-primary text-white px-6 py-4 text-center">
          <h1 className="text-xl font-bold">Ilorin Children's Qur'an Recitation Championship 2026</h1>
          <p className="text-sm text-white/80 mt-1">Official E-Invitation</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3 space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Guest Name</p>
                <p className="text-lg font-bold text-blue-900">{name}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Registration Number</p>
                <p className="text-lg font-bold text-amber-900">{regNumber}</p>
              </div>
              {email && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs text-green-600 uppercase font-semibold mb-1">Sent To</p>
                  <p className="text-sm font-medium text-green-900 break-all">{email}</p>
                </div>
              )}
            </div>
            <div className="md:w-2/3 border rounded-lg overflow-hidden bg-gray-100">
              <iframe src="/QuranRecitationInvitation.pdf" className="w-full h-96 border-0" title="Invitation PDF" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
            <p><strong>Date:</strong> Thursday, 20 August 2026</p>
            <p><strong>Time:</strong> 10:00 a.m. Prompt</p>
            <p><strong>Venue:</strong> Ilorin Banquet Hall, Ahmadu Bello Way, Opposite Government House Ilorin, Kwara State</p>
            <p className="text-xs text-gray-500 mt-2">Admission is strictly by invitation. Please present this invitation at the venue.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => window.print()} className="btn-primary px-4 py-2 rounded-lg text-sm">Print Invitation</button>
            <a href={`/QuranRecitationInvitation.pdf`} download className="px-4 py-2 rounded-lg text-sm border border-gray-300">Download PDF</a>
            <a href={`mailto:?subject=${subject}&body=Dear ${encodeURIComponent(name)},%0A%0APlease find attached your e-invitation for the Ilorin Children's Qur'an Recitation Championship 2026.%0A%0ARegistration Number: ${encodeURIComponent(regNumber)}%0A%0ADate: Thursday, 20 August 2026%0ATime: 10:00 a.m. Prompt%0AVenue: Ilorin Banquet Hall, Ahmadu Bello Way, Opposite Government House Ilorin, Kwara State`} className="px-4 py-2 rounded-lg text-sm border border-gray-300">Share via Email</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvitationPage