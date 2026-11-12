import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '../services/api';
import { setToken } from '../services/auth';
import AuthShell from '../components/AuthShell';

const FIELDS = [
  ['username', 'Username', 'text', 'username'],
  ['email', 'Email', 'email', 'email'],
  ['password', 'Password (8+ characters)', 'password', 'new-password'],
  ['passwordConfirm', 'Confirm password', 'password', 'new-password'],
];

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', passwordConfirm: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Use at least 8 characters for your password');
    setLoading(true);
    try {
      await authAPI.register(form.username, form.email, form.password, form.passwordConfirm);
      const { data } = await authAPI.login(form.username, form.password);
      setToken(data.access, data.refresh);
      onLogin();
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      const d = err.response?.data;
      toast.error(d ? Object.values(d).flat().join(' ') : 'Could not create the account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to use. Your questions are saved in History."
      footer={<>Already registered? <Link to="/login" className="font-medium text-brand hover:underline">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        {FIELDS.map(([key, label, type, ac]) => (
          <div key={key}>
            <label htmlFor={key} className="label">{label}</label>
            <input id={key} type={type} autoComplete={ac} className="field" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? 'Creating account' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
