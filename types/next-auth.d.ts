import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user?: {
			idToken?: string;
		} & DefaultSession["user"];
	}

	interface JWT {
		idToken?: string;
	}
}
