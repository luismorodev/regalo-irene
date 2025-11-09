import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';

export default function App() {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);

	if (!loggedIn) return <Login updateLogIn={setLoggedIn} />;
	return (
		<div className='flex justify-center items-center min-h-screen bg-linear-to-b from-rose-100 to-pink-200'>
			<div className='w-full max-w-[400px] h-full bg-white/70 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden m-3'>
				<Home />
			</div>
		</div>
	);
}
