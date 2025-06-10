"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import Modal from "@/components/Modal";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	IconCloudDownload,
	IconFileExport,
	IconFileImport,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { Farmer } from "./farmer-columns";
import { Group } from "./group-columns";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

interface State {
	id: string;
	name: string;
}

interface District {
	id: string;
	name: string;
	stateId: string;
}

interface Pod {
	id: string;
	name: string;
	districtId: string;
}

interface Site {
	id: string;
	name: string;
	podId: string;
}

export function FarmerDataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [selectedStatus, setSelectedStatus] = useState<string>("View All");
	const [featuredImage, setFeaturedImage] = useState<File | null>(null);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [isImportModalOpen, setImportModalOpen] = useState(false);
	const [tableData, setTableData] = useState<TData[]>(data);
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
	const [isAddingFarmer, setIsAddingFarmer] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
		null
	);
	const [selectedPodId, setSelectedPodId] = useState<string | null>(null);
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isImporting, setIsImporting] = useState<boolean>(false);

	const [name, setName] = useState<string>("");
	const [gender, setGender] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [oafId, setOafId] = useState<string>("");
	const [otherName, setOtherName] = useState<string>("");
	const [dob, setDob] = useState<string>("");
	const [states, setStates] = useState<State[]>([]);
	const [districts, setDistricts] = useState<District[]>([]);
	const [groups, setGroups] = useState<Group[]>([]);
	const [pods, setPods] = useState<Pod[]>([]);
	const [sites, setSites] = useState<Site[]>([]);

	const fetchStates = async () => {
		try {
			const session = await getSession();

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}
			const response = await axios.get(
				"https://api.wowdev.com.ng/api/v1/state",
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setStates(response.data.data);

			console.log("States fetched:", response.data);
		} catch (error) {
			console.error("Error fetching states:", error);
		}
	};

	const fetchDistricts = async (stateId: string) => {
		try {
			const session = await getSession();

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}
			const response = await axios.get(
				`https://api.wowdev.com.ng/api/v1/district/state/${stateId}`,
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setDistricts(response.data.data);

			console.log("Districts fetched:", response.data);
		} catch (error) {
			console.error("Error fetching districts:", error);
		}
	};

	const fetchGroups = async (groupId: string) => {
		try {
			const session = await getSession();

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}
			const response = await axios.get(
				`https://api.wowdev.com.ng/api/v1/group/site/${groupId}`,
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setGroups(response.data.data);
			console.log("Group data", response.data.data);
		} catch (error) {
			console.error("Error fetching Groups:", error);
		}
	};
	const fetchPods = async (districtId: string) => {
		try {
			const session = await getSession();

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}
			const response = await axios.get(
				`https://api.wowdev.com.ng/api/v1/pod/district/${districtId}`,
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setPods(response.data.data);
		} catch (error) {
			console.error("Error fetching PODs:", error);
		}
	};

	const fetchSites = async (podId: string) => {
		try {
			const session = await getSession();

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}
			const response = await axios.get(
				`https://api.wowdev.com.ng/api/v1/site/pod/${podId}`,
				{
					headers: {
						Accept: "application/json",
						redirect: "follow",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setSites(response.data.data);
		} catch (error) {
			console.error("Error fetching sites:", error);
		}
	};

	const handleExport = () => {
		// Convert the table data to a worksheet
		const worksheet = XLSX.utils.json_to_sheet(tableData);

		// Create a new workbook and add the worksheet
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Farmers");

		// Generate a binary string from the workbook
		const binaryString = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "binary",
		});

		// Convert the binary string to a Blob
		const blob = new Blob([s2ab(binaryString)], {
			type: "application/octet-stream",
		});

		// Create a link element and trigger the download
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "farmers.xlsx";
		link.click();

		// Clean up
		URL.revokeObjectURL(url);
	};

	// Utility function to convert string to ArrayBuffer
	const s2ab = (s: string) => {
		const buf = new ArrayBuffer(s.length);
		const view = new Uint8Array(buf);
		for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
		return buf;
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
				biometricStatus:
					item.finger_bio && item.facial_bio
						? "both"
						: item.facial_bio
						? "facial"
						: item.finger_bio
						? "fingerprint"
						: "none",
			}));

			console.log("Mapped Data:", mappedData);
			setTableData(mappedData as TData[]);
		} catch (error) {
			console.error("Error fetching farmer data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (selectedStateId) {
			fetchDistricts(selectedStateId);
			setSelectedDistrictId(null);
			setSelectedPodId(null);
			setSelectedSiteId(null);
		}
	}, [selectedStateId]);

	useEffect(() => {
		if (selectedDistrictId) {
			fetchPods(selectedDistrictId);
			setSelectedPodId(null);
			setSelectedSiteId(null);
		}
	}, [selectedDistrictId]);

	useEffect(() => {
		if (selectedPodId) {
			fetchSites(selectedPodId);
			setSelectedSiteId(null);
		}
	}, [selectedPodId]);

	useEffect(() => {
		if (selectedSiteId) {
			fetchGroups(selectedSiteId);
			setSelectedGroupId(null);
		}
	}, [selectedSiteId]);

	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);

	const openImportModal = () => setImportModalOpen(true);
	const closeImportModal = () => setImportModalOpen(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		setFeaturedImage(file);

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreviewImage(null);
		}
	};

	// Function to filter data based on date range
	const filterDataByDateRange = () => {
		if (!dateRange?.from || !dateRange?.to) {
			console.log("No date range selected. Resetting to all data.");
			setTableData(data); // Reset to all data
			return;
		}

		const filteredData = data.filter((farmer: any) => {
			const dateJoined = new Date(farmer.created_at);
			return dateJoined >= dateRange.from! && dateJoined <= dateRange.to!;
		});

		console.log("Filtered data by date range:", filteredData);
		setTableData(filteredData);
	};

	useEffect(() => {
		filterDataByDateRange();
	}, [dateRange]);

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);

		if (status === "View All") {
			setTableData(data); // Reset to all data
			return;
		}

		const filteredData = data.filter((farmer: any) => {
			// Ensure biometricStatus exists before calling toLowerCase()
			const farmerStatus = farmer?.biometricStatus
				? farmer.biometricStatus.toLowerCase()
				: "";

			return farmerStatus === status.toLowerCase();
		});

		setTableData(filteredData);
	};

	useEffect(() => {
		handleStatusFilter(selectedStatus);
	}, [data]);

	useEffect(() => {
		setTableData(data); // Sync `tableData` with `data` prop
	}, [data]);

	const handleDelete = () => {
		const selectedRowIds = Object.keys(rowSelection).filter(
			(key) => rowSelection[key]
		);
		const filteredData = tableData.filter(
			(_, index) => !selectedRowIds.includes(index.toString())
		);
		setTableData(filteredData);
		setRowSelection({});
	};

	const handleAddFarmer = async () => {
		setIsAddingFarmer(true);
		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const formData = new FormData();
			formData.append("first_name", name.split(" ")[0]);
			formData.append("last_name", name.split(" ")[1] || "");
			formData.append("other_name", otherName);
			formData.append("gender", gender);
			formData.append("oaf_id", oafId);
			formData.append("dob", dob);
			formData.append("phone_number", phoneNumber);
			formData.append("email", email);
			formData.append("group_id", selectedGroupId || "");
			formData.append("site_id", selectedSiteId || "");
			formData.append("pod_id", selectedPodId || "");
			formData.append("district_id", selectedDistrictId || "");
			formData.append("state_id", selectedStateId || "");

			if (featuredImage) {
				formData.append("pic", featuredImage);
			}

			const response = await axios.post(
				"https://api.wowdev.com.ng/api/v1/farmer",
				formData,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			console.log("Farmer added successfully:", response.data);
			await fetchFarmers();
			toast.success("Farmer added successfully");

			closeModal();
		} catch (error) {
			console.error("Error adding farmer:", error);
		} finally {
			setIsAddingFarmer(false);
		}
	};
	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
	});

	const handleImportFileChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.name.endsWith(".csv")) {
			toast.error("Please upload a CSV file");
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("File size should not exceed 5MB");
			return;
		}

		setSelectedFile(file);
		setUploadProgress(0);
	};

	useEffect(() => {
		fetchStates();
	}, []);

	const handleImportSubmit = async () => {
		if (!selectedFile) return;
		if (!selectedStateId) {
			toast.error("Please select a state");
			return;
		}

		setIsImporting(true);
		setUploadProgress(0);

		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				throw new Error("No access token found");
			}

			const formData = new FormData();
			formData.append("csv_file", selectedFile);
			formData.append("state_id", selectedStateId);

			const response = await axios.post(
				"https://api.wowdev.com.ng/api/v1/farmer/import/data/extended",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
					},
					onUploadProgress: (progressEvent) => {
						if (progressEvent.total) {
							const progress = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							setUploadProgress(progress);
						}
					},
				}
			);

			toast.success("Farmers imported successfully!");
			closeImportModal();
			fetchFarmers(); // Refresh the farmer list
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response && error.response.data) {
					toast.error(error?.response?.data?.message);
					console.log("Error response:", error.response.data);
				} else {
					toast.error("An error occurred.");
					console.log("Error response: An error occurred.");
				}
			} else {
				toast.error("Something went wrong. Please try again.");
				console.log("Unexpected error:", error);
			}
		} finally {
			setIsImporting(false);
			setUploadProgress(0);
		}
	};

	return (
		<div className="rounded-lg border-[1px] py-0">
			<Modal isOpen={isModalOpen} onClose={closeModal} title="Add Farmer">
				<div className="bg-white py-1 rounded-lg w-[600px] transition-transform ease-in-out max-h[70vh] add-farmer overflow-y-auto">
					<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
						{/* Basic Information Section */}
						<div>
							<p className="text-sm text-dark-1">Basic Information</p>
							<div className="flex flex-col gap-2 mt-4">
								<div className="flex flex-row gap-3 justify-between items-center">
									<div>
										<p className="text-xs text-primary-6 font-inter">
											First Name
										</p>
										<Input
											type="text"
											className="focus:border-none mt-2"
											value={name.split(" ")[0] || ""}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
									<div>
										<p className="text-xs text-primary-6 font-inter">
											Last Name
										</p>
										<Input
											type="text"
											className="focus:border-none mt-2"
											value={name.split(" ")[1] || ""}
											onChange={(e) =>
												setName(`${name.split(" ")[0]} ${e.target.value}`)
											}
										/>
									</div>
								</div>
								<div className="flex flex-row gap-3 justify-between items-center w-full">
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Other Name
										</p>
										<Input
											type="text"
											className="focus:border-none mt-2"
											value={otherName}
											onChange={(e) => setOtherName(e.target.value)}
										/>
									</div>
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Gender
										</p>
										<Select onValueChange={(value) => setGender(value)}>
											<SelectTrigger className="w-full mt-2">
												<SelectValue placeholder="Select Gender" />
											</SelectTrigger>
											<SelectContent className="z-200 post bg-white">
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="flex flex-row gap-3 justify-between items-center">
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											OAF-ID
										</p>
										<Input
											type="text"
											className="focus:border-none mt-2"
											value={oafId}
											onChange={(e) => setOafId(e.target.value)}
										/>
									</div>
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Date of Birth
										</p>
										<Input
											type="date"
											className="focus:border-none mt-2"
											value={dob}
											onChange={(e) => setDob(e.target.value)}
										/>
									</div>
								</div>
								<div className="flex flex-row gap-3 justify-between items-center">
									<div>
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Phone Number
										</p>
										<Input
											type="text"
											className="focus:border-none mt-2"
											value={phoneNumber}
											onChange={(e) => setPhoneNumber(e.target.value)}
										/>
									</div>
									<div>
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Email
										</p>
										<Input
											type="email"
											className="focus:border-none mt-2"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>

						<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />

						{/* Location Section */}
						<div className="mt-4">
							<p className="text-sm text-dark-1">Location</p>
							<div className="flex flex-col gap-2 mt-2">
								<div className="flex flex-row items-center justify-between gap-5">
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											State
										</p>
										<Select
											onValueChange={(value) => setSelectedStateId(value)}>
											<SelectTrigger className="w-full mt-2">
												<SelectValue placeholder="Select State" />
											</SelectTrigger>
											<SelectContent className="z-200 post bg-white">
												{states.map((state) => (
													<SelectItem key={state.id} value={state.id}>
														{state.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											District
										</p>
										<Select
											onValueChange={(value) => setSelectedDistrictId(value)}>
											<SelectTrigger className="w-full mt-2">
												<SelectValue placeholder="Select District" />
											</SelectTrigger>
											<SelectContent className="z-200 post bg-white">
												{districts.map((district) => (
													<SelectItem key={district.id} value={district.id}>
														{district.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="flex flex-row items-center justify-between gap-5 mt-1">
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											POD/Sector
										</p>
										<Select onValueChange={(value) => setSelectedPodId(value)}>
											<SelectTrigger className="w-full mt-2">
												<SelectValue placeholder="Select POD" />
											</SelectTrigger>
											<SelectContent className="z-200 post bg-white">
												{pods.map((pod) => (
													<SelectItem key={pod.id} value={pod.id}>
														{pod.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Site
										</p>
										<Select onValueChange={(value) => setSelectedSiteId(value)}>
											<SelectTrigger className="w-full mt-2">
												<SelectValue placeholder="Select Site" />
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
								<div className="flex flex-col gap-2">
									<div>
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Group
										</p>
										<Select
											onValueChange={(value) => setSelectedGroupId(value)}>
											<SelectTrigger className="w-full mt-2">
												<SelectValue placeholder="Select Group" />
											</SelectTrigger>
											<SelectContent className="z-200 post bg-white">
												{groups.map((group) => (
													<SelectItem key={group.id} value={group.id}>
														{group.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>

						<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />

						{/* Image Upload Section */}
						<div>
							<p className="text-xs text-primary-6 font-inter">Upload Image</p>
							<div className="flex flex-col justify-center items-center gap-3 p-3 border-dashed border rounded-lg mt-3 mb-4">
								<IconCloudDownload size={14} />
								<p className="text-xs font-inter text-[#4B5563]">
									Choose a file
								</p>
								<input
									type="file"
									accept="image/*"
									className="hidden"
									id="fileInput"
									onChange={handleFileChange}
								/>
								<Button
									className="border text-xs p-2"
									onClick={() => document.getElementById("fileInput")?.click()}>
									Browse File
								</Button>
								{previewImage && (
									<div className="mt-2 flex flex-row justify-start items-center gap-3">
										<Image
											src={previewImage}
											width={100}
											height={100}
											alt="Preview"
											className="w-[200px] h-[200px] object-cover rounded-md"
										/>
										<Button
											onClick={() => {
												setFeaturedImage(null);
												setPreviewImage(null);
											}}
											className="border text-xs p-2">
											Remove
										</Button>
									</div>
								)}
							</div>
						</div>

						{/* Modal Footer */}
						<div className="flex flex-row justify-end items-center gap-3 font-inter">
							<Button
								className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
								onClick={closeModal}>
								Cancel
							</Button>
							<Button
								className="bg-primary-1 text-white font-inter text-xs"
								onClick={handleAddFarmer}
								disabled={isAddingFarmer}>
								{isAddingFarmer ? "Adding..." : "Add"}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<Modal
				isOpen={isImportModalOpen}
				onClose={closeImportModal}
				title="Import Farmer">
				<div className="bg-white py-1 rounded-lg import-farmer transition-transform ease-in-out max-h-[70vh] overflow-y-auto">
					<div className="mt-3 border-[1px] border-dashed border-[#E2E4E9] pt-4 px-4">
						{/* State Selection */}
						<div className="w-full mb-4">
							<p className="text-xs text-primary-6 mt-2 font-inter">State</p>
							<Select
								value={selectedStateId || ""}
								onValueChange={(value) => setSelectedStateId(value)}>
								<SelectTrigger className="w-full mt-2">
									<SelectValue placeholder="Select State" />
								</SelectTrigger>
								<SelectContent className="z-200 post bg-white">
									{states.map((state) => (
										<SelectItem key={state.id} value={state.id}>
											{state.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* File Upload Section */}
						<div className="flex flex-col justify-center items-center gap-3 p-6 border-dashed border-2 border-gray-300 rounded-lg mb-4">
							{!selectedFile ? (
								<>
									<IconCloudDownload size={40} className="text-primary-1" />
									<p className="text-sm font-medium text-gray-700">
										Select a CSV file to upload
									</p>
									<p className="text-xs text-gray-500 mb-2">
										or drag and drop it here
									</p>
									<input
										type="file"
										accept=".csv"
										className="hidden"
										id="csvFileInput"
										onChange={handleImportFileChange}
									/>
									<Button
										className="bg-primary-1 text-white text-xs"
										onClick={() =>
											document.getElementById("csvFileInput")?.click()
										}>
										Browse File
									</Button>
								</>
							) : (
								<div className="w-full">
									{uploadProgress > 0 && uploadProgress < 100 ? (
										<div className="flex flex-col items-center">
											<div className="relative w-20 h-20">
												<svg className="w-full h-full" viewBox="0 0 100 100">
													<circle
														className="text-gray-200"
														strokeWidth="8"
														stroke="currentColor"
														fill="transparent"
														r="36"
														cx="50"
														cy="50"
													/>
													<circle
														className="text-primary-1"
														strokeWidth="8"
														strokeDasharray={`${uploadProgress * 2.16} 216`}
														strokeLinecap="round"
														stroke="currentColor"
														fill="transparent"
														r="36"
														cx="50"
														cy="50"
													/>
												</svg>
												<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
													<span className="text-xs font-medium">
														{Math.round(uploadProgress)}%
													</span>
												</div>
											</div>
											<p className="text-xs mt-2 text-gray-600">
												Uploading {selectedFile.name}...
											</p>
										</div>
									) : (
										<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div className="flex items-center gap-3">
												<div className="bg-primary-1/10 p-2 rounded-full">
													<IconFileImport
														className="text-primary-1"
														size={20}
													/>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-800">
														{selectedFile.name}
													</p>
													<p className="text-xs text-gray-500">
														{(selectedFile.size / 1024).toFixed(1)} KB
													</p>
												</div>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													setSelectedFile(null);
													setUploadProgress(0);
												}}>
												<IconTrash size={16} color="red" />
											</Button>
										</div>
									)}
								</div>
							)}
						</div>

						{/* Instructions Section */}
						<div className="mb-6">
							<h3 className="text-sm font-medium text-gray-800 mb-2">
								Import Instructions
							</h3>
							<ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
								<li>CSV file must include required columns</li>
								<li>First row should contain headers</li>
								<li>Maximum file size: 5MB</li>
								<li>Only CSV files are accepted</li>
							</ul>
						</div>

						{/* Modal Footer */}
						<div className="flex flex-row justify-end items-center gap-3 font-inter pt-4 mb-4 mt-4">
							<Button
								className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
								onClick={closeImportModal}>
								Cancel
							</Button>
							<Button
								className="bg-primary-1 text-white font-inter text-xs"
								onClick={handleImportSubmit}
								disabled={!selectedFile || !selectedStateId || isImporting}>
								{isImporting ? "Importing..." : "Import"}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<div
				className="bg-white flex flex-row border-b-[1px] border-[#E2E4E9] justify-between items-center p-3"
				style={{
					borderTopLeftRadius: "0.5rem",
					borderTopRightRadius: "0.5rem",
				}}>
				<div>
					<div className="flex flex-row justify-start items-center gap-2">
						<Image
							src="/images/staffm.png"
							alt="staff management"
							height={20}
							width={20}
						/>
						<p className="text-sm text-dark-1 font-medium font-inter">
							Farmer Management
						</p>
					</div>

					<p className="text-xs text-primary-6 mt-3">
						Helping farmers plan, organize, and manage their farms efficiently
						to increase productivity and profitability.
					</p>
				</div>
				<div className="flex flex-row justify-start items-center gap-3 font-inter">
					<Button
						className="border-[#E8E8E8] border-[1px]"
						onClick={handleExport}>
						<IconFileExport /> Export
					</Button>
					<Button
						className="border-[#E8E8E8] border-[1px]"
						onClick={openImportModal}>
						<IconFileImport /> Import
					</Button>
					<Button
						className="bg-primary-1 text-white font-inter"
						onClick={openModal}>
						<IconPlus /> Add Farmer
					</Button>
				</div>
			</div>

			{/* filter function */}
			<div className="p-3 flex flex-row justify-between border-b-[1px] border-[#E2E4E9] bg-white items-center gap-20 max-w-full">
				<div className="flex flex-row justify-center bg-white items-center rounded-lg mx-auto special-btn-farmer pr-2">
					{["View All", "Both", "Facial", "Fingerprint", "None"].map(
						(status, index, arr) => (
							<p
								key={status}
								className={`px-2 py-2 text-center text-sm cursor-pointer border border-[#E2E4E9] overflow-hidden ${
									selectedStatus === status
										? "bg-primary-5 text-dark-1"
										: "text-dark-1"
								} 
			${index === 0 ? "rounded-l-lg firstRound" : ""} 
			${index === arr.length - 1 ? "rounded-r-lg lastRound" : ""}`}
								onClick={() => handleStatusFilter(status)}>
								{status}
							</p>
						)
					)}
				</div>

				<div className="p-3 flex flex-row justify-start items-center gap-3 w-full ">
					<Input
						placeholder="Search Farmer..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="focus:border-none bg-[#F9FAFB]"
					/>
					{/* filter by date */}
					<div className="w-[250px]">
						<DateRangePicker dateRange={dateRange} onSelect={setDateRange} />
					</div>
					<Button
						className="border-[#E8E8E8] border-[1px] bg-white"
						onClick={handleDelete}>
						<IconTrash /> Delete
					</Button>
				</div>
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="bg-primary-3">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id} className="bg-primary-3 text-xs">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="bg-white">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-left text-xs text-primary-6">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex items-center justify-between bg-white rounded-lg py-3 px-2 border-t-[1px] border-gray-300 mt-2">
				<div className="flex-1 text-xs text-primary-6 text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-10 lg:space-x-10 gap-3">
					<div className="flex items-center space-x-4 gap-2">
						<p className="text-xs text-primary-6 font-medium">Rows per page</p>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}>
							<SelectTrigger className="h-8 w-[70px] bg-white z-10">
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top" className="bg-white">
								{[5, 10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-[100px] items-center justify-center font-medium text-xs text-primary-6">
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()} pages
					</div>
					<div className="flex items-center space-x-5 gap-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to next page</span>
							<ChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
