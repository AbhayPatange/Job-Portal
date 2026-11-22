import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';

export default function PasswordInput(props) {
    const [visible, setVisible] = useState(false);
    return <div className="relative">
        <Input {...props} type={visible ? 'text' : 'password'} className="pr-12" />
        <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded focus-visible:ring-2 focus-visible:ring-blue-500">
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
    </div>;
}
