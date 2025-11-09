import { useState } from 'react';
import { supabase } from '../supabaseClient';

interface Hint {
	id: string;
	hint: string;
	order: number;
	viewed: boolean;
	date_viewed: Date;
}

interface Question {
	id: string;
	question: string;
	answer: string;
	tries: number;
	answered_correct: boolean;
}

interface Props {
	question: Question;
	updateQuestion: (arg0: Question) => void;
	hint: Hint;
	fetchAllHints: () => void;
}

export default function QuestionCard({
	question,
	updateQuestion,
	hint,
	fetchAllHints,
}: Props) {
	const [answer, setAnswer] = useState<string>('');
	const [triesLeft, setTriesLeft] = useState<number>(question.tries);

	const checkAnswer = async () => {
		if (answer.trim().toLowerCase() === question.answer.toLowerCase()) {
			const updatedQuestion = await supabase
				.from('questions')
				.update({ answered_correct: true })
				.eq('id', question.id)
				.select()
				.single();

			updateQuestion((prevState) => ({
				...prevState,
				answered_correct: updatedQuestion.data.answered_correct,
			}));

			const today = new Date();
			const formattedDate = today.toISOString().split('T')[0];

			await supabase
				.from('hints')
				.update({ viewed: true, date_viewed: formattedDate })
				.eq('id', hint.id);

			await fetchAllHints();
		} else {
			setAnswer('');
			if (triesLeft === 1) {
				await supabase
					.from('questions')
					.update({ past: true })
					.eq('id', question.id);
			}
			setTriesLeft((prev) => prev - 1);
		}
	};

	return (
		<div className='bg-white/80 p-4 rounded-2xl shadow-md'>
			{triesLeft > 0 ? (
				<>
					<h3 className='text-lg font-semibold mb-3 text-center'>
						{question.question}
					</h3>
					<h5 className='text-sm mb-3 text-center'>
						Numero de intentos restantes: {triesLeft}
					</h5>
					<input
						type='text'
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						placeholder='Tu respuesta...'
						className='border border-pink-200 p-3 rounded-lg w-full mb-3 text-center'
						required
					/>
					<button
						onClick={() => {
							if (answer) checkAnswer();
						}}
						className='bg-pink-500 hover:bg-pink-600 text-white w-full py-2 rounded-lg active:scale-95 transition'
					>
						Comprobar
					</button>
				</>
			) : (
				<>
					<h2 className='text-lg font-semibold mb-3 text-center'>FALLASTE!</h2>
					<h5 className='text-sm mb-3 text-center'>Vuelve a probar mañana!</h5>
				</>
			)}
		</div>
	);
}
