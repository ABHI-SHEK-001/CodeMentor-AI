import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '../services/api';
import { setToken } from '../services/auth';
import AuthShell from '../components/AuthShell';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(form.username, form.password);
      setToken(data.access, data.refresh);
      onLogin();
      toast.success('Signed in');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Username or password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Pick up where you left off."
      footer={<>New here? <Link to="/register" className="font-medium text-brand hover:underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="u" className="label">Username</label>
          <input id="u" className="field" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="p" className="label">Password</label>
          <div className="relative">
            <input id="p" type={show ? 'text' : 'password'} className="field pr-10" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? 'Signing in' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}
