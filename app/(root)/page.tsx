"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function SignIn() {
	const session = useSession();
	const router = useRouter();

	console.log("session", session);

	useEffect(() => {
		if (session.status === "authenticated") {
			toast.success("Login Successful!");
			router.push("/dashboard");
		}
	}, [session.status, router]);

	if (session.status === "loading") {
		return (
			<div className="flex flex-row flex-1 justify-center h-screen">
				<Image src="/loader.svg" alt="loading" width={100} height={100} />
			</div>
		);
	}

	if (session.status === "authenticated") {
		return null;
	}

	const handleGoogleSignIn = async () => {
		const result = await signIn("google");

		if (result?.error) {
			console.error("Google Sign-In error:", result.error);
			toast.error("Failed to sign in. Please try again.");
		}
	};

	return (
		<div className="flex bg-white flex-row justify-center lg:justify-between align-middle p-2 w-full overflow-y-auto">
			<div className="rounded-lg w-[50%] lg:w-full hidden lg:block">
				<Image
					src="/images/logbg.png"
					alt="login"
					width={600}
					height={700}
					className="object-cover w-full h-full rounded-lg"
				/>
			</div>
			<div className="farmlog w-[50%] lg:w-full">
				<div className="bg-[#F0EFEF] shadow-md p-1 rounded-lg  mx-10 lg:mx-20 mt-[32%]">
					<div className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center align-middle justify-center">
						<div className="px-10">
							<Image
								src="/images/logo.png"
								alt="One Acre Fund Logo"
								width={200}
								height={50}
								className="w-fit justify-center h-[50px] mx-auto flex flex-row "
							/>
							<p className="text-[16px] text-[#141414] font-semibold text-center">
								Login to access your admin dashboard
							</p>
							<p className="text-sm text-[#7D7C81] text-center">
								Enter your details to continue{" "}
							</p>
						</div>

						<div
							className="mt-8 mb-5 rounded-lg bg-[#9F9E9E29] shadow-inner p-2 w-full mx-4 flex flex-row justify-between items-center cursor-pointer"
							onClick={handleGoogleSignIn}>
							<div className="flex flex-row justify-start items-center gap-2">
								<Image
									src="/images/google.png"
									alt="Google Logo"
									width={20}
									height={20}
								/>
								<p className="text-sm text-[#141414] font-normal font-inter">
									Continue with Google
								</p>
							</div>
							<IconArrowRight color="#292D32" />
						</div>
					</div>
					<div className="p-3 items-center bg-transparent justify-center flex flex-row gap-1">
						<p className="text-[#7D7C81] text-sm font-light">
							Experiencing issues signing in?{" "}
						</p>
						<Link
							href="/"
							className="text-primary-1 text-sm font-light underline">
							{" "}
							Contact Support
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
