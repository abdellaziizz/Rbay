import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	const result = await Promise.all([
		client.hSet('car1', {
			color: 'red',
			model: 1999
		}),
		client.hSet('car2', {
			color: 'green',
			model: 2000
		}),
		client.hSet('car3', {
			color: 'blue',
			model: 2001
		})
	]);
};
run();
const car = await client.hGetAll('car');
console.log(car);
