export default function AppPreloader({ error = false }) {
  return (
    <div className="app-preloader" role="status" aria-live="polite" aria-label={error ? 'Content is taking longer than expected' : 'Loading IEYDA'}>
      <div className="app-preloader__glow" />
      <div className="app-preloader__mark" aria-hidden="true">
        <span className="app-preloader__ring app-preloader__ring--outer" />
        <span className="app-preloader__ring app-preloader__ring--inner" />
        <img className="app-preloader__logo" src="/ieyda_logo_transparent.png" alt="IEYDA" />
      </div>
      <p className="app-preloader__title">Ilorin Emirate Youth Development Association</p>
      <p className="app-preloader__message">{error ? 'Connecting to the latest community update…' : 'Preparing the latest community update…'}</p>
      <div className="app-preloader__track" aria-hidden="true"><span /></div>
    </div>
  )
}
