import { DI, Route } from 'yanf';

@DI.Inject([])
export default class TestRoute extends Route {
	private UserDAO;

	@Route.path('/test')
	test(req, res, next) {
		res.send('pong');
	}
}
