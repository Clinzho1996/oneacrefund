"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { format, isValid, parseISO } from "date-fns";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FarmerDataTable } from "./farmer-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Farmer = {
	id: string;
	oaf_id: string;
	first_name: string;
	last_name: string;
	other_name: string;
	gender: string;
	email: string;
	phone_number: string;
	dob: string;
	state_id: string;
	district_id: string;
	pod_id: string;
	site_id: string;
	group_id: string;
	pic: string;
	finger_bio: string | null;
	facial_bio: string | null;
	created_at: string;
	updated_at: string;
	group: {
		id: string;
		state_id: string;
		district_id: string;
		pod_id: string;
		site_id: string;
		name: string;
		created_at: string;
		updated_at: string;
	};
	site: {
		id: string;
		state_id: string;
		district_id: string;
		pod_id: string;
		name: string;
		created_at: string;
		updated_at: string;
	};
	pod: {
		id: string;
		state_id: string;
		district_id: string;
		name: string;
		created_at: string;
		updated_at: string;
	};
	district: {
		id: string;
		state_id: string;
		name: string;
		created_at: string;
		updated_at: string;
	};
	state: {
		id: string;
		name: string;
	};
};

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const FarmerTable = () => {
	const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [tableData, setTableData] = useState<Farmer[]>([]);

	const openRestoreModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setRestoreModalOpen(true);
	};

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setDeleteModalOpen(true);
	};

	const closeRestoreModal = () => {
		setRestoreModalOpen(false);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const fetchFarmers = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			console.log("session", session);

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<{
				status: string;
				message: string;
				data: Farmer[];
			}>("https://api.wowdev.com.ng/api/v1/farmer", {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const fetchedData = response.data.data;

			console.log("Farmer Data:", fetchedData);

			// Map the API response to match the `Farmer` type
			const mappedData = fetchedData.map((item) => ({
				id: item.id,
				oaf_id: item.oaf_id,
				first_name: item.first_name,
				last_name: item.last_name,
				other_name: item.other_name,
				gender: item.gender,
				email: item.email,
				phone_number: item.phone_number,
				dob: item.dob,
				state_id: item.state_id,
				district_id: item.district_id,
				pod_id: item.pod_id,
				site_id: item.site_id,
				group_id: item.group_id,
				pic: item.pic,
				finger_bio: item.finger_bio,
				facial_bio: item.facial_bio,
				created_at: item.created_at,
				updated_at: item.updated_at,
				group: item.group || "N/A",
				site: item.site || "N/A",
				pod: item.pod || "N/A",
				district: item.district || "N/A",
				state: item.state || "N/A",
			}));

			console.log("Mapped Data:", mappedData);
			setTableData(mappedData);
		} catch (error) {
			console.error("Error fetching farmer data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchFarmers();
	}, []);

	const deleteFarmer = async (id: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.delete(
				`https://api.wowdev.com.ng/api/v1/farmer/${id}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				// Remove the deleted farmer from the table
				setTableData((prevData) =>
					prevData.filter((farmer) => farmer.id !== id)
				);

				toast.success("Farmer deleted successfully.");
			}
		} catch (error) {
			console.error("Error deleting farmer:", error);
		}
	};

	const columns: ColumnDef<Farmer>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="check"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="check"
				/>
			),
		},
		{
			accessorKey: "oaf_id",
			header: "OAF-ID",
			cell: ({ row }) => {
				const oafId = row.getValue<string>("oaf_id");
				return <span className="text-xs text-black">{oafId}</span>;
			},
		},
		{
			accessorKey: "first_name",
			header: "First Name",
			cell: ({ row }) => {
				const firstName = row.getValue<string>("first_name");
				return (
					<span className="text-xs text-black capitalize">{firstName}</span>
				);
			},
		},
		{
			accessorKey: "last_name",
			header: "Last Name",
			cell: ({ row }) => {
				const lastName = row.getValue<string>("last_name");
				return (
					<span className="text-xs text-black capitalize">{lastName}</span>
				);
			},
		},
		{
			accessorKey: "group.name",
			header: "Group Name",
			cell: ({ row }) => {
				const groupName = row.original.group?.name || "N/A"; // Fix applied here
				return <span className="text-xs text-primary-6">{groupName}</span>;
			},
		},
		{
			accessorKey: "site.name",
			header: "Site Name",
			cell: ({ row }) => {
				const siteName = row.original.site?.name || "N/A"; // Fix applied here
				return <span className="text-xs text-primary-6">{siteName}</span>;
			},
		},
		{
			accessorKey: "pod.name",
			header: "Pod Name",
			cell: ({ row }) => {
				const podName = row.original.pod?.name || "N/A"; // Fix applied here
				return <span className="text-xs text-primary-6">{podName}</span>;
			},
		},
		{
			accessorKey: "created_at",
			header: "Date Joined",
			cell: ({ row }) => {
				const date = parseISO(row.original.created_at);
				return (
					<span className="text-xs text-primary-6">
						{isValid(date) ? format(date, "do MMM. yyyy") : "Invalid Date"}
					</span>
				);
			},
		},
		{
			accessorKey: "biometricStatus",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-[13px] text-start items-start"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Biometric Status
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const status = row.original.facial_bio
					? "facial"
					: row.original.finger_bio
					? "fingerprint"
					: "none";
				return (
					<div
						className={`status ${
							status === "facial"
								? "blue"
								: status === "fingerprint"
								? "yellow"
								: "red"
						}`}>
						{status}
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => {
				const actions = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-8 w-8 p-2 bg-white border-[1px] bborder-[#E8E8E8]">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="bg-white">
							<Link href={`/farmer-management/${actions.id}`}>
								<DropdownMenuItem className="action cursor-pointer hover:bg-secondary-3">
									<IconEye />
									<p className="text-xs font-inter">View</p>
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem
								className="action cursor-pointer hover:bg-yellow-300"
								onClick={() => openRestoreModal(row)}>
								<IconPencil />
								<p className="text-xs font-inter">Edit</p>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="action cursor-pointer hover:bg-red-500"
								onClick={() => openDeleteModal(row)}>
								<IconTrash color="#F43F5E" />
								<p className="text-[#F43F5E] delete text-xs font-inter">
									Delete
								</p>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<FarmerDataTable columns={columns} data={tableData} />
			)}

			{isRestoreModalOpen && (
				<Modal onClose={closeRestoreModal} isOpen={isRestoreModalOpen}>
					<p className="mt-4">
						Are you sure you want to suspend {selectedRow?.first_name}&apos;s
						account?
					</p>
					<p className="text-sm text-primary-6">This can&apos;t be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeRestoreModal}>
							Cancel
						</Button>
						<Button className="bg-[#F04F4A] text-white font-inter text-xs modal-delete">
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p className="mt-4">
						Are you sure you want to delete {selectedRow?.first_name}'s account?
					</p>

					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeDeleteModal}>
							Cancel
						</Button>
						<Button
							className="bg-[#F04F4A] text-white font-inter text-xs modal-delete"
							onClick={async () => {
								await deleteFarmer(selectedRow.id);
								closeDeleteModal();
							}}>
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default FarmerTable;
