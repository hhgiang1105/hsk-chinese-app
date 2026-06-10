import { useState } from 'react'
import { supabase } from '../supabase.js'
import './Auth.css'

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('signup')
  const [sliding, setSliding] = useState(false)
  const [slideDir, setSlideDir] = useState('left')

  // Signup fields
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [showPass, setShowPass] = useState(false)
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function switchMode(to) {
    if (sliding) return
    setSlideDir(to === 'login' ? 'left' : 'right')
    setSliding(true)
    setError('')
    setTimeout(() => { setMode(to); setSliding(false) }, 320)
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  async function handleSignup() {
    setError('')
    if (!fullName.trim())    { setError('Vui lòng nhập họ và tên'); triggerShake(); return }
    if (!username.trim())    { setError('Vui lòng nhập tên đăng nhập'); triggerShake(); return }
    if (username.length < 3) { setError('Tên đăng nhập phải có ít nhất 3 ký tự'); triggerShake(); return }
    if (!email.trim())       { setError('Vui lòng nhập email'); triggerShake(); return }
    if (!password.trim())    { setError('Vui lòng nhập mật khẩu'); triggerShake(); return }
    if (password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); triggerShake(); return }

    setLoading(true)

    // Check username unique
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.trim())
      .maybeSingle()

    if (existing) {
      setError('Tên đăng nhập đã tồn tại, chọn tên khác!')
      triggerShake()
      setLoading(false)
      return
    }

    // Sign up with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), username: username.trim() }
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Email này đã được đăng ký. Hãy đăng nhập!')
      } else {
        setError(signUpError.message)
      }
      triggerShake()
      setLoading(false)
      return
    }

    // Insert profile
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName.trim(),
        username: username.trim(),
        xp: 0,
        streak: 0,
        learned_count: 0,
        last_active: new Date().toISOString().split('T')[0],
      })

      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        onLogin({ id: data.user.id, fullName: fullName.trim(), username: username.trim(), email: email.trim() })
      }, 800)
    }
  }

  async function handleLogin() {
    setError('')
    if (!loginEmail.trim())    { setError('Vui lòng nhập email'); triggerShake(); return }
    if (!loginPassword.trim()) { setError('Vui lòng nhập mật khẩu'); triggerShake(); return }

    setLoading(true)

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    })

    if (loginError) {
      setError('Email hoặc mật khẩu không đúng!')
      triggerShake()
      setLoading(false)
      return
    }

    // Load profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    setLoading(false)
    setSuccess(true)
    setTimeout(() => {
      onLogin({
        id: data.user.id,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || 'Bạn',
        username: profile?.username || '',
        email: data.user.email,
        xp: profile?.xp || 0,
        streak: profile?.streak || 0,
        learnedCount: profile?.learned_count || 0,
      })
    }, 700)

    setLoading(false)
  }

  return (
    <div className="auth-shell">
      <div className="auth-bg">
        <div className="auth-bg-circle1" />
        <div className="auth-bg-circle2" />
        <div className="auth-bg-hanzi">学</div>
      </div>

      <div className="auth-logo">
        <div className="auth-logo-icon">🏮</div>
        <div className="auth-logo-text">Jiang Chinese</div>
        <div className="auth-logo-sub">天天向上，学无止境</div>
      </div>

      <div className={`auth-card ${sliding ? `slide-out-${slideDir}` : 'slide-in'} ${shake ? 'shake' : ''}`}>

        {mode === 'signup' ? (
          <>
            <div className="auth-title">Tham gia cùng<br /><span>Jiang Chinese</span></div>

            <div className="auth-field">
              <label>Họ và tên</label>
              <input type="text" placeholder="Nguyễn Văn A"
                value={fullName} onChange={e => { setFullName(e.target.value); setError('') }} />
            </div>
            <div className="auth-field">
              <label>Tên đăng nhập</label>
              <input type="text" placeholder="vd: giang123"
                value={username} onChange={e => { setUsername(e.target.value); setError('') }} />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" placeholder="example@gmail.com"
                value={email} onChange={e => { setEmail(e.target.value); setError('') }} />
            </div>
            <div className="auth-field">
              <label>Mật khẩu</label>
              <div className="auth-input-wrap">
                <input type={showPass ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự"
                  value={password} onChange={e => { setPassword(e.target.value); setError('') }} />
                <button className="auth-eye" onClick={() => setShowPass(s => !s)} type="button">
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">⚠ {error}</div>}

            {success ? (
              <div className="auth-success">
                <div className="auth-success-check">✓</div>
                <div className="auth-success-text">Đăng ký thành công!</div>
              </div>
            ) : (
              <button className={`auth-submit ${loading ? 'loading' : ''}`} onClick={handleSignup} disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Đăng ký ngay'}
              </button>
            )}

            <div className="auth-switch">
              Đã có tài khoản?{' '}
              <button onClick={() => switchMode('login')}>Đăng nhập</button>
            </div>
          </>
        ) : (
          <>
            <div className="auth-title">Mừng bạn<br /><span>trở lại!</span></div>

            {success ? (
              <div className="auth-success">
                <div className="auth-success-check">✓</div>
                <div className="auth-success-text">Chào mừng trở lại!</div>
              </div>
            ) : (
              <>
                <div className="auth-field">
                  <label>Email</label>
                  <input type="email" placeholder="Nhập email"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className={error ? 'error' : ''}
                  />
                </div>
                <div className="auth-field">
                  <label>Mật khẩu</label>
                  <div className="auth-input-wrap">
                    <input type={showLoginPass ? 'text' : 'password'} placeholder="Nhập mật khẩu"
                      value={loginPassword}
                      onChange={e => { setLoginPassword(e.target.value); setError('') }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      className={error ? 'error' : ''}
                    />
                    <button className="auth-eye" onClick={() => setShowLoginPass(s => !s)} type="button">
                      {showLoginPass ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                {error && <div className="auth-error">⚠ {error}</div>}

                <button className={`auth-submit ${loading ? 'loading' : ''}`} onClick={handleLogin} disabled={loading}>
                  {loading ? <span className="auth-spinner" /> : 'Vào học ngay'}
                </button>

                <div className="auth-switch">
                  Chưa có tài khoản?{' '}
                  <button onClick={() => switchMode('signup')}>Đăng ký</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="auth-tabs">
        <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Đăng ký</button>
        <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Đăng nhập</button>
      </div>
    </div>
  )
}
