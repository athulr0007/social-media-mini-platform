export default function AuthLayout({ children }) {
  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <h1>
          More than just friends<br />
          truly connect
        </h1>
        <p>connect with global community on pingup.</p>
      </div>

      <div className="auth-right">
        {children}
      </div>
    </div>
  );
}





