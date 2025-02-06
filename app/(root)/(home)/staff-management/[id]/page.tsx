"use client";

import { staffData } from "@/constants";
import { IconArrowBack, IconSettings, IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

function StaffDetails() {
	const { id } = useParams();
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

	const staff = staffData.find((staff) => staff.id === id);

	if (!staff) {
		return (
			<section className="bg-primary py-[4%] px-[6%]">
				<p className="text-white text-[16px]">Staff not found</p>
			</section>
		);
	}
	return (
		<section className="bg-[#F6F8F9] h-screen">
			<div className="flex flex-row justify-between items-center bg-white p-4 border-b-[1px] border-[#E2E4E9] h-[80px]">
				<div className="flex flex-row justify-start gap-2 items-center">
					<div>
						<Link href="/staff-management">
							<div className="p-2 border-[1px] border-dark-3 rounded-md cursor-pointer">
								<IconArrowBack size={18} />
							</div>
						</Link>
					</div>
					<div>
						<h2 className="text-sm text-dark-1 font-normal font-inter">
							Staff Information
						</h2>
						<p className="text-xs font-light text-dark-2 font-inter">
							View and manage staff data, including contact information, roles,
							and performance records.
						</p>
					</div>
				</div>
				<div className="hidden lg:flex flex-row justify-start gap-2 items-center">
					<Link href="/settings">
						<div className="p-2 border-[1px] border-dark-3 rounded-md cursor-pointer">
							<IconSettings size={18} />
						</div>
					</Link>
					{session?.user && (
						<div className="md:flex flex-row justify-end gap-2 items-center mx-2 px-2">
							<div className="flex justify-center items-center border-[1px] border-dark-3 rounded-full overflow-hidden">
								{session.user.image ? (
									<Image
										src={session.user.image}
										alt="profile"
										className="object-cover w-full h-full lg:w-[35px] lg:h-[35px]"
										width={30}
										height={30}
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

			<div className="p-5 bg-white border-[1px] border-[#E2E4E9] m-4 rounded-lg">
				<div className="flex flex-row justify-start items-start gap-20 ">
					<div>
						<Image src="/images/avat.png" width={50} height={50} alt="avatar" />
						<div className="py-4 border-b-[1px] border-[#E2E4E9]">
							<p className="text-[16px] text-dark-1 font-medium font-inter mt-2">
								{staff.name}
							</p>
							<p className="text-sm text-[#6B7280B7] font-inter">
								Last signed in 3h ago
							</p>
						</div>
						<div className="py-4 w-full  border-b-[1px] border-[#E2E4E9]">
							<h2 className="text-sm text-[#6B7280B7] font-inter">Status</h2>
							<p
								className={`status-inner mt-4 ${
									staff.status === "active" ? "green" : "red"
								}`}>
								{staff.status}
							</p>
						</div>
						<div className="py-4">
							<div className="flex flex-row justify-start gap-1 items-center">
								<IconTrash color="red" size={16} />
								<p className="text-sm text-red">Delete</p>
							</div>
							<p className="text-sm text-[#6B7280B7] font-inter mt-2">
								Date joined <span className="text-dark-1">{staff.date}</span>
							</p>
						</div>
					</div>
					<div className="bg-[#F6F8FA] border-[1px] border-[#E2E4E9] w-[500px] rounded-lg">
						<div className="p-3 w-full">
							<h2 className="text-sm text-[#6B7280B7] font-inter">
								Basic Information
							</h2>
							<p className="text-sm text-dark-1 font-inter mt-2">
								Manage user profile
							</p>
						</div>
						<hr />

						<div className="bg-white p-3 rounded-lg mt-2 mx-1 mb-1 shadow-md flex flex-col gap-2">
							<div className="p-2 border-b-[1px] border-[#E2E4E9]">
								<h2 className="text-sm text-[#6B7280B7] font-inter">
									Full Name
								</h2>
								<p className="text-sm text-dark-1 font-inter mt-2">
									{staff.name}
								</p>
							</div>
							<div className="p-2 border-b-[1px] border-[#E2E4E9]">
								<h2 className="text-sm text-[#6B7280B7] font-inter">
									Email Address
								</h2>
								<p className="text-sm text-dark-1 font-inter mt-2">
									{staff.email}
								</p>
							</div>
							<div className="p-2 border-b-[1px] border-[#E2E4E9]">
								<h2 className="text-sm text-[#6B7280B7] font-inter">Role</h2>
								<p className="text-sm text-dark-1 font-inter mt-2">
									{staff.role}
								</p>
							</div>
							<div className="p-2 border-b-[1px] border-[#E2E4E9]">
								<h2 className="text-sm text-[#6B7280B7] font-inter">
									Staff Code
								</h2>
								<p className="text-sm text-dark-1 font-inter mt-2">
									{staff.staff}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default StaffDetails;
