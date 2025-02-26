"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Device } from "@/config/device-columns";
import { IconArrowBack, IconSettings } from "@tabler/icons-react";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ApiResponse {
	data: Device; // Adjust to match your API structure
}

function DeviceDetails() {
	const { id } = useParams();
	const { data: session } = useSession();
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<Device | null>(null);

	const openModal = () => {
		setModalOpen(true);
	};

	const openDeleteModal = () => {
		setDeleteModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};
	// Function to get the name initials from the user's name
	const getNameInitials = ({ name }: { name: string }) => {
		if (!name) return "OA";
		const initials = name
			.split(" ")
			.map((word) => word.charAt(0))
			.join("");
		return initials.toUpperCase();
	};

	const fetchDevice = useCallback(async () => {
		setIsLoading(true);
		try {
			const session = await getSession();

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<ApiResponse>(
				`https://api.wowdev.com.ng/api/v1/device/${id}`,
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			console.log("data", response?.data?.data);
			setUserData(response?.data?.data);
			setIsLoading(false);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.log(
					"Error fetching post:",
					error.response?.data || error.message
				);
			} else {
				console.log("Unexpected error:", error);
			}
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchDevice();
	}, [fetchDevice]);

	const formatDate = (rawDate?: string | Date) => {
		if (!rawDate) return "Unknown"; // Handle undefined case
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const parsedDate =
			typeof rawDate === "string" ? new Date(rawDate) : rawDate;
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	if (isLoading) {
		return <p>Loading...</p>;
	}

	const handleDelete = () => {
		// Get the selected row IDs
		console.log("item deleted");
	};

	return (
		<section className="bg-[#F6F8F9] h-screen">
			<div className="flex flex-row justify-between items-center bg-white p-4 border-b-[1px] border-[#E2E4E9] h-[80px]">
				<div className="flex flex-row justify-start gap-2 items-center">
					<div>
						<Link href="/device-management">
							<div className="p-2 border-[1px] border-dark-3 rounded-md cursor-pointer">
								<IconArrowBack size={18} />
							</div>
						</Link>
					</div>
					<div>
						<h2 className="text-sm text-dark-1 font-normal font-inter">
							Device Information
						</h2>
						<p className="text-xs font-light text-dark-2 font-inter">
							View and manage device data, including contact information, roles,
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
								{userData?.alias}
							</p>
							<p className="text-sm text-[#6B7280B7] font-inter">
								Posted by:{" "}
								<span className="text-dark-1">OneAcreFund Staff</span>
							</p>
						</div>
						<div className="py-4 w-full  border-b-[1px] border-[#E2E4E9]">
							<h2 className="text-sm text-[#6B7280B7] font-inter">Status</h2>
							<p
								className={`status-inner mt-4 ${
									userData?.status === "posted" ? "green" : "red"
								}`}>
								{userData?.status}
							</p>
						</div>
						<div className="py-4 w-full  border-b-[1px] border-[#E2E4E9]">
							<p className="text-sm text-[#6B7280B7] font-inter mt-2">
								Date of Posting{" "}
							</p>
							<p className="text-sm text-[#6B7280B7] font-inter mt-2">
								<span className="text-dark-1">
									{formatDate(userData?.created_at)}
								</span>
							</p>
						</div>
					</div>
					<div className="bg-[#F6F8FA] border-[1px] border-[#E2E4E9] w-[500px] rounded-lg">
						<div className="flex flex-row justify-between items-center">
							<div className="p-3 w-full">
								<h2 className="text-sm text-[#6B7280B7] font-inter">
									Basic Information
								</h2>
								<p className="text-sm text-dark-1 font-inter mt-2">
									Manage device information
								</p>
							</div>

							{userData?.status === "posted" && (
								<Button className="bg-white mr-10" onClick={openDeleteModal}>
									Unpost
								</Button>
							)}

							{userData?.status === "unposted" && (
								<Button className="bg-white mr-10" onClick={openModal}>
									Post
								</Button>
							)}
						</div>
						<hr />

						<div className="bg-white p-3 rounded-lg mt-2 mx-1 mb-1 shadow-md flex flex-col gap-2">
							<div className="flex flex-col justify-start items-center p-2 border-b-[1px] border-[#E2E4E9]">
								<div className="w-[50%] lg:w-full">
									<h2 className="text-sm text-[#6B7280B7] font-inter">
										Device Alias
									</h2>
									<p className="text-sm text-dark-1 font-inter mt-2">
										{userData?.alias}
									</p>
								</div>
							</div>
							<div className="flex flex-col justify-start items-center p-2">
								<div className="w-[50%] lg:w-full">
									<h2 className="text-sm text-[#6B7280B7] font-inter">
										Staff Name
									</h2>
									<p className="text-sm text-dark-1 font-inter mt-2">---</p>
								</div>
							</div>
						</div>

						<p className="text-sm text-dark-1 font-inter mt-2 p-2 font-medium">
							Location
						</p>
						<div className="bg-white p-3 rounded-lg mt-2 mx-1 mb-1 shadow-md flex flex-col gap-2">
							<div className="flex flex-row justify-start gap-20 items-center p-2 border-b-[1px] border-[#E2E4E9]">
								<div className="w-[50%] lg:w-full">
									<h2 className="text-sm text-[#6B7280B7] font-inter">State</h2>
									<p className="text-sm text-dark-1 font-inter mt-2">Niger</p>
								</div>
								<div className="w-[50%] lg:w-full">
									<h2 className="text-sm text-[#6B7280B7] font-inter">
										District Name
									</h2>
									<p className="text-sm text-dark-1 font-inter mt-2">---</p>
								</div>
							</div>
							<div className="flex flex-row justify-start gap-20 items-center p-2 border-b-[1px] border-[#E2E4E9]">
								<div className="w-[50%] lg:w-full">
									<h2 className="text-sm text-[#6B7280B7] font-inter">POD</h2>
									<p className="text-sm text-dark-1 font-inter mt-2">---</p>
								</div>
								<div className="w-[50%] lg:w-full">
									<h2 className="text-sm text-[#6B7280B7] font-inter">
										Site Name
									</h2>
									<p className="text-sm text-dark-1 font-inter mt-2">
										{userData?.serial_number}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p className="mt-4">
						Are you sure you want to unpost {userData?.alias} device ?
					</p>

					<p className="text-sm text-primary-6">This can&apos;t be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeDeleteModal}>
							Cancel
						</Button>
						<Button
							className="bg-[#F04F4A] text-white font-inter text-xs modal-delete gap-1"
							onClick={() => {
								handleDelete();
								closeDeleteModal();
							}}>
							Yes, Unpost
						</Button>
					</div>
				</Modal>
			)}

			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				title="Post Device"
				className="w-[500px]">
				<div className="bg-white py-5 rounded-lg transition-transform ease-in-out ">
					<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
						<p className="text-sm text-dark-1 font-inter">Basic Information</p>
						<div className="flex flex-col gap-2 mt-4">
							<p className="text-xs text-primary-6 font-inter">Staff Name</p>
							<Input type="text" className="focus:border-none mt-2 h-5" />
							<div className="flex flex-row items-center justify-between gap-5">
								<div className="w-[50%] lg:w-full">
									<p className="text-xs text-primary-6 mt-2 font-inter">
										State
									</p>
									<Input type="text" className="focus:border-none mt-2 h-5" />
								</div>
								<div className="w-[50%] lg:w-full">
									<p className="text-xs text-primary-6 mt-2 font-inter">
										District Name
									</p>
									<Input type="text" className="focus:border-none mt-2 h-5" />
								</div>
							</div>
							<p className="text-xs text-primary-6 mt-2 font-inter">POD</p>
							<Input type="text" className="focus:border-none mt-2 h-5" />
							<p className="text-xs text-primary-6 mt-2 font-inter">
								Site Name
							</p>
							<Input type="text" className="focus:border-none mt-2 h-5" />
						</div>
						<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
						<div className="flex flex-row justify-end items-center gap-3 font-inter">
							<Button
								className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
								onClick={closeModal}>
								Cancel
							</Button>
							<Button className="bg-primary-1 text-white font-inter text-xs">
								Submit
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</section>
	);
}

export default DeviceDetails;
