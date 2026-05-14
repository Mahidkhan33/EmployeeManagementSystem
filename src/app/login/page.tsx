'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Lock, Mail, Loader2 } from 'lucide-react';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('ems_token', data.data.token);
        localStorage.setItem('ems_user', JSON.stringify(data.data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Users size={32} color="white" />
          </div>
          <h1 className={styles.title}>EMS Login</h1>
          <p className={styles.subtitle}>Enter your credentials to access your portal</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.icon} />
              <input 
                type="email" 
                id="email" 
                placeholder="admin@ems.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password">Password</label>
              <a href="#" className={styles.forgot}>Forgot?</a>
            </div>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? <Loader2 className={styles.spinner} size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don&apos;t have an account? <a href="mailto:admin@ems.com">Contact Admin</a></p>
        </div>
      </div>
      
      <div className={styles.background}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
      </div>
    </div>
  );
}
