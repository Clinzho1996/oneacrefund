import { Logs } from "@/config/log-columns";
import { Project } from "@/config/project-columns";

export const sidebarLinks = [
	{
		label: "Dashboard",
		route: "/dashboard",
		imgUrl: "/icons/dashboard.svg",
	},
	{
		label: "Farmer Management",
		route: "/farmer-management",
		imgUrl: "/icons/farmer.svg",
	},
	// {
	// 	label: "Project Management",
	// 	route: "/project-management",
	// 	imgUrl: "/icons/project.svg",
	// },
	{
		label: "Device Management",
		route: "/device-management",
		imgUrl: "/icons/device.svg",
	},

	{
		label: "Staff Management",
		route: "/staff-management",
		imgUrl: "/icons/staff.svg",
	},
	{
		label: "Location Management",
		route: "/location-management",
		imgUrl: "/icons/location.svg",
	},
	{
		label: "Log Activity",
		route: "/log-activity",
		imgUrl: "/icons/log.svg",
	},
];

export const projectData: Project[] = [
	{
		id: "00001",
		projectName: "Fertilizer Distribution",
		startDate: "12th Jan. 2025",
		endDate: "12th Jan. 2026",
		status: "ongoing",
	},
	{
		id: "00002",
		projectName: "Irrigation Expansion",
		startDate: "15th Feb. 2025",
		endDate: "20th Dec. 2025",
		status: "yet to start",
	},
	{
		id: "00003",
		projectName: "Soil Testing Initiative",
		startDate: "10th Mar. 2025",
		endDate: "10th Sep. 2025",
		status: "ongoing",
	},
	{
		id: "00004",
		projectName: "Crop Rotation Program",
		startDate: "1st Apr. 2025",
		endDate: "1st Apr. 2026",
		status: "close",
	},
	{
		id: "00005",
		projectName: "Organic Farming Training",
		startDate: "5th May. 2025",
		endDate: "5th Nov. 2025",
		status: "ongoing",
	},
	{
		id: "00006",
		projectName: "Smart Farming Implementation",
		startDate: "12th Jun. 2025",
		endDate: "12th Dec. 2025",
		status: "yet to start",
	},
	{
		id: "00007",
		projectName: "Livestock Breeding Program",
		startDate: "20th Jul. 2025",
		endDate: "20th Jan. 2026",
		status: "ongoing",
	},
	{
		id: "00008",
		projectName: "Pest Control Research",
		startDate: "1st Aug. 2025",
		endDate: "1st Feb. 2026",
		status: "yet to start",
	},
	{
		id: "00009",
		projectName: "Farmers' Cooperative Expansion",
		startDate: "10th Sep. 2025",
		endDate: "10th Mar. 2026",
		status: "close",
	},
	{
		id: "00010",
		projectName: "Climate Change Adaptation",
		startDate: "5th Oct. 2025",
		endDate: "5th Apr. 2026",
		status: "ongoing",
	},
];

export const logData: Logs[] = [
	{
		id: "00001",
		fullName: "Confidence Clinton",
		date: "2024-12-25 15:34:00",
		module: "Farmer",
		actions: "update",
		description: "Updated farmer details for record 00023.",
	},
	{
		id: "00002",
		fullName: "Ayomide Kolawole",
		date: "2024-12-26 10:15:23",
		module: "Location",
		actions: "create",
		description: "Added a new location: Ikeja Farm.",
	},
	{
		id: "00003",
		fullName: "Samuel Eze",
		date: "2024-12-27 09:45:10",
		module: "Farmer",
		actions: "edit",
		description: "Edited contact details for farmer John Doe.",
	},
	{
		id: "00004",
		fullName: "Fatima Danladi",
		date: "2024-12-28 11:05:45",
		module: "Location",
		actions: "delete",
		description: "Removed inactive location from database.",
	},
	{
		id: "00005",
		fullName: "David Akpan",
		date: "2024-12-29 14:22:33",
		module: "Farmer",
		actions: "create",
		description: "Added new farmer profile: Mary Johnson.",
	},
	{
		id: "00006",
		fullName: "Grace Okonkwo",
		date: "2024-12-30 16:50:12",
		module: "Location",
		actions: "update",
		description: "Updated GPS coordinates for Epe farmland.",
	},
	{
		id: "00007",
		fullName: "John Doe",
		date: "2024-12-31 12:40:55",
		module: "Farmer",
		actions: "delete",
		description: "Deleted farmer profile of Samuel Uche.",
	},
	{
		id: "00008",
		fullName: "Aisha Bello",
		date: "2025-01-01 08:30:20",
		module: "Location",
		actions: "create",
		description: "Added a new farming site: Ajah Greenhouse.",
	},
	{
		id: "00009",
		fullName: "Tunde Adeyemi",
		date: "2025-01-02 13:55:42",
		module: "Farmer",
		actions: "edit",
		description: "Updated farming equipment details for Green Harvest Group.",
	},
	{
		id: "00010",
		fullName: "Mary Johnson",
		date: "2025-01-03 17:20:05",
		module: "Location",
		actions: "update",
		description: "Updated irrigation details for Badagry farm.",
	},
];
