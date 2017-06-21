import { DI, Server } from 'yanf';

async function main() {
	const server = new Server({ autoload: true, dir: __dirname });
	await server.listen();
	console.log('Server has been started!');
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	});
