import { Request, Response, Router } from "express";
import { UserDAO } from "@/dao/UserDAO";
import { CreateUserBodyValidations } from "@/middlewares/UserValidations";
import { ErrorControl } from "@/constants/ErrorControl";
import { verifyToken } from "@/middlewares/jwt";
import { CheckCache } from "@/middlewares/Cache";
import { HttpStatusCode } from "axios";
import { isUserAdmin } from "@/middlewares/Roles";
import { Cache } from "@/utils/cache";

export class UserController extends UserDAO {
	private router: Router;

	constructor() {
		super();
		this.router = Router();
	}

	public routes(): Router {
		// Token verification
		this.router.get(
			"/verifyToken",
			verifyToken,
			(req: Request, res: Response) => {
				return res
					.status(HttpStatusCode.Ok)
					.send("Token verified successfully.");
			}
		);

		// Add user
		this.router.post(
			"/",
			CreateUserBodyValidations,
			async (req: Request, res: Response) => {
				const data = await UserDAO.add(req.body);
				if (data[0] === ErrorControl.SUCCESS) {
					return res
						.status(data[2])
						.json({
							message: "User created successfully",
							content: data[1]
						});
				}
				return res.status(data[2]).send(data[1]);
			}
		);

		//get all users
		this.router.get(
			"/all",
			verifyToken,
			CheckCache,
			async (req: Request, res: Response) => {
				const data = await UserDAO.getAllUsers();
				if (data[0] === ErrorControl.SUCCESS) {
					Cache.set(req.body.cacheKey, data[1], 60);
				}
				return res.status(data[2]).send(data[1]);
			}
		);

		// Get user (self)
		this.router.get(
			"/",
			verifyToken,
			CheckCache,
			async (req: Request, res: Response) => {
				const userId = req.body.user.id;
				const data = await UserDAO.getUserById(userId);
				if (data[0] === ErrorControl.SUCCESS) {
					Cache.set(req.body.cacheKey, data[1], 60);
				}
				return res.status(data[2]).send(data[1]);
			}
		);

		//search user (document or email)
		this.router.get(
			"/search",
			verifyToken,
			CheckCache,
			async (req: Request, res: Response) => {
				const query = req.query.search as string;
				const data = await UserDAO.searchUser(query);
				if (data[0] === ErrorControl.SUCCESS) {
					Cache.set(req.body.cacheKey, {
						user: data[1],
					}, 60);
				}
				return res.status(data[2]).json({
					user: data[1],
				});
			}
		);

		// Get user by id
		this.router.get("/:id",
			verifyToken,
			CheckCache, async (req: Request, res: Response) => {
				const id = req.params.id;
				const data = await UserDAO.getUserById(id);
				if (data[0] === ErrorControl.SUCCESS) {
					Cache.set(req.body.cacheKey, data[1], 60);
				}
				return res.status(data[2]).send(data[1]);
			});

		// Sign in / login
		this.router.post("/signin", async (req: Request, res: Response) => {
			const { email, password } = req.body;
			const data = await UserDAO.signIn(email, password);
			return res.status(data[2]).send(data[1]);
		});

		// Forgot password (send)
		this.router.post(
			"/forgot_password",
			async (req: Request, res: Response) => {
				const { email } = req.body;
				const data = await UserDAO.forgorPassword(email);
				return res.status(data[2]).send(data[1]);
			}
		);

		// Forgot password (verify code)
		this.router.post(
			"/forgot_password/verify_code",
			async (req: Request, res: Response) => {
				const { email, code } = req.body;
				const data = await UserDAO.verifyForgotPasswordCode(email, code);
				return res.status(data[2]).send(data[1]);
			}
		);

		// Forgot password (reset)
		this.router.post(
			"/forgot_password/reset",
			async (req: Request, res: Response) => {
				const { email, code, password } = req.body;
				const data = await UserDAO.resetPassword(email, code, password);
				return res.status(data[2]).send(data[1]);
			}
		);

		// Update user
		this.router.put(
			"/",
			verifyToken,
			async (req: Request, res: Response) => {
				const userId = req.body.user.id;
				const data = await UserDAO.update(req.body, userId);
				if (data[0] === ErrorControl.SUCCESS) {
					return res.status(data[2]).send(data[1]);
				}
				return res.status(data[2]).send(data[1]);
			}
		);

		//delete user
		this.router.delete(
			"/:id",
			verifyToken,
			isUserAdmin,
			async (req: Request, res: Response) => {
				const id = req.params.id;
				const data = await UserDAO.delete(id);
				if (data[0] === ErrorControl.SUCCESS) {
					return res.status(data[2]).send(data[1]);
				}
				return res.status(data[2]).send(data[1]);
			}
		);

		return this.router;
	}

}
