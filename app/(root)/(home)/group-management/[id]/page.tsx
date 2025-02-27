"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { IconArrowBack, IconSettings } from "@tabler/icons-react";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export type Group = {
	id: string;
	state_id: string;
	district_id: string;
	pod_id: string;
	site_id: string;
	name: string;
	created_at: string;
	updated_at: string;
	site: {
		id: string;
		name: string;
	};
	pod: {
		id: string;
		name: string;
	};
	district: {
		id: string;
		name: string;
	};
	state: {
		id: string;
		name: string;
	};
};
interface ApiResponse {
	data: Group;
}

function GroupDetails() {
	const { id } = useParams();
	const { data: session } = useSession();
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<Group | null>(null);
	const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
	const [sites, setSites] = useState<Group[]>([]);

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

	const getNameInitials = ({ name }: { name: string }) => {
		if (!name) return "OA";
		const initials = name
			.split(" ")
			.map((word) => word.charAt(0))
			.join("");
		return initials.toUpperCase();
	};

	const fetchGroup = useCallback(async () => {
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
				`https://api.wowdev.com.ng/api/v1/group/${id}`,
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

			const siteId = response?.data?.data?.site.id;
			localStorage.setItem("siteId", siteId);
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
		fetchGroup();
	}, [fetchGroup]);

	const fetchSites = async () => {
		const siteId = localStorage.getItem("siteId");
		try {
			const session = await getSession();

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}
			const response = await axios.get(
				`https://api.wowdev.com.ng/api/v1/group/site/${siteId}`,
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setSites(response.data.data); // Ensure this is an array
			console.log("Sites fetched:", response.data);
		} catch (error) {
			console.error("Error fetching sites:", error);
		}
	};

	useEffect(() => {
		fetchSites();
	}, []);

	const formatDate = (rawDate?: string | Date) => {
		if (!rawDate) return "Unknown";
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const parsedDate =
			typeof rawDate === "string" ? new Date(rawDate) : rawDate;
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	return (
		<section className="bg-[#F6F8F9] h-screen">
			<div className="flex flex-row justify-between items-center bg-white p-4 border-b-[1px] border-[#E2E4E9] h-[77px]">
				<div className="flex flex-row justify-start gap-2 items-center">
					<div>
						<Link href="/location-management">
							<div className="p-2 border-[1px] border-dark-3 rounded-md cursor-pointer">
								<IconArrowBack size={18} />
							</div>
						</Link>
					</div>
					<div>
						<h2 className="text-sm text-dark-1 font-normal font-inter">
							Group Information
						</h2>
						<p className="text-xs font-light text-dark-2 font-inter">
							View and manage group data, including contact information, roles,
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
								{userData?.name}
							</p>
						</div>
						<div className="py-4 w-full  border-b-[1px] border-[#E2E4E9]">
							<p className="text-sm text-[#6B7280B7] font-inter mt-2">
								Date of Creation{" "}
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
									Group Information
								</h2>
								<p className="text-sm text-dark-1 font-inter mt-2">
									Manage group information
								</p>
							</div>
						</div>
						<hr />

						<div className="bg-white flex flex-col gap-2">
							<div className="flex flex-col justify-start items-center p-2 border-b-[1px] border-[#E2E4E9]">
								<div className="w-[50%] lg:w-full">
									<h2 className="text-sm text-[#6B7280B7] font-inter">
										Group Name
									</h2>
									<p className="text-sm text-dark-1 font-inter mt-2">
										{userData?.name}
									</p>
								</div>
							</div>
							<div className="bg-white p-3 rounded-lg mt-2 mx-1 mb-1 shadow-md flex flex-col gap-2">
								<div className="flex flex-row justify-start gap-20 items-center p-2 border-b-[1px] border-[#E2E4E9]">
									<div className="w-[50%] lg:w-full">
										<h2 className="text-sm text-[#6B7280B7] font-inter">
											State
										</h2>
										<p className="text-sm text-dark-1 font-inter mt-2">
											{userData?.state?.name}
										</p>
									</div>
									<div className="w-[50%] lg:w-full">
										<h2 className="text-sm text-[#6B7280B7] font-inter">
											District Name
										</h2>
										<p className="text-sm text-dark-1 font-inter mt-2">
											{userData?.district?.name}
										</p>
									</div>
								</div>
								<div className="flex flex-row justify-start gap-20 items-center p-2 border-b-[1px] border-[#E2E4E9]">
									<div className="w-[50%] lg:w-full">
										<h2 className="text-sm text-[#6B7280B7] font-inter">POD</h2>
										<p className="text-sm text-dark-1 font-inter mt-2">
											{userData?.pod?.name}
										</p>
									</div>
									<div className="w-[50%] lg:w-full">
										<h2 className="text-sm text-[#6B7280B7] font-inter">
											Site Name
										</h2>
										<p className="text-sm text-dark-1 font-inter mt-2">
											{userData?.site?.name}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white p-3 rounded-lg mt-2 mx-1 mb-1 shadow-md flex flex-col gap-2">
							<p className="text-sm text-dark-1 font-inter mt-2 p-2 font-medium">
								Sites Under {userData?.name}
							</p>
							<Select onValueChange={(value) => setSelectedSiteId(value)}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="See all Sites" />
								</SelectTrigger>
								<SelectContent className="z-200 post bg-white">
									{sites.map((site) => (
										<SelectItem key={site.id} value={site.id}>
											{site.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default GroupDetails;
