export default function Inject(deps: Array<string>) {
    return function(target) {
        target.__inject = deps;
    };
}