import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface loginProps {
	updateLogIn: (arg0: boolean) => void;
}

const Login = ({ updateLogIn }: loginProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [correctCredentials, setCorrectCredentials] =
		useState<Record<string, string>>();

	useEffect(() => {
		const fetchQuestions = async () => {
			const { data } = await supabase.from('users').select('*').single();
			setCorrectCredentials(data);
		};

		fetchQuestions();
	}, []);

	const handleLogin = async () => {
		setLoading(true);
		setErrorMsg('');

		if (
			email !== correctCredentials?.username ||
			password !== correctCredentials?.password
		) {
			setErrorMsg('Usuario o contraseña incorrectos ❌');
			setLoading(false);
			return;
		}

		updateLogIn(true);
	};

	return (
		<div className='flex flex-col justify-center items-center min-h-screen bg-linear-to-b from-rose-100 to-pink-200 px-4'>
			<div className='w-full max-w-[400px] bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg m-3'>
				<h1 className='text-2xl font-bold mb-6 text-center'>
					Inicia sesión 💖
				</h1>

				<input
					type='text'
					placeholder='Usuario'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='w-full mb-4 p-3 rounded-lg border border-pink-200 text-center'
				/>

				<input
					type='password'
					placeholder='Contraseña'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='w-full mb-4 p-3 rounded-lg border border-pink-200 text-center'
				/>

				<button
					onClick={handleLogin}
					disabled={loading}
					className='w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg active:scale-95 transition mb-4'
				>
					{loading ? 'Cargando...' : 'Iniciar sesión'}
				</button>

				{errorMsg && (
					<p className='text-red-500 text-center text-sm'>{errorMsg}</p>
				)}
			</div>
		</div>
	);
};

export default Login;
