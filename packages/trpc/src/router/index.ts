import { mergeRouters } from "../trpc";
import AuthRouter from "./auth";

//Types
//Need this later for front end
type AppRouter = typeof appRouter;

//Routes
//////////////////////////
const appRouter = mergeRouters(AuthRouter);

export default appRouter;
export { AppRouter };
