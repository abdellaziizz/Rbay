import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car', {
		color: 'red',
		model: 1999,
		enigne: { cylinder: 8 },
		owner: '',
		serivce: ''
	}); //HSET car color red model 1999
};
run();
const car = await client.hGetAll('car');
console.log(car);
