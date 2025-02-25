import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			if (account.provider === "google" && account.access_token) {
				try {
					const response = await fetch(
						"https://api.wowdev.com.ng/api/v1/auth/google",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
								Referer: "aitechma.com",
							},
							body: JSON.stringify({ token: account.access_token }), // 🔥 Send access token instead
						}
					);

					const data = await response.json();
					console.log("Backend API Response:", data); // Log response for debugging

					if (response.ok && data?.status === "success") {
						user.backendData = data; // Store backend response
						return true; // Allow sign-in
					} else {
						console.error("Backend validation failed:", data);
						return false; // Deny sign-in
					}
				} catch (error) {
					console.error("Error during backend validation:", error);
					return false; // Deny sign-in
				}
			}
			return false; // Deny sign-in for other providers or missing tokens
		},
		async jwt({ token, user }) {
			if (user) {
				token.backendData = user.backendData;
			}
			return token;
		},
		async session({ session, token }) {
			session.backendData = token.backendData;
			return session;
		},
	},
});

export { handler as GET, handler as POST };
