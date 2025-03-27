"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	IconEdit,
	IconEye,
	IconRestore,
	IconTrash,
	IconUserPause,
} from "@tabler/icons-react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DataTable } from "./data-table";

// This type is used to define the shape of our data.
export type Staff = {
	id: string;
	name?: string;
	date: string;
	role: string;
	staff: string;
	status?: string;
	email: string;
};

interface ApiResponse {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	picture: string | null;
	staff_code: string;
	role: string;
	is_active: boolean;
	last_logged_in: string | null;
	created_at: string;
	updated_at: string;
	status?: string;
}

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const Table = () => {
	const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);
	const [isReactivateModalOpen, setReactivateModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Staff[]>([]);
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [editData, setEditData] = useState({
		id: "",
		firstName: "",
		lastName: "",
		email: "",
		staffId: "",
		role: "super_admin",
	});

	const openEditModal = (row: any) => {
		const staff = row.original;
		setEditData({
			id: staff.id,
			firstName: staff.name?.split(" ")[0] || "",
			lastName: staff.name?.split(" ")[1] || "",
			email: staff.email,
			staffId: staff.staff,
			role: staff.role,
		});
		setEditModalOpen(true);
	};

	const closeEditModal = () => {
		setEditModalOpen(false);
	};

	const handleEditStaff = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.post(
				`https://api.wowdev.com.ng/api/v1/user/${editData.id}`,
				{
					first_name: editData.firstName,
					last_name: editData.lastName,
					email: editData.email,
					staff_code: editData.staffId,
					role: editData.role,
				},
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				toast.success("Staff updated successfully.");
				fetchStaffs(); // Refresh the table data
				closeEditModal();
			}
		} catch (error) {
			console.error("Error updating staff:", error);
			toast.error("Failed to update staff. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const openRestoreModal = (row: any) => {
		setSelectedRow(row.original);
		setRestoreModalOpen(true);
	};

	const openReactivateModal = (row: any) => {
		setSelectedRow(row.original);
		setReactivateModalOpen(true);
	};

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original);
		setDeleteModalOpen(true);
	};

	const closeRestoreModal = () => {
		setRestoreModalOpen(false);
	};

	const closeReactivateModal = () => {
		setReactivateModalOpen(false);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const fetchStaffs = async () => {
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
				data: ApiResponse[];
			}>("https://api.wowdev.com.ng/api/v1/user", {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const fetchedData = response.data.data;

			console.log("Staff Data:", fetchedData);

			// Map the API response to match the `Staff` type
			const mappedData = fetchedData.map((item) => ({
				id: item.id,
				name: `${item.first_name} ${item.last_name}` || "N/A",
				date: item.created_at,
				role: item.role,
				staff: item.staff_code,
				status: item.is_active ? "active" : "inactive",
				email: item.email,
			}));

			console.log("Mapped Data:", mappedData);
			setTableData(mappedData);
		} catch (error) {
			console.error("Error fetching user data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchStaffs();
	}, []);

	const deleteStaff = async (id: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.delete(
				`https://api.wowdev.com.ng/api/v1/user/${id}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				// Remove the deleted staff from the table
				setTableData((prevData) => prevData.filter((staff) => staff.id !== id));

				toast.success("Staff deleted successfully.");
			}
		} catch (error) {
			console.error("Error deleting staff:", error);
		}
	};

	const suspendStaff = async (id: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.put(
				`https://api.wowdev.com.ng/api/v1/user/suspend/${id}`,
				{},
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				// Update the staff status in the table
				setTableData((prevData) =>
					prevData.map((staff) =>
						staff.id === id ? { ...staff, status: "inactive" } : staff
					)
				);

				toast.success("Staff suspended successfully.");
			}
		} catch (error) {
			console.error("Error suspending staff:", error);
			toast.error("Failed to suspend staff. Please try again.");
		}
	};

	const reactivateStaff = async (id: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.put(
				`https://api.wowdev.com.ng/api/v1/user/reactivate/${id}`,
				{},
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				// Update the staff status in the table
				setTableData((prevData) =>
					prevData.map((staff) =>
						staff.id === id ? { ...staff, status: "active" } : staff
					)
				);

				toast.success("Staff reactivated successfully.");
			}
		} catch (error) {
			console.error("Error suspending staff:", error);
			toast.error("Failed to reactivate staff. Please try again.");
		}
	};

	const formatDate = (rawDate: string | Date) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const parsedDate =
			typeof rawDate === "string" ? new Date(rawDate) : rawDate;
		return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
	};

	const columns: ColumnDef<Staff>[] = [
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
			accessorKey: "name",
			header: "Full Name",
			cell: ({ row }) => {
				if (!row) return null; // or return a placeholder
				const name = row.getValue<string>("name") || "N/A";
				return (
					<span className="text-xs text-black capitalize t-data">{name}</span>
				);
			},
		},
		{
			accessorKey: "staff",
			header: "Staff Code",
			cell: ({ row }) => {
				const staff = row.getValue<string>("staff");

				return <span className="text-xs text-primary-6">{staff}</span>;
			},
		},
		{
			accessorKey: "email",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-[13px] text-left"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Email address
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const email = row.getValue<string>("email");

				return <span className="text-xs text-primary-6 t-data">{email}</span>;
			},
		},
		{
			accessorKey: "date",
			header: "Date Joined",
			cell: ({ row }) => {
				const rawDate = row.original.date;
				const date = new Date(rawDate); // ✅ Convert it to a Date object

				return (
					<span className="text-xs text-primary-6">{formatDate(date)}</span>
				);
			},
		},
		{
			accessorKey: "status",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-[13px] text-start items-start"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Status
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const status = row.getValue<string>("status");
				return (
					<div className={`status ${status === "active" ? "green" : "red"}`}>
						{status}
					</div>
				);
			},
		},
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => {
				const role = row.getValue<string>("role");

				return (
					<span className="role text-xs text-primary-6 capitalize">{role}</span>
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
							<Link href={`/staff-management/${actions.id}`}>
								<DropdownMenuItem className="action cursor-pointer hover:bg-secondary-3">
									<IconEye />
									<p className="text-xs font-inter">View</p>
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem
								className="action cursor-pointer hover:bg-blue-100"
								onClick={() => openEditModal(row)}>
								<IconEdit />
								<p className="text-xs font-inter">Edit</p>
							</DropdownMenuItem>
							{actions.status === "active" ? (
								<DropdownMenuItem
									className="action cursor-pointer hover:bg-yellow-300"
									onClick={() => openRestoreModal(row)}>
									<IconUserPause />
									<p className="text-xs font-inter">Suspend</p>
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className="action cursor-pointer hover:bg-yellow-300"
									onClick={() => openReactivateModal(row)}>
									<IconRestore />
									<p className="text-xs font-inter">Reactivate</p>
								</DropdownMenuItem>
							)}
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
				<DataTable columns={columns} data={tableData} />
			)}
			{isEditModalOpen && (
				<Modal
					isOpen={isEditModalOpen}
					onClose={closeEditModal}
					title="Edit Staff">
					<div className="bg-white p-0 rounded-lg w-[600px] transition-transform ease-in-out ">
						<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
							<p className="text-xs text-primary-6">Role</p>

							<RadioGroup
								defaultValue={editData.role}
								onValueChange={(value) =>
									setEditData({ ...editData, role: value })
								}>
								<div className="flex flex-row justify-between items-center gap-5">
									<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg">
										<RadioGroupItem value="admin" id="admin" />
										<p className="text-sm text-primary-6 whitespace-nowrap">
											Admin
										</p>
									</div>
									<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg">
										<RadioGroupItem value="super_admin" id="super_admin" />
										<p className="text-sm text-primary-6 whitespace-nowrap">
											Super Admin
										</p>
									</div>
									<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg">
										<RadioGroupItem value="field_officer" id="field_officer" />
										<p className="text-sm text-primary-6 whitespace-nowrap">
											Field
										</p>
									</div>
								</div>
							</RadioGroup>

							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-col gap-2">
								<p className="text-xs text-primary-6">Staff ID</p>
								<Input
									type="text"
									className="focus:border-none mt-2"
									value={editData.staffId}
									onChange={(e) =>
										setEditData({ ...editData, staffId: e.target.value })
									}
								/>
								<p className="text-xs text-primary-6">First Name</p>
								<Input
									type="text"
									className="focus:border-none mt-2"
									value={editData.firstName}
									onChange={(e) =>
										setEditData({ ...editData, firstName: e.target.value })
									}
								/>
								<p className="text-xs text-primary-6 mt-2">Last Name</p>
								<Input
									type="text"
									className="focus:border-none mt-2"
									value={editData.lastName}
									onChange={(e) =>
										setEditData({ ...editData, lastName: e.target.value })
									}
								/>
								<p className="text-xs text-primary-6 mt-2">Email Address</p>
								<Input
									type="text"
									className="focus:border-none mt-2"
									value={editData.email}
									onChange={(e) =>
										setEditData({ ...editData, email: e.target.value })
									}
								/>
							</div>
							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-row justify-end items-center gap-3 font-inter">
								<Button
									className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
									onClick={closeEditModal}>
									Cancel
								</Button>
								<Button
									className="bg-primary-1 text-white font-inter text-xs"
									onClick={handleEditStaff}
									disabled={isLoading}>
									{isLoading ? "Updating..." : "Update Staff"}
								</Button>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{isRestoreModalOpen && (
				<Modal onClose={closeRestoreModal} isOpen={isRestoreModalOpen}>
					<p className="mt-4">
						Are you sure you want to suspend {selectedRow?.name}'s account?
					</p>
					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeRestoreModal}>
							Cancel
						</Button>
						<Button
							className="bg-[#F04F4A] text-white font-inter text-xs modal-delete"
							onClick={async () => {
								await suspendStaff(selectedRow.id);
								closeRestoreModal();
							}}>
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}

			{isReactivateModalOpen && (
				<Modal onClose={closeReactivateModal} isOpen={isReactivateModalOpen}>
					<p className="mt-4">
						Are you sure you want to reactivate {selectedRow?.name}'s account?
					</p>
					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeReactivateModal}>
							Cancel
						</Button>
						<Button
							className="bg-[#F04F4A] text-white font-inter text-xs modal-delete"
							onClick={async () => {
								await reactivateStaff(selectedRow.id);
								closeReactivateModal();
							}}>
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p>Are you sure you want to delete {selectedRow?.name}'s account?</p>

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
								await deleteStaff(selectedRow.id);
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

export default Table;
