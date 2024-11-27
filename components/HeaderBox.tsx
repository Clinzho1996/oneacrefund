"use client";
import { IconSettings } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

function HeaderBox() {
	const { data: session } = useSession();
	// Function to get the name initials from the user's name
	const getNameInitials = ({ name }: { name: string }) => {
		if (!name) return "OA";
		const initials = name
			.split(" ")
			.map((word) => word.charAt(0))
			.join("");
		return initials.toUpperCase();
	};

	return (
		<div className="flex flex-row justify-between items-center p-4 border-b-[1px] border-[#E2E4E9] h-[80px]">
			{session?.user && (
				<div className="flex flex-col gap-2">
					<p className="text-sm text-dark-1 font-normal font-inter">
						Hi {session?.user?.name}, Welcome back to One Acre Fund 👋🏻
					</p>
					<p className="text-xs font-light text-dark-2 font-inter">
						We envision serving millions of farm families. We build for scale
						with every idea and solution.
					</p>
				</div>
			)}
			<div className="hidden lg:flex flex-row justify-start gap-2 items-center">
				<IconSettings />
				{session?.user && (
					<div className="md:flex flex-row justify-end gap-2 items-center mx-2 px-2">
						<div className="flex justify-center items-center border-[1px] border-dark-3 rounded-full overflow-hidden">
							{session.user.image ? (
								<Image
									src={session.user.image}
									alt="profile"
									className="object-cover w-full h-full lg:w-[40px] lg:h-[40px]"
									width={50}
									height={50}
								/>
							) : (
								<div className="flex items-center justify-center w-full h-full bg-dark-3">
									<h2 className="text-white font-bold text-lg">
										{getNameInitials({ name: session?.user?.name || "" })}
									</h2>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default HeaderBox;
