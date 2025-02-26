"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";

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
import { Input } from "@/components/ui/input";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PodDataTable } from "./pod-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Pods = {
	id: string;
	state_id: string;
	district_id: string;
	pod_id: string;
	site_id: string;
	name: string;
	created_at: string;
	updated_at: string;
	district: {
		id: string;
		name: string;
	};
	state: {
		id: string;
		name: string;
	};
};

const PodTable = () => {
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [tableData, setTableData] = useState<Pods[]>([]);

	const fetchPods = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.get<{
				status: string;
				message: string;
				data: Pods[];
			}>("https://api.wowdev.com.ng/api/v1/pod", {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const fetchedData = response.data.data;

			console.log("Site Data:", fetchedData);

			const mappedData = fetchedData.map((item) => ({
				id: item.id,
				state_id: item.state_id,
				district_id: item.district_id,
				pod_id: item.pod_id,
				site_id: item.site_id,
				name: item.name,
				created_at: item.created_at,
				updated_at: item.updated_at,
				district: item.district,
				state: item.state,
			}));

			console.log("Mapped Data:", mappedData);
			setTableData(mappedData);

			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching pod data:", error);
			toast.error("Failed to fetch pod data. Please try again.");
		}
	};

	useEffect(() => {
		fetchPods();
	}, []);

	const deletePod = async (id: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.delete(
				`https://api.wowdev.com.ng/api/v1/pod/${id}`,
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

				toast.success("POD deleted successfully.");
			}
		} catch (error) {
			console.error("Error deleting farmer:", error);
		}
	};
	const openModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setModalOpen(true);
	};

	const openEditModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setEditModalOpen(true);
	};

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setDeleteModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	const closeEditModal = () => {
		setEditModalOpen(false);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const columns: ColumnDef<Pods>[] = [
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
			accessorKey: "pod.name",
			header: "POD / Sector",
			cell: ({ row }) => {
				const podName = row.original.name;
				return <span className="text-xs text-primary-6">{podName}</span>;
			},
		},
		{
			accessorKey: "district.name",
			header: "District",
			cell: ({ row }) => {
				const districtName = row.original.district.name;
				return <span className="text-xs text-primary-6">{districtName}</span>;
			},
		},
		{
			accessorKey: "state.name",
			header: "State",
			cell: ({ row }) => {
				const stateName = row.original.state.name;
				return <span className="text-xs text-primary-6">{stateName}</span>;
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
								className="h-8 w-8 p-2 bg-white border-[1px] border-[#E8E8E8]">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="bg-white">
							<Link href={`/group-management/${actions.id}`}>
								<DropdownMenuItem className="action cursor-pointer hover:bg-secondary-3">
									<IconEye />
									<p className="text-xs font-inter">View</p>
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem
								className="action cursor-pointer hover:bg-yellow-300"
								onClick={() => openEditModal(row)}>
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
				<PodDataTable columns={columns} data={tableData} />
			)}

			{isModalOpen && (
				<Modal
					isOpen={isModalOpen}
					onClose={closeModal}
					title="Post Device"
					className="w-[500px]">
					<div className="bg-white py-5 rounded-lg transition-transform ease-in-out ">
						<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
							<p className="text-sm text-dark-1 font-inter">
								Basic Information
							</p>
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
			)}

			{isEditModalOpen && (
				<Modal
					isOpen={isEditModalOpen}
					onClose={closeEditModal}
					title="Edit Posted Device"
					className="w-[500px]">
					<div className="bg-white py-5 rounded-lg transition-transform ease-in-out ">
						<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
							<p className="text-sm text-dark-1 font-inter">
								Basic Information
							</p>
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
									onClick={closeEditModal}>
									Cancel
								</Button>
								<Button className="bg-primary-1 text-white font-inter text-xs">
									Submit
								</Button>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p className="mt-4">
						Are you sure you want to delete this POD: {""}
						{selectedRow?.name}?
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
								await deletePod(selectedRow.id);
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

export default PodTable;
