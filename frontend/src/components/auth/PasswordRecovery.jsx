import AuthShell from './AuthShell';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import PasswordInput from './PasswordInput';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { USER_API_END_POINT } from '@/utils/constant';

export default function PasswordRecovery({ reset = false }) {
    const [params] = useSearchParams();
    const token = params.get('token');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [message, setMessage] = useState('');
    const invalid = reset && !/^[a-f0-9]{64}$/.test(token || '');
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        if (reset && password !== confirm) return setMessage('Passwords do not match.');
        setBusy(true); setMessage('');
        try {
            const { data } = await axios.post(`${USER_API_END_POINT}/${reset ? 'reset-password' : 'forgot-password'}`, reset ? { token, password } : { email }, { timeout: 20000 });
            setDone(true); setMessage(data.message);
            setPassword(''); setConfirm('');
        } catch (error) { setMessage(error.response?.data?.message || 'Unable to reach the server. Please try again.'); }
        finally { setBusy(false); }
    }
    return <><Navbar /><AuthShell><main className="mx-auto max-w-md p-6 my-10 border rounded-lg">
        <h1 className="text-2xl font-bold mb-3">{reset ? 'Reset password' : 'Forgot password?'}</h1>
        <p className="text-sm text-gray-600 mb-5">{reset ? 'Choose a new password with at least 8 characters.' : 'Enter your account email and we’ll send you a reset link.'}</p>
        {invalid ? <p role="alert">This link is invalid. <Link className="text-blue-600" to="/forgot-password">Request a new link</Link>.</p> : !done && <form onSubmit={submit} className="space-y-4">
            {reset ? <><label className="block" htmlFor="new-password">New password</label><PasswordInput id="new-password" required minLength={8} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
            <label className="block" htmlFor="confirm-password">Confirm password</label><PasswordInput id="confirm-password" required minLength={8} autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></> : <><label htmlFor="reset-email">Email</label><Input id="reset-email" required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></>}
            <Button className="w-full" disabled={busy}>{busy ? 'Please wait…' : reset ? 'Update password' : 'Send reset link'}</Button>
        </form>}
        {message && <p role="status" className="my-4">{message}</p>}
        <Link className="block text-blue-600 mt-5" to="/login">Back to login</Link>
    </main></AuthShell></>;
}
