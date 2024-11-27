"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

const Sidebar = () => {
	const pathname = usePathname();
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

	const handleLogout = async () => {
		try {
			// Attempt sign out with redirect set to false
			await signOut({ redirect: false });

			// Sign-out is successful if no error occurs
			toast.success("Logout successful!");
		} catch (error) {
			// Catch any unexpected errors (although 'signOut' should generally not throw)
			toast.error("Failed to log out. Please try again.");
			console.error("Sign-out error:", error);
		}
	};

	return (
		<section className="sticky left-0 top-0 flex h-screen w-fit flex-col border-r-[1px] justify-between  bg-white  text-dark-3 max-sm:hidden lg:w-[234px]">
			<div className="flex flex-1 flex-col gap-2">
				<Link
					href="/"
					className="max-lg:hidden items-center gap-1 border-b-[1px] border-b-[#E2E4E9] p-3 lg:flex h-[80px]">
					<Image
						src="/images/logo.png"
						alt="One Acre Fund Logo"
						width={200}
						height={50}
						className="w-fit justify-center h-[50px] flex flex-row "
					/>
				</Link>
				<Link
					href="/"
					className="items-center gap-1 border-b-[1px] p-3 max-lg:flex hidden">
					<Image
						src="/images/favicon.png"
						alt="One Acre Fund Logo"
						width={50}
						height={50}
						className="w-[50px] object-contain h-full flex"
					/>
				</Link>
				<p className="text-sm font-normal text-dark-2 pl-4 font-inter py-4">
					MENU
				</p>
				{sidebarLinks.map((item) => {
					const isActive =
						pathname === item.route || pathname.startsWith(`${item.route}/`);

					return (
						<Link
							href={item.route}
							key={item.label}
							className={cn(
								"flex gap-2 items-center p-2 justify-start rounded-[8px] mx-4 my-0",
								{
									"bg-primary-5 border-[1px] border-primary-4": isActive,
								}
							)}>
							<Image
								src={item.imgUrl}
								alt={item.label}
								width={20}
								height={20}
								className="w-[20px] h-[20px] object-contain flex"
							/>
							<p
								className={cn("text-sm font-normal font-inter max-lg:hidden", {
									"text-dark-1": isActive,
								})}>
								{item.label}
							</p>
						</Link>
					);
				})}
			</div>
			<div className="flex flex-col gap-2 mb-4">
				<div className="flex flex-col mx-2 gap-2 border-b-[1px] border-[#E2E4E9] py-3">
					<div className="flex gap-2 items-center p-2 justify-start rounded-[8px] mx-4 my-0">
						<Image
							src="/images/settings.svg"
							alt="settings"
							width={20}
							height={20}
							className="w-[20px] h-[20px] object-contain flex"
						/>
						<p className="text-sm font-normal font-inter max-lg:hidden">
							Settings
						</p>
					</div>
					<div
						className="flex gap-2 items-center p-2 justify-start rounded-[8px] mx-4 my-0 cursor-pointer"
						onClick={handleLogout}>
						<Image
							src="/images/logout.svg"
							alt="settings"
							width={20}
							height={20}
							className="w-[20px] h-[20px] object-contain flex"
						/>
						<p className="text-sm font-normal font-inter max-lg:hidden">
							Logout
						</p>
					</div>
				</div>
				{session?.user && (
					<div className="md:flex flex-row justify-end gap-2 items-center mx-2 px-2">
						<div className="flex justify-center items-center border-[1px] border-dark-3 rounded-full overflow-hidden">
							{session.user.image ? (
								<Image
									src={session.user.image}
									alt="profile"
									className="object-cover w-full h-full lg:w-[50px] lg:h-[42px]"
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
						<div className="hidden md:block">
							<h3 className="text-dark-1 text-sm font-normal font-inter">
								{session.user.name}
							</h3>
							<h3 className="text-xs text-dark-3">{session.user.email}</h3>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default Sidebar;
