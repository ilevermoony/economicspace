import { InputHTMLAttributes, useState } from 'react';
import { sanitizeInput } from '../utils/security';
import { Input } from './ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface SecureInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  sanitize?: boolean;
  maxLength?: number;
  showPasswordToggle?: boolean;
}

export function SecureInput({
  value,
  onChange,
  sanitize = true,
  maxLength,
  showPasswordToggle = false,
  type,
  className,
  ...props
}: SecureInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Apply max length if specified
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }

    // Sanitize input if enabled
    if (sanitize && type !== 'password') {
      newValue = sanitizeInput(newValue);
    }

    onChange(newValue);
  };

  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className="relative">
      <Input
        {...props}
        type={inputType}
        value={value}
        onChange={handleChange}
        className={className}
      />
      {showPasswordToggle && type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
