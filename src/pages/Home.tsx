import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import QuestionCard from '../components/QuestionCard';

interface Question {
	id: string;
	question: string;
	answer: string;
	tries: number;
	answered_correct: boolean;
}

interface Hint {
	id: string;
	hint: string;
	order: number;
	viewed: boolean;
	date_viewed: Date;
}

export default function Home() {
	const [question, setQuestion] = useState<Question | undefined>();
	const [hint, setHint] = useState<Hint>();
	const [allHints, setAllHints] = useState<Hint[]>();
	const [errorMsg, setErrorMsg] = useState<string>();

	const [showHistory, setShowHistory] = useState<boolean>(false);

	const fetchAllHints = async () => {
		const { data } = await supabase
			.from('hints')
			.select('*')
			.eq('viewed', true)
			.select();

		setAllHints(data ?? []);
	};

	useEffect(() => {
		const fetchQuestions = async () => {
			const today = new Date();
			const formattedDate = today.toISOString().split('T')[0];

			const { data, error } = await supabase
				.from('questions')
				.select('*')
				.eq('date', formattedDate)
				.eq('past', false)
				.single();
			if (error) {
				setErrorMsg('Fallaste! Prueba mañana con otra pregunta!');
			}
			setQuestion(data || []);
		};

		const fetchHint = async () => {
			const today = new Date();
			const formattedDate = today.toISOString().split('T')[0];

			const { data } = await supabase
				.from('hints')
				.select(`*`)
				.or(`viewed.eq.false,date_viewed.eq.${formattedDate}`)
				.order('order', { ascending: true })
                .limit(1)
				.single();
			setHint(data);
		};

		fetchQuestions();
		fetchHint();
		fetchAllHints();
	}, []);

	return (
		<div className='flex flex-col justify-center items-center px-4 py-6 h-full'>
			{showHistory ? (
				<div className='min-h-screen bg-pink-50 p-4'>
					<h1 className='text-center text-xl font-semibold text-pink-700 mb-4'>
						🎁 Pistas Descubiertas
					</h1>

					<div className='flex flex-col gap-3'>
						{allHints?.map((clue, index) => (
							<div
								key={clue.id}
								className='bg-white shadow-md rounded-2xl p-4 border border-pink-100'
							>
								<p className='text-sm text-gray-500 mb-1'>
									Pista {index + 1} —{' '}
									{new Date(clue.date_viewed).toLocaleDateString('es-ES')}
								</p>
								<p className='text-lg text-gray-800'>{clue.hint}</p>
							</div>
						))}
					</div>
					<button
						onClick={() => setShowHistory(false)}
						className='w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg active:scale-95 transition mt-4'
					>
						Volver
					</button>
				</div>
			) : (
				question && (
					<div className='flex flex-col gap-6 w-full'>
						{!errorMsg && !question.answered_correct && (
							<>
								<h1 className='text-2xl font-bold mb-6 text-center'>
									🎁 Adivina y descubre tu regalo!
								</h1>
								<QuestionCard
									key={question.id}
									question={question}
									updateQuestion={setQuestion}
									hint={hint}
                                    fetchAllHints={fetchAllHints}
								/>
							</>
						)}
						{!errorMsg && question.answered_correct && (
							<>
								<h1 className='text-2xl font-bold mb-6 text-center'>
									Wooooo! La pista de hoy es:
								</h1>
								<h2 className='text-lg font-semibold mb-3 text-center'>
									{hint?.hint}
								</h2>
								<button
									onClick={() => setShowHistory(true)}
									className='w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg active:scale-95 transition mb-4'
								>
									Ver todas las pistas conseguidas
								</button>
							</>
						)}
						{errorMsg && !question.answered_correct && (
							<>
								<h2 className='text-lg font-semibold mb-3 text-center'>
									Vaya... Parece que ya has fallado la pregunta de hoy! 💩
								</h2>
								<button
									onClick={() => setShowHistory(true)}
									className='w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg active:scale-95 transition mb-4'
								>
									Ver todas las pistas conseguidas
								</button>
							</>
						)}
					</div>
				)
			)}
		</div>
	);
}
